export interface AtomSlot {
  h: number
  l: number
  c: number
  dark: string
  light: string
}

export const FREE_ARCS: { name: string; h: [number, number] }[] = [
  { name: 'blue', h: [222, 276] },
  { name: 'rose', h: [322, 373] },
  { name: 'chartreuse', h: [95, 138] },
]

export const ATOM_SLOTS: AtomSlot[] = [
  { h: 252, l: 0.62, c: 0.14, dark: '#3e89d7', light: '#2562a1' },
  { h: 340, l: 0.66, c: 0.15, dark: '#cd6aaf', light: '#9b4b83' },
  { h: 118, l: 0.66, c: 0.13, dark: '#8b9c33', light: '#66741c' },
  { h: 226, l: 0.72, c: 0.1, dark: '#57b1d4', light: '#3d88a4' },
  { h: 330, l: 0.5, c: 0.12, dark: '#884783', light: '#5c2859' },
  { h: 106, l: 0.8, c: 0.11, dark: '#c7c26b', light: '#9d9952' },
  { h: 270, l: 0.55, c: 0.1, dark: '#5b6eac', light: '#3b4a7b' },
  { h: 356, l: 0.76, c: 0.1, dark: '#e496b3', light: '#b3738b' },
]

const ELEMENTS_BY_Z = [
  'H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar',
  'K', 'Ca', 'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn', 'Ga', 'Ge', 'As', 'Se', 'Br', 'Kr',
  'Rb', 'Sr', 'Y', 'Zr', 'Nb', 'Mo', 'Tc', 'Ru', 'Rh', 'Pd', 'Ag', 'Cd', 'In', 'Sn', 'Sb', 'Te', 'I', 'Xe',
  'Cs', 'Ba', 'La', 'Ce', 'Pr', 'Nd', 'Pm', 'Sm', 'Eu', 'Gd', 'Tb', 'Dy', 'Ho', 'Er', 'Tm', 'Yb', 'Lu',
  'Hf', 'Ta', 'W', 'Re', 'Os', 'Ir', 'Pt', 'Au', 'Hg', 'Tl', 'Pb', 'Bi', 'Po', 'At', 'Rn',
  'Fr', 'Ra', 'Ac', 'Th', 'Pa', 'U', 'Np', 'Pu', 'Am', 'Cm', 'Bk', 'Cf', 'Es', 'Fm', 'Md', 'No', 'Lr',
  'Rf', 'Db', 'Sg', 'Bh', 'Hs', 'Mt', 'Ds', 'Rg', 'Cn', 'Nh', 'Fl', 'Mc', 'Lv', 'Ts', 'Og',
]

const Z_OF_ELEMENT = new Map<string, number>(ELEMENTS_BY_Z.map((symbol, index) => [symbol, index + 1]))

export function atomicNumber(element: string): number {
  const z = Z_OF_ELEMENT.get(element)
  if (z === undefined) throw new Error(`未知元素符号：${element}（渲染层元素应已通过周期表校验）`)
  return z
}

export function assignAtomColors(elements: string[]): Map<string, AtomSlot> {
  const unique = [...new Set(elements)]
  const sorted = unique.sort((a, b) => atomicNumber(a) - atomicNumber(b))
  const map = new Map<string, AtomSlot>()
  sorted.forEach((element, index) => {
    const slot = ATOM_SLOTS[index % ATOM_SLOTS.length]
    const round = Math.floor(index / ATOM_SLOTS.length)
    if (round === 0) {
      map.set(element, slot)
    } else {
      map.set(element, { ...slot, c: Math.round(slot.c * Math.pow(0.6, round) * 1000) / 1000 })
    }
  })
  return map
}
