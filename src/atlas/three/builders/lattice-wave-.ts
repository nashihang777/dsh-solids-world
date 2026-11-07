import * as THREE from 'three'
import { finalize, type BuildOptions, type EntryModel } from '../kit'

const POSITIVE = new THREE.Color('#f2b34c')
const NEGATIVE = new THREE.Color('#58c7d8')
const NEUTRAL = new THREE.Color('#93a8b0')
const OMEGA_3D = 1.2

interface WaveState {
  playing: boolean
  speed: number
  time: number
}

function makeState(): WaveState {
  return { playing: true, speed: 1, time: 0 }
}

function tint(material: THREE.MeshStandardMaterial, u: number, amplitude: number): void {
  const t = amplitude > 1e-6 ? Math.max(Math.min(u / amplitude, 1), -1) : 0
  const base = t >= 0 ? POSITIVE : NEGATIVE
  material.color.copy(base).multiplyScalar(0.4 + 0.6 * Math.abs(t))
}

export function buildMonoChain(options: BuildOptions): EntryModel {
  const N = 24
  const AMP = 0.45
  const CURVE_Y = 1.9
  const state = makeState()
  const params = { wavelength: 6, frequency: 1.5 }

  const group = new THREE.Group()
  const anchors: Record<string, THREE.Vector3> = {}
  const atoms: THREE.Mesh[] = []
  const geometry = new THREE.SphereGeometry(0.3, 16, 12)
  for (let i = 0; i < N; i++) {
    const material = new THREE.MeshStandardMaterial({ color: NEUTRAL.clone(), roughness: 0.45 })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.userData = { kind: 'wave-atom' }
    group.add(mesh)
    atoms.push(mesh)
  }

  const curvePositions = new Float32Array(N * 3)
  const curveGeometry = new THREE.BufferGeometry()
  curveGeometry.setAttribute('position', new THREE.BufferAttribute(curvePositions, 3))
  const curve = new THREE.Line(curveGeometry, new THREE.LineBasicMaterial({ color: new THREE.Color('#f2b34c') }))
  curve.userData = { kind: 'wave-curve' }
  group.add(curve)

  const axis = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, CURVE_Y, 0), new THREE.Vector3(N - 1, CURVE_Y, 0)]),
    new THREE.LineBasicMaterial({ color: new THREE.Color(options.palette.muted), transparent: true, opacity: 0.5 }),
  )
  axis.userData = { kind: 'wave-axis' }
  group.add(axis)

  const update = () => {
    const k = (Math.PI * 2) / params.wavelength
    const omega = params.frequency
    for (let i = 0; i < N; i++) {
      const u = AMP * Math.sin(k * i - omega * state.time)
      atoms[i].position.set(i, u, 0)
      tint(atoms[i].material as THREE.MeshStandardMaterial, u, AMP)
      curvePositions[i * 3] = i
      curvePositions[i * 3 + 1] = CURVE_Y + u
      curvePositions[i * 3 + 2] = 0
    }
    curveGeometry.attributes.position.needsUpdate = true
    curveGeometry.computeBoundingSphere()
  }
  update()

  anchors.chainStart = new THREE.Vector3(0, 0, 0)
  anchors.chainEnd = new THREE.Vector3(N - 1, 0, 0)
  anchors.curve = new THREE.Vector3(N / 2, CURVE_Y, 0)
  atoms[N - 1].position.set(N - 1, 0, 0)
  anchors.lastAtom = atoms[N - 1].position.clone()

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
      if (next.wavelength !== undefined) params.wavelength = next.wavelength
      if (next.frequency !== undefined) params.frequency = next.frequency
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

