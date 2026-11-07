import * as THREE from 'three'
import type { OrbitalMode } from '../../data/types'
import { finalize, type BuildOptions, type EntryModel } from '../kit'

export interface FieldSample {
  field: Float32Array
  dims: number
  extent: number
  maxAbs: number
  maxPos: number
  maxNeg: number
}

const GRID = 64

const RADIAL: Record<string, (r: number) => number> = {
  '1,0': (r) => 2 * Math.exp(-r),
  '2,0': (r) => (1 / (2 * Math.sqrt(2))) * (2 - r) * Math.exp(-r / 2),
  '2,1': (r) => (1 / (2 * Math.sqrt(6))) * r * Math.exp(-r / 2),
  '3,2': (r) => (4 / (81 * Math.sqrt(30))) * r * r * Math.exp(-r / 3),
}

const EXTENT: Record<number, number> = { 1: 5, 2: 11, 3: 20 }

const ANGULAR_MAX: Record<OrbitalMode, { max: number; l: number }> = {
  s: { max: 1 / (2 * Math.sqrt(Math.PI)), l: 0 },
  pz: { max: Math.sqrt(3 / (4 * Math.PI)), l: 1 },
  px: { max: Math.sqrt(3 / (4 * Math.PI)), l: 1 },
  py: { max: Math.sqrt(3 / (4 * Math.PI)), l: 1 },
  dz2: { max: 2 * Math.sqrt(5 / (16 * Math.PI)), l: 2 },
  dxy: { max: Math.sqrt(15 / (4 * Math.PI)) / 2, l: 2 },
}

const DZ2_RING_MAX = Math.sqrt(5 / (16 * Math.PI))

export function radialWave(n: number, l: number, r: number): number {
  const fn = RADIAL[`${n},${l}`]
  if (!fn) throw new Error(`radialWave: n=${n}, l=${l}`)
  return fn(r)
}

export function harmonic(mode: OrbitalMode, x: number, y: number, z: number, r: number): number {
  switch (mode) {
    case 's':
      return 1 / (2 * Math.sqrt(Math.PI))
    case 'pz':
      return Math.sqrt(3 / (4 * Math.PI)) * (z / r)
    case 'px':
      return Math.sqrt(3 / (4 * Math.PI)) * (x / r)
    case 'py':
      return Math.sqrt(3 / (4 * Math.PI)) * (y / r)
    case 'dz2':
      return (Math.sqrt(5 / (16 * Math.PI)) * (3 * z * z - r * r)) / (r * r)
    case 'dxy':
      return (Math.sqrt(15 / (4 * Math.PI)) * (x * y)) / (r * r)
  }
}

export function psi(mode: OrbitalMode, n: number, l: number, x: number, y: number, z: number): number {
  const r = Math.sqrt(x * x + y * y + z * z)
  if (r < 1e-9) return 0
  return radialWave(n, l, r) * harmonic(mode, x, y, z, r)
}

const fieldCache = new Map<string, FieldSample>()

export function sampleField(mode: OrbitalMode, n: number, l: number): FieldSample {
  const key = `${n},${l},${mode}`
  const cached = fieldCache.get(key)
  if (cached) return cached
  const extent = EXTENT[n] ?? 15
  const field = new Float32Array(GRID * GRID * GRID)
  let maxAbs = 0
  let maxPos = 0
  let maxNeg = 0
  for (let k = 0; k < GRID; k++) {
    const z = ((k / (GRID - 1)) * 2 - 1) * extent
    for (let j = 0; j < GRID; j++) {
      const y = ((j / (GRID - 1)) * 2 - 1) * extent
      for (let i = 0; i < GRID; i++) {
        const x = ((i / (GRID - 1)) * 2 - 1) * extent
        const v = psi(mode, n, l, x, y, z)
        field[i + j * GRID + k * GRID * GRID] = v
        const abs = Math.abs(v)
        if (abs > maxAbs) maxAbs = abs
        if (v > maxPos) maxPos = v
        if (-v > maxNeg) maxNeg = -v
      }
    }
  }
  const sample: FieldSample = { field, dims: GRID, extent, maxAbs, maxPos, maxNeg }
  fieldCache.set(key, sample)
  return sample
}

export interface MeshData {
  positions: Float32Array
  indices: Uint32Array
}

const CORNERS: Array<[number, number, number]> = [
  [0, 0, 0],
  [1, 0, 0],
  [1, 1, 0],
  [0, 1, 0],
  [0, 0, 1],
  [1, 0, 1],
  [1, 1, 1],
  [0, 1, 1],
]

