import type { BuildOptions, EntryModel } from '../kit'
import { buildHydrogenLevelsModel } from './bohr-atom-'

export default function build(options: BuildOptions): EntryModel {
  return buildHydrogenLevelsModel(options)
}
