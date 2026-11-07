import { buildCrystalStructure, cubicCell, type CrystalParams } from './crystal-structure-'
import type { BuildOptions, EntryModel } from '../kit'

const params: CrystalParams = {
  cell: cubicCell(2.87),
  atoms: [
    { element: 'Fe', fract: [0, 0, 0] },
    { element: 'Fe', fract: [0.5, 0.5, 0.5] },
  ],
  anchors: {
    'corner-atom': [0, 0, 0],
    'body-atom': [0.5, 0.5, 0.5],
    'nn-pair': [0.25, 0.25, 0.25],
    'diagonal': [0.5, 0.5, 0],
  },
}

export default function build(options: BuildOptions): EntryModel {
  return buildCrystalStructure(params, options)
}
