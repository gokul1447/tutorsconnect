
import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import ProfileEditor from '../components/ProfileEditor'

export default function MyProfile() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return
      setUser(data?.user ?? null)
      setLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => {
      mounted = false
      sub?.subscription?.unsubscribe?.()
    }
  }, [])

  if (loading) return <div className="p-6">Loading...</div>
  if (!user) return <div className="p-6">Please sign in to edit your profile.</div>

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-xl font-semibold mb-4">My Profile</h2>
      <ProfileEditor user={user} onSaved={() => alert('Saved!')} />
    </div>
  )
}
