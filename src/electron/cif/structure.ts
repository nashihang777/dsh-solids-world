import { cifError, type CifError } from './errors'
import type { DataBlock, Loop } from './parser'
import { HM_INDEX, SPACE_GROUPS, type SpaceGroupEntry } from './spaceGroups'
import { expandSymmetry, parseSymOp, symOpsFromXyzList, type SymOp } from './symmetry'
import { parseHallSymbol, type HallOp } from './hall'

export interface Cell {
  a: number
  b: number
  c: number
  alpha: number
  beta: number
  gamma: number
  matrix: number[][]
}

export interface AtomSite {
  element: string
  fract: [number, number, number]
  occupancy?: number
}

export interface StructureData {
  fileName: string
  name: string
  cell: Cell
  atoms: AtomSite[]
  spaceGroup: string
  spaceGroupNumber?: number
  source?: string
  parseMs: number
}

const ELEMENT_SYMBOLS = new Set([
  'H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar',
  'K', 'Ca', 'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn', 'Ga', 'Ge', 'As', 'Se', 'Br', 'Kr',
  'Rb', 'Sr', 'Y', 'Zr', 'Nb', 'Mo', 'Tc', 'Ru', 'Rh', 'Pd', 'Ag', 'Cd', 'In', 'Sn', 'Sb', 'Te', 'I', 'Xe',
  'Cs', 'Ba', 'La', 'Ce', 'Pr', 'Nd', 'Pm', 'Sm', 'Eu', 'Gd', 'Tb', 'Dy', 'Ho', 'Er', 'Tm', 'Yb', 'Lu',
  'Hf', 'Ta', 'W', 'Re', 'Os', 'Ir', 'Pt', 'Au', 'Hg', 'Tl', 'Pb', 'Bi', 'Po', 'At', 'Rn',
  'Fr', 'Ra', 'Ac', 'Th', 'Pa', 'U', 'Np', 'Pu', 'Am', 'Cm', 'Bk', 'Cf', 'Es', 'Fm', 'Md', 'No', 'Lr',
  'Rf', 'Db', 'Sg', 'Bh', 'Hs', 'Mt', 'Ds', 'Rg', 'Cn', 'Nh', 'Fl', 'Mc', 'Lv', 'Ts', 'Og',
])

const ATOM_LIMIT = 10000

const CELL_TAGS = {
  a: ['_cell_length_a'],
  b: ['_cell_length_b'],
  c: ['_cell_length_c'],
  alpha: ['_cell_angle_alpha'],
  beta: ['_cell_angle_beta'],
  gamma: ['_cell_angle_gamma'],
}

const SPACEGROUP_NAME_TAGS = [
  '_space_group_name_h-m_alt',
  '_symmetry_space_group_name_h-m',
  '_space_group_name_h-m_full',
  '_space_group_name_h-m',
]

const SPACEGROUP_NUMBER_TAGS = ['_space_group_it_number', '_symmetry_int_tables_number']

const SYMOP_TAGS = ['_space_group_symop_operation_xyz', '_symmetry_equiv_pos_as_xyz']

const HALL_TAGS = ['_space_group_name_hall']

const CUBIC_LEGACY_ALIASES: Record<string, string> = {
  'pm3': 'p m -3',
  'pn3': 'p n -3',
  'fm3': 'f m -3',
  'fd3': 'f d -3',
  'im3': 'i m -3',
  'pa3': 'p a -3',
  'ia3': 'i a -3',
  'pm3m': 'p m -3 m',
  'pn3n': 'p n -3 n',
  'pm3n': 'p m -3 n',
  'pn3m': 'p n -3 m',
  'fm3m': 'f m -3 m',
  'fm3c': 'f m -3 c',
  'fd3m': 'f d -3 m',
  'fd3c': 'f d -3 c',
  'im3m': 'i m -3 m',
  'ia3d': 'i a -3 d',
}

export function stripUncertainty(raw: string): string {
  return raw.replace(/\(\d+\)\s*$/, '')
}

function toNumber(raw: string, line: number, label: string): number {
  const cleaned = stripUncertainty(raw).trim()
  const value = Number(cleaned)
  if (!Number.isFinite(value)) {
    throw cifError('SYNTAX', line, `标签 ${label} 的值 "${raw}" 不是数字`, '检查该值是否被误写为文本')
  }
  return value
}

