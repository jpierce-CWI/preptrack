import { useEffect, useState } from 'react'
import { useParams, notFound } from 'next/navigation'
import { useJobs } from '@/lib/JobContext'
import { useEquipment } from '@/lib/EquipmentContext'  


export default function ItemCard({ jobNumber, item }) {

  const { updateItem } = useEquipment()
  const [expanded, setExpanded] = useState(false)
  const [noteDraft, setNoteDraft] = useState('')

  const bothDone = item.prepped
  const notes = Array.isArray(item.notes)
    ? item.notes
    : typeof item.notes === 'string' && item.notes.trim()
      ? [item.notes]
      : []

  function handleAddNote() {
    const text = noteDraft.trim()
    if (!text) return

    const nextNotes = [...notes, { id: Date.now(), text }]
    updateItem(jobNumber, item.id, 'notes', nextNotes)
    setNoteDraft('')
  }

  function handleDeleteNote(noteIndex) {
    const nextNotes = notes.filter((_, index) => index !== noteIndex)
    updateItem(jobNumber, item.id, 'notes', nextNotes)
  }

  return (
    <div className={`border rounded-lg mb-2 overflow-hidden transition-colors ${bothDone ? 'border-green-200 bg-green-50' : 'bg-white'}`}>
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${bothDone ? 'bg-green-500' : item.prepped ? 'bg-yellow-400' : 'bg-gray-300'}`} />
          <span className="font-medium text-sm">{item.name}{item.name.endsWith('s') || item.quantity <= 1 ? '' : 's'}</span>
          {item.quantity > 1 && (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
              x{item.quantity}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {item.prepped && <span className="text-xs text-gray-400">Prepped</span>}
          <span className="text-gray-400 text-xs">{expanded ? '▲' : '▼'}</span>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 pt-3 border-t flex flex-col gap-4">

          <div className="flex gap-4 flex-wrap">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</label>
              <input
                type="date"
                value={item.date}
                onChange={(e) => updateItem(jobNumber, item.id, 'date', e.target.value)}
                className="border rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Sign Off</label>
              <input
                type="text"
                value={item.signOff}
                placeholder="Initials"
                onChange={(e) => updateItem(jobNumber, item.id, 'signOff', e.target.value)}
                className="border rounded px-2 py-1.5 text-sm w-28 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={item.prepped}
                onChange={(e) => {
                    if (e.target.checked) {setExpanded(false)}    
                    updateItem(jobNumber, item.id, 'prepped', e.target.checked)
                }}
                className="w-4 h-4 accent-blue-600"
              />
              Prepped
            </label>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Notes</label>

            <div className="flex gap-2">
              <input
                type="text"
                value={noteDraft}
                onChange={(e) => setNoteDraft(e.target.value)}
                placeholder="Add a note..."
                className="border rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
              <button
                type="button"
                onClick={handleAddNote}
                disabled={!noteDraft.trim()}
                className="px-3 py-1.5 text-sm rounded bg-blue-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Add Note
              </button>
            </div>

            <div className="min-h-12 px-1">
              {notes.length === 0 ? (
                <p className="text-xs text-gray-400">No notes yet.</p>
              ) : (
                <ul className="list-disc pl-5 space-y-1">
                  {notes.map((note, index) => {
                    const noteText = typeof note === 'string' ? note : note.text
                    return (
                      <li key={typeof note === 'string' ? `${note}-${index}` : note.id ?? index} className="text-sm text-gray-700">
                        <div className="flex items-start justify-between gap-3">
                          <p className="whitespace-pre-wrap">{noteText}</p>
                          <button
                            type="button"
                            onClick={() => handleDeleteNote(index)}
                            className="text-xs text-red-600 hover:text-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  )
}