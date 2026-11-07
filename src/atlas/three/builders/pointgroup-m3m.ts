import { buildPointGroupModel, type PointGroupParams } from './symmetry-elements-'
import type { BuildOptions, EntryModel } from '../kit'

const D = Math.SQRT1_2
const T = 1 / Math.sqrt(3)

const params: PointGroupParams = {
  generators: [
    { type: 'rot', axis: [0, 0, 1], angle: Math.PI / 2 },
    { type: 'rot', axis: [1, 1, 1], angle: (Math.PI * 2) / 3 },
    { type: 'inversion' },
  ],
  elements: [
    { kind: 'axis', order: 4, direction: [1, 0, 0] },
    { kind: 'axis', order: 4, direction: [0, 1, 0] },
    { kind: 'axis', order: 4, direction: [0, 0, 1] },
    { kind: 'axis', order: 3, direction: [T, T, T] },
    { kind: 'axis', order: 3, direction: [-T, T, T] },
    { kind: 'axis', order: 3, direction: [T, -T, T] },
    { kind: 'axis', order: 3, direction: [T, T, -T] },
    { kind: 'axis', order: 2, direction: [D, D, 0] },
    { kind: 'axis', order: 2, direction: [D, -D, 0] },
    { kind: 'axis', order: 2, direction: [D, 0, D] },
    { kind: 'axis', order: 2, direction: [D, 0, -D] },
    { kind: 'axis', order: 2, direction: [0, D, D] },
    { kind: 'axis', order: 2, direction: [0, D, -D] },
    { kind: 'mirror', order: 1, direction: [1, 0, 0] },
    { kind: 'mirror', order: 1, direction: [0, 1, 0] },
    { kind: 'mirror', order: 1, direction: [0, 0, 1] },
    { kind: 'mirror', order: 1, direction: [D, D, 0] },
    { kind: 'mirror', order: 1, direction: [D, -D, 0] },
    { kind: 'mirror', order: 1, direction: [D, 0, D] },
    { kind: 'mirror', order: 1, direction: [D, 0, -D] },
    { kind: 'mirror', order: 1, direction: [0, D, D] },
    { kind: 'mirror', order: 1, direction: [0, D, -D] },
    { kind: 'inversion', order: 1, direction: [0, 0, 0] },
  ],
  motifPoint: [0.9, 0.5, 0.7],
}

export default function build(options: BuildOptions): EntryModel {
  return buildPointGroupModel(params, options)
}
