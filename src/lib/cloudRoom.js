import { apply, createState, summarize } from './meeting'

const CONFIG = {
  apiKey: 'AIzaSyDqo-AyryLhYPAIBrPy-O15S6W_9HkRbPY',
  authDomain: 'presentation-e045c.firebaseapp.com',
  databaseURL: 'https://presentation-e045c-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'presentation-e045c',
}

const ROOT = 'novaNet'

function database() {
  const firebase = window.firebase
  if (!firebase?.initializeApp || !firebase?.database) return null
  if (!firebase.apps?.length) firebase.initializeApp(CONFIG)
  return firebase.database()
}

function screenOf(state) {
  return typeof state.briefing === 'number' ? 'brief' : 'cases'
}

function defang(value) {
  if (Array.isArray(value)) return value.map(defang)
  if (!value || typeof value !== 'object') return value
  const out = {}
  for (const [key, item] of Object.entries(value)) {
    out[/^\d+$/.test(key) ? `k${key}` : key] = defang(item)
  }
  return out
}

function rehydrate(value) {
  if (Array.isArray(value)) {
    const objects = value.filter((item) => item && typeof item === 'object')
    if (objects.length && objects.every((item) => !item.kind)) {
      const out = {}
      value.forEach((item, index) => {
        if (item != null) out[String(index)] = rehydrate(item)
      })
      return out
    }
    return value.map(rehydrate)
  }
  if (!value || typeof value !== 'object') return value
  const out = {}
  for (const [key, item] of Object.entries(value)) {
    const plain = /^k(\d+)$/.exec(key)
    out[plain ? plain[1] : key] = rehydrate(item)
  }
  return out
}

function asMap(value) {
  const data = rehydrate(value)
  if (!data || typeof data !== 'object' || Array.isArray(data)) return {}
  return data
}

function pack(state) {
  return defang(JSON.parse(JSON.stringify({ ...state, screen: screenOf(state) })))
}

function normalize(raw) {
  const data = rehydrate(raw)
  if (!data || typeof data.rev !== 'number') return null
  let briefing = typeof data.briefing === 'number' ? data.briefing : 0
  if (data.screen === 'cases') briefing = null
  return {
    ...createState(),
    ...data,
    votes: asMap(data.votes),
    history: asMap(data.history),
    people: asMap(data.people),
    ledger: Array.isArray(data.ledger) ? data.ledger : [],
    voteEndsAt: typeof data.voteEndsAt === 'number' ? data.voteEndsAt : null,
    briefing,
  }
}

function project(full, identity) {
  if (!full) return null
  if (identity.role === 'host') return full
  const id = String(identity.studentId || '')
  return {
    rev: full.rev,
    caseIndex: full.caseIndex,
    phase: full.phase,
    briefing: full.briefing,
    voteEndsAt: full.voteEndsAt,
    discussStartedAt: full.discussStartedAt,
    updatedAt: full.updatedAt,
    myVote: full.votes?.[id] || null,
    summary: full.phase === 'results' ? summarize(full.votes || {}) : null,
    present: Object.keys(full.people || {}).length,
  }
}

export function openCloud(identity, caseCount) {
  const db = database()
  if (!db) return Promise.resolve(null)

  const stateRef = db.ref(`${ROOT}/state`)
  const presenceRoot = db.ref(`${ROOT}/presence`)
  const listeners = []
  let stateHandler = null
  let presenceHandler = null
  let latestState
  let sawState = false
  let latestPresence = []
  let sawPresence = false

  const session = {
    set onState(fn) {
      stateHandler = fn
      if (sawState) fn?.(latestState)
    },
    set onPresence(fn) {
      presenceHandler = fn
      if (sawPresence) fn?.(latestPresence)
    },
    send(action) {
      const mine = identity
      let nextAction = action
      if (mine.role !== 'host') {
        if (!['vote', 'arrive'].includes(action.type)) return Promise.resolve()
        nextAction = { ...action, studentId: mine.studentId, name: mine.name }
      }
      return stateRef.transaction((current) => {
        const base = normalize(current)
        if (!base) {
          if (mine.role !== 'host') return
          const created = createState()
          const applied = apply(created, nextAction, caseCount)
          return pack(applied === created ? created : applied)
        }
        const applied = apply(base, nextAction, caseCount)
        if (applied === base) return
        return pack(applied)
      })
    },
    close() {
      for (const stop of listeners) stop()
      listeners.length = 0
    },
  }

  return new Promise((resolve) => {
    let settled = false
    const finish = (value) => {
      if (settled) return
      settled = true
      resolve(value)
    }

    const onState = (snap) => {
      const full = normalize(snap.val())
      sawState = true
      latestState = project(full, identity)
      stateHandler?.(latestState)
      if (!settled) finish(session)
    }
    stateRef.on('value', onState, () => {
      session.close()
      finish(null)
    })
    listeners.push(() => stateRef.off('value', onState))

    const onPresence = (snap) => {
      const val = snap.val() || {}
      const rows = Object.entries(val)
        .map(([id, item]) => ({ id, name: item?.name || '' }))
        .filter((item) => item.name)
        .sort((a, b) => a.name.localeCompare(b.name, 'ar'))
      sawPresence = true
      latestPresence = rows
      presenceHandler?.(rows)
    }
    presenceRoot.on('value', onPresence)
    listeners.push(() => presenceRoot.off('value', onPresence))

    if (identity.role === 'student' && identity.studentId) {
      const tabId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
      const presenceRef = db.ref(`${ROOT}/presence/${identity.studentId}`)
      presenceRef.onDisconnect().remove()
      presenceRef.set({ name: identity.name, at: Date.now(), tabId })
      listeners.push(() => {
        presenceRef.transaction((current) => {
          if (current?.tabId === tabId) return null
          return
        })
      })
    }

    setTimeout(() => {
      if (settled) return
      session.close()
      finish(null)
    }, 20000)
  })
}
