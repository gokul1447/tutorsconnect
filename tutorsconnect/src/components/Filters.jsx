import { useState, useEffect } from 'react'

export default function Filters({ onChange, initial = {} }) {
  const [subject, setSubject] = useState(initial.subject || '')
  const [city, setCity] = useState(initial.city || '')
  const [minRate, setMinRate] = useState(initial.minRate ?? '')
  const [maxRate, setMaxRate] = useState(initial.maxRate ?? '')
  const [query, setQuery] = useState(initial.query || '')
  const [sort, setSort] = useState(initial.sort || 'rating_desc')

  useEffect(() => {
    const t = setTimeout(() => {
      onChange?.({ subject: subject.trim(), city: city.trim(), minRate, maxRate, query: query.trim(), sort })
    }, 450)
    return () => clearTimeout(t)
  }, [subject, city, minRate, maxRate, query, sort, onChange])

  return (
    <div className="card p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search name or headline"
               className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]" />

        <input value={subject} onChange={e=>setSubject(e.target.value)} placeholder="Subject (e.g. Math)"
               className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]" />

        <input value={city} onChange={e=>setCity(e.target.value)} placeholder="City"
               className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]" />

        <select value={sort} onChange={e=>setSort(e.target.value)} className="p-2 border rounded-md">
          <option value="rating_desc">Sort: Rating (high → low)</option>
          <option value="rate_asc">Sort: Rate (low → high)</option>
          <option value="newest">Sort: Newest</option>
        </select>
      </div>

      <div className="flex items-center gap-2 mt-3">
        <input type="number" value={minRate} onChange={e=>setMinRate(e.target.value)} placeholder="Min rate"
               className="p-2 border rounded-md w-28" />
        <input type="number" value={maxRate} onChange={e=>setMaxRate(e.target.value)} placeholder="Max rate"
               className="p-2 border rounded-md w-28" />
        <div className="ml-auto hint">Results update automatically</div>
      </div>
    </div>
  )
}
