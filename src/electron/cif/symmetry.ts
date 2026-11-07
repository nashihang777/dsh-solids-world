import { cifError, type CifError } from './errors'

export interface SymOp {
  r: [number, number, number][]
  t: [number, number, number]
}

const TERM_PATTERN = /([+-]?)(\d*)(x|y|z)/g
const CONSTANT_PATTERN = /([+-])(\d+)\/(\d+)/g

export function parseSymOp(xyz: string): SymOp {
  const parts = xyz.split(',').map((p) => p.replace(/\s/g, ''))
  if (parts.length !== 3) {
    throw cifError('SYNTAX', 0, `对称操作 "${xyz}" 不是三段式`, '操作应形如 x,y,z 或 -y,x-y,z+1/2')
  }
  const r: [number, number, number][] = []
  const t: number[] = []
  for (const part of parts) {
    const row = [0, 0, 0]
    let translation = 0
    TERM_PATTERN.lastIndex = 0
    let matchedTerm = null as RegExpExecArray | null
    while ((matchedTerm = TERM_PATTERN.exec(part)) !== null) {
      const sign = matchedTerm[1] === '-' ? -1 : 1
      const magnitude = matchedTerm[2] === '' ? 1 : parseInt(matchedTerm[2], 10)
      const variable = matchedTerm[3]
      const column = variable === 'x' ? 0 : variable === 'y' ? 1 : 2
      row[column] = sign * magnitude
    }
    CONSTANT_PATTERN.lastIndex = 0
    let matchedConstant = null as RegExpExecArray | null
    while ((matchedConstant = CONSTANT_PATTERN.exec(part)) !== null) {
      const sign = matchedConstant[1] === '-' ? -1 : 1
      const numerator = parseInt(matchedConstant[2], 10)
      const denominator = parseInt(matchedConstant[3], 10)
      if (denominator === 0 || (12 / denominator) % 1 !== 0) {
        throw cifError('SYNTAX', 0, `对称操作 "${xyz}" 的平移不是 1/12 整数倍`, '平移分母应为 2/3/4/6/12')
      }
      translation += sign * numerator * (12 / denominator)
    }
    r.push(row as [number, number, number])
    t.push(translation)
  }
  return { r, t: t as [number, number, number] }
}

export function applySymOp(op: SymOp, fract: [number, number, number]): [number, number, number] {
  const out: [number, number, number] = [0, 0, 0]
  for (let i = 0; i < 3; i++) {
    const raw = op.r[i][0] * fract[0] + op.r[i][1] * fract[1] + op.r[i][2] * fract[2] + op.t[i] / 12
    out[i] = raw - Math.floor(raw)
  }
  return out
}

const EQUIV_TOLERANCE = 0.001

function sameFract(a: [number, number, number], b: [number, number, number]): boolean {
  for (let i = 0; i < 3; i++) {
    const d = Math.abs(a[i] - b[i])
    if (Math.min(d, 1 - d) > EQUIV_TOLERANCE) return false
  }
  return true
}

export interface ExpandAtom {
  element: string
  fract: [number, number, number]
  occupancy?: number
}

export function expandSymmetry(
  asymmetryAtoms: ExpandAtom[],
  ops: SymOp[],
): ExpandAtom[] {
  const result: ExpandAtom[] = []
  const seen: Array<{ element: string; fract: [number, number, number] }> = []
  for (const atom of asymmetryAtoms) {
    for (const op of ops) {
      const fract = applySymOp(op, atom.fract)
      if (seen.some((entry) => entry.element === atom.element && sameFract(entry.fract, fract))) continue
      seen.push({ element: atom.element, fract })
      result.push({ element: atom.element, fract, occupancy: atom.occupancy })
    }
  }
  return result
}

export function symOpsFromXyzList(xyzList: Array<{ xyz: string; line: number }>): SymOp[] {
  const ops: SymOp[] = []
  for (const item of xyzList) {
    const op = parseSymOp(item.xyz)
    ops.push(op)
  }
  if (!ops.some((op) => op.r.every((row, i) => row.every((v, j) => v === (i === j ? 1 : 0)) && op.t[i] === 0))) {
    if (xyzList.length > 0) {
      throw cifError('SYNTAX', xyzList[0].line, '对称操作列表缺少恒等操作 x,y,z', '显式 symop 列表必须包含 x,y,z')
    }
  }
  return ops
}
