import * as THREE from 'three'
import { finalize, type BuildOptions, type EntryModel } from '../kit'

const SIZE = 1.6
const MOTIF_COLOR = '#58c7d8'
const AXIS_COLOR = '#f2b34c'
const MIRROR_COLOR = '#58c7d8'
const ANIM_DURATION = 0.9
const FLASH_DURATION = 0.3

export type SymGen =
  | { type: 'rot'; axis: [number, number, number]; angle: number }
  | { type: 'mirror'; normal: [number, number, number] }
  | { type: 'inversion' }
  | { type: 'rotinv'; axis: [number, number, number]; angle: number }

export interface SymElementSpec {
  kind: 'axis' | 'mirror' | 'inversion'
  order: number
  direction: [number, number, number]
}

export interface PointGroupParams {
  generators: SymGen[]
  elements: SymElementSpec[]
  motifPoint: [number, number, number]
}

function rotMatrix(axis: [number, number, number], angle: number): THREE.Matrix3 {
  const m = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(...axis).normalize(), angle)
  return new THREE.Matrix3().setFromMatrix4(m)
}

function mirrorMatrix(normal: [number, number, number]): THREE.Matrix3 {
  const n = new THREE.Vector3(...normal).normalize()
  const m = new THREE.Matrix3()
  const elements = [
    1 - 2 * n.x * n.x, -2 * n.x * n.y, -2 * n.x * n.z,
    -2 * n.y * n.x, 1 - 2 * n.y * n.y, -2 * n.y * n.z,
    -2 * n.z * n.x, -2 * n.z * n.y, 1 - 2 * n.z * n.z,
  ]
  m.set(elements[0], elements[3], elements[6], elements[1], elements[4], elements[7], elements[2], elements[5], elements[8])
  return m
}

function inversionMatrix(): THREE.Matrix3 {
  return new THREE.Matrix3().set(-1, 0, 0, 0, -1, 0, 0, 0, -1)
}

function genMatrix(gen: SymGen): THREE.Matrix3 {
  if (gen.type === 'rot') return rotMatrix(gen.axis, gen.angle)
  if (gen.type === 'mirror') return mirrorMatrix(gen.normal)
  if (gen.type === 'rotinv') {
    return new THREE.Matrix3().multiplyMatrices(mirrorMatrix(gen.axis), rotMatrix(gen.axis, gen.angle))
  }
  return inversionMatrix()
}

function sameMatrix(a: THREE.Matrix3, b: THREE.Matrix3): boolean {
  const ea = a.elements
  const eb = b.elements
  for (let i = 0; i < 9; i++) {
    if (Math.abs(ea[i] - eb[i]) > 1e-6) return false
  }
  return true
}

export function groupClosure(generators: SymGen[]): THREE.Matrix3[] {
  const gens = generators.map(genMatrix)
  const ops: THREE.Matrix3[] = [new THREE.Matrix3()]
  let grew = true
  let guard = 0
  while (grew && guard < 200) {
    grew = false
    guard++
    for (const op of [...ops]) {
      for (const gen of gens) {
        const product = new THREE.Matrix3().multiplyMatrices(gen, op)
        if (!ops.some((o) => sameMatrix(o, product))) {
          ops.push(product)
          grew = true
        }
      }
    }
  }
  return ops
}

function orbitPositions(ops: THREE.Matrix3[], point: THREE.Vector3): THREE.Vector3[] {
  const positions: THREE.Vector3[] = []
  const seen = new Set<string>()
  for (const op of ops) {
    const p = point.clone().applyMatrix3(op)
    const key = `${p.x.toFixed(3)},${p.y.toFixed(3)},${p.z.toFixed(3)}`
    if (seen.has(key)) continue
    seen.add(key)
    positions.push(p)
  }
  return positions
}

function cubeFrame(edgeMaterial: THREE.LineBasicMaterial): THREE.Group {
  const group = new THREE.Group()
  const corners: THREE.Vector3[] = []
  for (const x of [-SIZE, SIZE]) {
    for (const y of [-SIZE, SIZE]) {
      for (const z of [-SIZE, SIZE]) {
        corners.push(new THREE.Vector3(x, y, z))
      }
    }
  }
  const pairs: Array<[number, number]> = []
  for (let i = 0; i < 8; i++) {
    for (let j = i + 1; j < 8; j++) {
      const d = corners[i].distanceTo(corners[j])
      if (Math.abs(d - 2 * SIZE) < 1e-6) pairs.push([i, j])
    }
  }
  const lines: number[] = []
  for (const [i, j] of pairs) {
    lines.push(corners[i].x, corners[i].y, corners[i].z, corners[j].x, corners[j].y, corners[j].z)
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(lines, 3))
  const frame = new THREE.LineSegments(geometry, edgeMaterial)
  frame.userData = { kind: 'sym-cube-frame' }
  group.add(frame)

  const faces = new THREE.Mesh(
    new THREE.BoxGeometry(2 * SIZE, 2 * SIZE, 2 * SIZE),
    new THREE.MeshBasicMaterial({
      color: new THREE.Color('#58c7d8'),
      transparent: true,
      opacity: 0.05,
      depthWrite: false,
    }),
  )
  faces.userData = { kind: 'sym-cube-face' }
  group.add(faces)
  return group
}

