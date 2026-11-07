import type { BuildOptions, EntryModel } from '../kit'
import { buildOrbitalModel } from './orbital-'

export default function build(options: BuildOptions): EntryModel {
  return buildOrbitalModel(
    { n: 2, l: 1, mode: 'pz', pMode: options.orbitalView?.pMode ?? 'single' },
    options,
  )
}
