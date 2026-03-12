import { useState, useEffect, useCallback } from 'react'
import Navbar from '../components/Navbar'
import { detectionAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import {
  Shield, AlertCircle, CheckCircle, Loader2,
  Zap, HelpCircle, Link as LinkIcon, Type
} from 'lucide-react'

// ── Result Card ────────────────────────────────────────────────────────────────
function ResultCard({ result }) {
  const { result: label, confidence, fake_probability, real_probability, message } = result

  const isFake      = label === 'FAKE'
  const isUncertain = label === 'UNCERTAIN'

  const colours = isFake
    ? { border: 'border-red-700',    bg: 'bg-red-900/20',    text: 'text-red-400',    bar: 'bg-red-500',    Icon: AlertCircle }
    : isUncertain
    ? { border: 'border-yellow-700', bg: 'bg-yellow-900/20', text: 'text-yellow-400', bar: 'bg-yellow-500', Icon: HelpCircle }
    : { border: 'border-green-700',  bg: 'bg-green-900/20',  text: 'text-green-400',  bar: 'bg-green-500',  Icon: CheckCircle }

  const { border, bg, text, bar, Icon } = colours

  return (
    <div className={`${bg} border ${border} rounded-2xl p-6 mt-6 animate-pulse-once`}>
      {/* Top row */}
      <div className="flex items-center gap-4 mb-6">
        <Icon className={text} size={36} />
        <div>
          <p className="text-slate-400 text-xs uppercase tracking-widest">Detection Result</p>
          <p className={`${text} text-3xl font-extrabold`}>{label} NEWS</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-slate-400 text-xs uppercase tracking-widest">Confidence</p>
          <p className={`${text} text-3xl font-extrabold`}>{confidence}%</p>
        </div>
      </div>

      {/* Probability bars */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        {[
          { label: 'Fake Probability', value: fake_probability, colour: 'bg-red-500' },
          { label: 'Real Probability', value: real_probability, colour: 'bg-green-500' },
        ].map(({ label, value, colour }) => (
          <div key={label} className="bg-slate-800/60 rounded-xl p-4">
            <div className="flex justify-between text-xs text-slate-400 mb-2">
              <span>{label}</span><span className="font-bold">{value}%</span>
            </div>
            <div className="bg-slate-700 rounded-full h-2">
              <div className={`${colour} h-2 rounded-full transition-all`} style={{ width: `${value}%` }}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Message */}
      <p className="text-slate-300 text-sm leading-relaxed bg-slate-800/40 rounded-lg px-4 py-3">
        {message}
      </p>
    </div>
  )
}

// ── Dashboard Page ─────────────────────────────────────────────────────────────
function DashboardPage() {
  const { user } = useAuth()
  const [form,    setForm]    = useState({ title: '', content: '', source_url: '' })
  const [result,  setResult]  = useState(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [stats,   setStats]   = useState(null)

  const fetchStats = useCallback(() => {
    detectionAPI.getStats().then((r) => setStats(r.data)).catch(() => {})
  }, [])

  useEffect(() => { fetchStats() }, [fetchStats])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.content.trim()) { setError('Please paste some article content.'); return }
    setError('')
    setLoading(true)
    setResult(null)
    try {
      const res = await detectionAPI.analyze({
        title: form.title,
        content: form.content,
        source_url: form.source_url || undefined,
      })
      setResult(res.data)
      fetchStats()
    } catch (err) {
      const data = err.response?.data
      setError(
        typeof data === 'object'
          ? Object.values(data).flat().join(' ')
          : 'Analysis failed. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  const clearForm = () => { setForm({ title: '', content: '', source_url: '' }); setResult(null); setError('') }

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Welcome back, {user?.username}! 👋</h1>
          <p className="text-slate-400 mt-1">Paste any news article below to check if it's real or fake.</p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Total Scanned', value: stats.total,     colour: 'text-blue-400'  },
              { label: 'Fake Detected', value: stats.fake,      colour: 'text-red-400'   },
              { label: 'Real Verified', value: stats.real,      colour: 'text-green-400' },
            ].map(({ label, value, colour }) => (
              <div key={label} className="bg-slate-800 border border-slate-700 rounded-2xl p-4 text-center">
                <p className={`${colour} text-3xl font-extrabold`}>{value}</p>
                <p className="text-slate-400 text-xs mt-1 uppercase tracking-wide">{label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Form card */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Zap className="text-blue-400" size={20} />
              <h2 className="text-white font-semibold text-lg">Analyse an Article</h2>
            </div>
            {(form.title || form.content) && (
              <button onClick={clearForm} className="text-slate-500 hover:text-slate-300 text-xs transition">
                Clear form
              </button>
            )}
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-800 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                <Type size={13} className="inline mr-1" /> Article Title <span className="text-slate-500">(optional)</span>
              </label>
              <input
                type="text" value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Enter the article headline…"
                className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Article Content <span className="text-red-400">*</span>
              </label>
              <textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder="Paste the full article text here… (minimum 20 characters)"
                rows={9} required
                className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition resize-none"
              />
              <p className="text-slate-500 text-xs mt-1">{form.content.length} chars</p>
            </div>

            {/* URL */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                <LinkIcon size={13} className="inline mr-1" /> Source URL <span className="text-slate-500">(optional)</span>
              </label>
              <input
                type="url" value={form.source_url}
                onChange={(e) => setForm({ ...form, source_url: e.target.value })}
                placeholder="https://example.com/article"
                className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-semibold transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <><Loader2 className="animate-spin" size={18} /> Analysing…</>
              ) : (
                <><Shield size={18} /> Analyse Article</>
              )}
            </button>
          </form>

          {result && <ResultCard result={result} />}
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