function lookupPair(block: DataBlock, tags: string[]): { line: number; value: string } | undefined {
  for (const tag of tags) {
    const hit = block.pairs.get(tag)
    if (hit) return hit
  }
  return undefined
}

function lookupLoop(block: DataBlock, tag: string): Loop | undefined {
  for (const loop of block.loops) {
    if (loop.columns.includes(tag)) return loop
  }
  return undefined
}

function lookupCell(block: DataBlock, tags: string[]): { line: number; value: string } | undefined {
  const pair = lookupPair(block, tags)
  if (pair) return pair
  for (const tag of tags) {
    const loop = lookupLoop(block, tag)
    if (loop && loop.rows.length > 0) {
      const columnIndex = loop.columns.indexOf(tag)
      const firstRow = loop.rows[0]
      return { line: firstRow.line, value: firstRow.values[columnIndex] as string }
    }
  }
  return undefined
}

export function normalizeHmSymbol(raw: string): string {
  let s = raw.trim().toLowerCase()
  s = s.replace(/\\bar\s*\{?\s*(\d)\s*\}?/g, '-$1')
  s = s.replace(/bar\s*\{?\s*(\d)\s*\}?/g, '-$1')
  s = s.replace(/_/g, ' ')
  const tokens = s.split(/\s+/).filter((t) => t !== '1' && t !== '')
  return tokens.join('').replace(/\s/g, '')
}

function resolveSpaceGroup(block: DataBlock): {
  ops: SymOp[]
  spaceGroup: string
  spaceGroupNumber?: number
} {
  for (const tag of SYMOP_TAGS) {
    const loop = lookupLoop(block, tag)
    if (loop) {
      const columnIndex = loop.columns.indexOf(tag)
      const xyzList = loop.rows.map((row) => ({
        xyz: row.values[columnIndex] as string,
        line: row.line,
      }))
      if (xyzList.length === 0) {
        throw cifError('MISSING_ATOMS', block.line, '对称操作循环为空', 'symop 循环至少应包含恒等操作 x,y,z')
      }
      const ops = symOpsFromXyzList(xyzList)
      const hmPair = lookupPair(block, SPACEGROUP_NAME_TAGS)
      return { ops, spaceGroup: hmPair?.value ?? '（显式操作列表）', spaceGroupNumber: undefined }
    }
  }

  const hallPair = lookupPair(block, HALL_TAGS)
  if (hallPair) {
    const hall = hallPair.value
    const setting = hall.match(/:(h|r)$/i)
    if (setting && setting[1]!.toLowerCase() === 'r') {
      throw cifError('NONSTANDARD_SETTING', hallPair.line, 'R 群使用菱方坐标设定', '请用六方坐标（:h）设定导出')
    }
    const hallOps: HallOp[] = parseHallSymbol(hall.replace(/:(h|r)$/i, ''), hallPair.line)
    const ops: SymOp[] = hallOps.map((op) => ({ r: op.r, t: op.t }))
    return { ops, spaceGroup: hall, spaceGroupNumber: undefined }
  }

  const hmPair = lookupPair(block, SPACEGROUP_NAME_TAGS)
  const numberPair = lookupPair(block, SPACEGROUP_NUMBER_TAGS)

  if (hmPair) {
    const rawSymbol = hmPair.value
    const originChoice = rawSymbol.match(/:2\b|origin\s*choice\s*2/i)
    if (originChoice) {
      return resolveByLookup(normalizeHmSymbol(rawSymbol), hmPair.line, rawSymbol)
    }
    const originOne = rawSymbol.match(/:1\b|origin\s*choice\s*1/i)
    if (originOne) {
      throw cifError('NONSTANDARD_SETTING', hmPair.line, `空间群 ${rawSymbol} 声明了 origin choice 1`, '本软件采用惯用 origin choice 2，请用标准设定导出')
    }
    const rSetting = rawSymbol.match(/:r\b/i)
    if (rSetting) {
      throw cifError('NONSTANDARD_SETTING', hmPair.line, `空间群 ${rawSymbol} 使用菱方坐标设定`, '请用六方坐标设定导出')
    }
    return resolveByLookup(normalizeHmSymbol(rawSymbol), hmPair.line, rawSymbol)
  }

  if (numberPair) {
    const number = toNumber(numberPair.value, numberPair.line, '_space_group_IT_number')
    const entry = SPACE_GROUPS[Math.round(number)]
    if (!entry) {
      throw cifError('UNKNOWN_SPACEGROUP', numberPair.line, `空间群编号 ${number} 超出 1~230`, '检查 IT 编号')
    }
    return { ops: entry.ops.map(parseSymOp), spaceGroup: entry.hm, spaceGroupNumber: entry.number }
  }

  return {
    ops: [{ r: [[1, 0, 0], [0, 1, 0], [0, 0, 1]], t: [0, 0, 0] }],
    spaceGroup: 'P1 (未声明，按 P1)',
  }
}