function axisObject(spec: SymElementSpec, index: number): THREE.Group {
  const group = new THREE.Group()
  const dir = new THREE.Vector3(...spec.direction).normalize()
  const length = SIZE * 1.55
  const shaft = new THREE.Mesh(
    new THREE.CylinderGeometry(0.035, 0.035, length * 2 - 0.5, 8),
    new THREE.MeshStandardMaterial({ color: new THREE.Color(AXIS_COLOR), roughness: 0.4 }),
  )
  shaft.userData = { kind: 'sym-axis', order: spec.order, swInteract: index, swInteractKind: 'sym-element' }
  group.add(shaft)

  const head = new THREE.Mesh(
    new THREE.ConeGeometry(0.09, 0.28, 10),
    new THREE.MeshStandardMaterial({ color: new THREE.Color(AXIS_COLOR), roughness: 0.4 }),
  )
  head.position.copy(dir.clone().multiplyScalar(length))
  head.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir)
  head.userData = { kind: 'sym-axis-head', order: spec.order, swInteract: index, swInteractKind: 'sym-element' }
  group.add(head)

  const tickCount = Math.abs(spec.order)
  const tickGeometry = new THREE.BoxGeometry(0.14, 0.045, 0.045)
  const tickMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color(AXIS_COLOR) })
  for (let t = 0; t < tickCount; t++) {
    const tick = new THREE.Mesh(tickGeometry, tickMaterial)
    const along = length - 0.15 - t * 0.28
    tick.position.copy(dir.clone().multiplyScalar(along))
    tick.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir)
    tick.userData = { kind: 'sym-axis-tick', order: spec.order }
    group.add(tick)
  }

  group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir)
  return group
}

function mirrorObject(spec: SymElementSpec, index: number): THREE.Mesh {
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(SIZE * 2.1, SIZE * 2.1),
    new THREE.MeshBasicMaterial({
      color: new THREE.Color(MIRROR_COLOR),
      transparent: true,
      opacity: 0.16,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
  )
  const normal = new THREE.Vector3(...spec.direction).normalize()
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal)
  mesh.userData = { kind: 'sym-mirror', swInteract: index, swInteractKind: 'sym-element' }
  return mesh
}

function inversionObject(index: number): THREE.Group {
  const group = new THREE.Group()
  const core = new THREE.Mesh(
    new THREE.SphereGeometry(0.11, 16, 12),
    new THREE.MeshStandardMaterial({
      color: new THREE.Color('#e9f1f2'),
      emissive: new THREE.Color(MIRROR_COLOR),
      emissiveIntensity: 0.6,
      roughness: 0.3,
    }),
  )
  core.userData = { kind: 'sym-inversion', swInteract: index, swInteractKind: 'sym-element' }
  group.add(core)
  const shell = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.22),
    new THREE.MeshBasicMaterial({ color: new THREE.Color(MIRROR_COLOR), wireframe: true }),
  )
  shell.userData = { kind: 'sym-inversion-shell', swInteract: index, swInteractKind: 'sym-element' }
  group.add(shell)
  return group
}

export function elementMatrix(spec: SymElementSpec): THREE.Matrix3 {
  if (spec.kind === 'inversion') return inversionMatrix()
  if (spec.kind === 'mirror') return mirrorMatrix(spec.direction)
  if (spec.order < 0) {
    return new THREE.Matrix3().multiplyMatrices(mirrorMatrix(spec.direction), rotMatrix(spec.direction, Math.PI / 2))
  }
  return rotMatrix(spec.direction, (Math.PI * 2) / spec.order)
}

interface SymAnimState {
  speed: number
  mode: 'idle' | 'rot' | 'morph' | 'flash'
  rotAxis: THREE.Vector3
  rotTarget: number
  rotCurrent: number
  morphFrom: THREE.Vector3[]
  morphTo: THREE.Vector3[]
  t: number
  flashTimer: number
}

