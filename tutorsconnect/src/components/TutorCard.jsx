import Avatar from './ui/Avatar'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export default function TutorCard({ tutor }) {
  // if using public avatars: build URL; if mock, tutor.profile_image_path could be absolute
  const avatar = tutor.profile_image_path
    ? (tutor.profile_image_path.startsWith('http') ? tutor.profile_image_path : supabase.storage.from('avatars').getPublicUrl(tutor.profile_image_path).publicURL)
    : null

  return (
    <div className="card p-4">
      <div className="flex gap-4">
        <Avatar src={avatar} alt={tutor.name} size={64} />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <div className="font-semibold text-lg">{tutor.name}</div>
              <div className="text-sm text-[color:var(--muted)]">{tutor.headline}</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium">₹{tutor.rate_per_hour || '—'}/hr</div>
              <div className="text-xs text-yellow-500">{'★'.repeat(Math.round(tutor.rating || 0))}</div>
            </div>
          </div>

          <p className="mt-3 text-sm text-slate-700 line-clamp-3">{tutor.bio}</p>

          <div className="mt-3 flex items-center gap-2 flex-wrap">
            {(tutor.subjects || []).slice(0,4).map(s => (
              <span key={s} className="text-xs px-2 py-1 bg-gray-100 rounded-full">{s}</span>
            ))}
          </div>

          <div className="mt-4 flex gap-2">
            <Link to={`/tutor/${tutor.id}`} className="px-3 py-1 rounded-full border text-sm">View</Link>
            <button className="px-3 py-1 rounded-full bg-[color:var(--accent)] text-white text-sm">Message</button>
          </div>
        </div>
      </div>
    </div>
  )
}
