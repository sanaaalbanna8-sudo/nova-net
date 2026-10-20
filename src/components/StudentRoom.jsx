import { useEffect } from 'react'
import cases from '../data/cases.json'
import { ANSWER_KEY } from '../data/answerKey'
import { useMeeting } from '../hooks/useMeeting'
import { Shell, useElapsed } from './Shell'
import Briefing, { SLIDES } from './Briefing'
import CaseCard from './CaseCard'
import ResultsBoard from './ResultsBoard'

export default function StudentRoom({ identity, onLeave }) {
  const { state, status, send } = useMeeting(identity)
  const opening = !!state && typeof state.briefing === 'number'
  const item = state && !opening ? cases[state.caseIndex] : null
  const elapsed = useElapsed(state?.phase === 'discuss' ? state.discussStartedAt : null)

  useEffect(() => {
    document.title = `${identity.name} | أي شبكة؟`
    return () => {
      document.title = 'الاجتماع الطارئ | أي شبكة؟'
    }
  }, [identity.name])

  if (!state || (opening ? false : !item)) {
    return (
      <Shell status={status} onLeave={() => onLeave('')}>
        <p className="panel p-8 text-center text-mist">جارٍ فتح قاعة الاجتماع… إذا اللوحة لسا ما انفتحت، استني المعلمة تدخل.</p>
      </Shell>
    )
  }

  const progress = opening ? (state.briefing + 1) / SLIDES.length : (state.caseIndex + 1) / cases.length

  return (
    <Shell status={status} onLeave={() => onLeave('')} leaveLabel="تغيير الاسم" stage clock={elapsed} progress={progress}>
      <div className="board is-opening">
        <div className="board-main" style={{ gridColumn: '1 / -1' }}>
          {opening ? (
            <Briefing step={state.briefing} />
          ) : state.phase === 'discuss' ? (
            <>
              <CaseCard item={item} mode="story" />
              <CaseCard item={item} mode="choices" />
            </>
          ) : state.phase === 'voting' ? (
            <>
              <CaseCard item={item} mode="story" />
              <CaseCard item={item} mode="choices" myVote={state.myVote} votingOpen onVote={(choice) => send({ type: 'vote', choice })} />
            </>
          ) : (
            <>
              <CaseCard item={item} mode="story" />
              <ResultsBoard item={item} phase="results" summary={state.summary} answer={ANSWER_KEY[item.id]} />
            </>
          )}
          <div className="board-dock">
            <span className="text-sm font-extrabold text-ink">{identity.name}</span>
            <span className="text-xs font-bold text-mist">
              {opening ? 'تابعي الشريحة مع المعلمة' : state.phase === 'voting' ? 'اختاري النوع الأنسب' : state.phase === 'results' ? 'شوفي الإجابة الصحيحة والسبب' : 'النقاش مفتوح'}
            </span>
            {state.myVote && state.phase === 'voting' && <span className="chip border-sea/30 bg-sea/10 text-sea">صوتك {state.myVote}</span>}
          </div>
        </div>
      </div>
    </Shell>
  )
}
