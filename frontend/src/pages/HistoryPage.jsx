import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { detectionAPI } from '../services/api'
import {
  AlertCircle, CheckCircle, HelpCircle,
  Trash2, ChevronLeft, ChevronRight, History, ExternalLink
} from 'lucide-react'

function HistoryPage() {
  const [history,    setHistory]    = useState([])
  const [loading,    setLoading]    = useState(true)
  const [page,       setPage]       = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total,      setTotal]      = useState(0)
  const [deleting,   setDeleting]   = useState(null)

  const fetchHistory = async (p = 1) => {
    setLoading(true)
    try {
      const res = await detectionAPI.getHistory(p)
      setHistory(res.data.results)
      setTotal(res.data.count)
      setTotalPages(Math.ceil(res.data.count / 10))
    } catch {
      /* silently fail */
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchHistory(page) }, [page])

  const handleDelete = async (id) => {
    setDeleting(id)
    try {
      await detectionAPI.deleteAnalysis(id)
      setHistory((prev) => prev.filter((item) => item.id !== id))
      setTotal((t) => t - 1)
    } catch { /* ignore */ }
    finally { setDeleting(null) }
  }

  const styleFor = (result) => ({
    FAKE:      { Icon: AlertCircle,  text: 'text-red-400',    bg: 'bg-red-900/20 border-red-800',      label: 'FAKE NEWS'      },
    REAL:      { Icon: CheckCircle,  text: 'text-green-400',  bg: 'bg-green-900/20 border-green-800',  label: 'REAL NEWS'      },
    UNCERTAIN: { Icon: HelpCircle,   text: 'text-yellow-400', bg: 'bg-yellow-900/20 border-yellow-800', label: 'UNCERTAIN'      },
  }[result] ?? { Icon: HelpCircle, text: 'text-slate-400', bg: 'bg-slate-800 border-slate-700', label: result })

  const fmt = (iso) =>
    new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center gap-3 mb-8">
          <History className="text-blue-400" size={24} />
          <h1 className="text-2xl font-bold text-white">Analysis History</h1>
          {total > 0 && (
            <span className="ml-auto text-slate-400 text-sm">{total} total</span>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-slate-400 mt-4">Loading your history…</p>
          </div>
        )}

        {/* Empty */}
        {!loading && history.length === 0 && (
          <div className="text-center py-20 bg-slate-800 border border-slate-700 rounded-2xl">
            <History className="text-slate-600 mx-auto mb-4" size={48} />
            <p className="text-white font-semibold mb-2 text-lg">No analyses yet</p>
            <p className="text-slate-400 text-sm">Head to the Dashboard to analyse your first article.</p>
          </div>
        )}

        {/* List */}
        {!loading && history.length > 0 && (
          <div className="space-y-4">
            {history.map((item) => {
              const { Icon, text, bg, label } = styleFor(item.result)
              return (
                <div key={item.id} className={`${bg} border rounded-2xl p-5`}>
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">

                      {/* Result badge + confidence */}
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <Icon className={text} size={16} />
                        <span className={`${text} font-bold text-sm`}>{label}</span>
                        <span className="text-slate-400 text-sm">· {item.confidence}% confidence</span>
                        {item.source_url && (
                          <a href={item.source_url} target="_blank" rel="noopener noreferrer"
                            className="ml-auto flex items-center gap-1 text-blue-400 hover:text-blue-300 text-xs">
                            Source <ExternalLink size={12} />
                          </a>
                        )}
                      </div>

                      {/* Title */}
                      {item.title && (
                        <p className="text-white font-medium text-sm mb-1 truncate">{item.title}</p>
                      )}

                      {/* Content preview */}
                      <p className="text-slate-400 text-sm line-clamp-2">{item.content}</p>

                      {/* Date */}
                      <p className="text-slate-500 text-xs mt-2">{fmt(item.created_at)}</p>
                    </div>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={deleting === item.id}
                      className="flex-shrink-0 p-2 text-slate-500 hover:text-red-400 disabled:opacity-40 transition rounded-lg hover:bg-red-900/20"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* Probability bars */}
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    {[
                      { label: 'Fake', value: item.fake_probability, colour: 'bg-red-500' },
                      { label: 'Real', value: item.real_probability, colour: 'bg-green-500' },
                    ].map(({ label, value, colour }) => (
                      <div key={label}>
                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                          <span>{label}</span><span>{value}%</span>
                        </div>
                        <div className="bg-slate-700 rounded-full h-1.5">
                          <div className={`${colour} h-1.5 rounded-full`} style={{ width: `${value}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-8">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
              className="p-2 text-slate-400 hover:text-white disabled:opacity-40 transition">
              <ChevronLeft size={20} />
            </button>
            <span className="text-slate-400 text-sm">Page {page} of {totalPages}</span>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="p-2 text-slate-400 hover:text-white disabled:opacity-40 transition">
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default HistoryPage
