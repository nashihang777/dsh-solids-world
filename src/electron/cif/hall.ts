import { cifError } from './errors'

export interface HallOp {
  r: [number, number, number][]
  t: [number, number, number]
}

const ROT_PRINCIPAL: Record<string, Record<string, number[][]>> = {
  x: {
    1: [[1, 0, 0], [0, 1, 0], [0, 0, 1]],
    2: [[1, 0, 0], [0, -1, 0], [0, 0, -1]],
    3: [[1, 0, 0], [0, 0, -1], [0, 1, -1]],
    4: [[1, 0, 0], [0, 0, -1], [0, 1, 0]],
    6: [[1, 0, 0], [0, 1, -1], [0, 1, 0]],
  },
  y: {
    1: [[1, 0, 0], [0, 1, 0], [0, 0, 1]],
    2: [[-1, 0, 0], [0, 1, 0], [0, 0, -1]],
    3: [[-1, 0, 1], [0, 1, 0], [-1, 0, 0]],
    4: [[0, 0, 1], [0, 1, 0], [-1, 0, 0]],
    6: [[0, 0, 1], [0, 1, 0], [-1, 0, 1]],
  },
  z: {
    1: [[1, 0, 0], [0, 1, 0], [0, 0, 1]],
    2: [[-1, 0, 0], [0, -1, 0], [0, 0, 1]],
    3: [[0, -1, 0], [1, -1, 0], [0, 0, 1]],
    4: [[0, -1, 0], [1, 0, 0], [0, 0, 1]],
    6: [[1, -1, 0], [1, 0, 0], [0, 0, 1]],
  },
}

const ROT_FACE_DIAGONAL: Record<string, Record<string, number[][]>> = {
  x: {
    "'": [[-1, 0, 0], [0, 0, -1], [0, -1, 0]],
    '"': [[-1, 0, 0], [0, 0, 1], [0, 1, 0]],
  },
  y: {
    "'": [[0, 0, -1], [0, -1, 0], [-1, 0, 0]],
    '"': [[0, 0, 1], [0, -1, 0], [1, 0, 0]],
  },
  z: {
    "'": [[0, -1, 0], [-1, 0, 0], [0, 0, -1]],
    '"': [[0, 1, 0], [1, 0, 0], [0, 0, -1]],
  },
}

const ROT_BODY_DIAGONAL = [[0, 0, 1], [1, 0, 0], [0, 1, 0]]

const LATTICE_TRANSLATIONS: Record<string, number[][]> = {
  P: [],
  A: [[0, 6, 6]],
  B: [[6, 0, 6]],
  C: [[6, 6, 0]],
  I: [[6, 6, 6]],
  F: [[0, 6, 6], [6, 0, 6], [6, 6, 0]],
  R: [[8, 4, 4], [4, 8, 8]],
}

const LETTER_TRANSLATIONS: Record<string, number[]> = {
  a: [6, 0, 0],
  b: [0, 6, 0],
  c: [0, 0, 6],
  n: [6, 6, 6],
  u: [3, 0, 0],
  v: [0, 3, 0],
  w: [0, 0, 3],
  d: [3, 3, 3],
}

function mulMat(a: number[][], b: number[][]): number[][] {
  const r = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      r[i][j] = a[i][0] * b[0][j] + a[i][1] * b[1][j] + a[i][2] * b[2][j]
    }
  }
  return r
}

function applyMat(m: number[][], v: number[]): number[] {
  return [
    m[0][0] * v[0] + m[0][1] * v[1] + m[0][2] * v[2],
    m[1][0] * v[0] + m[1][1] * v[1] + m[1][2] * v[2],
    m[2][0] * v[0] + m[2][1] * v[1] + m[2][2] * v[2],
  ]
}

function mod12(v: number[]): number[] {
  return v.map((x) => ((x % 12) + 12) % 12)
}

function sameOp(a: HallOp, b: HallOp): boolean {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (a.r[i][j] !== b.r[i][j]) return false
    }
    if (a.t[i] !== b.t[i]) return false
  }
  return true
}

function compose(op1: HallOp, op2: HallOp): HallOp {
  const rotated = applyMat(op1.r, op2.t)
  return {
    r: mulMat(op1.r, op2.r) as [number, number, number][],
    t: mod12(rotated.map((x, i) => x + op1.t[i])) as [number, number, number],
  }
}

function closure(generators: HallOp[]): HallOp[] {
  const identity: HallOp = { r: [[1, 0, 0], [0, 1, 0], [0, 0, 1]] as [number, number, number][], t: [0, 0, 0] }
  const list: HallOp[] = [identity]
  for (const g of generators) {
    if (!list.some((op) => sameOp(op, g))) list.push(g)
  }
  for (let i = 0; i < list.length; i++) {
    for (let j = 0; j < list.length; j++) {
      const c = compose(list[i], list[j])
      if (!list.some((op) => sameOp(op, c))) list.push(c)
    }
  }
  return list
}

interface ParsedRotation {
  r: number[][]
  t: number[]
  n: number
  resolvedAxis: string
}

