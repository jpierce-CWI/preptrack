'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter, notFound } from 'next/navigation'
import Link from 'next/link'
import { useJobs } from '@/lib/JobContext'
import { useEquipment } from '@/lib/EquipmentContext'
import ItemCard from '@/components/ui/ItemCard'
import JobHeader from '../../../components/ui/JobHeader'
import ChallengeList from '@/components/ui/ChallengeList'


export default function JobDetailPage() {
    
const { jobNumber } = useParams()
const router = useRouter()
const { jobs, updateJobStatus, patchJob, deleteJob } = useJobs()
const { getEquipment, initJob } = useEquipment()

const job = jobs.find((j) => j.jobNumber === jobNumber)
if (!job) return notFound()

  useEffect(() => {
    initJob(job)
  }, [initJob, job])

  const items = getEquipment(jobNumber)
  const doneCount = items.filter((i) => i.prepped).length

  useEffect(() => {
    if (items.length === 0) return
    let newStatus
    if (doneCount === 0) newStatus = 'Not Started'
    else if (doneCount === items.length) newStatus = 'Complete'
    else newStatus = 'In Progress'
    if (newStatus !== job.status) updateJobStatus(jobNumber, newStatus)
  }, [doneCount, items.length])

  async function handlePatchJob(updates) {
    await patchJob(jobNumber, updates)
  }

  async function handleDeleteJob() {
    await deleteJob(jobNumber)
    router.push('/')
  }


  return (
    <div className="max-w-5xl mx-auto">
      <Link href="/" className="text-sm text-gray-500 hover:text-gray-800 transition-colors mb-6 inline-block">
        ← Back to Dashboard
      </Link>
      <JobHeader job={job} onPatchJob={handlePatchJob} onDeleteJob={handleDeleteJob} />
      
      {items.length > 0 && (
        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4">
          <div
            className="bg-green-500 h-1.5 rounded-full transition-all"
            style={{ width: `${(doneCount / items.length) * 100}%` }}
          />
        </div>
      )} 

      <div className="flex gap-6 items-start">
        {/* Main equipment column */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold">Equipment</h2>
            <span className="text-xs text-gray-500">{doneCount} / {items.length} complete</span>
          </div>



          {items.length === 0 ? (
            <p className="text-gray-400 text-sm">No equipment items for this job.</p>
          ) : (
            items.map((item) => (
              <ItemCard key={item.id} jobNumber={jobNumber} item={item} />
            ))
          )}
        </div>

        {/* Challenges sidebar — Lucky Putt only */}
        {job.venue === 'Lucky Putt' && Array.isArray(job.challenges) && job.challenges.length > 0 && (
          <div className="w-64 flex-shrink-0 bg-white border rounded-lg shadow-sm p-4 sticky top-20">
            <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">Challenges</h2>
            <ChallengeList challenges={job.challenges} />
          </div>
        )}
      </div>
    </div>
  )
}
