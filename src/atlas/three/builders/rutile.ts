import { buildCrystalStructure, tetragonalCell, type CrystalParams } from './crystal-structure-'
import type { BuildOptions, EntryModel } from '../kit'

const params: CrystalParams = {
  cell: tetragonalCell(4.59, 2.96),
  atoms: [
    { element: 'Ti', fract: [0, 0, 0] },
    { element: 'Ti', fract: [0.5, 0.5, 0.5] },
    { element: 'O', fract: [0.305, 0.305, 0] },
    { element: 'O', fract: [0.695, 0.695, 0] },
    { element: 'O', fract: [0.195, 0.805, 0.5] },
    { element: 'O', fract: [0.805, 0.195, 0.5] },
  ],
  anchors: {
    'ti-site': [0, 0, 0],
    'o-site': [0.305, 0.305, 0],
    'ti-o-bond': [0.1525, 0.1525, 0],
    'octahedra-chain': [0.25, 0.25, 0.25],
    'body-ti': [0.5, 0.5, 0.5],
  },
}

export default function build(options: BuildOptions): EntryModel {
  return buildCrystalStructure(params, options)
}
