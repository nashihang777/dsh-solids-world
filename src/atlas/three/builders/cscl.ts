import { buildCrystalStructure, cubicCell, type CrystalParams } from './crystal-structure-'
import type { BuildOptions, EntryModel } from '../kit'

const params: CrystalParams = {
  cell: cubicCell(4.11),
  atoms: [
    { element: 'Cs', fract: [0, 0, 0] },
    { element: 'Cl', fract: [0.5, 0.5, 0.5] },
  ],
  anchors: {
    'cs-site': [0, 0, 0],
    'cl-site': [0.5, 0.5, 0.5],
    'cs-cl-bond': [0.25, 0.25, 0.25],
  },
}

export default function buildCsCl(options: BuildOptions): EntryModel {
  return buildCrystalStructure(params, options)
}
