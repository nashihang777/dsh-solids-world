import { useMemo } from 'react'
import { assignAtomColors } from '../data/atomPalette'
import { useLocale } from '../i18n/LocaleProvider'
import type { Note } from '../../electron/notes'
import type { StructureData } from '../../electron/cif/structure'
import type { AtlasEntry, Hotspot } from '../data/types'
import type { DictKey } from '../i18n/zh'
import { NoteEditor } from './NoteEditor'

interface DetailPanelProps {
  entry: AtlasEntry | null
  theme: 'dark' | 'light'
  activeHotspotId: string | null
  onHotspotSelect: (hotspot: Hotspot) => void
  collapsed: boolean
  onToggle: () => void
  customStructure: StructureData | null
  onExitCustom: () => void
  lessonDone: boolean
  quizPassed: boolean
  onStartLesson: () => void
  onStartQuiz: () => void
  note: Note | undefined
  onSaveNote: (entryId: string, text: string) => void
}

function ElementLegend({ entry, theme }: { entry: AtlasEntry; theme: 'dark' | 'light' }) {
  const colors = useMemo(
    () => assignAtomColors(entry.elements.map((item) => item.element)),
    [entry],
  )
  return (
    <div className="element-legend">
      {entry.elements.map((item) => {
        const slot = colors.get(item.element)
        const hex = slot ? (theme === 'dark' ? slot.dark : slot.light) : 'transparent'
        return (
          <span key={item.element} className="element-legend-item">
            <span className="element-legend-dot" style={{ background: hex }} />
            {item.element} × {item.count}
          </span>
        )
      })}
    </div>
  )
}

function CustomElementLegend({ structure, theme }: { structure: StructureData; theme: 'dark' | 'light' }) {
  const counts = useMemo(() => {
    const map = new Map<string, number>()
    for (const atom of structure.atoms) {
      map.set(atom.element, (map.get(atom.element) ?? 0) + 1)
    }
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]))
  }, [structure])
  const colors = useMemo(() => assignAtomColors(counts.map(([element]) => element)), [counts])
  return (
    <div className="element-legend">
      {counts.map(([element, count]) => {
        const slot = colors.get(element)
        const hex = slot ? (theme === 'dark' ? slot.dark : slot.light) : 'transparent'
        return (
          <span key={element} className="element-legend-item">
            <span className="element-legend-dot" style={{ background: hex }} />
            {element} × {count}
          </span>
        )
      })}
    </div>
  )
}

function CustomStructureCard({ structure, theme, onExit }: { structure: StructureData; theme: 'dark' | 'light'; onExit: () => void }) {
  const { t } = useLocale()
  const cell = structure.cell
  return (
    <div className="panel-body detail-body">
      <div className="detail-head">
        <h2 className="detail-title">{structure.name}</h2>
        <p className="detail-en">{structure.fileName}</p>
      </div>
      <div className="detail-actions">
        <button className="btn-primary" onClick={onExit}>
          {t('custom.back')}
        </button>
      </div>
      <section className="detail-section">
        <h3 className="eyebrow">{t('custom.info')}</h3>
        <table className="fact-table">
          <tbody>
            <tr>
              <th scope="row">{t('custom.space-group')}</th>
              <td>{structure.spaceGroup}{structure.spaceGroupNumber !== undefined ? ` (#${structure.spaceGroupNumber})` : ''}</td>
            </tr>
            <tr>
              <th scope="row">{t('custom.cell-a')}</th>
              <td>{cell.a.toFixed(4)} Å</td>
            </tr>
            <tr>
              <th scope="row">{t('custom.cell-b')}</th>
              <td>{cell.b.toFixed(4)} Å</td>
            </tr>
            <tr>
              <th scope="row">{t('custom.cell-c')}</th>
              <td>{cell.c.toFixed(4)} Å</td>
            </tr>
            <tr>
              <th scope="row">{t('custom.angles')}</th>
              <td>{cell.alpha.toFixed(2)}° / {cell.beta.toFixed(2)}° / {cell.gamma.toFixed(2)}°</td>
            </tr>
            <tr>
              <th scope="row">{t('custom.atoms')}</th>
              <td>{structure.atoms.length}</td>
            </tr>
            <tr>
              <th scope="row">{t('custom.parse-time')}</th>
              <td>{structure.parseMs} ms</td>
            </tr>
            {structure.source && (
              <tr>
                <th scope="row">{t('custom.source')}</th>
                <td>{structure.source}</td>
              </tr>
            )}
          </tbody>
        </table>
        <CustomElementLegend structure={structure} theme={theme} />
      </section>
      <div className="detail-notice">
        <p>{t('custom.notice')}</p>
      </div>
    </div>
  )
}

