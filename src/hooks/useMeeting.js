import { useEffect, useRef, useState } from 'react'
import cases from '../data/cases.json'
import { openCloud } from '../lib/cloudRoom'
import { scheduleSheet } from '../lib/sheetSync'

export function useMeeting(identity) {
  const [state, setState] = useState(null)
  const [online, setOnline] = useState([])
  const [status, setStatus] = useState('connecting')
  const cloudRef = useRef(null)
  const modeRef = useRef('connecting')
  const identityRef = useRef(identity)
  identityRef.current = identity

  useEffect(() => {
    let stopped = false
    let retry
    let clouding = false

    const enterCloud = () => {
      if (stopped || clouding || modeRef.current === 'cloud') return
      clouding = true
      openCloud(identityRef.current, cases.length).then((session) => {
        if (stopped) {
          session?.close()
          return
        }
        if (!session) {
          clouding = false
          setStatus('connecting')
          retry = setTimeout(enterCloud, 1500)
          return
        }
        modeRef.current = 'cloud'
        cloudRef.current = session
        session.onState = (next) => {
          if (!stopped) setState(next)
        }
        session.onPresence = (rows) => {
          if (!stopped) setOnline(rows)
        }
        setStatus('live')
        if (identityRef.current.role === 'host') session.send({ type: 'arrive' })
        else session.send({ type: 'arrive', name: identityRef.current.name })
      })
    }

    enterCloud()

    return () => {
      stopped = true
      clearTimeout(retry)
      cloudRef.current?.close()
    }
  }, [identity.role, identity.studentId, identity.name])

  useEffect(() => {
    if (identity.role !== 'host' || status !== 'live' || modeRef.current !== 'cloud') return undefined
    if (state?.phase !== 'voting' || !state.voteEndsAt) return undefined
    const wait = Math.max(0, state.voteEndsAt - Date.now() + 120)
    const id = setTimeout(() => cloudRef.current?.send({ type: 'close' }), wait)
    return () => clearTimeout(id)
  }, [identity.role, status, state?.phase, state?.voteEndsAt])

  useEffect(() => {
    if (identity.role !== 'host' || status !== 'live' || modeRef.current !== 'cloud' || !state) return undefined
    scheduleSheet(state)
    return undefined
  }, [identity.role, status, state])

  const send = (action) => {
    if (modeRef.current === 'cloud' && cloudRef.current) cloudRef.current.send(action)
  }

  return { state, status, send, online }
}