export function buildPointGroupModel(params: PointGroupParams, options: BuildOptions): EntryModel {
  const group = new THREE.Group()
  const anchors: Record<string, THREE.Vector3> = {}

  const edgeMaterial = new THREE.LineBasicMaterial({
    color: new THREE.Color(options.palette.muted),
    transparent: true,
    opacity: 0.85,
  })
  const cube = cubeFrame(edgeMaterial)
  group.add(cube)

  const ops = groupClosure(params.generators)
  const motifPoint = new THREE.Vector3(...params.motifPoint)
  const positions = orbitPositions(ops, motifPoint)
  const motifGroup = new THREE.Group()
  const motifGeometry = new THREE.SphereGeometry(0.11, 14, 10)
  const motifMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(MOTIF_COLOR),
    roughness: 0.35,
    metalness: 0.05,
  })
  for (const p of positions) {
    const mesh = new THREE.Mesh(motifGeometry, motifMaterial)
    mesh.position.copy(p)
    mesh.userData = { kind: 'sym-motif' }
    motifGroup.add(mesh)
  }
  group.add(motifGroup)

  const state: SymAnimState = {
    speed: 1,
    mode: 'idle',
    rotAxis: new THREE.Vector3(0, 0, 1),
    rotTarget: 0,
    rotCurrent: 0,
    morphFrom: [],
    morphTo: [],
    t: 0,
    flashTimer: 0,
  }

  const elementMeshes: THREE.Object3D[] = []
  params.elements.forEach((spec, index) => {
    if (spec.kind === 'axis') {
      const obj = axisObject(spec, index)
      group.add(obj)
      elementMeshes.push(obj)
    } else if (spec.kind === 'mirror') {
      const mesh = mirrorObject(spec, index)
      group.add(mesh)
      elementMeshes.push(mesh)
    } else {
      const obj = inversionObject(index)
      group.add(obj)
      elementMeshes.push(obj)
    }
    anchors[`element-${index}`] = new THREE.Vector3(...spec.direction).normalize().multiplyScalar(SIZE * 1.2)
  })
  if (params.elements.some((e) => e.kind === 'inversion')) {
    anchors.inversion = new THREE.Vector3(0, 0, 0)
  }
  anchors.cubeCorner = new THREE.Vector3(-SIZE, -SIZE, -SIZE)

  const setSpeed = (speed: number) => {
    state.speed = speed
  }

  const model: EntryModel = {
    group,
    anchors,
    radius: 1,
    setSymSpeed: setSpeed,
    animation: (elapsed, delta) => {
      void elapsed
      let busy = false
      if (state.mode === 'rot') {
        const angularSpeed = state.rotTarget / ANIM_DURATION
        state.rotCurrent = Math.min(state.rotCurrent + delta * state.speed * angularSpeed, state.rotTarget)
        motifGroup.setRotationFromAxisAngle(state.rotAxis, state.rotCurrent)
        if (Math.abs(state.rotTarget - state.rotCurrent) < 1e-4) {
          state.rotCurrent = ((state.rotTarget % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)
          if (state.rotCurrent < 1e-6 || Math.abs(state.rotCurrent - Math.PI * 2) < 1e-6) {
            motifGroup.setRotationFromAxisAngle(state.rotAxis, 0)
          } else {
            motifGroup.setRotationFromAxisAngle(state.rotAxis, state.rotCurrent)
          }
          state.mode = 'flash'
          state.flashTimer = FLASH_DURATION
        }
        busy = true
      } else if (state.mode === 'morph') {
        state.t = Math.min(state.t + (delta * state.speed) / ANIM_DURATION, 1)
        const ease = state.t < 0.5 ? 2 * state.t * state.t : 1 - Math.pow(-2 * state.t + 2, 2) / 2
        motifGroup.children.forEach((child, i) => {
          if (i >= state.morphFrom.length) return
          child.position.lerpVectors(state.morphFrom[i], state.morphTo[i], ease)
        })
        if (state.t >= 1) {
          motifGroup.children.forEach((child, i) => {
            if (i >= state.morphTo.length) return
            child.position.copy(state.morphTo[i])
          })
          state.mode = 'flash'
          state.flashTimer = FLASH_DURATION
        }
        busy = true
      } else if (state.mode === 'flash') {
        state.flashTimer -= delta
        const k = Math.max(state.flashTimer / FLASH_DURATION, 0)
        edgeMaterial.color.set('#f2b34c')
        edgeMaterial.opacity = 0.4 + (1 - k) * 0.5
        if (state.flashTimer <= 0) {
          edgeMaterial.color.set(options.palette.muted)
          edgeMaterial.opacity = 0.85
          state.mode = 'idle'
        }
        busy = true
      }
      return busy
    },
    interact: (payload) => {
      if (payload.kind !== 'sym-element') return undefined
      const index = Math.round(payload.value)
      const spec = params.elements[index]
      if (!spec) return undefined
      if (state.mode === 'morph' || state.mode === 'flash') return undefined
      if (spec.kind === 'axis' && spec.order > 0) {
        const dir = new THREE.Vector3(...spec.direction).normalize()
        if (state.mode === 'rot' && state.rotAxis.dot(dir) > 0.999) {
          state.rotTarget += (Math.PI * 2) / spec.order
        } else {
          state.mode = 'rot'
          state.rotAxis = dir
          state.rotCurrent = 0
          state.rotTarget = (Math.PI * 2) / spec.order
          motifGroup.setRotationFromAxisAngle(dir, 0)
        }
      } else {
        const matrix = elementMatrix(spec)
        const from: THREE.Vector3[] = []
        const to: THREE.Vector3[] = []
        motifGroup.children.forEach((child) => {
          from.push(child.position.clone())
          to.push(child.position.clone().applyMatrix3(matrix))
        })
        state.morphFrom = from
        state.morphTo = to
        state.t = 0
        state.mode = 'morph'
      }
      return undefined
    },
  }

  const finalized = finalize(group, anchors)
  model.group = finalized.group
  model.anchors = finalized.anchors
  model.radius = finalized.radius
  return model
}

