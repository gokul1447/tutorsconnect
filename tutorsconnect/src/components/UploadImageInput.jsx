import { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function UploadImageInput({ userId, bucket = 'avatars', onComplete }) {
  const [progress, setProgress] = useState(0)
  const [uploading, setUploading] = useState(false)

  async function uploadFile(file) {
    if (!file) return
    setUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const filePath = `${userId}/avatar-${Date.now()}.${ext}`

      const { data, error } = await supabase.storage.from(bucket).upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

      if (error) throw error
      // data.path contains stored path
      setProgress(100)
      onComplete && onComplete(data.path)
    } catch (err) {
      console.error('Upload failed', err)
      alert('Upload failed: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={e => uploadFile(e.target.files?.[0])}
        className="mb-2"
      />
      {uploading && <div className="text-sm">Uploading... {progress}%</div>}
    </div>
  )
}
