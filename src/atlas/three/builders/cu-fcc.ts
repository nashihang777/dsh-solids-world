import { buildCrystalStructure, cubicCell, type CrystalParams } from './crystal-structure-'
import type { BuildOptions, EntryModel } from '../kit'

const params: CrystalParams = {
  cell: cubicCell(3.61),
  atoms: [
    { element: 'Cu', fract: [0, 0, 0] },
    { element: 'Cu', fract: [0.5, 0.5, 0] },
    { element: 'Cu', fract: [0.5, 0, 0.5] },
    { element: 'Cu', fract: [0, 0.5, 0.5] },
  ],
  anchors: {
    'corner-atom': [0, 0, 0],
    'face-atom': [0.5, 0.5, 0],
    'nn-pair': [0.25, 0.25, 0],
    'close-packed-plane': [0.5, 0.5, 0.5],
  },
}

export default function build(options: BuildOptions): EntryModel {
  return buildCrystalStructure(params, options)
}
