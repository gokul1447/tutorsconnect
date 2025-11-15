import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import UploadImageInput from './UploadImageInput'

export default function ProfileEditor({ user, onSaved }) {
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    name: '',
    headline: '',
    bio: '',
    subjects: '',
    city: '',
    country: '',
    rate_per_hour: '',
    profile_image_path: null
  })

  useEffect(() => {
    if (!user) return
    ;(async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('tutors')
        .select('*')
        .eq('user_id', user.id)
        .single()
      if (error && error.code !== 'PGRST116') { // single returns 406 if no row
        console.error(error)
      }
      if (data) {
        setForm({
          name: data.name || '',
          headline: data.headline || '',
          bio: data.bio || '',
          subjects: (data.subjects || []).join(', '),
          city: data.city || '',
          country: data.country || '',
          rate_per_hour: data.rate_per_hour || '',
          profile_image_path: data.profile_image_path || null
        })
      }
      setLoading(false)
    })()
  }, [user])

  async function handleSave(e) {
    e.preventDefault()
    // basic validation
    if (!form.name.trim()) return alert('Please enter your name')
    const payload = {
      user_id: user.id,
      name: form.name.trim(),
      headline: form.headline.trim(),
      bio: form.bio.trim(),
      subjects: form.subjects.split(',').map(s => s.trim()).filter(Boolean),
      city: form.city.trim(),
      country: form.country.trim(),
      rate_per_hour: form.rate_per_hour ? Number(form.rate_per_hour) : null,
      profile_image_path: form.profile_image_path || null,
      updated_at: new Date().toISOString()
    }

    // use upsert to create or update by user_id
    const { data, error } = await supabase
      .from('tutors')
      .upsert(payload, { onConflict: 'user_id' }) // matches RLS: requires user_id = auth.uid()
      .select()

    if (error) {
      console.error(error)
      return alert('Saving profile failed: ' + error.message)
    }
    alert('Profile saved!')
    onSaved && onSaved(data?.[0] ?? null)
  }

  async function handleImageComplete(path) {
    setForm(f => ({ ...f, profile_image_path: path }))
  }

  if (loading) return <div>Loading profile...</div>

  return (
    <form onSubmit={handleSave} className="bg-white p-6 rounded shadow max-w-xl">
      <h3 className="text-lg font-semibold mb-3">Edit profile</h3>

      <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Full name"
        className="w-full mb-2 p-2 border rounded" />

      <input value={form.headline} onChange={e => setForm({ ...form, headline: e.target.value })} placeholder="Headline"
        className="w-full mb-2 p-2 border rounded" />

      <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} placeholder="Bio"
        className="w-full mb-2 p-2 border rounded" />

      <input value={form.subjects} onChange={e => setForm({ ...form, subjects: e.target.value })} placeholder="Subjects (comma separated)"
        className="w-full mb-2 p-2 border rounded" />

      <div className="flex gap-2 mb-2">
        <input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} placeholder="City"
          className="w-full p-2 border rounded" />
        <input value={form.rate_per_hour} onChange={e => setForm({ ...form, rate_per_hour: e.target.value })} placeholder="Rate (₹/hr)"
          type="number" className="w-40 p-2 border rounded" />
      </div>

      <div className="mb-3">
        <div className="mb-2">Avatar</div>
        {form.profile_image_path && (
          <div className="mb-2">
            <img
              src={supabase.storage.from('avatars').getPublicUrl(form.profile_image_path).publicURL}
              alt="avatar"
              className="w-24 h-24 rounded-full object-cover"
            />
          </div>
        )}
        <UploadImageInput userId={user.id} onComplete={handleImageComplete} />
      </div>

      <div className="flex justify-end gap-2">
        <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded">Save</button>
      </div>
    </form>
  )
}
