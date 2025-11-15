import { useState } from 'react'
import Filters from '../components/Filters'
import TutorList from '../components/TutorList'

export default function LandingPage() {
  const [filters, setFilters] = useState({})

  return (
    <main className="min-h-screen">
      <div className="container pt-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Find a tutor nearby</h1>
          <p className="mt-2 hint">Filter by subject, city and hourly rate — minimal, fast, and reliable.</p>
        </div>

        <Filters onChange={(f) => setFilters(f)} />

        <TutorList filters={filters} />
      </div>
    </main>
  )
}
