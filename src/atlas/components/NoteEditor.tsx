import { useEffect, useRef, useState } from 'react'
import { useLocale } from '../i18n/LocaleProvider'
import type { Note } from '../../electron/notes'

export const NOTE_DEBOUNCE_MS = 300

interface NoteEditorProps {
  entryId: string
  note: Note | undefined
  onSave: (entryId: string, text: string) => void
}

export function NoteEditor({ entryId, note, onSave }: NoteEditorProps) {
  const { t } = useLocale()
  const [text, setText] = useState(note?.text ?? '')
  const timer = useRef<number | null>(null)
  const latest = useRef(onSave)
  latest.current = onSave

  useEffect(() => {
    setText(note?.text ?? '')
    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current)
    }
  }, [entryId, note])

  const scheduleSave = (value: string) => {
    setText(value)
    if (timer.current !== null) window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      latest.current(entryId, value)
      timer.current = null
    }, NOTE_DEBOUNCE_MS)
  }

  return (
    <textarea
      className="note-editor"
      placeholder={t('detail.notes.placeholder')}
      value={text}
      onChange={(event) => scheduleSave(event.target.value)}
      rows={5}
    />
  )
}
