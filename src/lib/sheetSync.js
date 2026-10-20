import cases from '../data/cases.json'
import { ANSWER_KEY } from '../data/answerKey'
import { SHEET_TOKEN, SHEET_URL } from '../config'

export function sheetPayload(state) {
  const records = []
  for (const item of state?.ledger || []) {
    if (item.kind !== 'vote') continue
    const itemCase = cases.find((entry) => entry.id === item.caseId)
    const letters = String(item.choice || '').split('')
    const optionTitle = letters.map((letter) => itemCase?.options.find((entry) => entry.key === letter)?.title || letter).join(' + ')
    const key = ANSWER_KEY[item.caseId]
    const best = key?.best ? String(key.best).split('').sort().join('') : ''
    const got = letters.slice().sort().join('')
    records.push([
      `${item.studentId}-${item.caseId}`,
      item.name || '',
      item.caseId,
      itemCase?.title || '',
      item.choice,
      optionTitle,
      Math.round(Number(item.ms || 0) / 100) / 10,
      best && best === got ? 1 : 0,
      item.at || Date.now(),
    ])
  }
  return { token: SHEET_TOKEN, records }
}

let lastSig = ''
let timer

export function scheduleSheet(state) {
  if (!SHEET_URL) return
  const payload = sheetPayload(state)
  const sig = JSON.stringify(payload.records)
  if (sig === lastSig) return
  clearTimeout(timer)
  timer = setTimeout(() => {
    lastSig = sig
    fetch(SHEET_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    }).catch(() => {})
  }, 700)
}
