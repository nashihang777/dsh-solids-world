import { buildBravaisLattice, type BravaisParams } from './lattice-bravais-'
import type { BuildOptions, EntryModel } from '../kit'

const params: BravaisParams = {
  system: 'cubic',
  centering: 'F',
  a: 3.5,
  b: 3.5,
  c: 3.5,
  alpha: 90,
  beta: 90,
  gamma: 90,
}

export default function build(options: BuildOptions): EntryModel {
  return buildBravaisLattice(params, options)
}
