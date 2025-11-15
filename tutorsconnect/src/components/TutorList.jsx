import { useEffect, useState, useCallback } from "react"
import { supabase } from "../supabaseClient"
import TutorCard from "./TutorCard"

const PAGE_SIZE = 9

export default function TutorList({ filters = {}, sort = "rating_desc" }) {
  const [tutors, setTutors] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  const fetchTutors = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      let query = supabase.from("tutors").select("*", { count: "exact" })

      if (filters.query?.trim()) {
        query = query.or(`name.ilike.%${filters.query.trim()}%,headline.ilike.%${filters.query.trim()}%`)
      }
      if (filters.subject) query = query.contains("subjects", [filters.subject])
      if (filters.city) query = query.eq("city", filters.city)
      if (filters.minRate) query = query.gte("rate_per_hour", Number(filters.minRate))
      if (filters.maxRate) query = query.lte("rate_per_hour", Number(filters.maxRate))

      if (sort === "rating_desc") query = query.order("rating", { ascending: false })
      else if (sort === "rate_asc") query = query.order("rate_per_hour", { ascending: true })
      else if (sort === "newest") query = query.order("created_at", { ascending: false })

      query = query.range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1)

      const { data, error: fetchError, count } = await query

      if (fetchError) throw fetchError

      setTutors(prev => (page === 0 ? data : [...prev, ...data]))
      setHasMore((page + 1) * PAGE_SIZE < (count || 0))
    } catch (err) {
      console.error(err)
      setError(err.message || "Failed to load tutors")
    } finally {
      setLoading(false)
    }
  }, [filters, page, sort])

  useEffect(() => { setPage(0) }, [filters, sort])
  useEffect(() => { fetchTutors() }, [fetchTutors])

  return (
    <div>
      {loading && tutors.length === 0 && <div className="p-6 text-center hint">Loading tutors…</div>}
      {error && <div className="p-4 text-red-600">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tutors.map(t => <TutorCard key={t.id} tutor={t} />)}
      </div>

      {!loading && tutors.length === 0 && <div className="p-6 text-center hint">No tutors found.</div>}

      <div className="flex justify-center mt-6">
        {hasMore ? (
          <button onClick={() => setPage(p => p + 1)} className="px-4 py-2 rounded-full bg-[color:var(--accent)] text-white">
            {loading ? 'Loading...' : 'Load more'}
          </button>
        ) : (
          tutors.length > 0 && <div className="text-sm text-muted">No more results</div>
        )}
      </div>
    </div>
  )
}
