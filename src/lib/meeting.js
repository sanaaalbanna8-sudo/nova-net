import { VOTE_SECONDS } from '../config'

export function createState() {
  return {
    rev: 1,
    caseIndex: 0,
    phase: 'discuss',
    briefing: 0,
    votes: {},
    voteEndsAt: null,
    history: {},
    people: {},
    ledger: [],
    discussStartedAt: Date.now(),
    updatedAt: Date.now(),
  }
}

function touch(state) {
  return { ...state, rev: state.rev + 1, updatedAt: Date.now() }
}

function snapshot(state) {
  return {
    phase: state.phase,
    votes: { ...state.votes },
    voteEndsAt: state.voteEndsAt || null,
  }
}

export function summarize(votes) {
  const counts = { A: 0, B: 0, C: 0 }
  for (const choice of Object.values(votes || {})) {
    if (counts[choice] !== undefined) counts[choice] += 1
  }
  const total = counts.A + counts.B + counts.C
  const percents = { A: 0, B: 0, C: 0 }
  if (total) {
    ;['A', 'B', 'C'].forEach((key) => {
      percents[key] = Math.round((counts[key] / total) * 100)
    })
    const drift = 100 - (percents.A + percents.B + percents.C)
    if (drift) {
      const top = ['A', 'B', 'C'].sort((a, b) => counts[b] - counts[a])[0]
      percents[top] += drift
    }
  }
  return { counts, total, percents }
}

export function apply(state, action, caseCount) {
  switch (action.type) {
    case 'arrive': {
      const id = String(action.studentId || '')
      const name = String(action.name || '').trim().slice(0, 40)
      if (!id || name.length < 2) return state
      if (state.people?.[id] === name) return state
      return touch({ ...state, people: { ...(state.people || {}), [id]: name } })
    }
    case 'brief': {
      const step = action.step
      if (!Number.isInteger(step) || step < 0 || step > 2) return state
      if (step === state.briefing) return state
      return touch({
        ...state,
        briefing: step,
        phase: 'discuss',
        votes: {},
        voteEndsAt: null,
        discussStartedAt: Date.now(),
      })
    }
    case 'cases-start': {
      if (state.briefing == null && state.caseIndex === 0 && state.phase === 'discuss' && !Object.keys(state.votes || {}).length) {
        return state
      }
      return touch({
        ...state,
        briefing: null,
        caseIndex: 0,
        phase: 'discuss',
        votes: {},
        voteEndsAt: null,
        history: {},
        ledger: [],
        discussStartedAt: Date.now(),
      })
    }
    case 'open': {
      if (state.phase === 'voting' || typeof state.briefing === 'number') return state
      return touch({ ...state, phase: 'voting', voteEndsAt: Date.now() + VOTE_SECONDS * 1000 })
    }
    case 'close': {
      if (state.phase !== 'voting') return state
      return touch({ ...state, phase: 'results', voteEndsAt: null })
    }
    case 'vote': {
      if (state.phase !== 'voting') return state
      const id = String(action.studentId || '')
      const name = String(action.name || '').trim().slice(0, 40)
      if (!id || !['A', 'B', 'C'].includes(action.choice)) return state
      const people = { ...(state.people || {}) }
      if (!people[id] && name.length >= 2) people[id] = name
      if (!people[id]) return state
      if (state.votes?.[id] === action.choice && state.people?.[id] === people[id]) return state
      const caseId = state.caseIndex + 1
      const started = (state.voteEndsAt || Date.now()) - VOTE_SECONDS * 1000
      const ms = Math.max(0, Date.now() - started)
      const ledger = (state.ledger || []).filter((item) => !(item.kind === 'vote' && item.studentId === id && item.caseId === caseId))
      ledger.push({ kind: 'vote', studentId: id, name: people[id], caseId, choice: action.choice, ms, at: Date.now() })
      return touch({ ...state, people, ledger, votes: { ...(state.votes || {}), [id]: action.choice } })
    }
    case 'jump': {
      const index = action.index
      if (!Number.isInteger(index) || index < 0 || index >= caseCount) return state
      if (state.phase === 'voting') return state
      if (index === state.caseIndex && state.briefing == null) return state
      const history = { ...(state.history || {}) }
      if (state.briefing == null) history[state.caseIndex] = snapshot(state)
      const saved = history[index]
      return touch({
        ...state,
        history,
        briefing: null,
        caseIndex: index,
        phase: saved?.phase || 'discuss',
        votes: saved?.votes ? { ...saved.votes } : {},
        voteEndsAt: saved?.phase === 'voting' ? saved.voteEndsAt : null,
        discussStartedAt: Date.now(),
      })
    }
    case 'next':
    case 'prev': {
      if (typeof state.briefing === 'number') return state
      const index = state.caseIndex + (action.type === 'next' ? 1 : -1)
      if (index < 0 || index >= caseCount) return state
      const history = { ...(state.history || {}), [state.caseIndex]: snapshot(state) }
      const saved = history[index]
      return touch({
        ...state,
        history,
        caseIndex: index,
        phase: saved?.phase || 'discuss',
        votes: saved?.votes ? { ...saved.votes } : {},
        voteEndsAt: saved?.phase === 'voting' ? saved.voteEndsAt : null,
        discussStartedAt: Date.now(),
      })
    }
    default:
      return state
  }
}
