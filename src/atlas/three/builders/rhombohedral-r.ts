import { buildBravaisLattice, type BravaisParams } from './lattice-bravais-'
import type { BuildOptions, EntryModel } from '../kit'

const params: BravaisParams = {
  system: 'rhombohedral',
  centering: 'R',
  a: 3.2,
  b: 3.2,
  c: 3.2,
  alpha: 75,
  beta: 75,
  gamma: 75,
}

export default function build(options: BuildOptions): EntryModel {
  return buildBravaisLattice(params, options)
}
