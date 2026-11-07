import { buildCrystalStructure, cubicCell, type CrystalParams } from './crystal-structure-'
import type { BuildOptions, EntryModel } from '../kit'

const params: CrystalParams = {
  cell: cubicCell(3.905),
  atoms: [
    { element: 'Sr', fract: [0, 0, 0] },
    { element: 'Ti', fract: [0.5, 0.5, 0.5] },
    { element: 'O', fract: [0.5, 0.5, 0] },
    { element: 'O', fract: [0.5, 0, 0.5] },
    { element: 'O', fract: [0, 0.5, 0.5] },
  ],
  anchors: {
    'sr-site': [0, 0, 0],
    'ti-site': [0.5, 0.5, 0.5],
    'o-site': [0.5, 0.5, 0],
    'ti-o-bond': [0.5, 0.5, 0.25],
    'octahedron': [0.5, 0.5, 0.5],
  },
}

export default function build(options: BuildOptions): EntryModel {
  return buildCrystalStructure(params, options)
}
