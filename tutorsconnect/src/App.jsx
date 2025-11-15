import { useEffect, useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'

import { supabase } from './supabaseClient'

export default function App(){
  const [user, setUser] = useState(null)

  useEffect(()=>{
    // get current session user
    supabase.auth.getUser().then(({ data }) => setUser(data?.user ?? null))

    // subscribe to auth changes
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => sub.subscription.unsubscribe()
  },[])

  if(!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="p-8 bg-white rounded-xl shadow-md text-center">
          <h1 className="text-2xl font-semibold mb-4">TutorsConnect</h1>
          <p className="mb-6">Sign in with Google to continue</p>
          <button
            className="px-4 py-2 rounded bg-blue-600 text-white"
            onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })}
          >Sign in with Google</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-lg font-semibold">Welcome, {user.user_metadata.full_name || user.email}</h2>
        <p className="text-sm text-gray-600 mt-2">UID: {user.id}</p>
        <div className="mt-4 flex gap-2">
          <button className="px-3 py-1 bg-gray-200 rounded" onClick={() => supabase.auth.signOut()}>Sign out</button>
        </div>
      </div>
    </div>
  )
}