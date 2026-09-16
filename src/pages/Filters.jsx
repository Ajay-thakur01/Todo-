import { Filter } from 'lucide-react'

export default function Filters() {
  return (
    <div>
      <div className="flex items-center gap-2.5 mb-8">
        <Filter size={22} className="text-teal-500" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Filters</h1>
      </div>
      <div className="card p-8 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Filter System
        </h3>
        <p className="text-sm text-gray-400 dark:text-gray-500">
          Powerful filter builder coming in Phase 11.
          <br />
          Will support: date, project, label, priority, status, keywords.
        </p>
      </div>
    </div>
  )
}
