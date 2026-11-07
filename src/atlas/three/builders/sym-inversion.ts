import { buildPointGroupModel, type PointGroupParams } from './symmetry-elements-'
import type { BuildOptions, EntryModel } from '../kit'

const params: PointGroupParams = {
  generators: [{ type: 'inversion' }],
  elements: [{ kind: 'inversion', order: 1, direction: [0, 0, 0] }],
  motifPoint: [0.65, 0.25, 0.8],
}

export default function build(options: BuildOptions): EntryModel {
  return buildPointGroupModel(params, options)
}
