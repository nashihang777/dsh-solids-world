import type { CSSProperties } from 'react'
import { useLocale } from '../i18n/LocaleProvider'
import { CATEGORIES } from '../data/categories'
import type { AtlasEntry } from '../data/types'

interface LibraryPanelProps {
  entries: AtlasEntry[]
  selectedId: string | null
  onSelect: (id: string) => void
  collapsed: boolean
  onToggle: () => void
  onOpenGallery: () => void
}

export function LibraryPanel({ entries, selectedId, onSelect, collapsed, onToggle, onOpenGallery }: LibraryPanelProps) {
  const { t, locale } = useLocale()
  if (collapsed) {
    return (
      <aside className="panel panel-lib panel-collapsed" aria-label={t('lib.title')}>
        <button className="panel-handle" onClick={onToggle} title={t('lib.expand')} aria-label={t('lib.expand')}>
          ›
        </button>
      </aside>
    )
  }
  const groups = new Map<string, AtlasEntry[]>()
  for (const entry of entries) {
    const list = groups.get(entry.category)
    if (list) list.push(entry)
    else groups.set(entry.category, [entry])
  }
  const categoryName = (category: string): string => {
    const names = CATEGORIES[category]
    if (names) return locale === 'en' ? names.en : names.zh
    return groups.get(category)?.[0]?.english ?? category
  }
  return (
    <aside className="panel panel-lib" aria-label={t('lib.title')}>
      <header className="panel-head">
        <span className="eyebrow">{t('lib.title')}</span>
        <button className="panel-fold" onClick={onToggle} title={t('lib.collapse')} aria-label={t('lib.collapse')}>
          ‹
        </button>
      </header>
      <div className="panel-body">
        {[...groups].map(([category, list]) => (
          <section key={category} className="lib-group">
            <h3 className="lib-group-title">{categoryName(category)}</h3>
            <ul className="lib-list">
              {list.map((entry) => (
                <li key={entry.id}>
                  <button
                    className={`lib-item${entry.id === selectedId ? ' selected' : ''}`}
                    style={{ '--lib-accent': entry.accent } as CSSProperties}
                    onClick={() => onSelect(entry.id)}
                    aria-current={entry.id === selectedId ? 'true' : undefined}
                  >
                    <span className="lib-item-name">{entry.name}</span>
                    <span className="lib-item-en">{entry.english}</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <footer className="panel-foot">
        <button className="lib-gallery-btn" onClick={onOpenGallery}>
          {t('lib.gallery')}
        </button>
      </footer>
    </aside>
  )
}
