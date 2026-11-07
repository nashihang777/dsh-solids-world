import type { BuildOptions, EntryModel } from '../kit'
import { buildShellStructureModel } from './bohr-atom-'

export default function build(options: BuildOptions): EntryModel {
  return buildShellStructureModel(options)
}
