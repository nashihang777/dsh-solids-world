import { build3DMode } from './lattice-wave-'
import type { BuildOptions, EntryModel } from '../kit'

export default function build(options: BuildOptions): EntryModel {
  return build3DMode(options)
}
