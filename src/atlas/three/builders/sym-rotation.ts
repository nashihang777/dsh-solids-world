import { buildPointGroupModel, type PointGroupParams } from './symmetry-elements-'
import type { BuildOptions, EntryModel } from '../kit'

const params: PointGroupParams = {
  generators: [{ type: 'rot', axis: [0, 0, 1], angle: Math.PI / 2 }],
  elements: [{ kind: 'axis', order: 4, direction: [0, 0, 1] }],
  motifPoint: [0.75, 0.2, 0.85],
}

export default function build(options: BuildOptions): EntryModel {
  return buildPointGroupModel(params, options)
}
