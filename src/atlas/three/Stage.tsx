/**
 * The 3D stage of the atlas.
 *
 * The desktop build rendered this tree with @react-three/fiber, drei's <Html>
 * and an N8AO/bloom composer. A Harness Client half only receives the host's
 * React instance, so this file keeps the same scene, the same `StageProps` /
 * `StageApi` contract and the same CSS class hooks, but drives three.js
 * directly: one renderer, one animation loop, and a DOM overlay for the anchors
 * the original placed with <Html>.
 */

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import type { Hotspot, Tone } from '../data/types'
import type { StructureData } from '../../electron/cif/structure'
import type { EntryModel, StagePalette, StageEvent, BuildOptions } from './kit'
import { loadEntry } from './registry'
import { setShellHighlight } from './builders/orbital-'
import { buildFromStructureData } from './customStructure'
import { pmark, pspan } from '../perf/perf'
import { useLocale } from '../i18n/LocaleProvider'

export interface StageProps {
  entryId: string
  entryName: string
  supercell: 1 | 2
  showBonds: boolean
  showLabels: boolean
  spin: boolean
  theme: 'dark' | 'light'
  postfx: boolean
  bondTolerance: number
  hotspots: Hotspot[]
  activeHotspotId: string | null
  onHotspotSelect: (hotspot: Hotspot) => void
  customStructure: StructureData | null
  onApi?: (api: StageApi) => void
  orbitalView?: { isoFraction: number; pMode: 'single' | 'triple' }
  orbitalOpacity?: number
  showNodalSurfaces?: boolean
  radialR?: number
  onStageEvent?: (event: StageEvent) => void
  standingLabels?: boolean
  symSpeed?: number
  clipAxis?: number
  animPlayback?: { playing: boolean; speed: number }
  animParams?: Record<string, number>
  animStepTick?: number
}

export interface StageApi {
  reset(): void
  focus(): void
  zoom(direction: number): void
}

interface StageCssValues {
  palette: StagePalette
  tones: Record<Tone, string>
}

const FALLBACK_PALETTE: StagePalette = { muted: '#93a8b0', ink: '#e9f1f2' }
const FALLBACK_TONES: Record<Tone, string> = {
  cyan: '#58c7d8',
  jade: '#4cc98a',
  amber: '#f2b34c',
  violet: '#c98bf0',
}

function readCssValues(element: HTMLElement | null): StageCssValues {
  if (!element) return { palette: FALLBACK_PALETTE, tones: FALLBACK_TONES }
  const styles = getComputedStyle(element)
  const read = (name: string, fallback: string): string => {
    const value = styles.getPropertyValue(name).trim()
    return value.length > 0 ? value : fallback
  }
  return {
    palette: { muted: read('--muted', FALLBACK_PALETTE.muted), ink: read('--ink', FALLBACK_PALETTE.ink) },
    tones: {
      cyan: read('--tone-cyan', FALLBACK_TONES.cyan),
      jade: read('--tone-jade', FALLBACK_TONES.jade),
      amber: read('--tone-amber', FALLBACK_TONES.amber),
      violet: read('--tone-violet', FALLBACK_TONES.violet),
    },
  }
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1)
  return t * t * (3 - 2 * t)
}

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function hasWebGL2(): boolean {
  try {
    return !!document.createElement('canvas').getContext('webgl2')
  } catch {
    return false
  }
}

export function Webgl2Notice({ children }: { children: ReactNode }) {
  return <div className="webgl2-notice">{children}</div>
}

function frameCamera(camera: THREE.PerspectiveCamera, aspect: number, radius: number): void {
  const vFov = THREE.MathUtils.degToRad(camera.fov)
  const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect)
  const minFov = Math.min(vFov, hFov)
  const dist = (radius / Math.tan(minFov / 2)) * 1.2
  const polar = Math.PI / 2 - THREE.MathUtils.degToRad(15)
  const az = THREE.MathUtils.degToRad(35)
  camera.position.set(
    dist * Math.sin(polar) * Math.sin(az),
    dist * Math.cos(polar),
    dist * Math.sin(polar) * Math.cos(az),
  )
  camera.near = Math.max(radius / 100, 0.01)
  camera.far = dist + radius * 4
  camera.updateProjectionMatrix()
}

function shadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 128
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('stage:shadow-canvas-unavailable')
  const gradient = ctx.createRadialGradient(64, 64, 4, 64, 64, 64)
  gradient.addColorStop(0, 'rgba(255,255,255,1)')
  gradient.addColorStop(0.6, 'rgba(255,255,255,0.45)')
  gradient.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 128, 128)
  return new THREE.CanvasTexture(canvas)
}

interface AtomLabel {
  element: string
  position: THREE.Vector3
}

interface SceneState {
  renderer: THREE.WebGLRenderer
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  controls: OrbitControls
  wrapper: THREE.Group
  shadow: THREE.Mesh | null
  shadowTexture: THREE.CanvasTexture
  sceneModel: EntryModel | null
  api: StageApi
}

export function Stage(props: StageProps) {
  const { t } = useLocale()
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const hotspotRefs = useRef<Array<HTMLDivElement | null>>([])
  const ringRefs = useRef<Array<HTMLDivElement | null>>([])
  const cardRefs = useRef<Array<HTMLDivElement | null>>([])
  const atomRefs = useRef<Array<HTMLDivElement | null>>([])

  const [webgl2] = useState(hasWebGL2)
  const [error, setError] = useState<string | null>(null)
  const [model, setModel] = useState<EntryModel | null>(null)
  const [cssValues, setCssValues] = useState<StageCssValues>(() => ({
    palette: FALLBACK_PALETTE,
    tones: FALLBACK_TONES,
  }))

  const propsRef = useRef(props)
  propsRef.current = props

  const sceneRef = useRef<SceneState | null>(null)
  const atomsRef = useRef<AtomLabel[]>([])

  const runtime = useRef({
    entrance: 1,
    spinSuspended: false,
    spinTimer: 0,
    focus: null as
      | {
          t: number
          duration: number
          fromPos: THREE.Vector3
          fromTarget: THREE.Vector3
          target: THREE.Vector3
          distance: number
        }
      | null,
    raf: 0,
    visible: true,
    clock: new THREE.Clock(),
  })

  // The palette lives in the scoped stylesheet, so it can only be read once the
  // panel root is mounted.
  useEffect(() => {
    setCssValues(readCssValues(containerRef.current))
  }, [props.theme])

  const atoms = useMemo<AtomLabel[]>(() => {
    const items: AtomLabel[] = []
    if (!model) return items
    model.group.traverse((obj) => {
      const data = obj.userData as { kind?: string; ghost?: boolean; element?: unknown } | undefined
      if (data?.kind === 'atom' && !data.ghost && typeof data.element === 'string') {
        const mesh = obj as THREE.Mesh
        items.push({ element: data.element, position: mesh.position.clone().add(model.group.position) })
      }
    })
    return items
  }, [model])
  atomsRef.current = atoms

  // --- build the entry model ------------------------------------------------
  useEffect(() => {
    if (!webgl2) return
    let alive = true
    pmark('entry-switch')
    const options: BuildOptions = {
      supercell: props.supercell,
      theme: props.theme,
      bondTolerance: props.bondTolerance,
      palette: cssValues.palette,
      orbitalView: props.orbitalView,
    }
    const load: Promise<EntryModel> = props.customStructure
      ? Promise.resolve().then(() => buildFromStructureData(props.customStructure as StructureData, options))
      : loadEntry(props.entryId, options)
    void load.then(
      (loaded) => {
        if (!alive) return
        setModel(loaded)
        setError(null)
        log(
          `perf entry-switch:${
            props.customStructure ? props.customStructure.fileName : props.entryId
          } ${Math.round(pspan('entry-switch'))}ms`,
        )
      },
      (err: unknown) => {
        if (!alive) return
        setError(String(err))
      },
    )
    return () => {
      alive = false
    }
  }, [
    webgl2,
    props.entryId,
    props.supercell,
    props.theme,
    props.bondTolerance,
    cssValues.palette.muted,
    cssValues.palette.ink,
    props.customStructure,
    props.orbitalView,
  ])

  // --- renderer, camera, controls, animation loop ---------------------------
  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!webgl2 || !canvas || !container) return

    const cores = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 4 : 4
    const maxDpr = propsRef.current.postfx ? (cores >= 8 ? 2 : 1.75) : 1.5

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.0

    const scene = new THREE.Scene()
    scene.add(new THREE.AmbientLight(0xffffff, 0.35))
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.1)
    keyLight.position.set(6, 10, 4)
    scene.add(keyLight)
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.15)
    fillLight.position.set(-6, -4, -6)
    scene.add(fillLight)

    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 1000)
    camera.position.set(8, 6, 10)

    const wrapper = new THREE.Group()
    scene.add(wrapper)

    const controls = new OrbitControls(camera, canvas)
    controls.enableDamping = true
    controls.dampingFactor = 0.08
    // OrbitControls dispatches start/end; suspend auto-spin while the user drags.
    controls.addEventListener('start', () => {
      runtime.current.spinSuspended = true
      if (runtime.current.spinTimer !== 0) window.clearTimeout(runtime.current.spinTimer)
    })
    controls.addEventListener('end', () => {
      runtime.current.spinTimer = window.setTimeout(() => {
        runtime.current.spinSuspended = false
      }, 3000)
    })

    const shadowMap = shadowTexture()

    const startFocus = (current: EntryModel, target: THREE.Vector3) => {
      runtime.current.focus = {
        t: 0,
        duration: prefersReducedMotion() ? 0.001 : 0.6,
        fromPos: camera.position.clone(),
        fromTarget: controls.target.clone(),
        target,
        distance: current.radius * 0.45,
      }
    }

    const state: SceneState = {
      renderer,
      scene,
      camera,
      controls,
      wrapper,
      shadow: null,
      shadowTexture: shadowMap,
      sceneModel: null,
      api: {
        reset: () => {
          runtime.current.focus = null
          controls.target.set(0, 0, 0)
          controls.update()
          const current = sceneRef.current?.sceneModel
          if (current) {
            frameCamera(camera, camera.aspect, current.radius)
            controls.minDistance = current.radius * 0.2
            controls.maxDistance = current.radius * 6
            controls.update()
          }
        },
        focus: () => {
          const current = sceneRef.current?.sceneModel
          const activeProps = propsRef.current
          const hotspot = activeProps.hotspots.find((h) => h.id === activeProps.activeHotspotId)
          const anchor = current && hotspot ? current.anchors[hotspot.anchor] : undefined
          if (!current || !anchor) return
          startFocus(current, wrapper.localToWorld(anchor.clone()))
        },
        zoom: (direction: number) => {
          const current = sceneRef.current?.sceneModel
          if (!current) return
          const offset = camera.position.clone().sub(controls.target)
          const factor = direction > 0 ? 0.8 : 1.25
          const next = Math.min(
            Math.max(offset.length() * factor, current.radius * 0.2),
            current.radius * 6,
          )
          offset.setLength(next)
          camera.position.copy(controls.target).add(offset)
          controls.update()
        },
      },
    }
    sceneRef.current = state
    propsRef.current.onApi?.(state.api)

    const resize = () => {
      const width = container.clientWidth || 1
      const height = container.clientHeight || 1
      renderer.setSize(width, height, false)
      camera.aspect = width / Math.max(height, 1)
      camera.updateProjectionMatrix()
    }
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(container)

    const project = (point: THREE.Vector3, width: number, height: number) => {
      const ndc = point.clone().project(camera)
      return {
        x: (ndc.x * 0.5 + 0.5) * width,
        y: (-ndc.y * 0.5 + 0.5) * height,
        onScreen: ndc.z < 1,
      }
    }

    const tick = () => {
      runtime.current.raf = window.requestAnimationFrame(tick)
      if (!runtime.current.visible || document.hidden) return
      const delta = Math.min(runtime.current.clock.getDelta(), 0.1)
      const elapsed = runtime.current.clock.elapsedTime
      const activeProps = propsRef.current
      const current = state.sceneModel

      if (runtime.current.entrance < 1) {
        runtime.current.entrance = Math.min(runtime.current.entrance + delta / 0.24, 1)
        const p = runtime.current.entrance
        const c1 = 1.70158
        const c3 = c1 + 1
        const back = 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2)
        wrapper.scale.setScalar(0.85 + 0.15 * back)
      }
      if (activeProps.spin && !runtime.current.spinSuspended) wrapper.rotation.y += 0.14 * delta

      current?.animation?.(elapsed, delta)

      const focus = runtime.current.focus
      if (focus) {
        focus.t = Math.min(focus.t + delta / focus.duration, 1)
        const e = focus.t < 0.5 ? 2 * focus.t * focus.t : 1 - Math.pow(-2 * focus.t + 2, 2) / 2
        const direction = camera.position.clone().sub(focus.target).normalize()
        const toPos = focus.target.clone().addScaledVector(direction, focus.distance)
        camera.position.lerpVectors(focus.fromPos, toPos, e)
        controls.target.lerpVectors(focus.fromTarget, focus.target, e)
        if (focus.t >= 1) runtime.current.focus = null
      }

      controls.update()
      renderer.render(scene, camera)

      const width = container.clientWidth || 1
      const height = container.clientHeight || 1
      const cameraDirection = camera.position.clone().normalize()
      if (current) {
        activeProps.hotspots.forEach((hotspot, index) => {
          const anchor = current.anchors[hotspot.anchor]
          const holder = hotspotRefs.current[index]
          if (!anchor || !holder) return
          const point = project(wrapper.localToWorld(anchor.clone()), width, height)
          holder.style.transform = `translate3d(${point.x}px, ${point.y}px, 0)`
          holder.style.visibility = point.onScreen ? 'visible' : 'hidden'
          const vis = smoothstep(-0.05, 0.3, anchor.clone().normalize().dot(cameraDirection))
          const ring = ringRefs.current[index]
          const card = cardRefs.current[index]
          if (ring) ring.style.opacity = String(0.35 + vis * 0.65)
          if (card) card.style.opacity = String(vis)
        })
        atomsRef.current.forEach((atom, index) => {
          const holder = atomRefs.current[index]
          if (!holder) return
          const point = project(wrapper.localToWorld(atom.position.clone()), width, height)
          holder.style.transform = `translate3d(${point.x}px, ${point.y}px, 0) translate(-50%, -50%)`
          holder.style.visibility = point.onScreen ? 'visible' : 'hidden'
        })
      }
    }
    runtime.current.raf = window.requestAnimationFrame(tick)

    const observerIntersection = new IntersectionObserver(
      (entries) => {
        runtime.current.visible = entries.some((entry) => entry.isIntersecting)
      },
      { threshold: 0 },
    )
    observerIntersection.observe(container)

    return () => {
      window.cancelAnimationFrame(runtime.current.raf)
      if (runtime.current.spinTimer !== 0) window.clearTimeout(runtime.current.spinTimer)
      observerIntersection.disconnect()
      observer.disconnect()
      controls.dispose()
      renderer.dispose()
      shadowMap.dispose()
      if (state.shadow) {
        state.shadow.geometry.dispose()
        ;(state.shadow.material as THREE.Material).dispose()
      }
      sceneRef.current = null
    }
  }, [webgl2])

  // --- attach the loaded model to the scene --------------------------------
  useEffect(() => {
    const state = sceneRef.current
    if (!state || !model) return
    const previous = state.sceneModel
    if (previous && previous !== model) state.wrapper.remove(previous.group)
    state.sceneModel = model
    state.wrapper.add(model.group)
    model.group.scale.setScalar(1)
    model.group.rotation.set(0, 0, 0)

    if (state.shadow) {
      state.wrapper.remove(state.shadow)
      state.shadow.geometry.dispose()
      ;(state.shadow.material as THREE.Material).dispose()
      state.shadow = null
    }
    const shadow = new THREE.Mesh(
      new THREE.PlaneGeometry(model.radius * 2.6, model.radius * 2.6),
      new THREE.MeshBasicMaterial({
        map: state.shadowTexture,
        transparent: true,
        depthWrite: false,
        opacity: 0.3,
        color: 0x000000,
        toneMapped: false,
      }),
    )
    shadow.position.set(0, -model.radius * 1.02, 0)
    shadow.rotation.x = -Math.PI / 2
    state.wrapper.add(shadow)
    state.shadow = shadow

    state.controls.minDistance = model.radius * 0.2
    state.controls.maxDistance = model.radius * 6
    frameCamera(state.camera, state.camera.aspect, model.radius)
    state.controls.target.set(0, 0, 0)
    state.controls.update()
    runtime.current.entrance = prefersReducedMotion() ? 1 : 0
    runtime.current.focus = null
    propsRef.current.onApi?.(state.api)
  }, [model])

  // --- prop-driven scene updates ------------------------------------------
  useEffect(() => {
    if (!model) return
    model.group.traverse((obj) => {
      if ((obj.userData as { kind?: string }).kind === 'bond') obj.visible = props.showBonds
    })
  }, [model, props.showBonds])

  useEffect(() => {
    if (!model) return
    model.group.traverse((obj) => {
      const kind = (obj.userData as { kind?: string }).kind
      if (kind === 'orbital-surface') {
        const material = (obj as THREE.Mesh).material as THREE.MeshStandardMaterial
        material.transparent = true
        material.opacity = props.orbitalOpacity ?? 0.6
      }
      if (kind === 'nodal-surface') obj.visible = props.showNodalSurfaces ?? true
    })
  }, [model, props.orbitalOpacity, props.showNodalSurfaces])

  useEffect(() => {
    if (!model || props.radialR === undefined) return
    setShellHighlight(model, props.radialR)
  }, [model, props.radialR])

  useEffect(() => {
    if (!model || props.symSpeed === undefined) return
    model.setSymSpeed?.(props.symSpeed)
  }, [model, props.symSpeed])

  useEffect(() => {
    if (!model || !props.animPlayback) return
    model.setAnimPlayback?.(props.animPlayback.playing, props.animPlayback.speed)
  }, [model, props.animPlayback])

  useEffect(() => {
    if (!model || !props.animParams) return
    model.setAnimParams?.(props.animParams)
  }, [model, props.animParams])

  useEffect(() => {
    if (!model || props.animStepTick === undefined) return
    model.animStep?.()
  }, [model, props.animStepTick])

  useEffect(() => {
    const state = sceneRef.current
    if (!state) return
    const normals: Array<[number, number, number]> = [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ]
    const axis = props.clipAxis
    if (axis !== undefined && axis >= 1 && axis <= 3) {
      state.renderer.clippingPlanes = [
        new THREE.Plane(new THREE.Vector3(...normals[axis - 1]).negate(), 0),
      ]
    } else {
      state.renderer.clippingPlanes = []
    }
  }, [props.clipAxis])

  // Focus the camera on the newly active hotspot.
  useEffect(() => {
    const state = sceneRef.current
    const current = state?.sceneModel
    if (!state || !current) return
    if (!props.activeHotspotId) {
      runtime.current.focus = null
      return
    }
    const hotspot = props.hotspots.find((h) => h.id === props.activeHotspotId)
    const anchor = hotspot ? current.anchors[hotspot.anchor] : undefined
    if (!anchor) return
    runtime.current.focus = {
      t: 0,
      duration: prefersReducedMotion() ? 0.001 : 0.6,
      fromPos: state.camera.position.clone(),
      fromTarget: state.controls.target.clone(),
      target: state.wrapper.localToWorld(anchor.clone()),
      distance: current.radius * 0.45,
    }
  }, [props.activeHotspotId, props.hotspots, model])

  // Pointer picking for models that expose `interact` (Bohr level selection).
  useEffect(() => {
    const canvas = canvasRef.current
    const state = sceneRef.current
    if (!canvas || !state || !model?.interact) return
    let downX = 0
    let downY = 0
    const onDown = (event: PointerEvent) => {
      downX = event.clientX
      downY = event.clientY
    }
    const onUp = (event: PointerEvent) => {
      if (Math.hypot(event.clientX - downX, event.clientY - downY) > 4) return
      const rect = canvas.getBoundingClientRect()
      const ndc = new THREE.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1,
      )
      const raycaster = new THREE.Raycaster()
      raycaster.setFromCamera(ndc, state.camera)
      const hits = raycaster.intersectObject(model.group, true)
      for (const hit of hits) {
        const value = (hit.object.userData as { swInteract?: unknown }).swInteract
        if (typeof value !== 'number') continue
        const kind = (hit.object.userData as { swInteractKind?: string }).swInteractKind ?? 'bohr-level'
        const stageEvent = model.interact?.({ kind, value })
        if (stageEvent) propsRef.current.onStageEvent?.(stageEvent)
        return
      }
    }
    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointerup', onUp)
    return () => {
      canvas.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('pointerup', onUp)
    }
  }, [model])

  if (!webgl2) {
    return (
      <Webgl2Notice>
        <h2>{t('stage.webgl2.title')}</h2>
        <p>{t('stage.webgl2.body1')}</p>
        <p>{t('stage.webgl2.body2')}</p>
      </Webgl2Notice>
    )
  }

  if (error !== null) {
    return (
      <div className="stage-error" role="alert">
        <h3>{t('stage.error.title')}</h3>
        <p className="stage-error-module">{props.entryId}</p>
        <p className="stage-error-reason">{error}</p>
      </div>
    )
  }

  return (
    <div className="stage-root" ref={containerRef}>
      <canvas ref={canvasRef} className="sw-stage-canvas" />
      <div className="sw-stage-overlay">
        {model &&
          props.hotspots.map((hotspot, index) => {
            const active = hotspot.id === props.activeHotspotId
            return (
              <div
                key={hotspot.id}
                className="sw-hotspot-anchor"
                ref={(element) => {
                  hotspotRefs.current[index] = element
                }}
              >
                <div className="hotspot-ring-wrap">
                  <div
                    ref={(element) => {
                      ringRefs.current[index] = element
                    }}
                    className={`hotspot-ring tone-${hotspot.tone}${active ? ' active' : ''}`}
                    role="button"
                    tabIndex={0}
                    aria-label={hotspot.label}
                    onClick={() => props.onHotspotSelect(hotspot)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        props.onHotspotSelect(hotspot)
                      }
                    }}
                  >
                    <span className="hotspot-ring-core" />
                  </div>
                  {props.standingLabels && <span className="hotspot-ring-label">{hotspot.label}</span>}
                </div>
                {active && (
                  <div
                    ref={(element) => {
                      cardRefs.current[index] = element
                    }}
                    className="hotspot-stage-card"
                  >
                    <span className={`hotspot-stage-card-label tone-${hotspot.tone}`}>{hotspot.label}</span>
                    <p>{hotspot.note}</p>
                  </div>
                )}
              </div>
            )
          })}
        {props.showLabels &&
          atoms.map((atom, index) => (
            <div
              key={`${atom.element}-${index}`}
              ref={(element) => {
                atomRefs.current[index] = element
              }}
              className={`atom-label${props.theme === 'light' ? ' light' : ''}`}
            >
              {atom.element}
            </div>
          ))}
      </div>
      {model === null && error === null && (
        <div className="stage-loading" aria-label={t('stage.loading')}>
          <span className="stage-loading-name">{props.entryName}</span>
        </div>
      )}
    </div>
  )
}

function log(message: string): void {
  const api = (globalThis as { solids?: { log?: (level: string, message: string) => void } }).solids
  api?.log?.('info', message)
}
