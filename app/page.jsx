'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useJobs } from '@/lib/JobContext'
import JobTable from '@/components/ui/JobTable'

export default function Page() {
  const { jobs } = useJobs()
  const [search, setSearch] = useState('')

  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  const filteredBySearch = jobs
    .filter((job) => {
      const q = search.toLowerCase()
      return job.jobNumber.toLowerCase().includes(q) || job.jobName.toLowerCase().includes(q)
    })
    .sort((a, b) => {
      if (!a.dueDate) return 1
      if (!b.dueDate) return -1
      return new Date(a.dueDate) - new Date(b.dueDate)
    })

  const pastJobs = filteredBySearch.filter((job) => {
    if (!job.dueDate) return false
    const due = new Date(job.dueDate)
    due.setHours(0, 0, 0, 0)
    return due < todayStart
  })

  const activeJobs = filteredBySearch.filter((job) => {
    if (!job.dueDate) return true
    const due = new Date(job.dueDate)
    due.setHours(0, 0, 0, 0)
    return due >= todayStart
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">{jobs.length} job{jobs.length !== 1 ? 's' : ''} total</p>
        </div>
        <Link
          href="/add"
          className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
        >
          + Add Job
        </Link>
      </div>

      <div className="mb-4">
        <input
          type="text"
          maxLength={50}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by job # or name..."
          className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <JobTable jobs={activeJobs} search={search} title="Active Jobs" />

      <JobTable jobs={pastJobs} search={search} title="Past Jobs" />
    </div>
  )
}