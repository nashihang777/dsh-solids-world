import * as THREE from 'three'
import { finalize, type BuildOptions, type EntryModel } from '../kit'

export type CrystalSystem =
  | 'cubic'
  | 'tetragonal'
  | 'orthorhombic'
  | 'monoclinic'
  | 'triclinic'
  | 'rhombohedral'
  | 'hexagonal'

export type Centering = 'P' | 'I' | 'F' | 'C' | 'R'

export interface BravaisParams {
  system: CrystalSystem
  centering: Centering
  a: number
  b: number
  c: number
  alpha: number
  beta: number
  gamma: number
}

export function bravaisVectors(p: BravaisParams): [THREE.Vector3, THREE.Vector3, THREE.Vector3] {
  const rad = Math.PI / 180
  const ca = Math.cos(p.alpha * rad)
  const cb = Math.cos(p.beta * rad)
  const cg = Math.cos(p.gamma * rad)
  const sg = Math.sin(p.gamma * rad)
  const va = new THREE.Vector3(p.a, 0, 0)
  const vb = new THREE.Vector3(p.b * cg, p.b * sg, 0)
  const cx = p.c * cb
  const cy = (p.c * (ca - cb * cg)) / sg
  const cz = Math.sqrt(Math.max(p.c * p.c - cx * cx - cy * cy, 0))
  const vc = new THREE.Vector3(cx, cy, cz)
  return [va, vb, vc]
}

const CORNERS: Array<[number, number, number]> = [
  [0, 0, 0],
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1],
  [1, 1, 0],
  [1, 0, 1],
  [0, 1, 1],
  [1, 1, 1],
]

function basePoints(p: BravaisParams): THREE.Vector3[] {
  const [va, vb, vc] = bravaisVectors(p)
  const toCart = (f: [number, number, number]) =>
    new THREE.Vector3().addScaledVector(va, f[0]).addScaledVector(vb, f[1]).addScaledVector(vc, f[2])
  const points = CORNERS.map(toCart)
  if (p.centering === 'I') points.push(toCart([0.5, 0.5, 0.5]))
  if (p.centering === 'F') {
    points.push(toCart([0.5, 0.5, 0]), toCart([0.5, 0, 0.5]), toCart([0, 0.5, 0.5]))
    points.push(toCart([0.5, 0.5, 1]), toCart([0.5, 1, 0.5]), toCart([1, 0.5, 0.5]))
  }
  if (p.centering === 'C') points.push(toCart([0.5, 0.5, 0]), toCart([0.5, 0.5, 1]))
  return points
}

function hexPoints(p: BravaisParams): THREE.Vector3[] {
  const points: THREE.Vector3[] = []
  for (let layer = 0; layer <= 1; layer++) {
    for (let k = 0; k < 6; k++) {
      const angle = (Math.PI / 3) * k
      points.push(new THREE.Vector3(p.a * Math.cos(angle), p.a * Math.sin(angle), layer * p.c))
    }
  }
  return points
}

function pushEdges(lines: number[], from: THREE.Vector3, to: THREE.Vector3, offset: THREE.Vector3): void {
  lines.push(
    from.x + offset.x, from.y + offset.y, from.z + offset.z,
    to.x + offset.x, to.y + offset.y, to.z + offset.z,
  )
}

function cellEdges(
  vectors: [THREE.Vector3, THREE.Vector3, THREE.Vector3],
  offset: THREE.Vector3,
  lines: number[],
): void {
  const [va, vb, vc] = vectors
  const corners: THREE.Vector3[] = []
  for (const [x, y, z] of CORNERS) {
    corners.push(new THREE.Vector3().addScaledVector(va, x).addScaledVector(vb, y).addScaledVector(vc, z))
  }
  const pairs: Array<[number, number]> = [
    [0, 1],
    [2, 4],
    [3, 5],
    [6, 7],
    [0, 2],
    [1, 4],
    [3, 6],
    [5, 7],
    [0, 3],
    [1, 5],
    [2, 6],
    [4, 7],
  ]
  for (const [i, j] of pairs) {
    pushEdges(lines, corners[i], corners[j], offset)
  }
}

function hexPrismEdges(p: BravaisParams, offset: THREE.Vector3, lines: number[]): void {
  const ring = (z: number) => {
    for (let k = 0; k < 6; k++) {
      const a1 = new THREE.Vector3(p.a * Math.cos((Math.PI / 3) * k), p.a * Math.sin((Math.PI / 3) * k), z)
      const a2 = new THREE.Vector3(p.a * Math.cos((Math.PI / 3) * (k + 1)), p.a * Math.sin((Math.PI / 3) * (k + 1)), z)
      pushEdges(lines, a1, a2, offset)
    }
  }
  ring(0)
  ring(p.c)
  for (let k = 0; k < 6; k++) {
    const bottom = new THREE.Vector3(p.a * Math.cos((Math.PI / 3) * k), p.a * Math.sin((Math.PI / 3) * k), 0)
    pushEdges(lines, bottom, bottom.clone().setZ(p.c), offset)
  }
}

