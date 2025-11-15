import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import TutorCard from '../components/TutorCard'

export default function TutorProfilePage() {
  const { id } = useParams()
  const [tutor, setTutor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }

    async function fetchTutor() {
      setLoading(true)
      try {
        const { data, error } = await supabase.from('tutors').select('*').eq('id', id).single()
        if (error) setError(error.message)
        else setTutor(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchTutor()
  }, [id])

  if (loading) return <div className="p-6">Loading...</div>
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>
  if (!tutor) return <div className="p-6">Tutor not found.</div>

  return (
    <div className="max-w-3xl mx-auto p-6">
      <TutorCard tutor={tutor} />
      <div className="mt-6 bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-2">About</h3>
        <p className="text-gray-700">{tutor.bio}</p>

        <div className="mt-4">
          <strong>Subjects:</strong> {(tutor.subjects || []).join(', ')}
        </div>
        <div className="mt-1">
          <strong>City:</strong> {tutor.city || '—'}
        </div>
        <div className="mt-1">
          <strong>Rate:</strong> ₹{tutor.rate_per_hour || '—'} / hr
        </div>
      </div>
    </div>
  )
}