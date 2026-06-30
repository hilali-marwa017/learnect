import React, { useState } from 'react';
import { Menu, X, GraduationCap, Sparkles, Sun, Moon, LogOut, User } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ theme, onToggleTheme }) {
  const [isOpen, setIsOpen] = useState(false);
  const { user, role, logout, dashboardPath } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsOpen(false);
  };

  const scrollTo = (sectionId) => {
    if (location.pathname === '/') {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(`/?scrollTo=${sectionId}`);
    }
    setIsOpen(false);
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-canvas/85 backdrop-blur-md border-b border-hairline transition-all duration-350">
      <div className="flex justify-between items-center h-16 px-6 max-w-7xl mx-auto">

        <div className="flex items-center gap-8">
          <Link to="/" className="font-display-xl text-2xl text-ink tracking-tight flex items-center gap-2 hover:opacity-95 transition-opacity">
            <GraduationCap className="h-6 w-6 text-accent-orange" />
            <span>Learnect<span className="text-accent-orange">.ma</span></span>
          </Link>
          <nav className="hidden lg:flex items-center gap-6 text-sm">
            <Link to="/teachers" className="text-charcoal hover:text-accent-orange transition-colors">Trouver un Prof</Link>
            <button onClick={() => scrollTo('how-it-works')} className="text-charcoal hover:text-accent-orange transition-colors cursor-pointer">Comment ça marche</button>
            <button onClick={() => scrollTo('verification-section')} className="text-charcoal hover:text-accent-orange transition-colors cursor-pointer">Qualité certifiée</button>
          </nav>
        </div>

        <div className="hidden lg:flex items-center gap-4">
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-lg bg-surface-elevated hover:bg-surface-elevated/80 text-ink border border-hairline transition-all cursor-pointer"
          >
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4 text-accent-yellow" />}
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              <Link
                to={dashboardPath()}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-hairline bg-surface-elevated text-ink hover:text-accent-orange transition-all text-xs font-semibold"
              >
                {user.photo
                  ? <img src={`http://localhost:8000/storage/${user.photo}`} alt="" className="h-5 w-5 rounded-full object-cover" />
                  : <User className="h-4 w-4 text-mute" />
                }
                <span>Mon Espace ({role === 'enseignant' ? 'Prof' : role === 'admin' ? 'Admin' : 'Élève'})</span>
              </Link>
              <button onClick={handleLogout} className="p-2 text-mute hover:text-accent-red transition-all cursor-pointer" title="Déconnexion">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="text-ink text-sm font-semibold px-4 py-2 hover:text-ash transition-colors">Connexion</Link>
              <button
                onClick={() => navigate('/register')}
                className="flex items-center gap-2 bg-ink text-canvas px-4 py-2 rounded-lg text-xs font-bold hover:bg-ash transition-all active:scale-95 cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5 text-accent-orange" />
                <span>Devenir Tuteur / Élève</span>
              </button>
            </>
          )}
        </div>

        <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 text-ink cursor-pointer">
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {isOpen && (
        <div className="lg:hidden w-full bg-canvas/95 border-b border-hairline py-4 px-6 space-y-4 backdrop-blur-lg flex flex-col">
          <Link to="/teachers" onClick={() => setIsOpen(false)} className="py-2 text-ink hover:text-accent-orange border-b border-divider-soft font-semibold">Trouver un Prof</Link>
          <button onClick={() => scrollTo('how-it-works')} className="py-2 text-left text-charcoal border-b border-divider-soft">Comment ça marche</button>
          <button onClick={() => scrollTo('verification-section')} className="py-2 text-left text-charcoal border-b border-divider-soft">Qualité certifiée</button>
          <div className="flex flex-col gap-3 pt-2">
            <button onClick={() => { onToggleTheme(); setIsOpen(false); }} className="w-full py-2.5 rounded-lg border border-hairline text-ink text-sm bg-surface-elevated flex items-center justify-center gap-2">
              {theme === 'light' ? <><Moon className="h-4 w-4" /><span>Mode Sombre</span></> : <><Sun className="h-4 w-4 text-accent-yellow" /><span>Mode Clair</span></>}
            </button>
            {user ? (
              <>
                <Link to={dashboardPath()} onClick={() => setIsOpen(false)} className="w-full text-center py-2.5 rounded-lg bg-surface-elevated border border-hairline text-ink font-bold text-sm">Mon Espace</Link>
                <button onClick={handleLogout} className="w-full py-2.5 rounded-lg bg-accent-red/10 border border-accent-red/20 text-accent-red font-bold text-sm">Déconnexion</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsOpen(false)} className="w-full text-center py-2.5 rounded-lg border border-hairline-strong text-ink font-bold text-sm bg-surface-elevated">Connexion</Link>
                <button onClick={() => { setIsOpen(false); navigate('/register'); }} className="w-full py-2.5 rounded-lg bg-ink text-canvas font-bold text-sm flex items-center justify-center gap-2">
                  <Sparkles className="h-4 w-4 text-accent-orange" />S'enregistrer
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}