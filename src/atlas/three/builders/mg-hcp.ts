import { buildCrystalStructure, hexagonalCell, type CrystalParams } from './crystal-structure-'
import type { BuildOptions, EntryModel } from '../kit'

const params: CrystalParams = {
  cell: hexagonalCell(3.21, 5.21),
  atoms: [
    { element: 'Mg', fract: [1 / 3, 2 / 3, 0.25] },
    { element: 'Mg', fract: [2 / 3, 1 / 3, 0.75] },
  ],
  anchors: {
    'a-site': [1 / 3, 2 / 3, 0.25],
    'b-site': [2 / 3, 1 / 3, 0.75],
    'hollow-site': [2 / 3, 1 / 3, 0.25],
    'c-axis': [0, 0, 0.5],
    'nn-pair': [0.5, 0.5, 0.25],
  },
}

export default function build(options: BuildOptions): EntryModel {
  return buildCrystalStructure(params, options)
}
