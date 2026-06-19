'use client'

import { useEffect, useState } from 'react'

export default function JobHeader({ job, onPatchJob, onDeleteJob }) {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [form, setForm] = useState({
    jobName: job.jobName ?? '',
    location: job.location ?? '',
    dueDate: job.dueDate ?? '',
    venue: job.venue ?? '',
  })

  useEffect(() => {
    setForm({
      jobName: job.jobName ?? '',
      location: job.location ?? '',
      dueDate: job.dueDate ?? '',
      venue: job.venue ?? '',
    })
  }, [job])

  async function handleSave() {
    setIsSaving(true)
    try {
      await onPatchJob?.(form)
      setIsEditing(false)
    } catch {
      window.alert('Unable to update this job right now.')
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDelete() {
    const ok = window.confirm(`Delete Job #${job.jobNumber}? This cannot be undone.`)
    if (!ok) return

    setIsDeleting(true)
    try {
      await onDeleteJob?.()
    } catch {
      window.alert('Unable to delete this job right now.')
      setIsDeleting(false)
    }
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm p-6 mb-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Job #{job.jobNumber}</p>
          <h1 className="text-2xl font-bold mb-1">{job.jobName}</h1>
          <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-500">
            {job.location && <span>📍 {job.location}</span>}
            {job.venue && <span>🏢 {job.venue}</span>}
            {job.dueDate && <span>📅 Due {new Date(job.dueDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-xs font-medium px-3 py-1 rounded-full ${
            job.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
            job.status === 'Complete' ? 'bg-green-100 text-green-700' :
            'bg-gray-100 text-gray-600'
          }`}>
            {job.status}
          </span>
          <button
            type="button"
            onClick={() => setIsEditing((v) => !v)}
            className="text-sm border rounded px-3 py-1.5 hover:bg-gray-50 transition-colors"
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-sm border border-red-200 text-red-700 rounded px-3 py-1.5 hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>

      {isEditing && (
        <div className="mt-4 border-t pt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="text-sm flex flex-col gap-1">
            <span className="text-gray-600">Job Name</span>
            <input
              value={form.jobName}
              onChange={(e) => setForm((prev) => ({ ...prev, jobName: e.target.value }))}
              className="border rounded px-3 py-2"
            />
          </label>

          <label className="text-sm flex flex-col gap-1">
            <span className="text-gray-600">Due Date</span>
            <input
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm((prev) => ({ ...prev, dueDate: e.target.value }))}
              className="border rounded px-3 py-2"
            />
          </label>

          <label className="text-sm flex flex-col gap-1">
            <span className="text-gray-600">Location</span>
            <input
              value={form.location}
              onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
              className="border rounded px-3 py-2"
            />
          </label>

          <label className="text-sm flex flex-col gap-1">
            <span className="text-gray-600">Venue</span>
            <input
              value={form.venue}
              onChange={(e) => setForm((prev) => ({ ...prev, venue: e.target.value }))}
              className="border rounded px-3 py-2"
            />
          </label>

          <div className="md:col-span-2 flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}