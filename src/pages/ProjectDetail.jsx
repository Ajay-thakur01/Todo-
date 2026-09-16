import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { Plus, Settings } from 'lucide-react'
import { toast } from 'sonner'
import { mockProjects, mockSections } from '../data/mockProjects'
import { mockTasks } from '../data/mockTasks'
import { TaskGroup } from '../components/task/TaskGroup'
import { Button } from '../components/common/Button'
import useUIStore from '../store/uiStore'

export default function ProjectDetail() {
  const { projectId } = useParams()
  const { openTaskModal } = useUIStore()
  const [tasks, setTasks] = useState(mockTasks)

  const project = mockProjects.find((p) => p.id === projectId)
  const sections = mockSections.filter((s) => s.projectId === projectId)

  if (!project) {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-4">🔍</div>
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
          Project not found
        </h3>
      </div>
    )
  }

  const handleComplete = (task) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, completed: !t.completed } : t))
    )
  }

  // Tasks with no section
  const unsectionedTasks = tasks.filter(
    (t) => t.projectId === projectId && !t.sectionId && !t.parentTaskId
  )

  return (
    <div>
      {/* Project header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{ backgroundColor: `${project.color}20` }}
          >
            {project.icon}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {project.name}
            </h1>
            {project.description && (
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">
                {project.description}
              </p>
            )}
          </div>
        </div>
        <Button variant="ghost" size="icon" aria-label="Project settings">
          <Settings size={16} />
        </Button>
      </div>

      {/* Sections */}
      {sections.map((section) => {
        const sectionTasks = tasks.filter(
          (t) => t.sectionId === section.id && !t.parentTaskId
        )
        return (
          <TaskGroup
            key={section.id}
            title={section.name}
            tasks={sectionTasks}
            onComplete={handleComplete}
            onEdit={() => toast.info('Editor coming in Phase 5')}
            onDelete={(task) =>
              setTasks((prev) => prev.filter((t) => t.id !== task.id))
            }
            onTaskClick={() => toast.info('Task details coming in Phase 5')}
            onAddTask={() => openTaskModal({ projectId, sectionId: section.id })}
          />
        )
      })}

      {/* Unsectioned tasks */}
      {unsectionedTasks.length > 0 && (
        <TaskGroup
          title="Tasks"
          tasks={unsectionedTasks}
          onComplete={handleComplete}
          onEdit={() => toast.info('Editor coming in Phase 5')}
          onDelete={(task) =>
            setTasks((prev) => prev.filter((t) => t.id !== task.id))
          }
          onTaskClick={() => toast.info('Task details coming in Phase 5')}
          onAddTask={() => openTaskModal({ projectId })}
        />
      )}

      {sections.length === 0 && unsectionedTasks.length === 0 && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">📋</div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
            No tasks yet
          </h3>
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">
            Start adding tasks to {project.name}.
          </p>
          <Button variant="primary" size="md" onClick={() => openTaskModal({ projectId })}>
            <Plus size={14} /> Add task
          </Button>
        </div>
      )}

      {/* Add section */}
      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
        <button
          type="button"
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-blue-500
                     hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded-lg transition-colors"
        >
          <Plus size={14} />
          Add section
        </button>
      </div>
    </div>
  )
}
