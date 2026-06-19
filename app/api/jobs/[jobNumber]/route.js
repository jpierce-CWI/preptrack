import { mkdir, readFile, writeFile } from 'fs/promises'
import path from 'path'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const STORE_DIR = path.join(process.cwd(), 'data')
const STORE_PATH = path.join(STORE_DIR, 'preptrack-store.json')

const DEFAULT_STORE = {
  jobs: [
    {
      jobNumber: '5508',
      jobName: 'CWI Test',
      location: '',
      dueDate: '2026-01-01',
      venue: '',
      status: 'Not Started',
      courses: '',
      challenges: [],
      Notes: [],
    },
  ],
  equipment: {},
}

function normalizeStore(store) {
  return {
    jobs: Array.isArray(store?.jobs) ? store.jobs : DEFAULT_STORE.jobs,
    equipment: store?.equipment && typeof store.equipment === 'object' ? store.equipment : {},
  }
}

async function readStore() {
  try {
    const raw = await readFile(STORE_PATH, 'utf8')
    return normalizeStore(JSON.parse(raw))
  } catch {
    await mkdir(STORE_DIR, { recursive: true })
    await writeFile(STORE_PATH, JSON.stringify(DEFAULT_STORE, null, 2), 'utf8')
    return DEFAULT_STORE
  }
}

async function writeStore(store) {
  await mkdir(STORE_DIR, { recursive: true })
  await writeFile(STORE_PATH, JSON.stringify(normalizeStore(store), null, 2), 'utf8')
}

const PATCHABLE_FIELDS = ['jobName', 'location', 'dueDate', 'venue']

export async function PATCH(request, { params }) {
  const { jobNumber } = await params
  const decodedJobNumber = decodeURIComponent(jobNumber)
  const patch = await request.json()
  const nextPatch = Object.fromEntries(
    PATCHABLE_FIELDS.filter((key) => key in patch).map((key) => [key, patch[key]])
  )

  const store = await readStore()
  const index = store.jobs.findIndex((job) => job.jobNumber === decodedJobNumber)
  if (index < 0) {
    return Response.json({ error: 'Job not found' }, { status: 404 })
  }

  const updatedJob = { ...store.jobs[index], ...nextPatch }
  const nextJobs = [...store.jobs]
  nextJobs[index] = updatedJob

  const nextStore = { ...store, jobs: nextJobs }
  await writeStore(nextStore)

  return Response.json({ ok: true, job: updatedJob })
}

export async function DELETE(_request, { params }) {
  const { jobNumber } = await params
  const decodedJobNumber = decodeURIComponent(jobNumber)

  const store = await readStore()
  const exists = store.jobs.some((job) => job.jobNumber === decodedJobNumber)
  if (!exists) {
    return Response.json({ error: 'Job not found' }, { status: 404 })
  }

  const nextJobs = store.jobs.filter((job) => job.jobNumber !== decodedJobNumber)
  const nextEquipment = { ...store.equipment }
  delete nextEquipment[decodedJobNumber]

  const nextStore = {
    ...store,
    jobs: nextJobs,
    equipment: nextEquipment,
  }

  await writeStore(nextStore)

  return Response.json({ ok: true })
}