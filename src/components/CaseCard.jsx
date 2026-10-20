import { useEffect, useState } from 'react'
import { CHOICE_STYLE } from '../config'

function splitVote(value) {
  return String(value || '').split('').filter(Boolean)
}

export default function CaseCard({ item, mode = 'full', myVote = null, votingOpen = false, onVote = null }) {
  const showStory = mode !== 'choices'
  const showChoices = mode !== 'story'
  const need = item.pick || 1
  const [picked, setPicked] = useState(() => splitVote(myVote))

  useEffect(() => {
    setPicked(splitVote(myVote))
  }, [myVote, item.id])

  return (
    <>
      {showStory && (
        <section className="case-story">
          <div className="case-kicker">
            <span className="chip border-gold/40 bg-[#fff8ea] text-gold2">حالة {item.id}</span>
            <span className="chip border-sea/30 bg-sea/10 text-sea">{item.code}</span>
            <span className="text-xs font-bold text-faint">{item.minutes} د نقاش</span>
          </div>
          <h2>{item.title}</h2>
          {item.paragraphs.map((paragraph) => (
            <p key={paragraph} className="case-lead">
              {paragraph}
            </p>
          ))}
          <div className="mt-1 flex flex-wrap gap-2">
            {item.facts.map((fact) => (
              <span key={fact.label} className="chip border-line bg-white text-ink">
                {fact.label}: {fact.value}
              </span>
            ))}
          </div>
        </section>
      )}
      {showChoices && need > 1 && (
        <section className="case-choices">
          <div className="flex items-end justify-between gap-3">
            <h3>{item.question}</h3>
            <p className="text-sm font-extrabold text-sea">{picked.length} / {need}</p>
          </div>
          <div className="pick-slots" aria-hidden="true">
            {Array.from({ length: need }, (_, index) => (
              <i key={index} className={index < picked.length ? 'is-on' : ''} />
            ))}
          </div>
          <div className="choice-grid is-pick">
            {item.options.map((option) => {
              const style = CHOICE_STYLE[option.key] || CHOICE_STYLE.A
              const selected = picked.includes(option.key)
              const toggle = () => {
                if (!votingOpen || !onVote) return
                const next = selected ? picked.filter((key) => key !== option.key) : picked.length >= need ? picked : [...picked, option.key].sort()
                if (next === picked) return
                setPicked(next)
                if (next.length === need) onVote(next.join(''))
                else if (myVote) onVote('')
              }
              const body = (
                <>
                  <span className={`text-sm font-black ${style.text}`}>{selected ? 'مثبتة' : 'اضغطي'}</span>
                  <strong>{option.title}</strong>
                  <p>{option.text}</p>
                </>
              )
              if (!onVote) {
                return (
                  <div key={option.key} className={`choice-card ${selected ? style.ring : ''}`} style={{ '--tone': style.bar }}>
                    {body}
                  </div>
                )
              }
              return (
                <button key={option.key} type="button" className={`choice-card ${selected ? `is-picked ${style.ring}` : ''}`} style={{ '--tone': style.bar }} disabled={!votingOpen} onClick={toggle}>
                  {body}
                </button>
              )
            })}
          </div>
        </section>
      )}
      {showChoices && need === 1 && (
        <section className="case-choices">
          <h3>{item.question}</h3>
          <div className="choice-grid">
            {item.options.map((option) => {
              const style = CHOICE_STYLE[option.key]
              const selected = myVote === option.key
              const className = `choice-card ${selected ? style.ring : ''}`
              const body = (
                <>
                  <span className={`text-sm font-black ${style.text}`}>
                    {option.key}
                    {selected ? ' · صوتك' : ''}
                  </span>
                  <strong>{option.title}</strong>
                  <p>{option.text}</p>
                </>
              )
              if (!onVote) {
                return (
                  <div key={option.key} className={className} style={{ '--tone': style.bar }}>
                    {body}
                  </div>
                )
              }
              return (
                <button
                  key={option.key}
                  className={className}
                  style={{ '--tone': style.bar }}
                  disabled={!votingOpen}
                  onClick={() => onVote(option.key)}
                >
                  {body}
                </button>
              )
            })}
          </div>
        </section>
      )}
    </>
  )
}
