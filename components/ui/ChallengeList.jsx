import { CHALLENGE_MAP } from '@/lib/challenges'

/**
 * challenges: 2D array - challenges[courseIndex][holeIndex] = code string
 * Renders each entry as: CxHy - Challenge Name (CODE)
 */
export default function ChallengeList({ challenges }) {
  if (!Array.isArray(challenges) || challenges.length === 0) return null

  const rows = []
  challenges.forEach((course, ci) => {
    if (!Array.isArray(course)) return
    course.forEach((code, hi) => {
      if (!code) return
      const entry = CHALLENGE_MAP[code]
      rows.push({
        label: `C${ci + 1}H${hi + 1}`,
        name: entry?.label ?? code,
        code,
      })
    })
  })

  if (rows.length === 0) return null

  return (
    <div className="flex flex-col gap-1">
      {rows.map((row) => (
        <div key={row.label} className="flex items-center gap-2 text-sm">
          <span className="font-mono text-xs font-semibold text-gray-500 w-10">{row.label}</span>
          <span className="text-gray-800">{row.name}</span>
          <span className="text-xs text-gray-400">({row.code})</span>
        </div>
      ))}
    </div>
  )
}