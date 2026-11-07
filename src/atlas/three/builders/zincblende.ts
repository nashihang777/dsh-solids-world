import { buildCrystalStructure, cubicCell, type CrystalParams } from './crystal-structure-'
import type { BuildOptions, EntryModel } from '../kit'

const params: CrystalParams = {
  cell: cubicCell(5.41),
  atoms: [
    { element: 'Zn', fract: [0, 0, 0] },
    { element: 'Zn', fract: [0.5, 0.5, 0] },
    { element: 'Zn', fract: [0.5, 0, 0.5] },
    { element: 'Zn', fract: [0, 0.5, 0.5] },
    { element: 'S', fract: [0.25, 0.25, 0.25] },
    { element: 'S', fract: [0.75, 0.75, 0.25] },
    { element: 'S', fract: [0.75, 0.25, 0.75] },
    { element: 'S', fract: [0.25, 0.75, 0.75] },
  ],
  anchors: {
    'zn-site': [0, 0, 0],
    's-site': [0.25, 0.25, 0.25],
    'zn-s-bond': [0.125, 0.125, 0.125],
    'face-atom': [0.5, 0.5, 0],
  },
}

export default function build(options: BuildOptions): EntryModel {
  return buildCrystalStructure(params, options)
}
