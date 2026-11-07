import type { BuildOptions, EntryModel } from '../kit'
import { buildOrbitalModel } from './orbital-'

export default function build(options: BuildOptions): EntryModel {
  return buildOrbitalModel({ n: 3, l: 2, mode: 'dxy', pMode: 'single' }, options)
}
