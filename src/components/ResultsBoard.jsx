import { CHOICE_STYLE } from '../config'
import { summarize } from '../lib/meeting'
import { useCountdown } from './Shell'

export default function ResultsBoard({ item, phase, votes, endsAt, answer = null, summary = null }) {
  const live = summary || summarize(votes || {})
  const { counts, total, percents } = live
  const clock = useCountdown(phase === 'voting' ? endsAt : null)
  const bestTitle = answer?.best ? item.options.find((option) => option.key === answer.best)?.title : ''

  return (
    <section className="case-choices">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-extrabold text-gold2">{phase === 'voting' ? 'باب التصويت' : 'نتيجة الحالة'}</p>
          <h3 className="font-display text-2xl text-ink">{item.question}</h3>
        </div>
        <p className="text-sm text-mist">
          {phase === 'voting' ? (
            <>
              باقي <span className="font-extrabold text-ink">{clock?.label || '00'}</span> ث · صوّت {total}
            </>
          ) : (
            <>
              صوّت <span className="font-extrabold text-ink">{total}</span>
            </>
          )}
        </p>
      </div>
      {answer?.best && (
        <p className="vote-answer">
          الأصح: {answer.best}
          {bestTitle ? `. ${bestTitle}` : ''}
          {answer.why ? ` — ${answer.why}` : ''}
        </p>
      )}
      <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[140px_minmax(0,1fr)] lg:items-center">
        <div
          className="mx-auto grid h-32 w-32 place-items-center rounded-full"
          style={{
            background: total
              ? `conic-gradient(${CHOICE_STYLE.A.bar} 0 ${percents.A}%, ${CHOICE_STYLE.B.bar} ${percents.A}% ${percents.A + percents.B}%, ${CHOICE_STYLE.C.bar} ${percents.A + percents.B}% 100%)`
              : '#e7eef8',
          }}
        >
          <div className="grid h-20 w-20 place-items-center rounded-full bg-white text-center">
            <span className="text-xs text-faint">الأصوات</span>
            <span className="text-2xl font-extrabold text-ink">{total}</span>
          </div>
        </div>
        <div className="space-y-3">
          {item.options.map((option) => (
            <div key={option.key}>
              <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                <span className={`font-bold ${CHOICE_STYLE[option.key].text}`}>
                  {option.key}. {option.title}
                  {answer?.best === option.key ? ' · الأصح' : ''}
                </span>
                <span className="font-extrabold text-ink">
                  {counts[option.key]} · {percents[option.key]}٪
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-panel2">
                <div className="h-full rounded-full" style={{ width: `${percents[option.key]}%`, background: CHOICE_STYLE[option.key].bar }} />
              </div>
              <p className="mt-1 text-xs leading-6 text-mist">{option.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
