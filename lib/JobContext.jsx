'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { DEFAULT_STORE } from './storeDefaults'

async function readStore() {
  const response = await fetch('/api/store', { cache: 'no-store' })
  if (!response.ok) throw new Error('Failed to load store')
  return response.json()
}

async function writeStore(nextStore) {
  const response = await fetch('/api/store', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(nextStore),
  })

  if (!response.ok) throw new Error('Failed to save store')
}

async function patchJobRequest(jobNumber, updates) {
  const response = await fetch(`/api/jobs/${encodeURIComponent(jobNumber)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  })

  if (!response.ok) throw new Error('Failed to update job')
  return response.json()
}

async function deleteJobRequest(jobNumber) {
  const response = await fetch(`/api/jobs/${encodeURIComponent(jobNumber)}`, {
    method: 'DELETE',
  })

  if (!response.ok) throw new Error('Failed to delete job')
  return response.json()
}

const JobContext = createContext(null)

export function JobProvider({ children }) {
  const [jobs, setJobs] = useState(DEFAULT_STORE.jobs)
  const [equipment, setEquipment] = useState(DEFAULT_STORE.equipment)
  const [hydrated, setHydrated] = useState(false)
  const [saveState, setSaveState] = useState('loading')
  const [lastSavedAt, setLastSavedAt] = useState(null)

  useEffect(() => {
    let alive = true

    readStore()
      .then((store) => {
        if (!alive) return
        setJobs(Array.isArray(store.jobs) ? store.jobs : DEFAULT_STORE.jobs)
        setEquipment(store.equipment && typeof store.equipment === 'object' ? store.equipment : DEFAULT_STORE.equipment)
        setSaveState('saved')
        setLastSavedAt(new Date())
      })
      .catch(() => {
        if (!alive) return
        setJobs(DEFAULT_STORE.jobs)
        setEquipment(DEFAULT_STORE.equipment)
        setSaveState('saved')
        setLastSavedAt(new Date())
      })
      .finally(() => {
        if (alive) setHydrated(true)
      })

    return () => {
      alive = false
    }
  }, [])

  useEffect(() => {
    if (!hydrated) return
    setSaveState('saving')
    writeStore({ jobs, equipment })
      .then(() => {
        setSaveState('saved')
        setLastSavedAt(new Date())
      })
      .catch(() => {
        setSaveState('error')
      })
  }, [jobs, equipment, hydrated])

  function importStore(nextStore) {
    const nextJobs = Array.isArray(nextStore?.jobs) ? nextStore.jobs : DEFAULT_STORE.jobs
    const nextEquipment = nextStore?.equipment && typeof nextStore.equipment === 'object'
      ? nextStore.equipment
      : DEFAULT_STORE.equipment

    setJobs(nextJobs)
    setEquipment(nextEquipment)
    setSaveState('saved')
    setLastSavedAt(new Date())
  }

  function exportStore() {
    return { jobs, equipment }
  }

  function addJob(job) {
    setJobs((prev) => [...prev, { status: 'Not Started', ...job }])
  }

  function updateJobStatus(jobNumber, status) {
    setJobs((prev) =>
      prev.map((j) => j.jobNumber === jobNumber ? { ...j, status } : j)
    )
  }

  async function patchJob(jobNumber, updates) {
    const payload = {
      jobName: updates.jobName,
      location: updates.location,
      dueDate: updates.dueDate,
      venue: updates.venue,
    }

    await patchJobRequest(jobNumber, payload)

    setJobs((prev) =>
      prev.map((job) =>
        job.jobNumber === jobNumber
          ? { ...job, ...payload }
          : job
      )
    )
  }

  async function deleteJob(jobNumber) {
    await deleteJobRequest(jobNumber)

    setJobs((prev) => prev.filter((job) => job.jobNumber !== jobNumber))
    setEquipment((prev) => {
      const next = { ...prev }
      delete next[jobNumber]
      return next
    })
  }
  

  return (
    <JobContext.Provider
      value={{
        jobs,
        equipment,
        setEquipment,
        addJob,
        updateJobStatus,
        patchJob,
        deleteJob,
        importStore,
        exportStore,
        saveState,
        lastSavedAt,
      }}
    >
      {children}
    </JobContext.Provider>
  )
}

export function useJobs() {
  const ctx = useContext(JobContext)
  if (!ctx) throw new Error('useJobs must be used inside JobProvider')
  return ctx
}
