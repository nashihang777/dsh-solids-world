import { buildCrystalStructure, hexagonalCell, type CrystalParams } from './crystal-structure-'
import type { BuildOptions, EntryModel } from '../kit'

const params: CrystalParams = {
  cell: hexagonalCell(2.464, 6.71),
  atoms: [
    { element: 'C', fract: [0, 0, 0.25] },
    { element: 'C', fract: [1 / 3, 2 / 3, 0.25] },
    { element: 'C', fract: [0, 0, 0.75] },
    { element: 'C', fract: [2 / 3, 1 / 3, 0.75] },
  ],
  anchors: {
    'layer-a': [0, 0, 0.25],
    'layer-b': [2 / 3, 1 / 3, 0.75],
    'in-plane-bond': [1 / 6, 1 / 3, 0.25],
    'interlayer': [0, 0, 0.5],
    'hollow-site': [2 / 3, 1 / 3, 0.25],
  },
}

export default function build(options: BuildOptions): EntryModel {
  return buildCrystalStructure(params, options)
}
