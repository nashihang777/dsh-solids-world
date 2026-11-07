import { buildPointGroupModel, type PointGroupParams } from './symmetry-elements-'
import type { BuildOptions, EntryModel } from '../kit'

const D = Math.SQRT1_2
const T = 1 / Math.sqrt(3)

const params: PointGroupParams = {
  generators: [
    { type: 'rotinv', axis: [0, 0, 1], angle: Math.PI / 2 },
    { type: 'rot', axis: [1, 1, 1], angle: (Math.PI * 2) / 3 },
  ],
  elements: [
    { kind: 'axis', order: -4, direction: [1, 0, 0] },
    { kind: 'axis', order: -4, direction: [0, 1, 0] },
    { kind: 'axis', order: -4, direction: [0, 0, 1] },
    { kind: 'axis', order: 3, direction: [T, T, T] },
    { kind: 'axis', order: 3, direction: [-T, T, T] },
    { kind: 'axis', order: 3, direction: [T, -T, T] },
    { kind: 'axis', order: 3, direction: [T, T, -T] },
    { kind: 'mirror', order: 1, direction: [D, D, 0] },
    { kind: 'mirror', order: 1, direction: [D, -D, 0] },
    { kind: 'mirror', order: 1, direction: [D, 0, D] },
    { kind: 'mirror', order: 1, direction: [D, 0, -D] },
    { kind: 'mirror', order: 1, direction: [0, D, D] },
    { kind: 'mirror', order: 1, direction: [0, D, -D] },
  ],
  motifPoint: [0.7, 0.4, 0.95],
}

export default function build(options: BuildOptions): EntryModel {
  return buildPointGroupModel(params, options)
}