export function DetailPanel({
  entry,
  theme,
  activeHotspotId,
  onHotspotSelect,
  collapsed,
  onToggle,
  customStructure,
  onExitCustom,
  lessonDone,
  quizPassed,
  onStartLesson,
  onStartQuiz,
  note,
  onSaveNote,
}: DetailPanelProps) {
  const { t } = useLocale()
  if (collapsed) {
    return (
      <aside className="panel panel-detail panel-collapsed" aria-label={t('detail.title')}>
        <button className="panel-handle" onClick={onToggle} title={t('detail.expand')} aria-label={t('detail.expand')}>
          ‹
        </button>
      </aside>
    )
  }
  return (
    <aside className="panel panel-detail" aria-label={t('detail.title')}>
      <header className="panel-head">
        <span className="eyebrow">{t('detail.title')}</span>
        <button className="panel-fold" onClick={onToggle} title={t('detail.collapse')} aria-label={t('detail.collapse')}>
          ›
        </button>
      </header>
      {customStructure ? (
        <CustomStructureCard structure={customStructure} theme={theme} onExit={onExitCustom} />
      ) : entry ? (
        <div className="panel-body detail-body">
          <div className="detail-head">
            <h2 className="detail-title">{entry.name}</h2>
            <p className="detail-en">{entry.english}</p>
            {entry.aliases.length > 0 && <p className="detail-aliases">{entry.aliases.join(' · ')}</p>}
            {(lessonDone || quizPassed) && (
              <p className="detail-badges">
                {lessonDone && <i className="badge badge-lesson">{t('detail.badge.lesson-done')}</i>}
                {quizPassed && <i className="badge badge-quiz">{t('detail.badge.quiz-passed')}</i>}
              </p>
            )}
          </div>

          <section className="detail-section">
            <h3 className="eyebrow">{t('detail.facts')}</h3>
            <table className="fact-table">
              <tbody>
                {entry.facts.map((fact) => (
                  <tr key={fact.key}>
                    <th scope="row">{t(`fact.${fact.key}` as DictKey)}</th>
                    <td>{fact.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <ElementLegend entry={entry} theme={theme} />
          </section>

          <section className="detail-section">
            <p className="detail-summary">{entry.summary}</p>
          </section>

          <section className="detail-section">
            <div className="detail-actions">
              <button className="btn-primary" onClick={onStartLesson}>
                {t('detail.lesson')}
              </button>
              <button className="btn-primary" onClick={onStartQuiz}>
                {t('detail.quiz')}
              </button>
            </div>
          </section>

          <section className="detail-section">
            <h3 className="eyebrow">{t('detail.hotspots')}</h3>
            <ul className="hotspot-list">
              {entry.hotspots.map((hotspot) => {
                const active = hotspot.id === activeHotspotId
                return (
                  <li key={hotspot.id}>
                    <button
                      className={`hotspot-item tone-${hotspot.tone}${active ? ' active' : ''}`}
                      onClick={() => onHotspotSelect(hotspot)}
                      aria-pressed={active}
                      title={active ? t('detail.hotspot.close') : t('detail.hotspot.show')}
                    >
                      <span className="hotspot-item-dot" />
                      {hotspot.label}
                    </button>
                  </li>
                )
              })}
            </ul>
          </section>

          <section className="detail-section">
            <h3 className="eyebrow">{t('detail.trivia')}</h3>
            <p className="detail-trivia">{entry.trivia}</p>
          </section>

          <section className="detail-section">
            <h3 className="eyebrow">{t('detail.notes')}</h3>
            <NoteEditor entryId={entry.id} note={note} onSave={onSaveNote} />
          </section>

          {entry.visualNotice && (
            <section className="detail-section">
              <div className="detail-notice">
                <p>{entry.visualNotice}</p>
              </div>
            </section>
          )}

          <footer className="detail-source">{entry.source}</footer>
        </div>
      ) : (
        <div className="panel-body panel-empty">{t('detail.empty')}</div>
      )}
    </aside>
  )
}
