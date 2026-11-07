import * as THREE from 'three'
import { finalize, type BuildOptions, type EntryModel } from '../kit'

const EPS = 0.6
const V_SCALE = 1.6
const R_MIN = Math.pow(2, 1 / 6)
const OMEGA_H = 1.6
const SOFTEN = 0.35
const LEFT_X = -2.2
const RIGHT_X = 2.2
const LOCAL_MAX = 0.55

function ljPotential(r: number): number {
  const x = 1 / r
  const x6 = Math.pow(x, 6)
  return 4 * EPS * (x6 * x6 - x6)
}

function solveOuterTurning(level: number): number {
  let lo = R_MIN
  let hi = 3.2
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2
    if (ljPotential(mid) < level) lo = mid
    else hi = mid
  }
  return (lo + hi) / 2
}

function solveInnerTurning(level: number): number {
  let lo = 0.82
  let hi = R_MIN
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2
    if (ljPotential(mid) > level) lo = mid
    else hi = mid
  }
  return (lo + hi) / 2
}

export default function buildHarmonicVsAnharmonic(options: BuildOptions): EntryModel {
  const group = new THREE.Group()
  const anchors: Record<string, THREE.Vector3> = {}
  const state = { playing: true, speed: 1, time: 0 }
  const params = { energy: 0.25 }

  const harmonicPotential = (local: number) => 0.5 * 1.4 * local * local

  const harmonicPoints: THREE.Vector3[] = []
  for (let l = -LOCAL_MAX; l <= LOCAL_MAX + 1e-9; l += 0.02) {
    harmonicPoints.push(new THREE.Vector3(LEFT_X + l, harmonicPotential(l) * V_SCALE, 0))
  }
  const harmonicCurve = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(harmonicPoints),
    new THREE.LineBasicMaterial({ color: new THREE.Color('#58c7d8') }),
  )
  harmonicCurve.userData = { kind: 'osc-curve-harmonic' }
  group.add(harmonicCurve)

  const anharmonicPoints: THREE.Vector3[] = []
  for (let r = 0.88; r <= 1.75; r += 0.012) {
    anharmonicPoints.push(new THREE.Vector3(RIGHT_X + r - R_MIN, ljPotential(r) * V_SCALE, 0))
  }
  const anharmonicCurve = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(anharmonicPoints),
    new THREE.LineBasicMaterial({ color: new THREE.Color('#f2b34c') }),
  )
  anharmonicCurve.userData = { kind: 'osc-curve-anharmonic' }
  group.add(anharmonicCurve)

  const leftBall = new THREE.Mesh(
    new THREE.SphereGeometry(0.17, 16, 12),
    new THREE.MeshStandardMaterial({ color: new THREE.Color('#58c7d8'), roughness: 0.35 }),
  )
  leftBall.userData = { kind: 'osc-ball' }
  group.add(leftBall)

  const rightBall = new THREE.Mesh(
    new THREE.SphereGeometry(0.17, 16, 12),
    new THREE.MeshStandardMaterial({ color: new THREE.Color('#f2b34c'), roughness: 0.35 }),
  )
  rightBall.userData = { kind: 'osc-ball' }
  group.add(rightBall)

  const leftMark = new THREE.Mesh(
    new THREE.SphereGeometry(0.055, 10, 8),
    new THREE.MeshBasicMaterial({ color: new THREE.Color('#58c7d8') }),
  )
  leftMark.userData = { kind: 'osc-mark' }
  group.add(leftMark)

  const rightMark = new THREE.Mesh(
    new THREE.SphereGeometry(0.055, 10, 8),
    new THREE.MeshBasicMaterial({ color: new THREE.Color('#f2b34c') }),
  )
  rightMark.userData = { kind: 'osc-mark' }
  group.add(rightMark)

  let geometry = { aH: 0, aA: 0, centerA: 0 }
  const refreshGeometry = () => {
    geometry.aH = Math.sqrt((2 * params.energy) / 1.4)
    const levelA = -EPS + params.energy
    const r1 = solveInnerTurning(levelA)
    const r2 = solveOuterTurning(levelA)
    geometry.aA = (r2 - r1) / 2
    geometry.centerA = (r1 + r2) / 2 - R_MIN
    leftMark.position.set(LEFT_X, params.energy * V_SCALE, 0)
    rightMark.position.set(RIGHT_X + geometry.centerA, levelA * V_SCALE, 0)
  }
  refreshGeometry()

  anchors.leftOscillator = new THREE.Vector3(LEFT_X, 0, 0)
  anchors.rightOscillator = new THREE.Vector3(RIGHT_X, 0, 0)
  anchors.parabolaWell = new THREE.Vector3(LEFT_X, 0, 0)
  anchors.ljWell = new THREE.Vector3(RIGHT_X, -EPS * V_SCALE, 0)

  const update = () => {
    leftBall.position.set(LEFT_X + geometry.aH * Math.cos(OMEGA_H * state.time), 0, 0)
    const omegaA = OMEGA_H * (1 - SOFTEN * (geometry.aA / LOCAL_MAX))
    rightBall.position.set(
      RIGHT_X + geometry.centerA + geometry.aA * Math.cos(omegaA * state.time),
      0,
      0,
    )
  }
  update()

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
      if (next.energy !== undefined) {
        params.energy = next.energy
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
