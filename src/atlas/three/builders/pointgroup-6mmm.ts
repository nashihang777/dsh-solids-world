import { buildPointGroupModel, type PointGroupParams } from './symmetry-elements-'
import type { BuildOptions, EntryModel } from '../kit'

const R = Math.PI / 6
const dirs: Array<[number, number, number]> = []
for (let k = 0; k < 6; k++) {
  dirs.push([Math.cos(k * R), Math.sin(k * R), 0])
}

const params: PointGroupParams = {
  generators: [
    { type: 'rot', axis: [0, 0, 1], angle: Math.PI / 3 },
    { type: 'rot', axis: [1, 0, 0], angle: Math.PI },
    { type: 'mirror', normal: [0, 0, 1] },
  ],
  elements: [
    { kind: 'axis', order: 6, direction: [0, 0, 1] },
    ...dirs.map((d) => ({ kind: 'axis' as const, order: 2, direction: d })),
    { kind: 'mirror', order: 1, direction: [0, 0, 1] },
    ...dirs.map((d) => ({ kind: 'mirror' as const, order: 1, direction: d })),
    { kind: 'inversion', order: 1, direction: [0, 0, 0] },
  ],
  motifPoint: [0.7, 0.3, 0.8],
}

export default function build(options: BuildOptions): EntryModel {
  return buildPointGroupModel(params, options)
}
