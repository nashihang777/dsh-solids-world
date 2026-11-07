import type { BuildOptions, EntryModel } from '../kit'
import { buildBohrModel } from './bohr-atom-'

export default function build(options: BuildOptions): EntryModel {
  return buildBohrModel(options)
}
