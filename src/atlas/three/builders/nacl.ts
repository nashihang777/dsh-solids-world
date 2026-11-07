import { buildCrystalStructure, cubicCell, type CrystalParams } from './crystal-structure-'
import type { BuildOptions, EntryModel } from '../kit'

const params: CrystalParams = {
  cell: cubicCell(5.64),
  atoms: [
    { element: 'Na', fract: [0, 0, 0] },
    { element: 'Na', fract: [0.5, 0.5, 0] },
    { element: 'Na', fract: [0.5, 0, 0.5] },
    { element: 'Na', fract: [0, 0.5, 0.5] },
    { element: 'Cl', fract: [0.5, 0, 0] },
    { element: 'Cl', fract: [0, 0.5, 0] },
    { element: 'Cl', fract: [0, 0, 0.5] },
    { element: 'Cl', fract: [0.5, 0.5, 0.5] },
  ],
  anchors: {
    'na-site': [0, 0, 0],
    'cl-site': [0.5, 0, 0],
    'na-cl-bond': [0.25, 0, 0],
  },
}

export default function buildNaCl(options: BuildOptions): EntryModel {
  return buildCrystalStructure(params, options)
}
