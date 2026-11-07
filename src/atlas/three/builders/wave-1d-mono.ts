import { buildMonoChain } from './lattice-wave-'
import type { BuildOptions, EntryModel } from '../kit'

export default function build(options: BuildOptions): EntryModel {
  return buildMonoChain(options)
}