const GLIDE_PERIOD = 1.4

export function buildGlideDemo(options: BuildOptions): EntryModel {
  const group = new THREE.Group()
  const anchors: Record<string, THREE.Vector3> = {}

  const mirror = new THREE.Mesh(
    new THREE.PlaneGeometry(GLIDE_PERIOD * 4.6, 1.6),
    new THREE.MeshBasicMaterial({
      color: new THREE.Color(MIRROR_COLOR),
      transparent: true,
      opacity: 0.18,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
  )
  mirror.rotation.x = Math.PI / 2
  mirror.userData = { kind: 'sym-mirror', swInteract: 0, swInteractKind: 'sym-element' }
  group.add(mirror)

  const footGeometryBig = new THREE.SphereGeometry(0.16, 14, 10)
  const footGeometrySmall = new THREE.SphereGeometry(0.09, 12, 8)
  const footMaterialBig = new THREE.MeshStandardMaterial({ color: new THREE.Color(MOTIF_COLOR), roughness: 0.4 })
  const footMaterialSmall = new THREE.MeshStandardMaterial({ color: new THREE.Color(AXIS_COLOR), roughness: 0.4 })
  const motifGroup = new THREE.Group()
  const halfPeriod = GLIDE_PERIOD / 2
  for (let k = -3; k <= 3; k++) {
    const left = k % 2 === 0
    const x = k * halfPeriod
    const y = left ? 0.32 : -0.32
    const big = new THREE.Mesh(footGeometryBig, footMaterialBig)
    big.position.set(x - 0.1, y, 0)
    big.userData = { kind: 'sym-motif' }
    motifGroup.add(big)
    const small = new THREE.Mesh(footGeometrySmall, footMaterialSmall)
    small.position.set(x + 0.14, y, 0.05)
    small.userData = { kind: 'sym-motif' }
    motifGroup.add(small)
  }
  group.add(motifGroup)

  const arrowShaft = new THREE.Mesh(
    new THREE.CylinderGeometry(0.035, 0.035, halfPeriod * 0.7, 8),
    new THREE.MeshStandardMaterial({ color: new THREE.Color(AXIS_COLOR), roughness: 0.4 }),
  )
  arrowShaft.rotation.z = Math.PI / 2
  arrowShaft.position.set(halfPeriod * 0.35 + 0.25, 0.95, 0)
  arrowShaft.userData = { kind: 'sym-arrow', swInteract: 1, swInteractKind: 'sym-element' }
  group.add(arrowShaft)
  const arrowHead = new THREE.Mesh(
    new THREE.ConeGeometry(0.09, 0.24, 10),
    new THREE.MeshStandardMaterial({ color: new THREE.Color(AXIS_COLOR), roughness: 0.4 }),
  )
  arrowHead.rotation.z = -Math.PI / 2
  arrowHead.position.set(halfPeriod + 0.25, 0.95, 0)
  arrowHead.userData = { kind: 'sym-arrow', swInteract: 1, swInteractKind: 'sym-element' }
  group.add(arrowHead)

  const state = {
    speed: 1,
    mode: 'idle' as 'idle' | 'morph' | 'flash',
    t: 0,
    flashTimer: 0,
  }
  const flashMaterial = mirror.material as THREE.MeshBasicMaterial

  const model: EntryModel = {
    group,
    anchors,
    radius: 1,
    setSymSpeed: (speed: number) => {
      state.speed = speed
    },
    animation: (elapsed, delta) => {
      void elapsed
      let busy = false
      if (state.mode === 'morph') {
        state.t = Math.min(state.t + (delta * state.speed) / ANIM_DURATION, 1)
        const ease = state.t < 0.5 ? 2 * state.t * state.t : 1 - Math.pow(-2 * state.t + 2, 2) / 2
        motifGroup.children.forEach((child, i) => {
          const startX = child.userData.startX as number
          const startY = child.userData.startY as number
          child.position.x = startX + halfPeriod * ease
          child.position.y = startY * (1 - 2 * ease)
        })
        if (state.t >= 1) {
          motifGroup.children.forEach((child) => {
            child.position.x = child.userData.startX as number
            child.position.y = child.userData.startY as number
          })
          state.mode = 'flash'
          state.flashTimer = FLASH_DURATION
        }
        busy = true
      } else if (state.mode === 'flash') {
        state.flashTimer -= delta
        const k = Math.max(state.flashTimer / FLASH_DURATION, 0)
        flashMaterial.opacity = 0.18 + (1 - k) * 0.5
        flashMaterial.color.set('#f2b34c')
        if (state.flashTimer <= 0) {
          flashMaterial.opacity = 0.18
          flashMaterial.color.set(MIRROR_COLOR)
          state.mode = 'idle'
        }
        busy = true
      }
      return busy
    },
    interact: (payload) => {
      if (payload.kind !== 'sym-element') return undefined
      if (state.mode !== 'idle') return undefined
      motifGroup.children.forEach((child) => {
        child.userData.startX = child.position.x
        child.userData.startY = child.position.y
      })
      state.t = 0
      state.mode = 'morph'
      return undefined
    },
  }

  anchors.mirrorPlane = new THREE.Vector3(0, 0, 0.8)
  anchors.footprint = new THREE.Vector3(0, 0.32, 0)
  anchors.translationArrow = new THREE.Vector3(halfPeriod * 0.6, 0.95, 0)
  anchors.halfPeriod = new THREE.Vector3(halfPeriod, -0.32, 0)

  const finalized = finalize(group, anchors)
  model.group = finalized.group
  model.anchors = finalized.anchors
  model.radius = finalized.radius
  return model
}

export function buildSpaceGroupIntro(options: BuildOptions): EntryModel {
  const group = new THREE.Group()
  const anchors: Record<string, THREE.Vector3> = {}
  const spacing = 3.4
  const motifGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)
  const motifMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(options.theme === 'dark' ? '#e9f1f2' : '#1f2933'),
    roughness: 0.4,
  })
  const gridMaterial = new THREE.LineBasicMaterial({ color: new THREE.Color(options.palette.muted) })

  const buildLattice = (offsetX: number, centered: boolean): THREE.Group => {
    const lattice = new THREE.Group()
    const d = 1.1
    const size = d * 3
    const lines: number[] = []
    for (let i = 0; i <= 3; i++) {
      lines.push(offsetX, 0, i * d, offsetX + size, 0, i * d)
      lines.push(offsetX + i * d, 0, 0, offsetX + i * d, 0, size)
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(lines, 3))
    const grid = new THREE.LineSegments(geometry, gridMaterial)
    grid.userData = { kind: 'sym-lattice-grid' }
    lattice.add(grid)
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const motif = new THREE.Mesh(motifGeometry, motifMaterial)
        motif.position.set(offsetX + i * d + d / 2, 0.35, j * d + d / 2)
        motif.rotation.y = Math.PI / 4
        motif.userData = { kind: 'sym-lattice-motif' }
        lattice.add(motif)
        if (centered) {
          const extra = new THREE.Mesh(motifGeometry, motifMaterial)
          extra.position.copy(motif.position).add(new THREE.Vector3(d / 2, 0, d / 2))
          extra.rotation.y = Math.PI / 4
          extra.userData = { kind: 'sym-lattice-motif' }
          lattice.add(extra)
        }
      }
    }
    return lattice
  }

  group.add(buildLattice(0, false))
  group.add(buildLattice(spacing + 1.2, true))

  anchors.leftCell = new THREE.Vector3(0.55, 0.35, 0.55)
  anchors.rightCell = new THREE.Vector3(spacing + 1.75, 0.35, 0.55)
  anchors.centeringMotif = new THREE.Vector3(spacing + 2.3, 0.35, 1.1)
  anchors.translationVector = new THREE.Vector3(1.65, 0.9, 0)
  return finalize(group, anchors)
}
