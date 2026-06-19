'use client'

import { useRef } from 'react'
import { useJobs } from '@/lib/JobContext'

function formatSavedAt(date) {
  if (!date) return 'Never saved'
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

export default function BackupControls() {
  const { exportStore, importStore, saveState, lastSavedAt } = useJobs()
  const fileInputRef = useRef(null)

  function handleExport() {
    const data = exportStore()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `preptrack-backup-${new Date().toISOString().slice(0, 10)}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  async function handleImport(event) {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const parsed = JSON.parse(text)
      importStore(parsed)
    } catch {
      window.alert('That file is not a valid PrepTrack JSON backup.')
    } finally {
      event.target.value = ''
    }
  }

  const statusLabel =
    saveState === 'saving'
      ? 'Saving...'
      : saveState === 'error'
        ? 'Save failed'
        : `Saved ${formatSavedAt(lastSavedAt)}`

  return (
    <div className="flex items-center gap-3">
      <span className={`text-xs px-2 py-1 rounded-full border ${saveState === 'error' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
        {statusLabel}
      </span>
      <button
        type="button"
        onClick={handleExport}
        className="text-sm border rounded px-3 py-2 hover:bg-gray-50 transition-colors"
      >
        Export JSON
      </button>
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="text-sm border rounded px-3 py-2 hover:bg-gray-50 transition-colors"
      >
        Import JSON
      </button>
      <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={handleImport} />
    </div>
  )
}