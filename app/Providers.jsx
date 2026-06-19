'use client'

import { JobProvider } from '@/lib/JobContext'
import { EquipmentProvider } from '@/lib/EquipmentContext'

export default function Providers({ children }) {
  return (
    <JobProvider>
      <EquipmentProvider>{children}</EquipmentProvider>
    </JobProvider>
  )
}
