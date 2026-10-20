export default function Roster({ people = {}, online = [], votes = {} }) {
  const names = new Map()
  Object.entries(people).forEach(([id, name]) => names.set(id, name))
  online.forEach((row) => {
    if (!names.has(row.id)) names.set(row.id, row.name)
  })
  const rows = [...names.entries()].sort((a, b) => a[1].localeCompare(b[1], 'ar'))

  return (
    <aside className="board-names room-names">
      <h2>الحاضرات · {online.length}</h2>
      <ol>
        {rows.length === 0 && <li className="text-sm text-mist">لسا ما حد دخل من رابط الطالبات.</li>}
        {rows.map(([id, name]) => {
          const here = online.some((row) => row.id === id)
          const voted = Boolean(votes[id])
          return (
            <li key={id} className={voted ? 'is-voted' : here ? 'is-on' : ''}>
              <i />
              <span>
                <strong>{name}</strong>
                <em>{voted ? `صوّتت ${votes[id]}` : here ? 'في القاعة' : 'غادرت'}</em>
              </span>
            </li>
          )
        })}
      </ol>
    </aside>
  )
}
