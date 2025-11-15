import { Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import LandingPage from './pages/LandingPage'
import TutorProfilePage from './pages/TutorProfilePage'
import MyProfile from './pages/MyProfile'
import NotFound from './pages/NotFound'
import Navbar from './components/Navbar'
import { supabase } from './supabaseClient'

export default function App(){
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data?.user ?? null))
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => sub?.subscription?.unsubscribe?.()
  }, [])

  return (
    <>
      <Navbar user={user} />
      <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path="/tutor/:id" element={<TutorProfilePage/>} />
        <Route path="/me" element={<MyProfile/>} />
        <Route path="*" element={<NotFound/>} />
      </Routes>
    </>
  )
}
