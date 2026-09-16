# TaskPilot - Modern Productivity & Task Management App

> A production-quality, Todoist-inspired productivity platform built with React and a modern frontend stack.
> Manage tasks, projects, labels, subtasks, due dates, reminders, and more — all in a clean, responsive interface.

---

## 📸 Overview

TaskPilot is a full-featured task management web application designed as a scalable productivity platform. It supports tasks, projects, sections, subtasks, priorities, labels, due dates, reminders, a calendar view, natural-language task creation, AI features, file attachments, comments, and a collaboration-ready architecture.

Design inspiration: **Todoist · Linear · Notion · Modern SaaS Dashboards**

---

## ✨ Features (Planned & In Progress)

| Feature | Status |
|---|---|
| App Shell (Sidebar, Header, Layout) | ✅ Phase 2 |
| Today / Upcoming / Inbox views | ✅ Phase 2 |
| Task CRUD (Create, Read, Update, Delete) | 🔄 Phase 5 |
| Projects & Sections | 🔄 Phase 6 |
| Subtasks | 🔄 Phase 7 |
| Calendar View | 🔄 Phase 9 |
| Natural Language Task Creation | 🔄 Phase 10 |
| Filter & Search System | 🔄 Phase 11 |
| Reminders & Notifications | 🔄 Phase 12 |
| File Attachments | 🔄 Phase 13 |
| Comments & Rich Text | 🔄 Phase 14 |
| AI Assistant | 🔄 Phase 15 |
| Dashboard & Analytics | 🔄 Phase 16 |
| Drag & Drop | 🔄 Phase 17 |
| Authentication | 🔄 Phase 18 |
| Backend / API Integration | 🔄 Phase 19 |

---

## 🛠️ Technology Stack

### ⚡ Core Framework

