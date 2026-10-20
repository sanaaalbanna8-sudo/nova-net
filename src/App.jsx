import { useCallback, useState } from 'react'
import { STORAGE_IDENTITY } from './config'
import { ensureSeatPath } from './paths'
import Landing from './components/Landing'
import HostRoom from './components/HostRoom'
import StudentRoom from './components/StudentRoom'

function readIdentity() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORAGE_IDENTITY) || 'null')
    if (saved?.role === 'host') return { role: 'host' }
    if (saved?.role === 'student' && saved.studentId && saved.name) return saved
  } catch {
    /* تُفتح صفحة الدخول */
  }
  return null
}

function studentId() {
  return `n${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
}

export default function App() {
  const [gate] = useState(ensureSeatPath)
  const [identity, setIdentity] = useState(readIdentity)

  const leave = useCallback(() => {
    sessionStorage.removeItem(STORAGE_IDENTITY)
    setIdentity(null)
  }, [])

  const enterHost = () => {
    const next = { role: 'host' }
    sessionStorage.setItem(STORAGE_IDENTITY, JSON.stringify(next))
    setIdentity(next)
  }

  const enterStudent = (name) => {
    const next = { role: 'student', studentId: studentId(), name }
    sessionStorage.setItem(STORAGE_IDENTITY, JSON.stringify(next))
    setIdentity(next)
  }

  const seated = identity && ((gate === 'host' && identity.role === 'host') || (gate === 'student' && identity.role === 'student'))

  if (!seated) return <Landing gate={gate} onHost={enterHost} onStudent={enterStudent} />
  if (identity.role === 'host') return <HostRoom identity={identity} onLeave={leave} />
  return <StudentRoom identity={identity} onLeave={leave} />
}
