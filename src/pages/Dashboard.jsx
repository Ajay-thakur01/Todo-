import { LayoutDashboard, CheckCircle2, AlertCircle, Clock, TrendingUp } from 'lucide-react'
import { mockTasks } from '../data/mockTasks'
import { filterOverdueTasks, filterTodayTasks } from '../utils/taskSorter'
import { format, subDays } from 'date-fns'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

// Mock weekly completion data
const weeklyData = Array.from({ length: 7 }, (_, i) => ({
  day: format(subDays(new Date(), 6 - i), 'EEE'),
  completed: Math.floor(Math.random() * 8) + 1,
}))

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="card p-5 flex items-center gap-4">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: `${color}20` }}
      >
        <Icon size={22} style={{ color }} />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
        <p className="text-sm text-gray-400 dark:text-gray-500">{label}</p>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const total = mockTasks.filter((t) => !t.parentTaskId).length
  const completed = mockTasks.filter((t) => t.completed && !t.parentTaskId).length
  const overdue = filterOverdueTasks(mockTasks).length
  const dueToday = filterTodayTasks(mockTasks).length
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

  return (
    <div>
      <div className="flex items-center gap-2.5 mb-8">
        <LayoutDashboard size={22} className="text-indigo-500" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={CheckCircle2} label="Completed" value={completed} color="#10b981" />
        <StatCard icon={AlertCircle} label="Overdue" value={overdue} color="#ef4444" />
        <StatCard icon={Clock} label="Due Today" value={dueToday} color="#f97316" />
        <StatCard icon={TrendingUp} label="Completion %" value={`${completionRate}%`} color="#6366f1" />
      </div>

      {/* Weekly chart */}
      <div className="card p-6">
        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-6">
          Tasks Completed This Week
        </h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={weeklyData} barSize={28}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 12, fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                fontSize: '13px',
              }}
            />
            <Bar dataKey="completed" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
