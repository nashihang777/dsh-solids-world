import { useEffect, useState } from 'react'
import { useLocale } from '../i18n/LocaleProvider'
import type { AtlasEntry, LessonStep } from '../data/types'

interface LessonModalProps {
  entry: AtlasEntry
  onClose: () => void
  onStepChange: (step: LessonStep | null) => void
  onFinish: () => void
  onQuiz: () => void
}

export function LessonModal({ entry, onClose, onStepChange, onFinish, onQuiz }: LessonModalProps) {
  const { t } = useLocale()
  const steps = entry.guide.lesson
  const [index, setIndex] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    onStepChange(done ? null : steps[index] ?? null)
    return () => onStepChange(null)
  }, [index, done, steps, onStepChange])

  useEffect(() => {
    if (done) onFinish()
  }, [done, onFinish])

  return (
    <div className="modal-overlay" onClick={onClose}>
      <aside
        className="modal-panel lesson-panel"
        role="dialog"
        aria-label={t('lesson.title')}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="lesson-head">
          <span className="eyebrow">{t('lesson.title')}</span>
          <span className="lesson-entry-name">{entry.name}</span>
          <button className="modal-close" onClick={onClose} aria-label={t('lesson.close')}>
            ×
          </button>
        </header>
        {done ? (
          <div className="lesson-body lesson-done">
            <h3>{t('lesson.done.title')}</h3>
            <p>{t('lesson.done.body')}</p>
            <div className="lesson-done-actions">
              <button className="btn-primary" onClick={onQuiz}>
                {t('lesson.quiz')}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="lesson-progress">{t('lesson.progress', { i: index + 1, n: steps.length })}</div>
            <div className="lesson-steps" role="tablist">
              {steps.map((step, i) => (
                <span key={i} className={`lesson-step-dot${i === index ? ' current' : ''}${i < index ? ' visited' : ''}`} />
              ))}
            </div>
            <div className="lesson-body">
              <h3>{steps[index]?.title}</h3>
              <p>{steps[index]?.body}</p>
            </div>
            <footer className="lesson-nav">
              <button disabled={index === 0} onClick={() => setIndex((prev) => Math.max(prev - 1, 0))}>
                {t('lesson.prev')}
              </button>
              {index < steps.length - 1 ? (
                <button className="btn-primary" onClick={() => setIndex((prev) => prev + 1)}>
                  {t('lesson.next')}
                </button>
              ) : (
                <button className="btn-primary" onClick={() => setDone(true)}>
                  {t('lesson.finish')}
                </button>
              )}
            </footer>
          </>
        )}
      </aside>
    </div>
  )
}
