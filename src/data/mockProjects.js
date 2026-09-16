// Mock Projects
export const mockProjects = [
  {
    id: 'project-1',
    name: 'Personal',
    description: 'Personal tasks and goals',
    icon: '🏠',
    color: '#8b5cf6',
    archived: false,
    order: 0,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'project-2',
    name: 'Work',
    description: 'Professional tasks and projects',
    icon: '💼',
    color: '#3b82f6',
    archived: false,
    order: 1,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'project-3',
    name: 'Development',
    description: 'Software development projects',
    icon: '💻',
    color: '#10b981',
    archived: false,
    order: 2,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'project-4',
    name: 'College',
    description: 'Academic tasks and assignments',
    icon: '🎓',
    color: '#f59e0b',
    archived: false,
    order: 3,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
]

// Mock Sections
export const mockSections = [
  { id: 'section-1', projectId: 'project-3', name: 'Frontend', order: 0 },
  { id: 'section-2', projectId: 'project-3', name: 'Backend', order: 1 },
  { id: 'section-3', projectId: 'project-3', name: 'Deployment', order: 2 },
  { id: 'section-4', projectId: 'project-2', name: 'In Progress', order: 0 },
  { id: 'section-5', projectId: 'project-2', name: 'Review', order: 1 },
]
