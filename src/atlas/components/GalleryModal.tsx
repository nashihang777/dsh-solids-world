import type { CSSProperties } from 'react'
import { useLocale } from '../i18n/LocaleProvider'
import type { AtlasEntry, FieldKey } from '../data/types'

const FIELD_ORDER: FieldKey[] = ['crystal', 'atomic', 'symmetry', 'dynamics']

interface GalleryModalProps {
  lessonDone: string[]
  quizPassed: string[]
  onSelect: (id: string) => void
  onClose: () => void
  onOpenNotes: () => void
}

export function GalleryModal({ lessonDone, quizPassed, onSelect, onClose, onOpenNotes }: GalleryModalProps) {
  const { t, entries } = useLocale()
  const groups = FIELD_ORDER.map((field) => ({
    field,
    entries: entries.filter((entry) => entry.field === field),
  })).filter((group) => group.entries.length > 0)

  return (
    <div className="modal-overlay modal-gallery" onClick={onClose}>
      <div className="modal-panel gallery-panel" role="dialog" aria-label={t('gallery.title')} onClick={(event) => event.stopPropagation()}>
        <header className="gallery-head">
          <span className="eyebrow">{t('gallery.title')}</span>
          <span className="gallery-hint">{t('gallery.hint')}</span>
          <button onClick={onOpenNotes}>{t('gallery.notes')}</button>
          <button className="modal-close" onClick={onClose} aria-label={t('help.close')}>
            ×
          </button>
        </header>
        <div className="gallery-body">
          {groups.map((group) => (
            <section key={group.field} className="gallery-group">
              <h3 className="gallery-group-title">{t(`field.${group.field}` as `field.${FieldKey}`)}</h3>
              <div className="gallery-grid">
                {group.entries.map((entry) => (
                  <button
                    key={entry.id}
                    className="gallery-card"
                    style={{ '--card-accent': entry.accent } as CSSProperties}
                    onClick={() => onSelect(entry.id)}
                  >
                    <span className="gallery-card-disc" />
                    <span className="gallery-card-name">{entry.name}</span>
                    <span className="gallery-card-en">{entry.english}</span>
                    <span className="gallery-card-badges">
                      {lessonDone.includes(entry.id) && <i className="badge badge-lesson">{t('gallery.badge-lesson')}</i>}
                      {quizPassed.includes(entry.id) && <i className="badge badge-quiz">{t('gallery.badge-quiz')}</i>}
                    </span>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
