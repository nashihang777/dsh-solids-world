import type { BuildOptions, EntryModel } from '../kit'
import { buildOrbitalModel } from './orbital-'

export default function build(options: BuildOptions): EntryModel {
  return buildOrbitalModel({ n: 1, l: 0, mode: 's', pMode: 'single' }, options)
}
