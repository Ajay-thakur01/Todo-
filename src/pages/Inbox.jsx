import { Inbox as InboxIcon, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { useState } from 'react'
import { TaskGroup } from '../components/task/TaskGroup'
import { Button } from '../components/common/Button'
import { mockTasks } from '../data/mockTasks'
import useUIStore from '../store/uiStore'

export default function Inbox() {
  const { openTaskModal } = useUIStore()
  const [tasks, setTasks] = useState(
    mockTasks.filter((t) => !t.projectId && !t.parentTaskId)
  )

  const handleComplete = (task) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, completed: !t.completed } : t))
    )
    if (!task.completed) toast.success(`"${task.title}" completed!`)
  }

  return (
    <div>
      <div className="flex items-center gap-2.5 mb-8">
        <InboxIcon size={22} className="text-blue-500" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Inbox</h1>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">📥</div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Your inbox is empty
          </h3>
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">
            Tasks without a project land here.
          </p>
          <Button variant="primary" size="md" onClick={() => openTaskModal()}>
            <Plus size={14} /> Add task
          </Button>
        </div>
      ) : (
        <TaskGroup
          title="Inbox"
          tasks={tasks}
          onComplete={handleComplete}
          onEdit={() => toast.info('Editor coming in Phase 5')}
          onDelete={(task) =>
            setTasks((prev) => prev.filter((t) => t.id !== task.id))
          }
          onTaskClick={() => toast.info('Task details coming in Phase 5')}
          onAddTask={() => openTaskModal()}
        />
      )}
    </div>
  )
}