const EDGES: Array<[number, number]> = [
  [0, 1],
  [2, 3],
  [4, 5],
  [6, 7],
  [0, 3],
  [1, 2],
  [5, 6],
  [4, 7],
  [0, 4],
  [1, 5],
  [2, 6],
  [3, 7],
]

export function surfaceNets(field: Float32Array, dims: number, iso: number): MeshData {
  const cellCount = dims - 1
  const vertexIndex = new Int32Array(cellCount * cellCount * cellCount).fill(-1)
  const positions: number[] = []
  const indices: number[] = []
  const values = new Float64Array(8)

  const cellIdx = (i: number, j: number, k: number) => i + j * cellCount + k * cellCount * cellCount

  for (let k = 0; k < cellCount; k++) {
    for (let j = 0; j < cellCount; j++) {
      for (let i = 0; i < cellCount; i++) {
        let mask = 0
        for (let c = 0; c < 8; c++) {
          const [ci, cj, ck] = CORNERS[c]
          const v = field[(i + ci) + (j + cj) * dims + (k + ck) * dims * dims]
          values[c] = v
          if (v < iso) mask |= 1 << c
        }
        if (mask === 0 || mask === 255) continue

        let vx = 0
        let vy = 0
        let vz = 0
        let count = 0
        for (const [a, b] of EDGES) {
          const bitA = (mask >> a) & 1
          const bitB = (mask >> b) & 1
          if (bitA === bitB) continue
          const t = Math.min(Math.max((iso - values[a]) / (values[b] - values[a]), 0), 1)
          const ax = i + CORNERS[a][0]
          const ay = j + CORNERS[a][1]
          const az = k + CORNERS[a][2]
          const bx = i + CORNERS[b][0]
          const by = j + CORNERS[b][1]
          const bz = k + CORNERS[b][2]
          vx += ax + (bx - ax) * t
          vy += ay + (by - ay) * t
          vz += az + (bz - az) * t
          count++
        }
        if (count === 0) continue
        vertexIndex[cellIdx(i, j, k)] = positions.length / 3
        positions.push(vx / count, vy / count, vz / count)
      }
    }
  }

  for (let k = 0; k < cellCount; k++) {
    for (let j = 0; j < cellCount; j++) {
      for (let i = 0; i < cellCount; i++) {
        if (vertexIndex[cellIdx(i, j, k)] < 0) continue
        const v0 = field[i + j * dims + k * dims * dims]
        for (const other of [1, 3, 4] as const) {
          const v1 = field[(i + CORNERS[other][0]) + (j + CORNERS[other][1]) * dims + (k + CORNERS[other][2]) * dims * dims]
          const below0 = v0 < iso
          const below1 = v1 < iso
          if (below0 === below1) continue
          const axis = other === 1 ? 0 : other === 3 ? 1 : 2
          const quad = quadNeighbors(i, j, k, axis).map(([qi, qj, qk]) => {
            if (qi < 0 || qj < 0 || qk < 0 || qi >= cellCount || qj >= cellCount || qk >= cellCount) return -1
            return vertexIndex[cellIdx(qi, qj, qk)]
          })
          if (quad.includes(-1)) continue
          if (below0) {
            indices.push(quad[0], quad[1], quad[2], quad[0], quad[2], quad[3])
          } else {
            indices.push(quad[0], quad[2], quad[1], quad[0], quad[3], quad[2])
          }
        }
      }
    }
  }

  return {
    positions: new Float32Array(positions),
    indices: new Uint32Array(indices),
  }
}

function quadNeighbors(i: number, j: number, k: number, axis: 0 | 1 | 2): Array<[number, number, number]> {
  if (axis === 0) {
    return [
      [i, j, k],
      [i, j - 1, k],
      [i, j - 1, k - 1],
      [i, j, k - 1],
    ]
  }
  if (axis === 1) {
    return [
      [i, j, k],
      [i - 1, j, k],
      [i - 1, j, k - 1],
      [i, j, k - 1],
    ]
  }
  return [
    [i, j, k],
    [i - 1, j, k],
    [i - 1, j - 1, k],
    [i, j - 1, k],
  ]
}

interface NodalSurface {
  kind: 'sphere' | 'plane' | 'cone'
  param: number
}

const NODAL: Record<string, NodalSurface[]> = {
  '2,0': [{ kind: 'sphere', param: 2 }],
  '2,1,pz': [{ kind: 'plane', param: 2 }],
  '2,1,px': [{ kind: 'plane', param: 1 }],
  '2,1,py': [{ kind: 'plane', param: 0 }],
  '3,2,dxy': [
    { kind: 'plane', param: 1 },
    { kind: 'plane', param: 0 },
  ],
  '3,2,dz2': [{ kind: 'cone', param: Math.acos(1 / Math.sqrt(3)) }],
}

