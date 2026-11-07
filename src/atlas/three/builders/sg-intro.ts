import { buildSpaceGroupIntro } from './symmetry-elements-'
import type { BuildOptions, EntryModel } from '../kit'

export default function build(options: BuildOptions): EntryModel {
  return buildSpaceGroupIntro(options)
}
