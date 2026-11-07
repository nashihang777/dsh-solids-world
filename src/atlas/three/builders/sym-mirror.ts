import { buildPointGroupModel, type PointGroupParams } from './symmetry-elements-'
import type { BuildOptions, EntryModel } from '../kit'

const params: PointGroupParams = {
  generators: [{ type: 'mirror', normal: [0, 0, 1] }],
  elements: [{ kind: 'mirror', order: 1, direction: [0, 0, 1] }],
  motifPoint: [0.65, 0.25, 0.8],
}

export default function build(options: BuildOptions): EntryModel {
  return buildPointGroupModel(params, options)
}
