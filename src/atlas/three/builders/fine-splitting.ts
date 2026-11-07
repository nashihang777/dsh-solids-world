import type { BuildOptions, EntryModel } from '../kit'
import { buildFineSplittingModel } from './bohr-atom-'

export default function build(options: BuildOptions): EntryModel {
  return buildFineSplittingModel(options)
}
