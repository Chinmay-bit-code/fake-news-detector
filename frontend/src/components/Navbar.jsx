import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Shield, LogOut, History, LayoutDashboard, Menu, X } from 'lucide-react'
import { useState } from 'react'

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <nav className="bg-slate-800 border-b border-slate-700 px-6 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-white font-bold text-xl">
          <Shield className="text-blue-400" size={24} />
          TruthGuard
        </Link>

        {/* Desktop nav */}
        {user ? (
          <div className="hidden sm:flex items-center gap-6">
            <Link to="/dashboard" className="flex items-center gap-1.5 text-slate-300 hover:text-white transition text-sm">
              <LayoutDashboard size={15} /> Dashboard
            </Link>
            <Link to="/history" className="flex items-center gap-1.5 text-slate-300 hover:text-white transition text-sm">
              <History size={15} /> History
            </Link>
            <span className="text-slate-500 text-sm hidden md:inline">{user.email}</span>
            <button onClick={handleLogout} className="flex items-center gap-1.5 text-red-400 hover:text-red-300 transition text-sm">
              <LogOut size={15} /> Logout
            </button>
          </div>
        ) : (
          <div className="hidden sm:flex items-center gap-4">
            <Link to="/login" className="text-slate-300 hover:text-white transition text-sm">Login</Link>
            <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition text-sm font-medium">
              Sign Up Free
            </Link>
          </div>
        )}

        {/* Mobile hamburger */}
        <button className="sm:hidden text-slate-400 hover:text-white" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="sm:hidden mt-4 pb-2 border-t border-slate-700 pt-4 space-y-3">
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setOpen(false)} className="block text-slate-300 hover:text-white">Dashboard</Link>
              <Link to="/history"   onClick={() => setOpen(false)} className="block text-slate-300 hover:text-white">History</Link>
              <button onClick={() => { setOpen(false); handleLogout() }} className="block text-red-400 hover:text-red-300">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login"    onClick={() => setOpen(false)} className="block text-slate-300 hover:text-white">Login</Link>
              <Link to="/register" onClick={() => setOpen(false)} className="block text-blue-400 hover:text-blue-300">Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar
