import { disposeModel, type BuildOptions, type EntryModel } from './kit'
import { BUILDERS } from './builders-map'

const LRU_LIMIT = 12

const cache = new Map<string, EntryModel>()

export function listBuilderIds(): string[] {
  return Object.keys(BUILDERS).sort()
}

export function hasBuilder(id: string): boolean {
  return Object.prototype.hasOwnProperty.call(BUILDERS, id)
}

export function resetModelTransform(model: EntryModel): void {
  model.group.scale.setScalar(1)
  model.group.rotation.set(0, 0, 0)
  model.group.updateMatrix()
}

export async function loadEntry(id: string, options: BuildOptions): Promise<EntryModel> {
  const orbitalKey = options.orbitalView
    ? `${options.orbitalView.isoFraction.toFixed(3)}|${options.orbitalView.pMode}`
    : ''
  const key = `${id}|${options.supercell}|${options.theme}|${options.bondTolerance}|${orbitalKey}`
  const cached = cache.get(key)
  if (cached) {
    cache.delete(key)
    cache.set(key, cached)
    resetModelTransform(cached)
    return cached
  }
  const loader = BUILDERS[id]
  if (!loader) throw new Error(`未注册的条目 builder：${id}`)
  const started = performance.now()
  const mod = await loader()
  const model = mod.default(options)
  log(`perf entry-load:${id} supercell=${options.supercell} ${Math.round(performance.now() - started)}ms`)
  cache.set(key, model)
  while (cache.size > LRU_LIMIT) {
    const oldest = cache.keys().next().value as string
    const evicted = cache.get(oldest) as EntryModel
    cache.delete(oldest)
    disposeModel(evicted)
    log(`perf lru-evict:${oldest}`)
  }
  return model
}

export function cacheSize(): number {
  return cache.size
}

function log(message: string): void {
  const api = (globalThis as { solids?: { log?: (level: string, message: string) => void } }).solids
  api?.log?.('info', message)
}