function nodalMeshes(surface: NodalSurface, extent: number): THREE.Mesh[] {
  if (surface.kind === 'sphere') {
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(surface.param, 32, 20),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color('#f2b34c'),
        transparent: true,
        opacity: 0.14,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    )
    mesh.userData = { kind: 'nodal-surface' }
    return [mesh]
  }
  if (surface.kind === 'plane') {
    const size = extent * 1.9
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(size, size),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color('#f2b34c'),
        transparent: true,
        opacity: 0.14,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    )
    if (surface.param === 0) mesh.rotation.x = Math.PI / 2
    else if (surface.param === 1) mesh.rotation.y = Math.PI / 2
    mesh.userData = { kind: 'nodal-surface' }
    return [mesh]
  }
  const height = extent
  const radius = height * Math.tan(surface.param)
  const meshes: THREE.Mesh[] = []
  for (const dir of [1, -1]) {
    const mesh = new THREE.Mesh(
      new THREE.ConeGeometry(radius, height, 48, 1, true),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color('#f2b34c'),
        transparent: true,
        opacity: 0.14,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    )
    mesh.rotation.x = (dir * Math.PI) / 2
    mesh.position.z = (-dir * height) / 2
    mesh.userData = { kind: 'nodal-surface' }
    meshes.push(mesh)
  }
  return meshes
}

const PHASE_POSITIVE_DARK = '#f2b34c'
const PHASE_POSITIVE_LIGHT = '#9a5b00'
const PHASE_NEGATIVE_DARK = '#58c7d8'
const PHASE_NEGATIVE_LIGHT = '#0e7490'

export const ORBITAL_OPACITY = 0.6

function negateCacheMap(): WeakMap<Float32Array, Float32Array> {
  return negateFieldCache
}

const negateFieldCache = new WeakMap<Float32Array, Float32Array>()

function negateField(field: Float32Array): Float32Array {
  const cached = negateCacheMap().get(field)
  if (cached) return cached
  const negated = new Float32Array(field.length)
  for (let i = 0; i < field.length; i++) negated[i] = -field[i]
  negateFieldCache.set(field, negated)
  return negated
}

function isosurfaceMesh(
  sample: FieldSample,
  iso: number,
  sign: 1 | -1,
  opacity: number,
  theme: 'dark' | 'light',
): THREE.Mesh | null {
  const field = sign === 1 ? sample.field : negateField(sample.field)
  const meshData = surfaceNets(field, sample.dims, iso)
  if (meshData.indices.length === 0) return null
  const geometry = new THREE.BufferGeometry()
  const span = (sample.extent * 2) / (sample.dims - 1)
  const center = (sample.dims - 1) / 2
  const scaled = new Float32Array(meshData.positions.length)
  for (let p = 0; p < meshData.positions.length; p++) {
    scaled[p] = (meshData.positions[p] - center) * span
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(scaled, 3))
  geometry.setIndex(new THREE.BufferAttribute(meshData.indices, 1))
  geometry.computeVertexNormals()
  const base =
    sign === 1
      ? theme === 'dark'
        ? PHASE_POSITIVE_DARK
        : PHASE_POSITIVE_LIGHT
      : theme === 'dark'
        ? PHASE_NEGATIVE_DARK
        : PHASE_NEGATIVE_LIGHT
  const material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(base),
    transparent: true,
    opacity,
    side: THREE.DoubleSide,
    roughness: 0.45,
    metalness: 0.05,
    depthWrite: false,
  })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.userData = { kind: 'orbital-surface', phase: sign }
  return mesh
}

function axialReach(mode: OrbitalMode, n: number, iso: number, angularMax: number): number {
  const { l } = ANGULAR_MAX[mode]
  const extent = EXTENT[n] ?? 15
  let inside = false
  for (let r = 0.05; r < extent; r += 0.05) {
    const v = Math.abs(radialWave(n, l, r)) * angularMax
    if (!inside && v > iso) {
      inside = true
    } else if (inside && v < iso) {
      return r
    }
  }
  return extent * 0.8
}

function dz2RingPeak(n: number): number {
  const extent = EXTENT[n] ?? 15
  let best = 1
  let bestVal = 0
  for (let r = 0.05; r < extent; r += 0.05) {
    const v = Math.abs(radialWave(n, 2, r)) * DZ2_RING_MAX
    if (v > bestVal) {
      bestVal = v
      best = r
    }
  }
  return best
}

