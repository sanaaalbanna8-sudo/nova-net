import { useState } from 'react'
import { BRAND_AR, BRAND_EN, MEETING_AR, MEETING_EN, UNIT_LINE } from '../config'
import { Mark } from './Shell'

export default function Landing({ gate = 'student', onHost, onStudent }) {
  const [name, setName] = useState('')
  const clean = name.trim().replace(/\s+/g, ' ')

  return (
    <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-8">
      <div className="mb-8 flex items-center gap-3 text-gold">
        <Mark className="h-12 w-12" />
        <div>
          <p className="text-sm font-semibold text-ink">
            {BRAND_AR}
            <span className="mx-1.5 font-normal text-faint">·</span>
            <span className="tracking-wide text-gold2">{BRAND_EN}</span>
          </p>
          <p className="text-xs text-mist">
            {MEETING_AR}
            <span className="mx-1.5 text-faint">·</span>
            {MEETING_EN}
          </p>
        </div>
      </div>

      {gate === 'host' && (
        <div className="panel mx-auto mt-10 w-full max-w-md p-7">
          <p className="text-xs font-extrabold text-gold2">{UNIT_LINE}</p>
          <h2 className="mt-2 font-display text-4xl text-ink">مقعد الرئاسة</h2>
          <p className="mt-3 text-sm leading-7 text-mist">اجتماع سريع. الطالبات يناقشن الحالة ويخترن نوع الشبكة الأنسب. ما في وظائف ولا أدوار.</p>
          <button className="btn-gold mt-6 w-full" type="button" onClick={() => onHost()}>
            دخول اللوحة
          </button>
        </div>
      )}

      {gate === 'student' && (
        <form
          className="panel mx-auto mt-10 w-full max-w-md p-7"
          onSubmit={(event) => {
            event.preventDefault()
            if (clean.length < 2) return
            onStudent(clean)
          }}
        >
          <p className="text-xs font-extrabold text-gold2">{UNIT_LINE}</p>
          <h2 className="mt-2 font-display text-4xl text-ink">ادخلي باسمك</h2>
          <p className="mt-3 text-sm leading-7 text-mist">اكتبي اسمك كما تحبين أن يظهر في القاعة. ما في مقعد وظيفي. التصويت على نوع الشبكة.</p>
          <label className="mt-5 block text-sm font-bold text-ink" htmlFor="student-name">
            الاسم
          </label>
          <input
            id="student-name"
            className="mt-2 w-full rounded-2xl border border-line bg-white px-4 py-3 text-lg text-ink"
            value={name}
            maxLength={40}
            autoComplete="name"
            onChange={(event) => setName(event.target.value)}
          />
          <button className="btn-gold mt-6 w-full" type="submit" disabled={clean.length < 2}>
            دخول القاعة
          </button>
        </form>
      )}
    </div>
  )
}
