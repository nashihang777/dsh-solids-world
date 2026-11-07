import { buildPointGroupModel, type PointGroupParams } from './symmetry-elements-'
import type { BuildOptions, EntryModel } from '../kit'

const params: PointGroupParams = {
  generators: [
    { type: 'rot', axis: [0, 1, 0], angle: Math.PI },
    { type: 'inversion' },
  ],
  elements: [
    { kind: 'axis', order: 2, direction: [0, 1, 0] },
    { kind: 'mirror', order: 1, direction: [0, 1, 0] },
    { kind: 'inversion', order: 1, direction: [0, 0, 0] },
  ],
  motifPoint: [0.55, 0.3, 0.8],
}

export default function build(options: BuildOptions): EntryModel {
  return buildPointGroupModel(params, options)
}