export interface OrbitalBuildParams {
  n: number
  l: number
  mode: OrbitalMode
  pMode: 'single' | 'triple'
}

export function buildOrbitalModel(params: OrbitalBuildParams, options: BuildOptions): EntryModel {
  const group = new THREE.Group()
  const anchors: Record<string, THREE.Vector3> = {}
  const isoFraction = options.orbitalView?.isoFraction ?? 0.2
  const modes: OrbitalMode[] =
    params.pMode === 'triple' && params.l === 1 ? ['pz', 'px', 'py'] : [params.mode]

  for (const mode of modes) {
    const sample = sampleField(mode, params.n, params.l)
    const isoPos = sample.maxPos * isoFraction
    const isoNeg = sample.maxNeg * isoFraction
    const pos = isoPos > 0 ? isosurfaceMesh(sample, isoPos, 1, ORBITAL_OPACITY, options.theme) : null
    if (pos) group.add(pos)
    const neg = isoNeg > 0 ? isosurfaceMesh(sample, isoNeg, -1, ORBITAL_OPACITY, options.theme) : null
    if (neg) group.add(neg)

    const angular = ANGULAR_MAX[mode].max
    const reach = axialReach(mode, params.n, isoPos, angular)
    if (mode === 's') {
      anchors.nucleus = new THREE.Vector3(0, 0, 0)
      if (params.n === 1) {
        anchors.bohrRadius = new THREE.Vector3(Math.log(1 / isoFraction), 0, 0)
        anchors.outerEdge = new THREE.Vector3(reach, 0, 0)
      }
      if (params.n === 2) {
        anchors.nodeShell = new THREE.Vector3(2, 0, 0)
        anchors.outerPeak = new THREE.Vector3(5.24, 0, 0)
      }
    } else if (mode === 'pz') {
      anchors.lobeTop = new THREE.Vector3(0, 0, reach)
      anchors.lobeBottom = new THREE.Vector3(0, 0, -reach)
      anchors.nodeCenter = new THREE.Vector3(0, 0, 0)
    } else if (mode === 'px') {
      anchors.lobeX = new THREE.Vector3(reach, 0, 0)
    } else if (mode === 'py') {
      anchors.lobeY = new THREE.Vector3(0, reach, 0)
    } else if (mode === 'dz2') {
      anchors.lobeTop = new THREE.Vector3(0, 0, reach)
      anchors.ringBand = new THREE.Vector3(dz2RingPeak(params.n), 0, 0)
    } else if (mode === 'dxy') {
      anchors.lobeQuadrant = new THREE.Vector3(reach / Math.SQRT2, reach / Math.SQRT2, 0)
    }
  }

  if (params.mode === 'dxy') {
    anchors.nodePlaneX = new THREE.Vector3(0, 1.2, 0)
    anchors.nodePlaneY = new THREE.Vector3(1.2, 0, 0)
  }

  const nodal = NODAL[`${params.n},${params.l},${params.mode}`]
  if (nodal) {
    const sample = sampleField(params.mode, params.n, params.l)
    for (const surface of nodal) {
      for (const mesh of nodalMeshes(surface, sample.extent)) {
        group.add(mesh)
      }
    }
  }

  return finalize(group, anchors)
}

export function buildElectronCloudModel(options: BuildOptions): EntryModel {
  const group = new THREE.Group()
  const anchors: Record<string, THREE.Vector3> = {}
  const count = 12000
  const positions = new Float32Array(count * 3)
  const maxDensity = 4 * Math.exp(-2)
  let placed = 0
  let guard = 0
  while (placed < count && guard < count * 400) {
    guard++
    const r = Math.random() * 9
    const density = 4 * r * r * Math.exp(-2 * r)
    if (density < Math.random() * maxDensity) continue
    const cost = Math.random() * 2 - 1
    const phi = Math.random() * Math.PI * 2
    const sint = Math.sqrt(1 - cost * cost)
    positions[placed * 3] = r * sint * Math.cos(phi)
    positions[placed * 3 + 1] = r * sint * Math.sin(phi)
    positions[placed * 3 + 2] = r * cost
    placed++
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions.slice(0, placed * 3), 3))
  const material = new THREE.PointsMaterial({
    color: new THREE.Color(options.theme === 'dark' ? '#4cc98a' : '#147a4f'),
    size: 0.1,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
  })
  const points = new THREE.Points(geometry, material)
  points.userData = { kind: 'electron-cloud' }
  group.add(points)

  const nucleus = new THREE.Mesh(
    new THREE.SphereGeometry(0.16, 16, 12),
    new THREE.MeshStandardMaterial({ color: new THREE.Color(options.palette.muted), roughness: 0.4 }),
  )
  nucleus.userData = { kind: 'cloud-nucleus' }
  group.add(nucleus)

  const shell = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 20),
    new THREE.MeshBasicMaterial({
      color: new THREE.Color('#f2b34c'),
      transparent: true,
      opacity: 0.22,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
  )
  shell.userData = { kind: 'bohr-shell' }
  group.add(shell)

  anchors.nucleus = new THREE.Vector3(0, 0, 0)
  anchors.bohrShell = new THREE.Vector3(1, 0, 0)
  anchors.cloudEdge = new THREE.Vector3(2.66, 0, 0)
  return finalize(group, anchors)
}

