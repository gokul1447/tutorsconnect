import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center p-6">
        <h1 className="text-2xl font-bold mb-2">404 — Page not found</h1>
        <p className="mb-4 text-gray-600">We couldn't find what you were looking for.</p>
        <Link to="/" className="px-4 py-2 bg-blue-600 text-white rounded">Go home</Link>
      </div>
    </div>
  )
}
