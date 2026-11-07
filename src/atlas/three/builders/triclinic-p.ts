import { buildBravaisLattice, type BravaisParams } from './lattice-bravais-'
import type { BuildOptions, EntryModel } from '../kit'

const params: BravaisParams = {
  system: 'triclinic',
  centering: 'P',
  a: 3,
  b: 4,
  c: 5,
  alpha: 75,
  beta: 95,
  gamma: 85,
}

export default function build(options: BuildOptions): EntryModel {
  return buildBravaisLattice(params, options)
}
