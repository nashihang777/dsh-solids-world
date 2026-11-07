import * as THREE from 'three'
import { finalize, type BuildOptions, type EntryModel, type StageEvent } from '../kit'

const N_LEVELS = 5
const RING_SCALE = 0.8
const TILT_STEP = Math.PI / 15
const ELECTRON_SPEED = 1.1
const TRANSITION_DURATION = 0.8

function bohrRadius(n: number): number {
  return RING_SCALE * n * n
}

function levelTilt(n: number): number {
  return (n - 1) * TILT_STEP
}

function levelEnergy(n: number): number {
  return -13.6 / (n * n)
}

export function ringPosition(n: number, theta: number): THREE.Vector3 {
  const local = new THREE.Vector3(bohrRadius(n) * Math.cos(theta), bohrRadius(n) * Math.sin(theta), 0)
  local.applyAxisAngle(new THREE.Vector3(1, 0, 0), levelTilt(n))
  return local
}

export function buildBohrModel(options: BuildOptions): EntryModel {
  const group = new THREE.Group()
  const anchors: Record<string, THREE.Vector3> = {}

  const nucleus = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 20, 14),
    new THREE.MeshStandardMaterial({
      color: new THREE.Color(options.theme === 'dark' ? '#e9f1f2' : '#1f2933'),
      emissive: new THREE.Color('#f2b34c'),
      emissiveIntensity: 0.25,
      roughness: 0.4,
    }),
  )
  nucleus.userData = { kind: 'bohr-nucleus' }
  group.add(nucleus)

  for (let n = 1; n <= N_LEVELS; n++) {
    const radius = bohrRadius(n)
    const geometry = new THREE.TorusGeometry(radius, 0.05, 8, 96)
    const ring = new THREE.Mesh(
      geometry,
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(options.palette.muted),
        transparent: true,
        opacity: 0.4 + 0.12 * (N_LEVELS - n),
        roughness: 0.5,
      }),
    )
    ring.rotation.x = levelTilt(n)
    ring.userData = { kind: 'bohr-ring', level: n, swInteract: n }
    group.add(ring)
    anchors[`level-${n}`] = ringPosition(n, Math.PI / 4)
  }

  const electron = new THREE.Mesh(
    new THREE.SphereGeometry(0.28, 16, 12),
    new THREE.MeshStandardMaterial({
      color: new THREE.Color(options.theme === 'dark' ? '#4cc98a' : '#147a4f'),
      emissive: new THREE.Color('#4cc98a'),
      emissiveIntensity: 0.3,
      roughness: 0.35,
    }),
  )
  electron.userData = { kind: 'bohr-electron' }
  group.add(electron)

  const photon = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.05, 1, 6, 1, true),
    new THREE.MeshBasicMaterial({
      color: new THREE.Color('#f2b34c'),
      transparent: true,
      opacity: 0,
      depthWrite: false,
    }),
  )
  photon.visible = false
  photon.userData = { kind: 'bohr-photon' }
  group.add(photon)

  anchors.nucleus = new THREE.Vector3(0, 0, 0)
  anchors.electron = ringPosition(1, 0)
  anchors.photonPath = new THREE.Vector3(6, 2, -4)

  let electronN = 1
  let electronTheta = 0
  let transition: { from: number; to: number; t: number } | null = null
  let photonDir = new THREE.Vector3(0.6, 0.5, -0.6).normalize()
  let photonLinger = 0

  const model: EntryModel = {
    group,
    anchors: {},
    radius: 1,
    animation: (elapsed, delta) => {
      void elapsed
      electronTheta += delta * ELECTRON_SPEED / Math.sqrt(electronN)
      if (transition) {
        transition.t += delta / TRANSITION_DURATION
        const t = Math.min(transition.t, 1)
        const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
        const from = ringPosition(transition.from, electronTheta)
        const to = ringPosition(transition.to, electronTheta)
        const mid = from.clone().lerp(to, ease)
        mid.y += Math.sin(Math.PI * ease) * 1.6
        electron.position.copy(mid)
        if (t >= 1) {
          electronN = transition.to
          transition = null
          photonLinger = 1
        }
        if (t < 0.9) {
          photon.visible = true
          const material = photon.material as THREE.MeshBasicMaterial
          material.opacity = Math.min(t * 2, 1)
          photon.scale.set(1, Math.max(t * 16, 0.01), 1)
          photon.position.copy(photonDir).multiplyScalar(t * 8)
          photon.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), photonDir)
        }
        return true
      }
      if (photonLinger > 0) {
        photonLinger -= delta
        const material = photon.material as THREE.MeshBasicMaterial
        material.opacity = Math.max(photonLinger, 0)
        if (photonLinger <= 0) photon.visible = false
        electron.position.copy(ringPosition(electronN, electronTheta))
        return true
      }
      electron.position.copy(ringPosition(electronN, electronTheta))
      return true
    },
    interact: (payload) => {
      if (payload.kind !== 'bohr-level') return undefined
      const to = Math.round(payload.value)
      if (to < 1 || to > N_LEVELS || to === electronN || transition) return undefined
      const from = electronN
      transition = { from, to, t: 0 }
      const energy = Math.abs(levelEnergy(to) - levelEnergy(from))
      photonDir = new THREE.Vector3(Math.random() - 0.5, Math.random() * 0.6 + 0.2, Math.random() - 0.5).normalize()
      const event: StageEvent = {
        kind: 'bohr-transition',
        from,
        to,
        energy,
        emission: to < from,
      }
      return event
    },
  }

  const finalized = finalize(group, anchors)
  model.group = finalized.group
  model.anchors = finalized.anchors
  model.radius = finalized.radius
  return model
}

