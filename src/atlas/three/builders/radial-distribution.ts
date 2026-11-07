import type { BuildOptions, EntryModel } from '../kit'
import { buildRadialDistributionModel } from './orbital-'

export default function build(options: BuildOptions): EntryModel {
  return buildRadialDistributionModel(options)
}
