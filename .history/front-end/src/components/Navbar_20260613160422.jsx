import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ theme, onToggleTheme }) {
  const [isOpen, setIsOpen] = useState(false);
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    logout();
    navigate('/');
    setIsOpen(false);
  }

  function handleScrollToSection(e, sectionId) {
    e.preventDefault();
    if (location.pathname === '/' || location.pathname === '') {
      var element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      navigate('/?scrollTo=' + sectionId);
    }
    setIsOpen(false);
  }

  function getDashboardPath() {
    if (role === 'admin') return '/admin/dashboard';
    if (role === 'enseignant') return '/enseignant/dashboard';
    if (role === 'etudiant') return '/etudiant/dashboard';
    return '/';
  }

  return (
    <header className="fixed top-0 w-full z-50 bg-canvas/85 backdrop-blur-md border-b border-hairline transition-all duration-350">
      <div className="flex justify-between items-center h-16 px-6 max-w-7xl mx-auto">
        
        <div className="flex items-center gap-8">
          <Link to="/" className="font-display-xl text-2xl text-ink tracking-tight flex items-center gap-2">
            <svg className="h-6 w-6 text-accent-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>
            <span>Learnect<span className="text-accent-orange">.ma</span></span>
          </Link>
          
          <nav className="hidden lg:flex items-center gap-6 text-sm">
            <Link to="/teachers" className="text-charcoal hover:text-accent-orange transition-colors">Trouver un Prof</Link>
            <a href="#how-it-works" onClick={function(e) { handleScrollToSection(e, 'how-it-works'); }} className="text-charcoal hover:text-accent-orange transition-colors">Comment ça marche</a>
            <a href="#verification-section" onClick={function(e) { handleScrollToSection(e, 'verification-section'); }} className="text-charcoal hover:text-accent-orange transition-colors">Qualité certifiée</a>
          </nav>
        </div>

        <div className="hidden lg:flex items-center gap-4">
          
          <button onClick={onToggleTheme} className="p-2 rounded-lg bg-surface-elevated hover:bg-surface-elevated/80 text-ink border border-hairline transition-all cursor-pointer">
            {theme === 'light' ? (
              <svg className="h-4.5 w-4.5 text-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            ) : (
              <svg className="h-4.5 w-4.5 text-accent-yellow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            )}
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              <Link to={getDashboardPath()} className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-hairline bg-surface-elevated text-ink hover:text-accent-orange transition-all text-xs font-semibold">
                <svg className="h-4 w-4 text-mute" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                <span>Mon Espace</span>
              </Link>
              <button onClick={handleLogout} className="p-2 text-mute hover:text-accent-red transition-all cursor-pointer">
                <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="text-ink text-sm font-semibold px-4 py-2 hover:text-ash transition-colors">Connexion</Link>
              <Link to="/register" className="flex items-center gap-2 bg-ink text-canvas px-4 py-2 rounded-lg text-xs font-bold hover:bg-ash transition-all">
                <svg className="h-3.5 w-3.5 text-accent-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                <span>Devenir Tuteur / Élève</span>
              </Link>
            </>
          )}
        </div>

        <button onClick={function() { setIsOpen(!isOpen); }} className="lg:hidden p-2 text-ink hover:text-ash transition-colors">
          {isOpen ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
          )}
        </button>
      </div>

      {isOpen && (
        <div className="lg:hidden w-full bg-canvas/95 border-b border-hairline py-4 px-6 space-y-4 backdrop-blur-lg flex flex-col">
          <Link to="/teachers" onClick={function() { setIsOpen(false); }} className="text-left py-2 text-ink hover:text-accent-orange border-b border-divider-soft font-semibold">Trouver un Professeur</Link>
          <a href="#how-it-works" onClick={function(e) { handleScrollToSection(e, 'how-it-works'); }} className="text-left py-2 text-charcoal hover:text-ink border-b border-divider-soft">Comment ça marche</a>
          <a href="#verification-section" onClick={function(e) { handleScrollToSection(e, 'verification-section'); }} className="text-left py-2 text-charcoal hover:text-ink border-b border-divider-soft">Qualité certifiée</a>

          <div className="flex flex-col gap-3 pt-2">
            <button onClick={function() { onToggleTheme(); setIsOpen(false); }} className="w-full text-center py-2.5 rounded-lg border border-hairline text-ink text-sm bg-surface-elevated flex items-center justify-center gap-2">
              {theme === 'light' ? <><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg><span>Mode Sombre</span></> : <><svg className="h-4 w-4 text-accent-yellow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg><span>Mode Clair</span></>}
            </button>

            {user ? (
              <>
                <Link to={getDashboardPath()} onClick={function() { setIsOpen(false); }} className="w-full text-center py-2.5 rounded-lg bg-surface-elevated border border-hairline text-ink font-bold text-sm">Mon Espace</Link>
                <button onClick={handleLogout} className="w-full text-center py-2.5 rounded-lg bg-accent-red/10 border border-accent-red/20 text-accent-red font-bold text-sm">Déconnexion</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={function() { setIsOpen(false); }} className="w-full text-center py-2.5 rounded-lg border border-hairline-strong text-ink font-bold text-sm bg-surface-elevated">Connexion</Link>
                <Link to="/register" onClick={function() { setIsOpen(false); }} className="w-full text-center py-2.5 rounded-lg bg-ink text-canvas font-bold text-sm flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 text-accent-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  <span>S'enregistrer</span>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}