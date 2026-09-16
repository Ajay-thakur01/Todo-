import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import useAuthStore from '../store/authStore'

export default function Signup() {
  const navigate = useNavigate()
  const signup = useAuthStore((state) => state.signup)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!acceptedTerms) {
      toast.error('Please accept the Terms & Conditions')
      return
    }

    try {
      setLoading(true)
      await signup(name, email, password)
      toast.success('Your TaskPilot account is ready')
      navigate('/today')
    } catch (error) {
      toast.error(error.message || 'Unable to create account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-zinc-50 dark:bg-zinc-950">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-md mb-4">
          <CheckCircle2 size={24} />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Create your TaskPilot account
        </h1>
        <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">A calmer way to get things done</p>
      </div>

      <div className="card w-full max-w-sm p-7 shadow-sm bg-white dark:bg-zinc-900">
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Name
            <input type="text" value={name} onChange={(event) => setName(event.target.value)} required className="mt-1.5 w-full px-3.5 py-2.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-850 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-zinc-400" />
          </label>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Email Address
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required className="mt-1.5 w-full px-3.5 py-2.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-850 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-zinc-400" />
          </label>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Password
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={6} required className="mt-1.5 w-full px-3.5 py-2.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-850 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-zinc-400" />
          </label>
          <label className="flex items-start gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            <input type="checkbox" checked={acceptedTerms} onChange={(event) => setAcceptedTerms(event.target.checked)} className="mt-0.5 accent-zinc-900" />
            <span>I agree to the <Link to="/terms" className="font-semibold text-zinc-900 dark:text-zinc-100 hover:underline">Terms & Conditions</Link>.</span>
          </label>
          <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold text-sm hover:opacity-90 disabled:opacity-50 transition-opacity">
            {loading ? 'Creating account...' : 'Create account'}
            <ArrowRight size={15} />
          </button>
        </form>
        <p className="text-center text-xs text-zinc-400 dark:text-zinc-500 mt-5">
          Already have an account? <Link to="/login" className="text-zinc-900 dark:text-zinc-100 font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
      <footer className="mt-8 text-center text-xs text-zinc-400 dark:text-zinc-500">© 2026 TaskPilot. All rights reserved.</footer>
    </div>
  )
}