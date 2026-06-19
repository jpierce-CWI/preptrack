import Link from 'next/link'
import BackupControls from './BackupControls'

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto">
      <Link href="/" className="text-lg font-bold tracking-tight">
        PrepTrack
      </Link>
      <div className="flex items-center gap-4">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
          Dashboard
        </Link>
        <BackupControls />
      </div>
    </nav>
  )
}
