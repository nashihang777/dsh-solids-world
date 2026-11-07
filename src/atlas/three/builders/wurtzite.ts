import { buildCrystalStructure, hexagonalCell, type CrystalParams } from './crystal-structure-'
import type { BuildOptions, EntryModel } from '../kit'

const params: CrystalParams = {
  cell: hexagonalCell(3.82, 6.26),
  atoms: [
    { element: 'Zn', fract: [1 / 3, 2 / 3, 0] },
    { element: 'Zn', fract: [2 / 3, 1 / 3, 0.5] },
    { element: 'S', fract: [1 / 3, 2 / 3, 0.375] },
    { element: 'S', fract: [2 / 3, 1 / 3, 0.875] },
  ],
  anchors: {
    'zn-site': [1 / 3, 2 / 3, 0],
    's-site': [1 / 3, 2 / 3, 0.375],
    'zn-s-bond': [2 / 3, 1 / 3, 0.1875],
    'c-axis': [0, 0, 0.5],
  },
}

export default function build(options: BuildOptions): EntryModel {
  return buildCrystalStructure(params, options)
}
