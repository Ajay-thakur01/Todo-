import { FolderOpen, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { mockProjects } from '../data/mockProjects'
import { mockTasks } from '../data/mockTasks'
import { Button } from '../components/common/Button'

function ProjectCard({ project }) {
  const taskCount = mockTasks.filter(
    (t) => t.projectId === project.id && !t.parentTaskId && !t.completed
  ).length

  return (
    <Link
      to={`/projects/${project.id}`}
      className="card p-5 hover:shadow-md transition-shadow duration-200 block group"
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
          style={{ backgroundColor: `${project.color}20` }}
        >
          {project.icon}
        </div>
        <span
          className="text-xs font-medium px-2 py-0.5 rounded-full"
          style={{ backgroundColor: `${project.color}20`, color: project.color }}
        >
          {taskCount} tasks
        </span>
      </div>
      <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-red-500 transition-colors">
        {project.name}
      </h3>
      {project.description && (
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1 line-clamp-2">
          {project.description}
        </p>
      )}
    </Link>
  )
}

export default function Projects() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2.5">
          <FolderOpen size={22} className="text-yellow-500" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Projects</h1>
        </div>
        <Button variant="primary" size="sm">
          <Plus size={14} /> New Project
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {mockProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {mockProjects.length === 0 && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">📁</div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
            No projects yet
          </h3>
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">
            Create your first project to organize your tasks.
          </p>
          <Button variant="primary" size="md">
            <Plus size={14} /> Create project
          </Button>
        </div>
      )}
    </div>
  )
}
