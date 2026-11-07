import { buildBravaisLattice, type BravaisParams } from './lattice-bravais-'
import type { BuildOptions, EntryModel } from '../kit'

const params: BravaisParams = {
  system: 'hexagonal',
  centering: 'P',
  a: 3.2,
  b: 3.2,
  c: 5.2,
  alpha: 90,
  beta: 90,
  gamma: 120,
}

export default function build(options: BuildOptions): EntryModel {
  return buildBravaisLattice(params, options)
}
