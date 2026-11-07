import { ENTRIES_ZH } from './entries.zh'
import { GUIDES_ZH } from './guides.zh'
import { ENTRIES_ATOMIC_ZH } from './entries-atomic.zh'
import { GUIDES_ATOMIC_ZH } from './guides-atomic.zh'
import { ENTRIES_BRAVAIS_ZH } from './entries-bravais.zh'
import { GUIDES_BRAVAIS_ZH } from './guides-bravais.zh'
import { ENTRIES_CRYSTAL2_ZH } from './entries-crystal2.zh'
import { GUIDES_CRYSTAL2_ZH } from './guides-crystal2.zh'
import { ENTRIES_SYMMETRY_ZH } from './entries-symmetry.zh'
import { GUIDES_SYMMETRY_ZH } from './guides-symmetry.zh'
import { ENTRIES_DYNAMICS_ZH } from './entries-dynamics.zh'
import { GUIDES_DYNAMICS_ZH } from './guides-dynamics.zh'
import { ENTRIES_EN } from './entries.en'
import { GUIDES_EN } from './guides.en'
import { ENTRIES_ATOMIC_EN } from './entries-atomic.en'
import { GUIDES_ATOMIC_EN } from './guides-atomic.en'
import { ENTRIES_BRAVAIS_EN } from './entries-bravais.en'
import { GUIDES_BRAVAIS_EN } from './guides-bravais.en'
import { ENTRIES_CRYSTAL2_EN } from './entries-crystal2.en'
import { GUIDES_CRYSTAL2_EN } from './guides-crystal2.en'
import { ENTRIES_SYMMETRY_EN } from './entries-symmetry.en'
import { GUIDES_SYMMETRY_EN } from './guides-symmetry.en'
import { ENTRIES_DYNAMICS_EN } from './entries-dynamics.en'
import { GUIDES_DYNAMICS_EN } from './guides-dynamics.en'
import type { AtlasEntry, EntryMeta, Guide } from './types'
import type { LocaleSetting } from '../../electron/storage'

const ENTRIES_BY_LOCALE: Record<LocaleSetting, EntryMeta[]> = {
  zh: [...ENTRIES_ZH, ...ENTRIES_CRYSTAL2_ZH, ...ENTRIES_BRAVAIS_ZH, ...ENTRIES_ATOMIC_ZH, ...ENTRIES_SYMMETRY_ZH, ...ENTRIES_DYNAMICS_ZH],
  en: [...ENTRIES_EN, ...ENTRIES_CRYSTAL2_EN, ...ENTRIES_BRAVAIS_EN, ...ENTRIES_ATOMIC_EN, ...ENTRIES_SYMMETRY_EN, ...ENTRIES_DYNAMICS_EN],
}

const GUIDES_BY_LOCALE: Record<LocaleSetting, Record<string, Guide>> = {
  zh: { ...GUIDES_ZH, ...GUIDES_BRAVAIS_ZH, ...GUIDES_CRYSTAL2_ZH, ...GUIDES_ATOMIC_ZH, ...GUIDES_SYMMETRY_ZH, ...GUIDES_DYNAMICS_ZH },
  en: { ...GUIDES_EN, ...GUIDES_BRAVAIS_EN, ...GUIDES_CRYSTAL2_EN, ...GUIDES_ATOMIC_EN, ...GUIDES_SYMMETRY_EN, ...GUIDES_DYNAMICS_EN },
}

function buildAtlas(metas: EntryMeta[], guides: Record<string, Guide>): AtlasEntry[] {
  return metas.map((meta) => {
    const guide = guides[meta.id]
    if (!guide) throw new Error(`条目 ${meta.id} 缺少讲解与测验数据`)
    return { ...meta, guide }
  })
}

export function buildAtlasFor(locale: LocaleSetting): AtlasEntry[] {
  return buildAtlas(ENTRIES_BY_LOCALE[locale], GUIDES_BY_LOCALE[locale])
}
