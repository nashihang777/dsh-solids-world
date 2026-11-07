import type { StructureData } from '../../electron/cif/structure'
import { disposeModel, type BuildOptions, type EntryModel } from './kit'
import { buildCrystalStructure, type CrystalParams } from './builders/crystal-structure-'

const CUSTOM_CACHE_LIMIT = 4
const cache = new Map<string, EntryModel>()

export function buildFromStructureData(structure: StructureData, options: BuildOptions): EntryModel {
  const key = `${structure.fileName}|${options.supercell}|${options.theme}|${options.bondTolerance}`
  const cached = cache.get(key)
  if (cached) {
    cache.delete(key)
    cache.set(key, cached)
    cached.group.scale.setScalar(1)
    cached.group.rotation.set(0, 0, 0)
    cached.group.updateMatrix()
    return cached
  }
  const params: CrystalParams = {
    cell: {
      a: structure.cell.a,
      b: structure.cell.b,
      c: structure.cell.c,
      alpha: structure.cell.alpha,
      beta: structure.cell.beta,
      gamma: structure.cell.gamma,
      matrix: [
        [structure.cell.matrix[0][0], structure.cell.matrix[0][1], structure.cell.matrix[0][2]],
        [structure.cell.matrix[1][0], structure.cell.matrix[1][1], structure.cell.matrix[1][2]],
        [structure.cell.matrix[2][0], structure.cell.matrix[2][1], structure.cell.matrix[2][2]],
      ],
    },
    atoms: structure.atoms.map((atom) => ({ element: atom.element, fract: atom.fract })),
    anchors: {},
  }
  const model = buildCrystalStructure(params, options)
  cache.set(key, model)
  while (cache.size > CUSTOM_CACHE_LIMIT) {
    const oldest = cache.keys().next().value as string
    const evicted = cache.get(oldest) as EntryModel
    cache.delete(oldest)
    disposeModel(evicted)
    window.solids.log('info', `perf custom-lru-evict:${oldest}`)
  }
  return model
}
