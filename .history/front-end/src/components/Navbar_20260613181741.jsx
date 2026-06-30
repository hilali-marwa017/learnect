import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { Menu, X, User, LogOut, LayoutDashboard, Shield, Bell, Sun, Moon } from 'lucide-react'

export default function Navbar({ theme, onToggleTheme }) {
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setProfileOpen(false)
    setMobileOpen(false)
  }

  const getDashboardLink = () => {
    if (isAdmin) return '/admin/dashboard'
    if (isEnseignant) return '/enseignant/dashboard'
    return '/etudiant/dashboard'
  }

  return (
    <nav className="sticky top-0 z-50 bg-canvas/80 backdrop-blur-xl border-b border-hairline">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-black text-ink tracking-tight">
              Learn<span className="text-accent-orange">ect</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="/#tutors-section" className="text-sm text-charcoal hover:text-ink transition-colors">
              Professeurs
            </a>
            <a href="/#how-it-works" className="text-sm text-charcoal hover:text-ink transition-colors">
              Comment ça marche
            </a>
            <a href="/#faq-section" className="text-sm text-charcoal hover:text-ink transition-colors">
              FAQ
            </a>

            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                {isAdmin && (
                  <Link to="/admin/dashboard" className="flex items-center gap-1.5 text-sm text-accent-blue hover:text-accent-blue/80 transition-colors">
                    <Shield className="h-4 w-4" />
                    Admin
                  </Link>
                )}
                <button onClick={onToggleTheme} className="p-2 text-charcoal hover:text-ink transition-colors">
                  {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
                <button className="relative p-2 text-charcoal hover:text-ink transition-colors">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 h-2 w-2 bg-accent-red rounded-full" />
                </button>
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-surface-deep transition-colors"
                  >
                    <div className="h-8 w-8 rounded-full bg-accent-orange/10 flex items-center justify-center">
                      <User className="h-4 w-4 text-accent-orange" />
                    </div>
                    <span className="text-sm font-medium text-ink">{user?.prenom}</span>
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-surface-card border border-hairline-strong rounded-xl shadow-xl py-2 animate-fade-in">
                      <div className="px-4 py-3 border-b border-hairline">
                        <p className="text-sm font-semibold text-ink">{user?.prenom} {user?.nom}</p>
                        <p className="text-xs text-mute">{user?.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 bg-accent-blue/10 text-accent-blue text-[10px] font-bold uppercase rounded">
                          {user?.role}
                        </span>
                      </div>
                      <Link
                        to={getDashboardLink()}
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-charcoal hover:bg-surface-deep transition-colors"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Tableau de bord
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-accent-red hover:bg-accent-red/5 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Déconnexion
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button onClick={onToggleTheme} className="p-2 text-charcoal hover:text-ink transition-colors">
                  {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
                <Link to="/login" className="text-sm font-medium text-charcoal hover:text-ink transition-colors">
                  Connexion
                </Link>
                <Link to="/register" className="text-sm font-bold bg-ink text-canvas px-4 py-2 rounded-lg hover:bg-ash transition-colors">
                  S'inscrire
                </Link>
              </div>
            )}
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-charcoal">
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-hairline bg-canvas px-6 py-4 space-y-3 animate-slide-up">
          <a href="/#tutors-section" onClick={() => setMobileOpen(false)} className="block text-sm text-charcoal py-2">
            Professeurs
          </a>
          <a href="/#how-it-works" onClick={() => setMobileOpen(false)} className="block text-sm text-charcoal py-2">
            Comment ça marche
          </a>
          <a href="/#faq-section" onClick={() => setMobileOpen(false)} className="block text-sm text-charcoal py-2">
            FAQ
          </a>
          {isAuthenticated ? (
            <>
              <Link to={getDashboardLink()} onClick={() => setMobileOpen(false)} className="block text-sm text-charcoal py-2">
                Tableau de bord
              </Link>
              {isAdmin && (
                <Link to="/admin/dashboard" onClick={() => setMobileOpen(false)} className="block text-sm text-accent-blue py-2">
                  Admin
                </Link>
              )}
              <button onClick={handleLogout} className="block text-sm text-accent-red py-2">
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileOpen(false)} className="block text-sm text-charcoal py-2">
                Connexion
              </Link>
              <Link to="/register" onClick={() => setMobileOpen(false)} className="block text-sm font-bold text-accent-orange py-2">
                S'inscrire
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}