import { buildCrystalStructure, cubicCell, type CrystalParams } from './crystal-structure-'
import type { BuildOptions, EntryModel } from '../kit'

const params: CrystalParams = {
  cell: cubicCell(5.46),
  atoms: [
    { element: 'Ca', fract: [0, 0, 0] },
    { element: 'Ca', fract: [0.5, 0.5, 0] },
    { element: 'Ca', fract: [0.5, 0, 0.5] },
    { element: 'Ca', fract: [0, 0.5, 0.5] },
    { element: 'F', fract: [0.25, 0.25, 0.25] },
    { element: 'F', fract: [0.75, 0.75, 0.75] },
    { element: 'F', fract: [0.75, 0.75, 0.25] },
    { element: 'F', fract: [0.25, 0.25, 0.75] },
    { element: 'F', fract: [0.75, 0.25, 0.75] },
    { element: 'F', fract: [0.25, 0.75, 0.75] },
    { element: 'F', fract: [0.75, 0.25, 0.25] },
    { element: 'F', fract: [0.25, 0.75, 0.25] },
  ],
  anchors: {
    'ca-site': [0, 0, 0],
    'f-tetrahedral': [0.25, 0.25, 0.25],
    'ca-f-bond': [0.125, 0.125, 0.125],
    'fcc-sublattice': [0.5, 0.5, 0],
  },
}

export default function build(options: BuildOptions): EntryModel {
  return buildCrystalStructure(params, options)
}