function resolveByLookup(normalized: string, line: number, rawSymbol: string): {
  ops: SymOp[]
  spaceGroup: string
  spaceGroupNumber?: number
} {
  const direct = HM_INDEX[normalized]
  if (direct !== undefined) return entryToOps(SPACE_GROUPS[direct])

  const cubicKey = CUBIC_LEGACY_ALIASES[normalized]
  if (cubicKey !== undefined) {
    const cubicNumber = HM_INDEX[normalizeHmSymbol(cubicKey)]
    if (cubicNumber !== undefined) return entryToOps(SPACE_GROUPS[cubicNumber])
  }

  throw cifError('UNKNOWN_SPACEGROUP', line, rawSymbol, '可改用 _space_group_IT_number 编号或显式 symop 操作列表')
}

function entryToOps(entry: SpaceGroupEntry): {
  ops: SymOp[]
  spaceGroup: string
  spaceGroupNumber?: number
} {
  return { ops: entry.ops.map(parseSymOp), spaceGroup: entry.hm, spaceGroupNumber: entry.number }
}

function parseElementSymbol(raw: string, line: number): string {
  let s = raw.trim()
  s = s.replace(/[\d+\-]+$/, '')
  const two = s.slice(0, 2)
  if (ELEMENT_SYMBOLS.has(two)) return two
  const one = s.slice(0, 1).toUpperCase()
  if (ELEMENT_SYMBOLS.has(one)) return one
  throw cifError('SYNTAX', line, `无法从 "${raw}" 解析出元素符号`, '建议补充 _atom_site_type_symbol 列')
}

function elementFromLabel(label: string, line: number): string {
  const match = label.match(/^([A-Za-z]{1,2})/)
  if (!match) {
    throw cifError('SYNTAX', line, `原子标签 "${label}" 无法解析出元素`, '标签应以元素符号开头')
  }
  const candidate = match[1]
  const capitalized = candidate[0].toUpperCase() + candidate.slice(1).toLowerCase()
  if (ELEMENT_SYMBOLS.has(capitalized)) return capitalized
  const single = candidate[0].toUpperCase()
  if (ELEMENT_SYMBOLS.has(single)) return single
  throw cifError('SYNTAX', line, `原子标签 "${label}" 无法解析出元素`, '标签应以元素符号开头')
}

function cellMatrix(cell: Omit<Cell, 'matrix'>): number[][] {
  const { a, b, c, alpha, beta, gamma } = cell
  const rad = Math.PI / 180
  const ca = Math.cos(alpha * rad)
  const cb = Math.cos(beta * rad)
  const cg = Math.cos(gamma * rad)
  const sg = Math.sin(gamma * rad)
  const volumeTerm = 1 - ca * ca - cb * cb - cg * cg + 2 * ca * cb * cg
  if (volumeTerm <= 0) {
    throw cifError('SYNTAX', 0, '晶胞角度组合无解（体积项为负）', '检查 α/β/γ 是否录入正确')
  }
  const cz = Math.sqrt(volumeTerm) / sg
  return [
    [a, 0, 0],
    [b * cg, b * sg, 0],
    [c * cb, c * (ca - cb * cg) / sg, c * cz],
  ]
}

