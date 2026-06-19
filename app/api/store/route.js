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

async function readStore() {
  try {
    const raw = await readFile(STORE_PATH, 'utf8')
    return JSON.parse(raw)
  } catch {
    await mkdir(STORE_DIR, { recursive: true })
    await writeFile(STORE_PATH, JSON.stringify(DEFAULT_STORE, null, 2), 'utf8')
    return DEFAULT_STORE
  }
}

export async function GET() {
  const store = await readStore()
  return Response.json(store)
}

export async function PUT(request) {
  const body = await request.json()
  const nextStore = {
    jobs: Array.isArray(body.jobs) ? body.jobs : DEFAULT_STORE.jobs,
    equipment: body.equipment && typeof body.equipment === 'object' ? body.equipment : {},
  }

  await mkdir(STORE_DIR, { recursive: true })
  await writeFile(STORE_PATH, JSON.stringify(nextStore, null, 2), 'utf8')

  return Response.json({ ok: true })
}