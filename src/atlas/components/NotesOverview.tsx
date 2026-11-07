import { useState } from 'react'
import { useLocale } from '../i18n/LocaleProvider'
import type { Note } from '../../electron/notes'

interface NotesOverviewProps {
  notes: Record<string, Note>
  onClear: () => void
  onExport: () => void
  onClose: () => void
}

export function NotesOverview({ notes, onClear, onExport, onClose }: NotesOverviewProps) {
  const { t, entries } = useLocale()
  const [confirming, setConfirming] = useState(false)
  const withNotes = entries.filter((entry) => notes[entry.id])

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel notes-panel" role="dialog" aria-label={t('notes.title')} onClick={(event) => event.stopPropagation()}>
        <header className="notes-head">
          <span className="eyebrow">{t('notes.title')}</span>
          <button className="modal-close" onClick={onClose} aria-label={t('notes.close')}>
            ×
          </button>
        </header>
        <div className="notes-body">
          {withNotes.length === 0 ? (
            <p className="notes-empty">{t('notes.empty')}</p>
          ) : (
            <ul className="notes-list">
              {withNotes.map((entry) => {
                const note = notes[entry.id]
                if (!note) return null
                return (
                  <li key={entry.id} className="note-item">
                    <h4 className="note-item-name">{entry.name}</h4>
                    <p className="note-item-text">{note.text}</p>
                    <span className="note-item-time">
                      {t('notes.updated', { time: new Date(note.at).toLocaleString() })}
                    </span>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
        <footer className="notes-foot">
          <button onClick={onExport} disabled={withNotes.length === 0}>
            {t('notes.export')}
          </button>
          {confirming ? (
            <button className="btn-danger" onClick={() => { setConfirming(false); onClear() }}>
              {t('notes.clear-confirm')}
            </button>
          ) : (
            <button className="btn-danger" disabled={withNotes.length === 0} onClick={() => setConfirming(true)}>
              {t('notes.clear')}
            </button>
          )}
        </footer>
      </div>
    </div>
  )
}
