import * as THREE from 'three'
import { finalize, type BuildOptions, type EntryModel } from '../kit'

const EPS = 0.6
const V_SCALE = 1.6
const R_MIN = Math.pow(2, 1 / 6)

function ljPotential(r: number): number {
  const x = 1 / r
  const x6 = Math.pow(x, 6)
  return 4 * EPS * (x6 * x6 - x6)
}

function solveTurningPoints(level: number): { r1: number; r2: number } {
  let lo = 0.82
  let hi = R_MIN
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2
    if (ljPotential(mid) > level) lo = mid
    else hi = mid
  }
  const r1 = (lo + hi) / 2
  lo = R_MIN
  hi = 3.2
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2
    if (ljPotential(mid) < level) lo = mid
    else hi = mid
  }
  const r2 = (lo + hi) / 2
  return { r1, r2 }
}

function levelFromTemperature(t: number): number {
  return -EPS + 0.05 + 0.42 * t
}

const CURVE_R_LO = 0.85
const CURVE_R_HI = 2.6

export default function buildThermalExpansion(options: BuildOptions): EntryModel {
  const group = new THREE.Group()
  const anchors: Record<string, THREE.Vector3> = {}
  const state = { playing: true, speed: 1, time: 0 }
  const params = { temperature: 0.3 }

  const leftAtom = new THREE.Mesh(
    new THREE.SphereGeometry(0.28, 16, 12),
    new THREE.MeshStandardMaterial({ color: new THREE.Color('#93a8b0'), roughness: 0.4 }),
  )
  leftAtom.userData = { kind: 'thermal-atom' }
  group.add(leftAtom)

  const rightAtom = new THREE.Mesh(
    new THREE.SphereGeometry(0.28, 16, 12),
    new THREE.MeshStandardMaterial({ color: new THREE.Color('#58c7d8'), roughness: 0.4 }),
  )
  rightAtom.userData = { kind: 'thermal-atom' }
  group.add(rightAtom)

  const curvePoints: THREE.Vector3[] = []
  for (let r = CURVE_R_LO; r <= CURVE_R_HI; r += 0.02) {
    curvePoints.push(new THREE.Vector3(r, ljPotential(r) * V_SCALE, 0))
  }
  const curve = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(curvePoints),
    new THREE.LineBasicMaterial({ color: new THREE.Color(options.palette.muted) }),
  )
  curve.userData = { kind: 'thermal-curve' }
  group.add(curve)

  const energyLine = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]),
    new THREE.LineBasicMaterial({ color: new THREE.Color('#f2b34c'), transparent: true, opacity: 0.7 }),
  )
  energyLine.userData = { kind: 'thermal-energy' }
  group.add(energyLine)

  const meanMarker = new THREE.Mesh(
    new THREE.SphereGeometry(0.09, 12, 10),
    new THREE.MeshStandardMaterial({
      color: new THREE.Color('#f2b34c'),
      emissive: new THREE.Color('#f2b34c'),
      emissiveIntensity: 0.5,
      roughness: 0.3,
    }),
  )
  meanMarker.userData = { kind: 'thermal-mean' }
  group.add(meanMarker)

  const trailPoints: THREE.Vector3[] = []
  const trail = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([new THREE.Vector3()]),
    new THREE.LineBasicMaterial({ color: new THREE.Color('#f2b34c'), transparent: true, opacity: 0.45 }),
  )
  trail.userData = { kind: 'thermal-trail' }
  group.add(trail)

  let geometry = { r1: 0, r2: 0, center: 0, amplitude: 0, level: 0 }
  const refreshGeometry = () => {
    geometry.level = levelFromTemperature(params.temperature)
    const { r1, r2 } = solveTurningPoints(geometry.level)
    geometry.r1 = r1
    geometry.r2 = r2
    geometry.center = (r1 + r2) / 2
    geometry.amplitude = (r2 - r1) / 2
    const y = geometry.level * V_SCALE
    energyLine.geometry.setFromPoints([
      new THREE.Vector3(r1, y, 0),
      new THREE.Vector3(r2, y, 0),
    ])
    meanMarker.position.set(geometry.center, y, 0)
    const point = new THREE.Vector3(geometry.center, y, 0)
    if (trailPoints.length === 0 || trailPoints[trailPoints.length - 1].distanceTo(point) > 0.01) {
      trailPoints.push(point)
    }
    trail.geometry.dispose()
    trail.geometry = new THREE.BufferGeometry().setFromPoints(trailPoints)
  }
  refreshGeometry()

  anchors.fixedAtom = new THREE.Vector3(0, 0, 0)
  anchors.potentialWell = new THREE.Vector3(R_MIN, -EPS * V_SCALE, 0)
  anchors.energyLevel = new THREE.Vector3(geometry.center, geometry.level * V_SCALE, 0)
  anchors.rightAtom = new THREE.Vector3(geometry.center, 0, 0)

  const update = () => {
    rightAtom.position.set(geometry.center + geometry.amplitude * Math.sin(state.time * 2.2), 0, 0)
  }
  update()
  leftAtom.position.set(0, 0, 0)

  const model: EntryModel = {
    group,
    anchors,
    radius: 1,
    animation: (elapsed, delta) => {
      void elapsed
      if (!state.playing) return false
      state.time += delta * state.speed
      update()
      return true
    },
    setAnimPlayback: (playing, speed) => {
      state.playing = playing
      state.speed = speed
    },
    setAnimParams: (next) => {
      if (next.temperature !== undefined) {
        params.temperature = next.temperature
        refreshGeometry()
      }
      update()
    },
    animStep: () => {
      state.time += (1 / 30) * state.speed
      update()
    },
  }
  const finalized = finalize(group, anchors)
  model.group = finalized.group
  model.anchors = finalized.anchors
  model.radius = finalized.radius
  return model
}
