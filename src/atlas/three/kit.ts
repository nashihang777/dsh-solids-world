import * as THREE from 'three'
import type { AtomSlot } from '../data/atomPalette'
import { assignAtomColors } from '../data/atomPalette'

export interface StageEvent {
  kind: 'bohr-transition'
  from: number
  to: number
  energy: number
  emission: boolean
}

export interface EntryModel {
  group: THREE.Group
  anchors: Record<string, THREE.Vector3>
  radius: number
  frameRadius?: number
  animation?: (elapsed: number, delta: number) => boolean
  interact?: (payload: { kind: string; value: number }) => StageEvent | undefined
  setSymSpeed?: (speed: number) => void
  setAnimPlayback?: (playing: boolean, speed: number) => void
  setAnimParams?: (params: Record<string, number>) => void
  animStep?: () => void
}

export interface StagePalette {
  muted: string
  ink: string
}

export interface OrbitalView {
  isoFraction: number
  pMode: 'single' | 'triple'
}

export interface BuildOptions {
  supercell: 1 | 2
  theme: 'dark' | 'light'
  bondTolerance: number
  palette: StagePalette
  orbitalView?: OrbitalView
  radialR?: number
}

export const BOND_RADII: Record<string, number> = {
  H: 0.4,
  Li: 1.23,
  Be: 0.9,
  B: 0.82,
  C: 0.77,
  N: 0.75,
  O: 0.73,
  F: 0.95,
  Na: 1.02,
  Mg: 0.89,
  Al: 1.18,
  Si: 1.11,
  P: 1.06,
  S: 1.05,
  Cl: 1.7,
  K: 1.38,
  Ca: 1.12,
  Ti: 1.05,
  Cr: 0.8,
  Mn: 0.79,
  Fe: 0.78,
  Co: 0.77,
  Ni: 0.74,
  Cu: 0.77,
  Zn: 1.15,
  Ga: 1.26,
  Ge: 1.2,
  As: 1.19,
  Se: 1.2,
  Br: 1.2,
  Rb: 1.52,
  Sr: 1.18,
  Sn: 1.39,
  Sb: 1.39,
  Te: 1.38,
  I: 1.39,
  Cs: 1.74,
  Ba: 1.35,
  Pb: 1.46,
  Bi: 1.48,
}

export const DISPLAY_RADII: Record<string, number> = {
  H: 0.32,
  Li: 0.9,
  Be: 0.62,
  B: 0.56,
  C: 0.55,
  N: 0.55,
  O: 0.56,
  F: 0.55,
  Na: 0.75,
  Mg: 0.72,
  Al: 0.82,
  Si: 0.78,
  P: 0.72,
  S: 0.75,
  Cl: 0.72,
  K: 0.9,
  Ca: 0.9,
  Ti: 0.75,
  Cr: 0.74,
  Mn: 0.74,
  Fe: 0.74,
  Co: 0.73,
  Ni: 0.72,
  Cu: 0.74,
  Zn: 0.73,
  Ga: 0.82,
  Ge: 0.78,
  As: 0.75,
  Se: 0.75,
  Br: 0.74,
  Rb: 1.0,
  Sr: 1.0,
  Sn: 0.95,
  Sb: 0.9,
  Te: 0.9,
  I: 0.88,
  Cs: 1.05,
  Ba: 1.0,
  Pb: 0.98,
  Bi: 0.98,
}

const SPHERE_WIDTH_SEGMENTS = 14
const SPHERE_HEIGHT_SEGMENTS = 10
const BOND_RADIUS = 0.09
const VERTEX_RADIUS = 0.09

export function bondRadius(element: string): number {
  const r = BOND_RADII[element]
  if (r === undefined) throw new Error(`成键半径表缺少元素：${element}`)
  return r
}

export function displayRadius(element: string): number {
  const r = DISPLAY_RADII[element]
  if (r === undefined) throw new Error(`显示半径表缺少元素：${element}`)
  return r
}

