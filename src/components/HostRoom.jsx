import { useEffect } from 'react'
import cases from '../data/cases.json'
import { ANSWER_KEY } from '../data/answerKey'
import { PHASE_LABEL, VOTE_SECONDS } from '../config'
import { seatHref } from '../paths'
import { useMeeting } from '../hooks/useMeeting'
import { armVoteSound, playVoteOpen, playVoteReveal } from '../lib/voteSound'
import { Shell, useElapsed } from './Shell'
import Briefing, { SLIDES } from './Briefing'
import CaseCard from './CaseCard'
import ResultsBoard from './ResultsBoard'
import Roster from './Roster'

export default function HostRoom({ identity, onLeave }) {
  const { state, status, send, online } = useMeeting(identity)
  const opening = !!state && typeof state.briefing === 'number'
  const item = state && !opening ? cases[state.caseIndex] : null
  const elapsed = useElapsed(state?.discussStartedAt)

  useEffect(() => {
    document.title = 'لوحة الرئاسة | أي شبكة؟'
    return () => {
      document.title = 'الاجتماع الطارئ | أي شبكة؟'
    }
  }, [])

  useEffect(() => {
    if (state?.phase === 'results') playVoteReveal()
  }, [state?.phase, state?.caseIndex])

  if (!state || (opening ? false : !item)) {
    return (
      <Shell status={status} onLeave={() => onLeave('')} leaveLabel="إغلاق اللوحة">
        <p className="panel p-8 text-center text-mist">جارٍ فتح قاعة الاجتماع…</p>
      </Shell>
    )
  }

  const progress = opening ? (state.briefing + 1) / SLIDES.length : (state.caseIndex + 1) / cases.length
  const joinLink = seatHref(window.location.origin, 'join')

  return (
    <Shell status={status} onLeave={() => onLeave('')} leaveLabel="إغلاق اللوحة" stage clock={elapsed} progress={progress}>
      <div className="board">
        <Roster people={state.people} online={online} votes={state.votes} />
        <div className="board-main">
          {opening ? (
            <Briefing step={state.briefing} />
          ) : (
            <>
              <CaseCard item={item} mode="story" />
              {state.phase === 'discuss' ? (
                <CaseCard item={item} mode="choices" />
              ) : (
                <ResultsBoard
                  item={item}
                  phase={state.phase}
                  votes={state.votes}
                  endsAt={state.voteEndsAt}
                  answer={state.phase === 'results' ? ANSWER_KEY[item.id] : null}
                />
              )}
            </>
          )}
          <div className="board-dock">
            {opening ? (
              <>
                <button className="btn-ghost" disabled={state.briefing === 0} onClick={() => send({ type: 'brief', step: state.briefing - 1 })}>
                  الشريحة السابقة
                </button>
                {state.briefing < SLIDES.length - 1 ? (
                  <button className="btn-gold" onClick={() => send({ type: 'brief', step: state.briefing + 1 })}>
                    {SLIDES[state.briefing + 1].title}
                  </button>
                ) : (
                  <>
                    <button className="btn-gold" onClick={() => send({ type: 'cases-start' })}>
                      ابدئي الحالات
                    </button>
                    <button className="btn-sea" onClick={() => send({ type: 'jump', index: 15 })}>
                      أسئلة أعمق
                    </button>
                  </>
                )}
              </>
            ) : (
              <>
                <button
                  className="btn-gold"
                  disabled={state.phase === 'voting'}
                  onClick={() => {
                    armVoteSound()
                    playVoteOpen()
                    send({ type: 'open' })
                  }}
                >
                  فتح التصويت · {VOTE_SECONDS} ث
                </button>
                <button className="btn-sea" disabled={state.phase !== 'voting'} onClick={() => send({ type: 'close' })}>
                  إغلاق وعرض النتائج
                  {state.phase === 'voting' ? ` (${Object.keys(state.votes || {}).length})` : ''}
                </button>
                <button className="btn-ghost" disabled={state.caseIndex === 0} onClick={() => send({ type: 'prev' })}>
                  السابق
                </button>
                <button className="btn-ghost" disabled={state.caseIndex >= cases.length - 1} onClick={() => send({ type: 'next' })}>
                  التالي
                </button>
                <button
                  className="btn-ghost"
                  disabled={state.phase === 'voting'}
                  onClick={() => send({ type: 'jump', index: state.caseIndex >= 15 ? 0 : 15 })}
                >
                  {state.caseIndex >= 15 ? 'الحالات الأولى' : 'أسئلة أعمق'}
                </button>
                <span className="text-xs font-bold text-mist">{PHASE_LABEL[state.phase]}</span>
              </>
            )}
            <button
              className="btn-ghost"
              onClick={() => navigator.clipboard?.writeText(joinLink)}
            >
              انسخي رابط الطالبات
            </button>
          </div>
        </div>
      </div>
    </Shell>
  )
}
