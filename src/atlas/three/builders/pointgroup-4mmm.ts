import { buildPointGroupModel, type PointGroupParams } from './symmetry-elements-'
import type { BuildOptions, EntryModel } from '../kit'

const D = Math.SQRT1_2

const params: PointGroupParams = {
  generators: [
    { type: 'rot', axis: [0, 0, 1], angle: Math.PI / 2 },
    { type: 'rot', axis: [1, 0, 0], angle: Math.PI },
    { type: 'mirror', normal: [0, 0, 1] },
  ],
  elements: [
    { kind: 'axis', order: 4, direction: [0, 0, 1] },
    { kind: 'axis', order: 2, direction: [1, 0, 0] },
    { kind: 'axis', order: 2, direction: [0, 1, 0] },
    { kind: 'axis', order: 2, direction: [D, D, 0] },
    { kind: 'axis', order: 2, direction: [D, -D, 0] },
    { kind: 'mirror', order: 1, direction: [0, 0, 1] },
    { kind: 'mirror', order: 1, direction: [1, 0, 0] },
    { kind: 'mirror', order: 1, direction: [0, 1, 0] },
    { kind: 'mirror', order: 1, direction: [D, D, 0] },
    { kind: 'mirror', order: 1, direction: [D, -D, 0] },
    { kind: 'inversion', order: 1, direction: [0, 0, 0] },
  ],
  motifPoint: [0.5, 0.2, 0.9],
}

export default function build(options: BuildOptions): EntryModel {
  return buildPointGroupModel(params, options)
}
