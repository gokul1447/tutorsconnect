import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export default function Navbar({ user }) {
  return (
    <header className="bg-white border-b">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="text-2xl font-bold text-slate-900">TutorsConnect</Link>

        <nav className="flex items-center gap-3">
          <Link to="/" className="text-sm text-slate-600 hover:text-slate-900">Browse</Link>
          <Link to="/me" className="text-sm text-slate-600 hover:text-slate-900">My Profile</Link>

          {user ? (
            <button
              onClick={() => supabase.auth.signOut()}
              className="ml-3 px-3 py-1 rounded-full border text-sm hover:bg-gray-50"
            >Sign out</button>
          ) : (
            <button
              onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })}
              className="ml-3 px-4 py-1 rounded-full bg-[color:var(--accent)] text-white text-sm hover:opacity-95"
            >
              Sign in
            </button>
          )}
        </nav>
      </div>
    </header>
  )
}
