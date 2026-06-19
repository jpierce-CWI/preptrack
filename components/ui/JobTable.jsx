import Link from 'next/link'


function DueDateCell({ dueDate }) {
  if (!dueDate) return <span className="text-gray-400">N/A</span>
  const due = new Date(dueDate)
  const diff = due - new Date()
  const isBad = diff <= 7 * 24 * 60 * 60 * 1000
  const formatted = due.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
  return (
    <span className="flex items-center gap-2">
      {formatted}
      {/* <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${isBad ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
        {isBad ? 'Late' : 'On Time'}
      </span> */}
    </span>
  )
}

function StatusBadge({ status }) {
  const colors = {
    'In Progress': 'bg-blue-100 text-blue-700',
    'Not Started': 'bg-gray-100 text-gray-600',
    'Complete':    'bg-green-100 text-green-700',
  }
  return (
    <span className={`text-xs font-medium px-2 py-1 rounded-full ${colors[status] ?? 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  )
}

export default function JobTable({ jobs, title, search }) {
    return (
          <div className="mt-4 bg-white rounded-lg border shadow-sm overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th colSpan={4} className="text-center py-3 text-md font-semibold text-blue-600 uppercase tracking-wide">{title}</th>
            </tr>
            <tr className="bg-gray-50 border-b">
              <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wide w-24">Job #</th>
              <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Job Name</th>
              <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wide w-52">Due Date</th>
              <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wide w-36">Status</th>
            </tr>
          </thead>
          <tbody>
            {jobs.length === 0 && (
              <tr>
                <td colSpan={4} className="py-12 text-center text-gray-400 text-sm">
                  {search ? 'No jobs match your search.' : 'No jobs available.'}
                </td>
              </tr>
            )}
            {jobs.map((job) => (
              <tr key={job.jobNumber} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                <td className="py-4 px-5">
                  <Link href={`/job/${job.jobNumber}`} className="text-blue-600 hover:underline font-semibold">
                    {job.jobNumber}
                  </Link>
                </td>
                <td className="py-4 px-5 font-medium">{job.jobName}</td>
                <td className="py-4 px-5 text-sm"><DueDateCell dueDate={job.dueDate} /></td>
                <td className="py-4 px-5"><StatusBadge status={job.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
)}