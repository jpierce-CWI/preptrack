'use client'

import { useRouter } from 'next/navigation'

export default function NotFound() {
  const router = useRouter()

  function handleReturnHome() {
    router.push('/')
  }

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">Page Not Found</h2>
      <button
        type="button"
        onClick={handleReturnHome}
        className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
      >
        Return Home
      </button>
    </div>
  )
}
