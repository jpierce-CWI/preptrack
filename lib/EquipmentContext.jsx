'use client'

import { createContext, useContext } from 'react'
import { useJobs } from './JobContext'
import { ATTRACTION_ITEMS } from './attractionItems'

const FALLBACK_ITEMS = [
  { id: 1, name: 'Test Item 1' },
  { id: 2, name: 'Test Item 2' },
  { id: 3, name: 'Test Item 3' },
]

function createEquipmentItem(template, nameOverride, quantityOverride) {
  return {
    ...template,
    name: nameOverride ?? template.name,
    quantity: quantityOverride ?? template.quantity ?? 1,
    picked: false,
    prepped: false,
    date: '',
    signOff: '',
    notes: [],
  }
}

function seedItems(job) {
  const templates = ATTRACTION_ITEMS[job.venue] ?? FALLBACK_ITEMS
 
  //D&B
  if (job.venue !== 'Lucky Putt' && !job.venue.endsWith('Limitless VR')) {
    return templates.map((template) => createEquipmentItem(template))
  }
  
  if (job.venue === 'Lucky Putt') {
  const holesPerCourse = Array.isArray(job.challenges) && Array.isArray(job.challenges[0])
    ? job.challenges[0].filter(Boolean).length
    : Array.isArray(job.challenges) ? job.challenges.filter(Boolean).length : 0
  const courses = parseInt(job.courseCount) || 1
  const kioskCount = parseInt(job.kioskCount) || 1
  const totalHolePCs = Math.max(holesPerCourse * courses, 1)

  return templates.map((template) => {
    if (template.name === 'Hole PC') {
      return createEquipmentItem(template, template.name, totalHolePCs)
    }

    if (template.name === 'Kiosk PC') {
      return createEquipmentItem(template, template.name, kioskCount)
    }

    return createEquipmentItem(template)
  })}

  if (job.venue.endsWith('Limitless VR')) {
    const playerCount = job.playerCount || 0
    const supportPkgCount = job.supportPkg || 0

    return templates.map((template) => {
        if (template.name === 'Pico Headsets' ||
            template.name === 'Pico Accessories' ||
            template.name === 'Strikers' ||
            template.name === 'Trackers' ||
            template.name === 'Tracker Mounts'
        ) {
            return createEquipmentItem(template, template.name, playerCount+supportPkgCount)
        }

        return createEquipmentItem(template)
    })
  }
}



const EquipmentContext = createContext(null)

export function EquipmentProvider({ children }) {
  const { equipment, setEquipment } = useJobs()

  function getEquipment(jobNumber) {
    return equipment[jobNumber] ?? []
  }

  function updateItem(jobNumber, itemId, field, value) {
    setEquipment((prev) => ({
      ...prev,
      [jobNumber]: (prev[jobNumber] ?? []).map((item) =>
        item.id === itemId ? { ...item, [field]: value } : item
      ),
    }))
  }

  function initJob(job) {
    setEquipment((prev) => {
      if (prev[job.jobNumber]) return prev
      return { ...prev, [job.jobNumber]: seedItems(job) }
    })
  }

  return (
    <EquipmentContext.Provider value={{ getEquipment, updateItem, initJob }}>
      {children}
    </EquipmentContext.Provider>
  )
}

export function useEquipment() {
  const ctx = useContext(EquipmentContext)
  if (!ctx) throw new Error('useEquipment must be used inside EquipmentProvider')
  return ctx
}
