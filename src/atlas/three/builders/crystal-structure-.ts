import * as THREE from 'three'
import { assignAtomColors } from '../../data/atomPalette'
import { atomSphere, bond, bondRadius, cellFrame, finalize, type BuildOptions, type EntryModel } from '../kit'

export interface CrystalAtom {
  element: string
  fract: [number, number, number]
}

export interface CrystalCell {
  a: number
  b: number
  c: number
  alpha: number
  beta: number
  gamma: number
  matrix: [number, number, number][]
}

export interface CrystalParams {
  cell: CrystalCell
  atoms: CrystalAtom[]
  anchors: Record<string, [number, number, number]>
}

interface WorkAtom {
  element: string
  pos: THREE.Vector3
  ghost: boolean
}

export function cubicCell(a: number): CrystalCell {
  return {
    a,
    b: a,
    c: a,
    alpha: 90,
    beta: 90,
    gamma: 90,
    matrix: [
      [a, 0, 0],
      [0, a, 0],
      [0, 0, a],
    ],
  }
}

export function tetragonalCell(a: number, c: number): CrystalCell {
  return {
    a,
    b: a,
    c,
    alpha: 90,
    beta: 90,
    gamma: 90,
    matrix: [
      [a, 0, 0],
      [0, a, 0],
      [0, 0, c],
    ],
  }
}

export function hexagonalCell(a: number, c: number): CrystalCell {
  return {
    a,
    b: a,
    c,
    alpha: 90,
    beta: 90,
    gamma: 120,
    matrix: [
      [a, 0, 0],
      [-a / 2, (a * Math.sqrt(3)) / 2, 0],
      [0, 0, c],
    ],
  }
}

export function cellVectors(cell: CrystalCell): [THREE.Vector3, THREE.Vector3, THREE.Vector3] {
  return [
    new THREE.Vector3(cell.matrix[0][0], cell.matrix[0][1], cell.matrix[0][2]),
    new THREE.Vector3(cell.matrix[1][0], cell.matrix[1][1], cell.matrix[1][2]),
    new THREE.Vector3(cell.matrix[2][0], cell.matrix[2][1], cell.matrix[2][2]),
  ]
}

function toCartesian(cell: CrystalCell, fract: [number, number, number]): THREE.Vector3 {
  const m = cell.matrix
  return new THREE.Vector3(
    fract[0] * m[0][0] + fract[1] * m[1][0] + fract[2] * m[2][0],
    fract[0] * m[0][1] + fract[1] * m[1][1] + fract[2] * m[2][1],
    fract[0] * m[0][2] + fract[1] * m[1][2] + fract[2] * m[2][2],
  )
}

function fractKey(x: number, y: number, z: number): string {
  return `${Math.round(x * 1e4)},${Math.round(y * 1e4)},${Math.round(z * 1e4)}`
}

function periodicDelta(a: number, b: number): number {
  const d = Math.abs(a - b)
  return Math.min(d, 1 - d)
}

function assertNoCoincidentAtoms(params: CrystalParams): void {
  const vectors = cellVectors(params.cell)
  for (let i = 0; i < params.atoms.length; i++) {
    for (let j = i + 1; j < params.atoms.length; j++) {
      const p = params.atoms[i]
      const q = params.atoms[j]
      if (p.element !== q.element) continue
      const dx = periodicDelta(p.fract[0], q.fract[0])
      const dy = periodicDelta(p.fract[1], q.fract[1])
      const dz = periodicDelta(p.fract[2], q.fract[2])
      const dxCart = Math.min(dx, Math.abs(dx - 1)) * vectors[0].length()
      const dyCart = Math.min(dy, Math.abs(dy - 1)) * vectors[1].length()
      const dzCart = Math.min(dz, Math.abs(dz - 1)) * vectors[2].length()
      const dist = Math.sqrt(dxCart * dxCart + dyCart * dyCart + dzCart * dzCart)
      if (dist > 0 && dist < 0.4) {
        throw new Error(`晶体条目存在坐标重合的同元素原子（间距 ${dist.toFixed(3)} Å < 0.4）：${p.element}`)
      }
    }
  }
}

export function buildCrystalStructure(params: CrystalParams, options: BuildOptions): EntryModel {
  assertNoCoincidentAtoms(params)
  const n = options.supercell
  const vectors = cellVectors(params.cell)
  const tolerance = options.bondTolerance
  const seen = new Set<string>()
  const all: WorkAtom[] = []

  for (let cx = 0; cx < n; cx++) {
    for (let cy = 0; cy < n; cy++) {
      for (let cz = 0; cz < n; cz++) {
        for (const atom of params.atoms) {
          const fx = atom.fract[0] + cx
          const fy = atom.fract[1] + cy
          const fz = atom.fract[2] + cz
          const key = fractKey(fx, fy, fz)
          if (seen.has(key)) continue
          seen.add(key)
          all.push({ element: atom.element, pos: toCartesian(params.cell, [fx, fy, fz]), ghost: false })
        }
      }
    }
  }

  const maxRadius = Math.max(...params.atoms.map((atom) => bondRadius(atom.element)))
  const margins = vectors.map((v) => (maxRadius * 2 * tolerance) / v.length())
  for (const atom of params.atoms) {
    for (let tx = -1; tx <= 1; tx++) {
      for (let ty = -1; ty <= 1; ty++) {
        for (let tz = -1; tz <= 1; tz++) {
          if (tx === 0 && ty === 0 && tz === 0) continue
          const fx = atom.fract[0] + tx
          const fy = atom.fract[1] + ty
          const fz = atom.fract[2] + tz
          const inDisplayBox = fx >= 0 && fx < n && fy >= 0 && fy < n && fz >= 0 && fz < n
          const inMarginBox =
            fx >= -margins[0] && fx <= n + margins[0] && fy >= -margins[1] && fy <= n + margins[1] && fz >= -margins[2] && fz <= n + margins[2]
          if (inDisplayBox || !inMarginBox) continue
          const key = fractKey(fx, fy, fz)
          if (seen.has(key)) continue
          seen.add(key)
          all.push({ element: atom.element, pos: toCartesian(params.cell, [fx, fy, fz]), ghost: true })
        }
      }
    }
  }

  const bonds: Array<[WorkAtom, WorkAtom]> = []
  for (let i = 0; i < all.length; i++) {
    for (let j = i + 1; j < all.length; j++) {
      const p = all[i]
      const q = all[j]
      if (p.ghost && q.ghost) continue
      const threshold = (bondRadius(p.element) + bondRadius(q.element)) * tolerance
      if (p.pos.distanceTo(q.pos) <= threshold) {
        bonds.push([p, q])
      }
    }
  }

  const group = new THREE.Group()
  const colors = assignAtomColors(params.atoms.map((atom) => atom.element))
  for (const atom of all) {
    const sphere = atomSphere(atom.element, atom.pos, colors, options.theme)
    sphere.userData.ghost = atom.ghost
    group.add(sphere)
  }
  for (const [p, q] of bonds) {
    const link = bond(p.pos, q.pos, options.palette)
    link.userData = { kind: 'bond', elements: [p.element, q.element] }
    group.add(link)
  }
  const supercellVectors = vectors.map((v) => v.multiplyScalar(n))
  group.add(cellFrame(supercellVectors, options.palette))

  const anchors: Record<string, THREE.Vector3> = {}
  for (const [key, f] of Object.entries(params.anchors)) {
    anchors[key] = toCartesian(params.cell, f)
  }
  return finalize(group, anchors)
}