const P_SCALE = 0.3

export function radialPDF(n: number, l: number, r: number): number {
  const R = radialWave(n, l, r)
  return 4 * Math.PI * r * r * R * R
}

export function mostProbableR(n: number, l: number): number {
  let best = 1
  let bestVal = 0
  for (let r = 0.2; r < 14; r += 0.05) {
    const v = radialPDF(n, l, r)
    if (v > bestVal) {
      bestVal = v
      best = r
    }
  }
  return best
}

export function buildRadialDistributionModel(options: BuildOptions): EntryModel {
  const group = new THREE.Group()
  const anchors: Record<string, THREE.Vector3> = {}
  const shellDefs: Array<{ n: number; l: number; label: string }> = [
    { n: 1, l: 0, label: '1s' },
    { n: 2, l: 1, label: '2p' },
    { n: 2, l: 0, label: '2s' },
  ]
  const shells: Array<{ r: number; mesh: THREE.Mesh }> = []
  for (const def of shellDefs) {
    const r = mostProbableR(def.n, def.l)
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(r, 36, 24),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color('#58c7d8'),
        transparent: true,
        opacity: 0.1,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    )
    mesh.userData = { kind: 'radial-shell', shellR: r }
    group.add(mesh)
    shells.push({ r, mesh })
  }
  highlightShell(shells, options.radialR ?? 1)

  for (const def of [
    { n: 1, l: 0, color: '#f2b34c' },
    { n: 2, l: 0, color: '#58c7d8' },
  ]) {
    const points: THREE.Vector3[] = []
    for (let r = 0.1; r <= 8; r += 0.06) {
      points.push(new THREE.Vector3(r, P_SCALE * radialPDF(def.n, def.l, r), 0))
    }
    const curve = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(points),
      new THREE.LineBasicMaterial({ color: new THREE.Color(def.color) }),
    )
    curve.userData = { kind: 'radial-curve' }
    group.add(curve)
  }

  const axis = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(8, 0, 0),
    ]),
    new THREE.LineBasicMaterial({ color: new THREE.Color(options.palette.muted), transparent: true, opacity: 0.5 }),
  )
  axis.userData = { kind: 'radial-axis' }
  group.add(axis)

  anchors.origin = new THREE.Vector3(0, 0, 0)
  anchors.peak1s = new THREE.Vector3(mostProbableR(1, 0), 0, 0)
  anchors.peak2s = new THREE.Vector3(mostProbableR(2, 0), 0, 0)
  anchors.curveTop = new THREE.Vector3(
    mostProbableR(1, 0),
    P_SCALE * radialPDF(1, 0, mostProbableR(1, 0)),
    0,
  )
  return finalize(group, anchors)
}

function highlightShell(shells: Array<{ r: number; mesh: THREE.Mesh }>, r: number): THREE.Mesh | null {
  let closest: { r: number; mesh: THREE.Mesh } | null = null
  for (const shell of shells) {
    if (!closest || Math.abs(shell.r - r) < Math.abs(closest.r - r)) closest = shell
  }
  for (const shell of shells) {
    const material = shell.mesh.material as THREE.MeshBasicMaterial
    const active = closest === shell
    material.color.set(active ? '#f2b34c' : '#58c7d8')
    material.opacity = active ? 0.4 : 0.1
  }
  return closest?.mesh ?? null
}

export function setShellHighlight(model: EntryModel, r: number): void {
  const shells: Array<{ r: number; mesh: THREE.Mesh }> = []
  model.group.traverse((obj) => {
    const mesh = obj as THREE.Mesh
    if (mesh.userData?.kind === 'radial-shell') {
      shells.push({ r: mesh.userData.shellR as number, mesh })
    }
  })
  highlightShell(shells, r)
}
