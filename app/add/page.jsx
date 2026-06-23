'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useJobs } from '@/lib/JobContext'

const VENUE_OPTIONS = [
  'Lucky Putt',
  '6p Limitless VR',
  '8p Limitless VR',
  '12p Limitless VR',
  'D&B Ranger Station',
  'EO Batman',
]

import { CHALLENGES } from '@/lib/challenges'

export default function AddPage() {
  const { addJob } = useJobs()
  const router = useRouter()

  const [form, setForm] = useState({
    jobNumber: '',
    jobName: '',
    location: '',
    dueDate: '',
    venue: '',
    Notes: [],
  })

  const [supportPkg, setSupportPkg] = useState('')
  const [courseCount, setCourseCount] = useState('')
  const [challengeCount, setChallengeCount] = useState('')
  const [kioskCount, setKioskCount] = useState('')
  const [coursesChallenges, setCoursesChallenges] = useState([]) // 2D: [courseIndex][holeIndex]

  const isLuckyPutt = form.venue === 'Lucky Putt'
  const isLVR = form.venue.endsWith('Limitless VR')

  function handleField(e) {
    if (e.target.name === 'courseCount' && parseInt(e.target.value) > 3) {
      setForm({ ...form, [e.target.name]: '3' })
      return
    }
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleCourseCount(e) {
    let count = parseInt(e.target.value) || 0
    count > 3 ? (count = 3, setCourseCount('3')) : setCourseCount(e.target.value)

    console.log('count:', count, 'courseCount:', courseCount)

    const holes = parseInt(challengeCount) || 0
    setCoursesChallenges(Array.from({ length: count }, () => Array(holes).fill('')))
  }



  function handleChallengeCount(e) {
    let count = parseInt(e.target.value) || 0
    count > 12 ? (count = 12, setChallengeCount('12')) : setChallengeCount(e.target.value)
    
    console.log('count:', count, 'courseCount:', courseCount)
    const courses = parseInt(courseCount) || 0
    setCoursesChallenges(Array.from({ length: courses }, () => Array(count).fill('')))
  }
  
  function handleSupportPkg(e) {
    setSupportPkg(e.target.value)
  }

  function handleChallengeSelect(courseIndex, holeIndex, value) {
    setCoursesChallenges((prev) =>
      prev.map((course, ci) =>
        ci === courseIndex
          ? course.map((v, hi) => (hi === holeIndex ? value : v))
          : course
      )
    )
  }

  function handleKioskCount(e) {
    setKioskCount(e.target.value)
  }

  function handleSubmit(e) {
    e.preventDefault()
    const newJob = {
      ...form,
      supportPkg: isLVR ? (parseInt(supportPkg) || 0) : 0,
      playerCount: isLVR ? (parseInt(form.venue.split(' ')[0]) || 0) : 0,
      challenges: isLuckyPutt ? coursesChallenges : [],
      courseCount: isLuckyPutt ? (parseInt(courseCount) || 1) : 1,
      kioskCount: isLuckyPutt ? (parseInt(kioskCount) || 1) : 1,
    }
    addJob(newJob)
    router.push('/')
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Add Job</h1>
        <p className="text-sm text-gray-500 mt-1">Fill in the details below to create a new job.</p>
      </div>

      <div className="bg-white rounded-lg border shadow-sm p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* Top two fields side by side */}
          {/*Job Number*/}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Job #</label>
              <input
                required
                maxLength="7"
                name="jobNumber"
                value={form.jobNumber}
                onChange={handleField}
                placeholder="e.g. 5507"
                className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {/*Due Date*/}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Due Date</label>
              <input
                required
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={handleField}
                className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          {/*Job Name*/}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Job Name</label>
            <input
              maxLength="45"
              required
              name="jobName"
              value={form.jobName}
              onChange={handleField}
              placeholder="e.g. Stick and Hack LP"
              className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/*Location*/}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Location</label>
            <input
              maxLength="45"
              required 
              name="location"
              value={form.location}
              onChange={handleField}
              placeholder="e.g. Dallas, TX"
              className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/*Attraction*/}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Attraction</label>
            <select
              name="venue"
              value={form.venue}
              onChange={handleField}
              className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select an attraction --</option>
              {VENUE_OPTIONS.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>

          {/* LVR - Spare Part Add ons */}
          {isLVR && (
            <div className="flex flex-col gap-4 border rounded p-4 bg-gray-50">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Spare Parts Package</label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  value={supportPkg}
                  onChange={handleSupportPkg}
                  placeholder="Leave Blank if None"
                  className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Lucky Putt — challenge count + selectors */}
          {isLuckyPutt && (
            <div className="flex flex-col gap-4 border rounded p-4 bg-gray-50">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Lucky Putt</p>

              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Number of Courses</label>
                  <input
                    type="number"
                    min="1"
                    max={3}
                    value={courseCount}
                    onChange={handleCourseCount}
                    placeholder="e.g. 1"
                    className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Holes per Course</label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    max={CHALLENGES.length}
                    value={challengeCount}
                    onChange={handleChallengeCount}
                    placeholder="e.g. 9"
                    className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Kiosk PCs</label>
                  <input
                    type="number"
                    min="0"
                    value={kioskCount}
                    onChange={handleKioskCount}
                    placeholder="e.g. 2"
                    className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {courseCount && challengeCount && (
                <div className="flex flex-col gap-1 text-xs text-gray-500">
                  <p>Total Hole PCs: {(parseInt(courseCount) || 0) * (parseInt(challengeCount) || 0)}</p>
                  <p>Total Kiosk PCs: {parseInt(kioskCount) || 0}</p>
                </div>
              )}

              {coursesChallenges.length > 0 && coursesChallenges.map((courseHoles, ci) => (
                <div key={ci} className="flex flex-col gap-3 border rounded p-3 bg-white">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Course {ci + 1}</p>
                  {courseHoles.map((val, hi) => (
                    <div key={hi} className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Hole {hi + 1}</label>
                      <select
                        value={val}
                        onChange={(e) => handleChallengeSelect(ci, hi, e.target.value)}
                        className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">-- Select challenge --</option>
                        {CHALLENGES.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.label} ({c.code})
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white rounded px-5 py-2 text-sm font-medium transition-colors"
            >
              Add Job
            </button>
            <a
              href="/"
              className="border rounded px-5 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}
