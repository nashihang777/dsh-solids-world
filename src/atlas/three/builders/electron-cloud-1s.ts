import type { BuildOptions, EntryModel } from '../kit'
import { buildElectronCloudModel } from './orbital-'

export default function build(options: BuildOptions): EntryModel {
  return buildElectronCloudModel(options)
}