function parseRotationToken(token: string, prev: ParsedRotation | null, position: number, line: number): ParsedRotation {
  let i = 0
  let neg = false
  if (token[0] === '-') {
    neg = true
    i = 1
  }
  const n = parseInt(token[i] as string, 10)
  if (![1, 2, 3, 4, 6].includes(n)) {
    throw cifError('UNKNOWN_SPACEGROUP', line, `Hall 符号旋转阶非法：${token}`, '旋转阶应为 1/2/3/4/6')
  }
  i++
  let axis: string | null = null
  let numericT: number | null = null
  const letters: string[] = []
  for (; i < token.length; i++) {
    const ch = token[i] as string
    if (ch === 'x' || ch === 'y' || ch === 'z') axis = ch
    else if (ch === "'" || ch === '"' || ch === '*') axis = ch
    else if (ch >= '1' && ch <= '5') numericT = parseInt(ch, 10)
    else if ('abcnuvwd'.includes(ch)) letters.push(ch)
    else {
      throw cifError('UNKNOWN_SPACEGROUP', line, `Hall 符号含未知字符：${token}`, '检查 Hall 符号拼写')
    }
  }

  let rot: number[][]
  let axisDir: number[] | null
  let resolvedAxis: string
  if (axis === 'x' || axis === 'y' || axis === 'z') {
    rot = ROT_PRINCIPAL[axis][String(n)]
    axisDir = axis === 'x' ? [1, 0, 0] : axis === 'y' ? [0, 1, 0] : [0, 0, 1]
    resolvedAxis = axis
  } else if (axis === "'" || axis === '"') {
    const prevAxis = prev?.resolvedAxis
    if (prevAxis !== 'x' && prevAxis !== 'y' && prevAxis !== 'z') {
      throw cifError('UNKNOWN_SPACEGROUP', line, `面对角 2 次旋转需要前序主轴：${token}`, '检查 Hall 符号轴序')
    }
    rot = ROT_FACE_DIAGONAL[prevAxis][axis]
    axisDir = null
    resolvedAxis = prevAxis
  } else if (axis === '*') {
    rot = ROT_BODY_DIAGONAL
    axisDir = [1, 1, 1]
    resolvedAxis = 'z'
  } else if (position === 1) {
    rot = ROT_PRINCIPAL.z[String(n)]
    axisDir = [0, 0, 1]
    resolvedAxis = 'z'
  } else if (position === 2 && n === 2 && prev) {
    if (prev.n === 3 || prev.n === 6) {
      rot = ROT_FACE_DIAGONAL.z["'"]
      axisDir = null
      resolvedAxis = 'z'
    } else {
      rot = ROT_PRINCIPAL.x['2']
      axisDir = [1, 0, 0]
      resolvedAxis = 'x'
    }
  } else if (n === 3) {
    rot = ROT_BODY_DIAGONAL
    axisDir = [1, 1, 1]
    resolvedAxis = 'z'
  } else {
    rot = ROT_PRINCIPAL.z[String(n)]
    axisDir = [0, 0, 1]
    resolvedAxis = 'z'
  }

  let r = rot.map((row) => [...row])
  if (neg) r = r.map((row) => row.map((x) => -x))

  let t = [0, 0, 0]
  if (numericT !== null) {
    if (!axisDir) {
      throw cifError('UNKNOWN_SPACEGROUP', line, `数字平移需要轴向：${token}`, '检查 Hall 符号平移记法')
    }
    const k = numericT / n
    t = axisDir.map((d) => Math.round(d * k * 12))
  }
  for (const letter of letters) {
    const lt = LETTER_TRANSLATIONS[letter]
    t = [t[0] + lt[0], t[1] + lt[1], t[2] + lt[2]]
  }
  return { r, t, n, resolvedAxis }
}

export function parseHallSymbol(hall: string, line: number): HallOp[] {
  const s = hall.replace(/_/g, ' ').trim()
  let v = [0, 0, 0]
  let body = s
  const vMatch = s.match(/\(\s*(-?\d+)\s+(-?\d+)\s+(-?\d+)\s*\)/)
  if (vMatch) {
    v = [+vMatch[1], +vMatch[2], +vMatch[3]]
    body = s.replace(/\(.*\)/, '').trim()
  }
  const tokens = body.split(/\s+/).filter(Boolean)
  if (tokens.length === 0) {
    throw cifError('UNKNOWN_SPACEGROUP', line, `Hall 符号为空`, '提供形如 -P 4 2 3 的 Hall 符号')
  }
  const head = tokens[0] as string
  const negativeLattice = head.startsWith('-')
  const lattice = (negativeLattice ? head.slice(1) : head).toUpperCase()
  if (!Object.prototype.hasOwnProperty.call(LATTICE_TRANSLATIONS, lattice)) {
    throw cifError('UNKNOWN_SPACEGROUP', line, `Hall 符号格子符号非法：${head}`, '应为 P/A/B/C/I/F/R')
  }
  const generators: HallOp[] = []
  for (const translation of LATTICE_TRANSLATIONS[lattice]) {
    generators.push({ r: [[1, 0, 0], [0, 1, 0], [0, 0, 1]] as [number, number, number][], t: [...translation] as [number, number, number] })
    if (negativeLattice) {
      generators.push({ r: [[-1, 0, 0], [0, -1, 0], [0, 0, -1]] as [number, number, number][], t: [...translation] as [number, number, number] })
    }
  }
  if (negativeLattice && LATTICE_TRANSLATIONS[lattice].length === 0) {
    generators.push({ r: [[-1, 0, 0], [0, -1, 0], [0, 0, -1]] as [number, number, number][], t: [0, 0, 0] })
  }
  let prev: ParsedRotation | null = null
  for (let k = 1; k < tokens.length; k++) {
    const parsed = parseRotationToken(tokens[k] as string, prev, k, line)
    prev = parsed
    generators.push({ r: parsed.r as [number, number, number][], t: mod12(parsed.t) as [number, number, number] })
  }
  if (v.some((x) => x !== 0)) {
    for (const g of generators) {
      g.t = mod12(g.t.map((x, i) => x + v[i] - applyMat(g.r, v)[i])) as [number, number, number]
    }
  }
  return closure(generators)
}