export function extractStructure(blocks: DataBlock[], fileName: string, fileBase: string): StructureData {
  const started = performance.now()
  let coordinateBlock: DataBlock | undefined
  let atomLoop: Loop | undefined
  for (const block of blocks) {
    const loop = lookupLoop(block, '_atom_site_fract_x')
    if (loop) {
      coordinateBlock = block
      atomLoop = loop
      break
    }
  }
  if (!coordinateBlock || !atomLoop) {
    throw cifError('NO_COORDINATE_BLOCK', blocks.length > 0 ? blocks[0].line : 1, '', '')
  }

  const block = coordinateBlock
  const cellRaw: Record<string, number> = {}
  for (const [key, tags] of Object.entries(CELL_TAGS)) {
    const hit = lookupCell(block, tags)
    if (!hit) {
      throw cifError('MISSING_CELL', block.line, '', '')
    }
    cellRaw[key] = toNumber(hit.value, hit.line, tags[0])
  }
  if (cellRaw.a <= 0 || cellRaw.b <= 0 || cellRaw.c <= 0) {
    throw cifError('SYNTAX', block.line, '晶胞边长必须为正数', '检查 _cell_length_* 的值')
  }
  const cell: Cell = {
    a: cellRaw.a,
    b: cellRaw.b,
    c: cellRaw.c,
    alpha: cellRaw.alpha,
    beta: cellRaw.beta,
    gamma: cellRaw.gamma,
    matrix: [],
  }
  cell.matrix = cellMatrix(cell)

  const columns = atomLoop.columns
  const xIndex = columns.indexOf('_atom_site_fract_x')
  const yIndex = columns.indexOf('_atom_site_fract_y')
  const zIndex = columns.indexOf('_atom_site_fract_z')
  if (yIndex === -1 || zIndex === -1) {
    const line = atomLoop.rows[0]?.line ?? block.line
    throw cifError('MISSING_ATOMS', line, '', '')
  }
  const typeIndex = columns.indexOf('_atom_site_type_symbol')
  const labelIndex = columns.indexOf('_atom_site_label')
  if (typeIndex === -1 && labelIndex === -1) {
    const line = atomLoop.rows[0]?.line ?? block.line
    throw cifError(
      'SYNTAX',
      line,
      '原子循环缺少 _atom_site_type_symbol 或 _atom_site_label 列',
      '无法确定元素种类',
    )
  }
  const occupancyIndex = columns.indexOf('_atom_site_occupancy')

  const asymmetryAtoms: Array<{ element: string; fract: [number, number, number]; occupancy?: number; line: number }> = []
  for (const row of atomLoop.rows) {
    const x = toNumber(row.values[xIndex] as string, row.line, '_atom_site_fract_x')
    const y = toNumber(row.values[yIndex] as string, row.line, '_atom_site_fract_y')
    const z = toNumber(row.values[zIndex] as string, row.line, '_atom_site_fract_z')
    let element: string
    if (typeIndex !== -1) {
      element = parseElementSymbol(row.values[typeIndex] as string, row.line)
    } else {
      element = elementFromLabel(row.values[labelIndex] as string, row.line)
    }
    let occupancy: number | undefined
    if (occupancyIndex !== -1 && row.values[occupancyIndex] && row.values[occupancyIndex] !== '.') {
      const raw = row.values[occupancyIndex] as string
      if (raw !== '?') occupancy = toNumber(raw, row.line, '_atom_site_occupancy')
    }
    asymmetryAtoms.push({
      element,
      fract: [((x % 1) + 1) % 1, ((y % 1) + 1) % 1, ((z % 1) + 1) % 1],
      occupancy,
      line: row.line,
    })
  }
  if (asymmetryAtoms.length === 0) {
    throw cifError('MISSING_ATOMS', atomLoop.rows[0]?.line ?? block.line, '', '')
  }

  const { ops, spaceGroup, spaceGroupNumber } = resolveSpaceGroup(block)
  const atoms = expandSymmetry(asymmetryAtoms, ops)
  if (atoms.length > ATOM_LIMIT) {
    const line = asymmetryAtoms[0]?.line ?? block.line
    throw cifError('SYNTAX', line, `展开后原子数 ${atoms.length} 超出教学级规模上限 10000`, '本软件面向教学级结构')
  }

  const nameHit =
    lookupPair(block, ['_chemical_name_common']) ??
    lookupPair(block, ['_chemical_name_systematic']) ??
    lookupPair(block, ['_chemical_name_mineral'])
  const formulaHit = lookupPair(block, ['_chemical_formula_sum'])
  const name = nameHit?.value ?? formulaHit?.value ?? fileBase
  const sourceHit = lookupPair(block, ['_citation_journal_name_full'])

  return {
    fileName,
    name,
    cell,
    atoms,
    spaceGroup,
    spaceGroupNumber,
    source: sourceHit?.value,
    parseMs: Math.round(performance.now() - started),
  }
}
