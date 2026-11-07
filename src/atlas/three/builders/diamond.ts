import { buildCrystalStructure, cubicCell, type CrystalParams } from './crystal-structure-'
import type { BuildOptions, EntryModel } from '../kit'

const params: CrystalParams = {
  cell: cubicCell(3.567),
  atoms: [
    { element: 'C', fract: [0, 0, 0] },
    { element: 'C', fract: [0.5, 0.5, 0] },
    { element: 'C', fract: [0.5, 0, 0.5] },
    { element: 'C', fract: [0, 0.5, 0.5] },
    { element: 'C', fract: [0.25, 0.25, 0.25] },
    { element: 'C', fract: [0.75, 0.75, 0.25] },
    { element: 'C', fract: [0.75, 0.25, 0.75] },
    { element: 'C', fract: [0.25, 0.75, 0.75] },
  ],
  anchors: {
    'c-atom': [0, 0, 0],
    'inner-c': [0.25, 0.25, 0.25],
    'c-c-bond': [0.125, 0.125, 0.125],
  },
}

export default function buildDiamond(options: BuildOptions): EntryModel {
  return buildCrystalStructure(params, options)
}