| Technology | Version | Purpose |
|---|---|---|
| [React](https://react.dev/) | ^18 | UI component library — the core rendering engine of the app |
| [Vite](https://vitejs.dev/) | ^5 | Lightning-fast build tool and dev server, replacing CRA |
| JavaScript (ES2022+) | — | Primary language (no TypeScript in this project) |

---

### 🎨 Styling

| Technology | Version | Purpose |
|---|---|---|
| [Tailwind CSS](https://tailwindcss.com/) | ^3 | Utility-first CSS framework — used for all layout, spacing, color, and responsive design |
| [@tailwindcss/typography](https://tailwindcss.com/docs/typography-plugin) | — | Prose styling for rich text content (descriptions, comments) |
| PostCSS + Autoprefixer | — | Required PostCSS pipeline for Tailwind CSS processing |
| Inter (Google Fonts) | — | Primary typeface for the entire UI |

> **Why Tailwind CSS?** Tailwind provides maximum flexibility with utility classes, eliminates CSS file bloat, and makes dark mode and responsive design trivial to implement.

---

### 🗺️ Routing

| Technology | Version | Purpose |
|---|---|---|
| [React Router DOM](https://reactrouter.com/) | ^6 | Client-side routing for all app pages (`/today`, `/inbox`, `/projects/:id`, etc.) |

**Routes:**
```
/login           → Login page
/signup          → Signup page
/                → Redirects to /today
/inbox           → Inbox view
/today           → Today's tasks
/upcoming        → Upcoming tasks grouped by date
/calendar        → Full calendar view
/projects        → All projects list
/projects/:id    → Individual project with sections & tasks
/filters         → Saved filters
/dashboard       → Productivity analytics
/settings        → User settings
```

---

### 🗄️ State Management

| Technology | Version | Purpose |
|---|---|---|
| [Zustand](https://zustand-demo.pmnd.rs/) | ^4 | Lightweight global state for UI state (sidebar, modals, theme, auth) |
| [TanStack React Query](https://tanstack.com/query) | ^5 | Server-state management — handles fetching, caching, and synchronizing async data |

> **Why two state systems?**  
> Zustand manages *client/UI state* (is the sidebar open? what theme is active?).  
> React Query manages *server/data state* (tasks, projects, labels — things that come from an API).

---

### 🌐 API Communication

| Technology | Version | Purpose |
|---|---|---|
| [Axios](https://axios-http.com/) | ^1 | HTTP client for all backend API calls — wrapped in service modules |

**Service Architecture:**
```
services/
├── api.js              ← Axios instance + interceptors
├── authService.js      ← Login, signup, logout, current user
├── taskService.js      ← Task CRUD operations
├── projectService.js   ← Project management
├── labelService.js     ← Label management
├── commentService.js   ← Task comments
├── attachmentService.js← File upload/management
└── aiService.js        ← AI assistant abstraction
```

---

### 📝 Forms & Validation

| Technology | Version | Purpose |
|---|---|---|
| [React Hook Form](https://react-hook-form.com/) | ^7 | Performant, uncontrolled form management for task creation and settings |
| [Zod](https://zod.dev/) | ^3 | Schema-based runtime validation — validates all form inputs and API payloads |

> Forms use RHF for performance (no re-render on every keystroke) and Zod schemas for type-safe validation rules.

---

### 📅 Date & Time

| Technology | Version | Purpose |
|---|---|---|
| [date-fns](https://date-fns.org/) | ^3 | Modular date utility library — formatting, comparing, grouping tasks by date |
| [chrono-node](https://github.com/wanasit/chrono) | ^2 | Natural language date/time parser — converts "tomorrow at 6pm" into structured date objects |

> **Why date-fns over Moment.js?** date-fns is tree-shakeable (only import what you use), immutable, and actively maintained. Moment.js is deprecated.

---

### 🖼️ Icons

| Technology | Version | Purpose |
|---|---|---|
| [Lucide React](https://lucide.dev/) | ^0.400+ | Clean, consistent icon set used throughout the UI — check, calendar, flag, inbox, etc. |

---

### 🔔 Notifications & Toasts

| Technology | Version | Purpose |
|---|---|---|
| [Sonner](https://sonner.emilkowal.ski/) | ^1 | Beautiful, accessible toast notifications for success/error/info messages |

---

### 📦 Drag & Drop

| Technology | Version | Purpose |
|---|---|---|
| [@dnd-kit/core](https://dndkit.com/) | ^6 | Accessible drag-and-drop primitives |
| [@dnd-kit/sortable](https://dndkit.com/) | ^7 | Sortable list abstraction built on dnd-kit core |

> Used for: reordering tasks, moving tasks between sections, reordering subtasks and projects.

---

### 📆 Calendar

| Technology | Version | Purpose |
|---|---|---|
| [FullCalendar](https://fullcalendar.io/) | ^6 | Full-featured calendar with Month, Week, Day views — tasks render as calendar events |

Packages used:
```
@fullcalendar/react
@fullcalendar/core
@fullcalendar/daygrid
@fullcalendar/timegrid
@fullcalendar/interaction
```

---

### 📎 File Uploads

| Technology | Version | Purpose |
|---|---|---|
| [React Dropzone](https://react-dropzone.js.org/) | ^14 | Drag-and-drop file attachment UI for tasks |

> File metadata (name, URL, size) is stored separately from task data. Actual files will eventually be uploaded to **Cloudinary or AWS S3**.

---

### 📝 Rich Text Editor

| Technology | Version | Purpose |
|---|---|---|
| [Tiptap](https://tiptap.dev/) | ^2 | Headless rich text editor for task descriptions and comments |

Supported formatting: **Bold · Italic · Headings · Bullet Lists · Numbered Lists · Links · Code**

---

### 📊 Charts & Analytics

| Technology | Version | Purpose |
|---|---|---|
| [Recharts](https://recharts.org/) | ^2 | Composable chart library for the productivity dashboard |

Used for: task completion bar charts, weekly progress, overdue tracking.

---

## 📁 Project Structure

```
productivity-app/
│
├── public/                     ← Static assets
│
├── src/
│   ├── assets/                 ← Images, SVGs
│   │
│   ├── components/
│   │   ├── common/             ← Button, Input, Modal, Badge, Checkbox, Tooltip
│   │   ├── layout/             ← AppLayout, Sidebar, Header, MobileNav
│   │   ├── task/               ← TaskItem, TaskGroup, TaskList, TaskForm
│   │   ├── project/            ← ProjectItem, ProjectForm, SectionList
│   │   ├── label/              ← LabelBadge, LabelSelector, LabelManager
│   │   ├── filter/             ← FilterBar, FilterTag, SavedFilters
│   │   ├── calendar/           ← CalendarView, CalendarEvent
│   │   ├── comments/           ← CommentList, CommentItem, CommentInput
│   │   ├── attachments/        ← AttachmentList, AttachmentDropzone
│   │   ├── ai/                 ← AIAssistant, AIChat, AIMessage
│   │   └── dashboard/          ← StatsCard, CompletionChart, ProgressBar
│   │
│   ├── pages/
│   │   ├── Today.jsx
│   │   ├── Inbox.jsx
│   │   ├── Upcoming.jsx
│   │   ├── Calendar.jsx
│   │   ├── Projects.jsx
│   │   ├── ProjectDetail.jsx
│   │   ├── Filters.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Settings.jsx
│   │   ├── Login.jsx
│   │   └── Signup.jsx
│   │
│   ├── layouts/
│   │   └── AppLayout.jsx       ← Sidebar + Header + <Outlet />
│   │
│   ├── hooks/
│   │   ├── useMediaQuery.js    ← Responsive breakpoint detection
│   │   ├── useSidebar.js       ← Sidebar open/close logic
│   │   ├── useTasks.js         ← Task query hooks
│   │   └── useProjects.js      ← Project query hooks
│   │
│   ├── store/
│   │   ├── uiStore.js          ← Sidebar, modal, theme state (Zustand)
│   │   └── authStore.js        ← Auth state placeholder (Zustand)
│   │
│   ├── services/
│   │   ├── api.js              ← Axios base instance
│   │   ├── authService.js
│   │   ├── taskService.js
│   │   ├── projectService.js
│   │   ├── labelService.js
│   │   ├── commentService.js
│   │   ├── attachmentService.js
│   │   └── aiService.js
│   │
│   ├── utils/
│   │   ├── taskSorter.js       ← Priority/date sorting utilities
│   │   ├── taskParser.js       ← Natural language → structured task data
│   │   └── filterParser.js     ← Filter string → filter object
│   │
│   ├── data/
│   │   ├── mockTasks.js        ← Sample tasks for development
│   │   ├── mockProjects.js     ← Sample projects
│   │   └── mockLabels.js       ← Sample labels
│   │
│   ├── App.jsx                 ← Root component with router
│   ├── main.jsx                ← Entry point
│   └── index.css               ← Tailwind directives + global styles
│
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
├── .eslintrc.cjs
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- npm >= 9

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/productivity-app.git
cd productivity-app

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at **http://localhost:5173**

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🎨 Design System

| Token | Value |
|---|---|
| Primary Font | Inter (Google Fonts) |
| Base Radius | 6px |
| Sidebar Width | 260px |
| Dark Mode | Tailwind `class` strategy |

### Priority Colors

| Priority | Label | Color |
|---|---|---|
| P1 | Urgent | 🔴 Red |
| P2 | High | 🟠 Orange |
| P3 | Medium | 🔵 Blue |
| P4 | Low | ⚫ Gray |

---

## 🏗️ Development Phases

| Phase | Focus | Status |
|---|---|---|
| 1 | Project Setup & Config | ✅ Done |
| 2 | App Shell & Layout | ✅ Done |
| 3 | Routing | 🔄 In Progress |
| 4 | Mock Data Layer | 🔄 In Progress |
| 5 | Task Management CRUD | ⏳ Pending |
| 6 | Projects & Sections | ⏳ Pending |
| 7 | Subtasks | ⏳ Pending |
| 8 | Today & Upcoming Views | ⏳ Pending |
| 9 | Calendar View | ⏳ Pending |
| 10 | Natural Language Parsing | ⏳ Pending |
| 11 | Filters & Search | ⏳ Pending |
| 12 | Reminders | ⏳ Pending |
| 13 | File Attachments | ⏳ Pending |
| 14 | Comments & Rich Text | ⏳ Pending |
| 15 | AI Assistant | ⏳ Pending |
| 16 | Dashboard & Analytics | ⏳ Pending |
| 17 | Drag & Drop | ⏳ Pending |
| 18 | Authentication Integration | ⏳ Pending |
| 19 | Backend / API Integration | ⏳ Pending |
| 20 | Testing & Performance | ⏳ Pending |
| 21 | Deployment | ⏳ Pending |

---

## 🔐 Security Notes

- API keys are **never** stored in frontend code
- AI provider keys live only on the backend
- Frontend validation is for UX only — backend validation is authoritative
- Rich text content is sanitized before render
- Auth tokens are managed securely via httpOnly cookies (backend phase)

---

## 📄 License

This project is for educational and personal use. Not affiliated with or derived from Todoist®.

---

## 👨‍💻 Author

Built incrementally as a full-featured productivity platform.  
Each phase is verified before proceeding to the next.