function hexPrimitiveEdges(p: BravaisParams, offset: THREE.Vector3, lines: number[]): void {
  const va = new THREE.Vector3(p.a, 0, 0)
  const vb = new THREE.Vector3(-p.a / 2, (p.a * Math.sqrt(3)) / 2, 0)
  const vc = new THREE.Vector3(0, 0, p.c)
  cellEdges([va, vb, vc], offset, lines)
}

export function buildBravaisLattice(p: BravaisParams, options: BuildOptions): EntryModel {
  const group = new THREE.Group()
  const anchors: Record<string, THREE.Vector3> = {}
  const n = options.supercell
  const isHex = p.system === 'hexagonal'
  const vectors = bravaisVectors(p)
  const [va, vb, vc] = vectors

  const pointColor = new THREE.Color(options.theme === 'dark' ? '#e9f1f2' : '#1f2933')
  const frameColor = new THREE.Color(options.palette.muted)
  const primitiveColor = new THREE.Color('#f2b34c')
  const pointRadius = Math.min(p.a, p.b, p.c) * 0.065
  const pointMaterial = new THREE.MeshStandardMaterial({ color: pointColor, roughness: 0.5, metalness: 0.05 })
  const pointGeometry = new THREE.SphereGeometry(pointRadius, 16, 12)

  const translations: THREE.Vector3[] = []
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      for (let k = 0; k < n; k++) {
        translations.push(va.clone().multiplyScalar(i).add(vb.clone().multiplyScalar(j)).add(vc.clone().multiplyScalar(k)))
      }
    }
  }

  const base = isHex ? hexPoints(p) : basePoints(p)
  const seen = new Set<string>()
  for (const t of translations) {
    for (const point of base) {
      const pos = point.clone().add(t)
      const key = `${pos.x.toFixed(3)},${pos.y.toFixed(3)},${pos.z.toFixed(3)}`
      if (seen.has(key)) continue
      seen.add(key)
      const mesh = new THREE.Mesh(pointGeometry, pointMaterial)
      mesh.position.copy(pos)
      mesh.userData = { kind: 'lattice-point' }
      group.add(mesh)
    }
  }

  const frameLines: number[] = []
  const primitiveLines: number[] = []
  if (isHex) {
    for (const t of translations) {
      hexPrismEdges(p, t, frameLines)
      hexPrimitiveEdges(p, t, primitiveLines)
    }
  } else {
    for (const t of translations) {
      cellEdges(vectors, t, frameLines)
    }
  }

  if (frameLines.length > 0) {
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(frameLines, 3))
    const lines = new THREE.LineSegments(geometry, new THREE.LineBasicMaterial({ color: frameColor, transparent: true, opacity: 0.9 }))
    lines.userData = { kind: 'lattice-frame' }
    group.add(lines)
  }
  if (primitiveLines.length > 0) {
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(primitiveLines, 3))
    const lines = new THREE.LineSegments(geometry, new THREE.LineBasicMaterial({ color: primitiveColor }))
    lines.userData = { kind: 'primitive-frame' }
    group.add(lines)
  }

  const toCart = (f: [number, number, number]) =>
    new THREE.Vector3().addScaledVector(va, f[0]).addScaledVector(vb, f[1]).addScaledVector(vc, f[2])
  anchors.corner = toCart([0, 0, 0])
  if (p.centering === 'I') anchors.bodyCenter = toCart([0.5, 0.5, 0.5])
  if (p.centering === 'F') anchors.faceCenter = toCart([0.5, 0.5, 0])
  if (p.centering === 'C') anchors.baseCenter = toCart([0.5, 0.5, 0])
  if (isHex) {
    anchors.hexPoint = new THREE.Vector3(p.a, 0, 0)
    anchors.cAxis = new THREE.Vector3(p.a * Math.cos(Math.PI / 6), p.a * Math.sin(Math.PI / 6), p.c / 2)
  } else {
    anchors.aAxis = toCart([0.5, 0, 0])
    anchors.bAxis = toCart([0, 0.5, 0])
    anchors.cAxis = toCart([0, 0, 0.5])
  }

  return finalize(group, anchors)
}