function levelHeight(n: number): number {
  return (levelEnergy(n) - levelEnergy(1)) * 0.35
}

function levelStep(
  n: number,
  x: number,
  width: number,
  color: string,
  kind: string,
): THREE.Mesh {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(width, 0.3, 1.6),
    new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      roughness: 0.5,
      metalness: 0.05,
    }),
  )
  mesh.position.set(x, levelHeight(n), 0)
  mesh.userData = { kind, level: n }
  return mesh
}

function transitionArrow(
  from: number,
  to: number,
  x: number,
  palette: BuildOptions['palette'],
): THREE.Group {
  const group = new THREE.Group()
  const top = levelHeight(from) + 0.15
  const bottom = levelHeight(to) + 0.15
  const length = top - bottom
  const shaft = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.06, Math.abs(length) - 0.3, 8),
    new THREE.MeshStandardMaterial({
      color: new THREE.Color(palette.muted),
      emissive: new THREE.Color('#f2b34c'),
      emissiveIntensity: 0.8,
      roughness: 0.4,
    }),
  )
  const direction = from > to ? -1 : 1
  shaft.position.set(x, (top + bottom) / 2, 0)
  const head = new THREE.Mesh(
    new THREE.ConeGeometry(0.16, 0.34, 10),
    new THREE.MeshStandardMaterial({
      color: new THREE.Color(palette.muted),
      emissive: new THREE.Color('#f2b34c'),
      emissiveIntensity: 0.8,
      roughness: 0.4,
    }),
  )
  head.position.set(x, from > to ? bottom + 0.17 : top - 0.17, 0)
  if (from > to) head.rotation.x = Math.PI
  group.add(shaft, head)
  group.userData = { kind: 'level-arrow', from, to }
  return group
}

export function buildHydrogenLevelsModel(options: BuildOptions): EntryModel {
  const group = new THREE.Group()
  const anchors: Record<string, THREE.Vector3> = {}
  const stepX = 4.2
  for (let n = 1; n <= N_LEVELS; n++) {
    const color = n === 1 ? '#58c7d8' : options.palette.muted
    const step = levelStep(n, (n - 1) * stepX, 3.2, color, 'level-step')
    step.userData.swInteract = n
    group.add(step)
    anchors[`level-${n}`] = new THREE.Vector3((n - 1) * stepX, levelHeight(n) + 1.1, 0)
  }

  const transitions: Array<[number, number, string]> = [
    [2, 1, 'lyman-alpha'],
    [3, 2, 'balmer-alpha'],
    [4, 2, 'balmer-beta'],
    [5, 3, 'paschen-alpha'],
  ]
  for (const [from, to, key] of transitions) {
    const arrow = transitionArrow(from, to, (from - 1) * stepX, options.palette)
    group.add(arrow)
    anchors[key] = new THREE.Vector3((from - 1) * stepX, (levelHeight(from) + levelHeight(to)) / 2 + 1, 0)
  }

  anchors.ladderBase = new THREE.Vector3(0, -1, 0)
  return finalize(group, anchors)
}