export function buildDiatomicChain(options: BuildOptions): EntryModel {
  const PAIRS = 12
  const AMP = 0.4
  const state = makeState()
  const params = { branch: 0, frequency: 1.2 }
  const M_RADIUS = 0.36
  const m_RADIUS = 0.24
  const MASS_RATIO = 0.5

  const group = new THREE.Group()
  const anchors: Record<string, THREE.Vector3> = {}
  const bigAtoms: THREE.Mesh[] = []
  const smallAtoms: THREE.Mesh[] = []
  const bigGeometry = new THREE.SphereGeometry(M_RADIUS, 16, 12)
  const smallGeometry = new THREE.SphereGeometry(m_RADIUS, 16, 12)
  for (let p = 0; p < PAIRS; p++) {
    const big = new THREE.Mesh(bigGeometry, new THREE.MeshStandardMaterial({ color: NEUTRAL.clone(), roughness: 0.45 }))
    big.userData = { kind: 'wave-atom-m' }
    group.add(big)
    bigAtoms.push(big)
    const small = new THREE.Mesh(
      smallGeometry,
      new THREE.MeshStandardMaterial({ color: NEUTRAL.clone(), roughness: 0.45 }),
    )
    small.userData = { kind: 'wave-atom-m' }
    group.add(small)
    smallAtoms.push(small)
  }

  const baseLine = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(PAIRS - 0.5, 0, 0)]),
    new THREE.LineBasicMaterial({ color: new THREE.Color(options.palette.muted), transparent: true, opacity: 0.4 }),
  )
  baseLine.userData = { kind: 'wave-axis' }
  group.add(baseLine)

  const update = () => {
    const omega = params.frequency
    const acoustic = params.branch === 0
    const k = acoustic ? (Math.PI * 2) / (PAIRS / 2) : 0
    for (let p = 0; p < PAIRS; p++) {
      const xM = p
      const xm = p + 0.5
      let uM: number
      let um: number
      if (acoustic) {
        uM = AMP * Math.sin(k * xM - omega * state.time)
        um = AMP * Math.sin(k * xm - omega * state.time)
      } else {
        um = AMP * Math.sin(omega * state.time)
        uM = -MASS_RATIO * AMP * Math.sin(omega * state.time)
      }
      bigAtoms[p].position.set(xM + uM, 0, 0)
      smallAtoms[p].position.set(xm + um, 0, 0)
      tint(bigAtoms[p].material as THREE.MeshStandardMaterial, uM, AMP)
      tint(smallAtoms[p].material as THREE.MeshStandardMaterial, um, AMP)
    }
  }
  update()

  anchors.chainStart = new THREE.Vector3(0, 0, 0)
  anchors.bigAtom = new THREE.Vector3(0, 0, 0)
  anchors.smallAtom = new THREE.Vector3(0.5, 0, 0)
  anchors.pair = new THREE.Vector3(4.5, 0, 0)
  anchors.chainEnd = new THREE.Vector3(PAIRS - 0.5, 0, 0)

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
      if (next.branch !== undefined) params.branch = Math.round(next.branch)
      if (next.frequency !== undefined) params.frequency = next.frequency
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

const K_DIRS: Array<[number, number, number]> = [
  [1, 0, 0],
  [1, 1, 0],
  [1, 1, 1],
]

export function build3DMode(options: BuildOptions): EntryModel {
  const GRID_N = 5
  const SPACING = 1.3
  const state = makeState()
  const params = { kdir: 0, amplitude: 0.3 }

  const group = new THREE.Group()
  const anchors: Record<string, THREE.Vector3> = {}
  const items: Array<{ mesh: THREE.Mesh; base: THREE.Vector3 }> = []
  const geometry = new THREE.SphereGeometry(0.22, 14, 10)
  for (let i = 0; i < GRID_N; i++) {
    for (let j = 0; j < GRID_N; j++) {
      for (let k = 0; k < GRID_N; k++) {
        const material = new THREE.MeshStandardMaterial({ color: NEUTRAL.clone(), roughness: 0.45 })
        const mesh = new THREE.Mesh(geometry, material)
        mesh.userData = { kind: 'wave-atom-3d' }
        group.add(mesh)
        items.push({ mesh, base: new THREE.Vector3(i * SPACING, j * SPACING, k * SPACING) })
      }
    }
  }

  const cellFrameEdges: number[] = []
  const size = SPACING * (GRID_N - 1)
  for (let a = 0; a <= size; a += size) {
    for (let b = 0; b <= size; b += size) {
      cellFrameEdges.push(0, a, b, size, a, b)
      cellFrameEdges.push(a, 0, b, a, size, b)
      cellFrameEdges.push(a, b, 0, a, b, size)
    }
  }
  const frameGeometry = new THREE.BufferGeometry()
  frameGeometry.setAttribute('position', new THREE.Float32BufferAttribute(cellFrameEdges, 3))
  const frame = new THREE.LineSegments(
    frameGeometry,
    new THREE.LineBasicMaterial({ color: new THREE.Color(options.palette.muted), transparent: true, opacity: 0.5 }),
  )
  frame.userData = { kind: 'wave-frame' }
  group.add(frame)

  const update = () => {
    const dir = new THREE.Vector3(...K_DIRS[params.kdir]).normalize()
    const kMag = (Math.PI * 2) / (SPACING * 4)
    const polar = new THREE.Vector3(0, 0, 1).cross(dir).lengthSq() > 1e-6 ? new THREE.Vector3(0, 0, 1).cross(dir).normalize() : new THREE.Vector3(0, 1, 0)
    for (const { mesh, base } of items) {
      const phase = kMag * dir.dot(base) - OMEGA_3D * state.time
      const u = params.amplitude * Math.sin(phase)
      mesh.position.copy(base).addScaledVector(polar, u)
      tint(mesh.material as THREE.MeshStandardMaterial, u, params.amplitude)
    }
  }
  update()

  anchors.latticeCorner = new THREE.Vector3(0, 0, 0)
  anchors.latticeCenter = new THREE.Vector3(size / 2, size / 2, size / 2)
  anchors.latticeFar = new THREE.Vector3(size, size, size)

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
      if (next.kdir !== undefined) params.kdir = Math.round(next.kdir)
      if (next.amplitude !== undefined) params.amplitude = next.amplitude
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
