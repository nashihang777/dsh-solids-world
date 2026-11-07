import { useEffect, useState } from 'react'
import { useLocale } from '../i18n/LocaleProvider'
import type { AtlasEntry } from '../data/types'

interface QuizModalProps {
  entry: AtlasEntry
  onClose: () => void
  onFinish: (passed: boolean) => void
}

export function QuizModal({ entry, onClose, onFinish }: QuizModalProps) {
  const { t } = useLocale()
  const questions = entry.guide.quiz
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Array<number | null>>(() => questions.map(() => null))
  const [finished, setFinished] = useState(false)

  const question = questions[index]
  const picked = answers[index]
  const score = answers.reduce<number>((sum, answer, i) => (answer === questions[i]?.answer ? sum + 1 : sum), 0)
  const passed = score === questions.length

  useEffect(() => {
    if (finished) onFinish(passed)
  }, [finished, passed, onFinish])

  const pick = (option: number) => {
    if (picked !== null) return
    setAnswers((prev) => {
      const next = [...prev]
      next[index] = option
      return next
    })
  }

  return (
    <div className="modal-overlay" onClick={finished ? onClose : undefined}>
      <div
        className="modal-panel quiz-panel"
        role="dialog"
        aria-label={t('quiz.title')}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="quiz-head">
          <span className="eyebrow">{t('quiz.title')}</span>
          <span className="quiz-entry-name">{entry.name}</span>
          <button className="modal-close" onClick={onClose} aria-label={t('quiz.close')}>
            ×
          </button>
        </header>
        {finished ? (
          <div className="quiz-body quiz-result">
            <h3>{t('quiz.score', { i: score, n: questions.length })}</h3>
            <p className={passed ? 'quiz-passed' : 'quiz-partial'}>{passed ? t('quiz.passed') : t('quiz.partial')}</p>
            <div className="quiz-result-actions">
              <button
                onClick={() => {
                  setIndex(0)
                  setAnswers(questions.map(() => null))
                  setFinished(false)
                }}
              >
                {t('quiz.retry')}
              </button>
              <button className="btn-primary" onClick={onClose}>
                {t('quiz.close')}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="quiz-progress">{t('quiz.progress', { i: index + 1, n: questions.length })}</div>
            <div className="quiz-body">
              <h3>{question.question}</h3>
              <ul className="quiz-options">
                {question.options.map((option, i) => {
                  const state =
                    picked === null ? 'idle' : i === question.answer ? 'correct' : i === picked ? 'wrong' : 'idle'
                  return (
                    <li key={i}>
                      <button
                        className={`quiz-option ${state}`}
                        disabled={picked !== null}
                        onClick={() => pick(i)}
                      >
                        <span className="quiz-option-mark">{['A', 'B', 'C'][i]}</span>
                        {option}
                      </button>
                    </li>
                  )
                })}
              </ul>
              {picked !== null && (
                <div className={`quiz-judge ${picked === question.answer ? 'correct' : 'wrong'}`}>
                  <strong>{picked === question.answer ? t('quiz.correct') : t('quiz.wrong')}</strong>
                  {picked !== question.answer && (
                    <p>
                      {t('quiz.explain-label')}：{question.explain}
                    </p>
                  )}
                </div>
              )}
            </div>
            <footer className="quiz-nav">
              {picked !== null &&
                (index < questions.length - 1 ? (
                  <button className="btn-primary" onClick={() => setIndex((prev) => prev + 1)}>
                    {t('quiz.next')}
                  </button>
                ) : (
                  <button className="btn-primary" onClick={() => setFinished(true)}>
                    {t('quiz.view-result')}
                  </button>
                ))}
            </footer>
          </>
        )}
      </div>
    </div>
  )
}