export function atomSphere(
  element: string,
  position: THREE.Vector3,
  colors: Map<string, AtomSlot>,
  theme: 'dark' | 'light',
): THREE.Mesh {
  const radius = displayRadius(element)
  const slot = colors.get(element)
  if (!slot) throw new Error(`原子配色缺失元素：${element}`)
  const color = new THREE.Color(theme === 'dark' ? slot.dark : slot.light)
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(radius, SPHERE_WIDTH_SEGMENTS, SPHERE_HEIGHT_SEGMENTS),
    new THREE.MeshStandardMaterial({ color, roughness: 0.55, metalness: 0.05 }),
  )
  mesh.position.copy(position)
  mesh.userData = { kind: 'atom', element }
  if (theme === 'light') {
    const outline = new THREE.Mesh(
      new THREE.SphereGeometry(radius * 1.08, SPHERE_WIDTH_SEGMENTS, SPHERE_HEIGHT_SEGMENTS),
      new THREE.MeshBasicMaterial({ color: color.clone().multiplyScalar(0.45), side: THREE.BackSide }),
    )
    mesh.add(outline)
  }
  return mesh
}

export function bond(from: THREE.Vector3, to: THREE.Vector3, palette: StagePalette): THREE.Mesh {
  const dir = new THREE.Vector3().subVectors(to, from)
  const length = dir.length()
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(BOND_RADIUS, BOND_RADIUS, length, 8),
    new THREE.MeshStandardMaterial({ color: new THREE.Color(palette.muted), roughness: 0.6, metalness: 0 }),
  )
  mesh.position.copy(from).addScaledVector(dir, 0.5)
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize())
  mesh.userData = { kind: 'bond' }
  return mesh
}

export function cellFrame(vectors: THREE.Vector3[], palette: StagePalette): THREE.Group {
  const group = new THREE.Group()
  const [va, vb, vc] = vectors
  const edges: Array<[THREE.Vector3, THREE.Vector3]> = []
  for (let axis = 0; axis < 3; axis++) {
    const along = vectors[axis]
    const t1 = vectors[(axis + 1) % 3]
    const t2 = vectors[(axis + 2) % 3]
    for (let s1 = 0; s1 <= 1; s1++) {
      for (let s2 = 0; s2 <= 1; s2++) {
        const start = t1.clone().multiplyScalar(s1).addScaledVector(t2, s2)
        edges.push([start, start.clone().add(along)])
      }
    }
  }
  const points: THREE.Vector3[] = []
  for (const [p1, p2] of edges) {
    points.push(p1, p2)
  }
  const lines = new THREE.LineSegments(
    new THREE.BufferGeometry().setFromPoints(points),
    new THREE.LineBasicMaterial({ color: new THREE.Color(palette.muted) }),
  )
  lines.userData = { kind: 'cellFrame' }
  group.add(lines)
  const vertexGeometry = new THREE.SphereGeometry(VERTEX_RADIUS, 8, 6)
  const vertexMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(palette.muted),
    roughness: 0.6,
    metalness: 0,
  })
  for (let x = 0; x <= 1; x++) {
    for (let y = 0; y <= 1; y++) {
      for (let z = 0; z <= 1; z++) {
        const vertex = new THREE.Mesh(vertexGeometry, vertexMaterial)
        vertex.position.copy(va).multiplyScalar(x).addScaledVector(vb, y).addScaledVector(vc, z)
        vertex.userData = { kind: 'cellFrame' }
        group.add(vertex)
      }
    }
  }
  return group
}

export function finalize(group: THREE.Group, anchors: Record<string, THREE.Vector3>): EntryModel {
  const box = new THREE.Box3().setFromObject(group)
  const center = box.getCenter(new THREE.Vector3())
  group.position.sub(center)
  const shifted: Record<string, THREE.Vector3> = {}
  for (const [key, value] of Object.entries(anchors)) {
    shifted[key] = value.clone().sub(center)
  }
  const sphere = box.getBoundingSphere(new THREE.Sphere())
  return { group, anchors: shifted, radius: sphere.radius }
}

export function disposeModel(model: EntryModel): void {
  model.group.traverse((obj) => {
    const hasGeometry = (obj as THREE.Mesh).geometry !== undefined
    if (hasGeometry) (obj as THREE.Mesh).geometry.dispose()
    const material = (obj as THREE.Mesh).material
    if (material) {
      if (Array.isArray(material)) material.forEach((m) => m.dispose())
      else material.dispose()
    }
  })
}

export function assignColorsFor(elements: string[]): Map<string, AtomSlot> {
  return assignAtomColors(elements)
}
