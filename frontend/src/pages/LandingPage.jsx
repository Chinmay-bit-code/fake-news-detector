import { Link } from 'react-router-dom'
import { Shield, Zap, BarChart3, Lock, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react'
import Navbar from '../components/Navbar'

function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-900/30 border border-blue-800 rounded-full px-4 py-2 mb-8 text-blue-400 text-sm font-medium">
            <Zap size={14} /> AI-Powered Detection Engine
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
            Stop Fake News
            <span className="text-blue-400"> Before It Spreads</span>
          </h1>

          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            TruthGuard uses advanced machine learning (TF-IDF + Logistic Regression) to
            instantly analyse any news article and tell you if it's real or fake — with a
            confidence score.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/register" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition">
              Get Started Free <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="border border-slate-600 hover:border-slate-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────────── */}
      <section className="py-16 px-6 bg-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Shield,   title: 'AI Analysis',       desc: 'NLP model trained on thousands of real and fake news examples using TF-IDF feature extraction.' },
              { icon: BarChart3, title: 'Confidence Score', desc: 'See fake vs real probability as a percentage so you can judge how confident the model is.' },
              { icon: Lock,     title: 'Secure & Private', desc: 'All analyses are private to your account, protected with JWT authentication and PostgreSQL.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 hover:border-blue-700 transition">
                <div className="bg-blue-900/30 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="text-blue-400" size={22} />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Live demo cards ───────────────────────────────────────────────────── */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-4">Example Results</h2>
          <p className="text-slate-400 text-center mb-10">See how TruthGuard classifies articles in real time.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-900/20 border border-green-800 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="text-green-400" size={20} />
                <span className="text-green-400 font-bold text-sm">REAL NEWS</span>
                <span className="ml-auto bg-green-900/50 text-green-400 text-xs font-bold px-2 py-1 rounded-full">94.2% confident</span>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                "Scientists discover new treatment for Alzheimer's disease showing promising results in Phase 3 clinical trials…"
              </p>
              <div className="mt-4">
                <div className="flex justify-between text-xs text-slate-400 mb-1"><span>Real</span><span>94%</span></div>
                <div className="bg-slate-700 rounded-full h-1.5">
                  <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '94%' }}></div>
                </div>
              </div>
            </div>
            <div className="bg-red-900/20 border border-red-800 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="text-red-400" size={20} />
                <span className="text-red-400 font-bold text-sm">FAKE NEWS</span>
                <span className="ml-auto bg-red-900/50 text-red-400 text-xs font-bold px-2 py-1 rounded-full">97.8% confident</span>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                "SHOCKING: Government hiding alien bodies — mainstream media won't tell you the TRUTH they discovered…"
              </p>
              <div className="mt-4">
                <div className="flex justify-between text-xs text-slate-400 mb-1"><span>Fake</span><span>98%</span></div>
                <div className="bg-slate-700 rounded-full h-1.5">
                  <div className="bg-red-500 h-1.5 rounded-full" style={{ width: '98%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────────── */}
      <section className="py-16 px-6 bg-blue-900/20 border-t border-blue-900/40">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to fight misinformation?</h2>
          <p className="text-slate-400 mb-8">Create a free account and start detecting fake news in seconds.</p>
          <Link to="/register" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition">
            Create Free Account <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-800 py-8 px-6 text-center text-slate-500 text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Shield size={16} className="text-blue-400" />
          <span className="text-white font-semibold">TruthGuard</span>
        </div>
        <p>AI-Based Fake News Detection System · Built with Django + React</p>
      </footer>
    </div>
  )
}

export default LandingPage
