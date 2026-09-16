import { Link } from 'react-router-dom'

export default function Terms() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 px-5 py-12">
      <article className="max-w-2xl mx-auto card p-7 md:p-10 bg-white dark:bg-zinc-900">
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">TaskPilot</p>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mt-2">Terms & Conditions</h1>
        <p className="text-xs text-zinc-400 mt-2">Last updated: September 16, 2026</p>
        <div className="prose prose-zinc dark:prose-invert prose-sm mt-8">
          <h2>Using TaskPilot</h2>
          <p>TaskPilot helps you organize personal tasks and reminders. You are responsible for the information you add and for keeping your account credentials private.</p>
          <h2>Reminders</h2>
          <p>Reminder delivery depends on browser permissions, device settings, connectivity, and whether the app is open. TaskPilot does not guarantee delivery of every reminder.</p>
          <h2>Acceptable use</h2>
          <p>Do not use the service to break the law, interfere with the service, or access another person&apos;s account.</p>
          <h2>Changes</h2>
          <p>We may update these terms as the product changes. Continued use after an update means you accept the revised terms.</p>
        </div>
        <Link to="/login" className="inline-block mt-8 text-sm font-semibold text-zinc-900 dark:text-zinc-100 hover:underline">Back to TaskPilot</Link>
        <p className="text-xs text-zinc-400 mt-8">© 2026 TaskPilot. All rights reserved.</p>
      </article>
    </div>
  )
}