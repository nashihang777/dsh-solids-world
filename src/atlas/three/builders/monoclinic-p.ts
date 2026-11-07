import { buildBravaisLattice, type BravaisParams } from './lattice-bravais-'
import type { BuildOptions, EntryModel } from '../kit'

const params: BravaisParams = {
  system: 'monoclinic',
  centering: 'P',
  a: 3,
  b: 4,
  c: 5,
  alpha: 90,
  beta: 110,
  gamma: 90,
}

export default function build(options: BuildOptions): EntryModel {
  return buildBravaisLattice(params, options)
}