export function buildFineSplittingModel(options: BuildOptions): EntryModel {
  const group = new THREE.Group()
  const anchors: Record<string, THREE.Vector3> = {}
  const splitGap = 0.55
  const stepX = 5

  const ground = levelStep(1, 0, 3.4, '#58c7d8', 'level-step')
  group.add(ground)
  const lower = levelStep(2, stepX, 2.0, options.palette.muted, 'level-split-lower')
  lower.position.y = levelHeight(2) - splitGap / 2
  group.add(lower)
  const upper = levelStep(2, stepX, 2.0, options.palette.muted, 'level-split-upper')
  upper.position.y = levelHeight(2) + splitGap / 2
  group.add(upper)

  const pair = new THREE.Group()
  const arrowA = transitionArrow(2, 1, stepX - 0.7, options.palette)
  const arrowB = transitionArrow(2, 1, stepX + 0.7, options.palette)
  for (const child of arrowA.children) {
    child.position.y -= splitGap / 2
  }
  for (const child of arrowB.children) {
    child.position.y += splitGap / 2
  }
  pair.add(arrowA, arrowB)
  group.add(pair)

  const splitBar = new THREE.Mesh(
    new THREE.CylinderGeometry(0.03, 0.03, 1.4, 6),
    new THREE.MeshBasicMaterial({ color: new THREE.Color('#f2b34c') }),
  )
  splitBar.position.set(stepX + 1.5, levelHeight(2), 0)
  splitBar.userData = { kind: 'split-bar' }
  group.add(splitBar)

  anchors.level1 = new THREE.Vector3(0, levelHeight(1), 0.8)
  anchors.level2pHalf = new THREE.Vector3(stepX, levelHeight(2) - splitGap / 2, 0.8)
  anchors.level2pThree = new THREE.Vector3(stepX, levelHeight(2) + splitGap / 2, 0.8)
  anchors.dLinePair = new THREE.Vector3(stepX + 0.7, (levelHeight(1) + levelHeight(2)) / 2, 0)
  anchors.splitBar = new THREE.Vector3(stepX + 1.5, levelHeight(2), 0)
  return finalize(group, anchors)
}

const SHELL_DEFS: Array<{ r: number; electrons: number; kind: string }> = [
  { r: 1.6, electrons: 2, kind: 'shell-k' },
  { r: 3.0, electrons: 8, kind: 'shell-l' },
  { r: 4.4, electrons: 1, kind: 'shell-m' },
]

export function buildShellStructureModel(options: BuildOptions): EntryModel {
  const group = new THREE.Group()
  const anchors: Record<string, THREE.Vector3> = {}

  const nucleus = new THREE.Mesh(
    new THREE.SphereGeometry(0.55, 20, 14),
    new THREE.MeshStandardMaterial({
      color: new THREE.Color(options.theme === 'dark' ? '#e9f1f2' : '#1f2933'),
      emissive: new THREE.Color('#f2b34c'),
      emissiveIntensity: 0.2,
      roughness: 0.4,
    }),
  )
  nucleus.userData = { kind: 'shell-nucleus' }
  group.add(nucleus)

  const electronGeometry = new THREE.SphereGeometry(0.22, 12, 10)
  const electronMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(options.theme === 'dark' ? '#4cc98a' : '#147a4f'),
    emissive: new THREE.Color('#4cc98a'),
    emissiveIntensity: 0.25,
    roughness: 0.35,
  })

  for (const shell of SHELL_DEFS) {
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(shell.r, 32, 20),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color('#58c7d8'),
        transparent: true,
        opacity: 0.1,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    )
    sphere.userData = { kind: shell.kind }
    group.add(sphere)

    for (let e = 0; e < shell.electrons; e++) {
      const electron = new THREE.Mesh(electronGeometry, electronMaterial)
      let theta: number
      let phi: number
      if (shell.electrons === 2) {
        theta = e === 0 ? Math.PI / 2 : -Math.PI / 2
        phi = 0
      } else if (shell.electrons === 8) {
        const ring = Math.floor(e / 4)
        theta = (Math.PI / 2) * (ring === 0 ? 1 : 2) - Math.PI / 2
        phi = (e % 4) * (Math.PI / 2)
      } else {
        theta = Math.PI / 3
        phi = Math.PI / 6
      }
      const position = new THREE.Vector3(
        shell.r * Math.cos(theta) * Math.cos(phi),
        shell.r * Math.sin(theta),
        shell.r * Math.cos(theta) * Math.sin(phi),
      )
      electron.position.copy(position)
      electron.userData = { kind: 'shell-electron', shell: shell.kind }
      group.add(electron)
      if (shell.kind === 'shell-m') anchors.valenceElectron = position.clone()
    }

    anchors[shell.kind] = new THREE.Vector3(shell.r, 0, 0)
  }

  anchors.nucleus = new THREE.Vector3(0, 0, 0)
  return finalize(group, anchors)
}
