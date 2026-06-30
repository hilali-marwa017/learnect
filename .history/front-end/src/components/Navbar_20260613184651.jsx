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
      const element = document.getElementById(sectionId);
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

  // Icônes SVG faites maison
  const IconMenu = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );

  const IconClose = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );

  const IconGraduation = () => (
    <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
    </svg>
  );

  const IconSun = () => (
    <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );

  const IconMoon = () => (
    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  );

  const IconUser = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

  const IconLogout = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  );

  const IconSparkles = () => (
    <svg className="w-3.5 h-3.5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );

  return (
    <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b shadow-sm">
      <div className="flex justify-between items-center h-16 px-4 md:px-6 max-w-7xl mx-auto">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-xl md:text-2xl font-bold text-gray-900">
          <IconGraduation />
          <span>Learnect<span className="text-orange-500">.ma</span></span>
        </Link>
        
        {/* Navigation Desktop */}
        <nav className="hidden lg:flex items-center gap-6 text-sm">
          <Link to="/teachers" className="text-gray-600 hover:text-orange-500 transition-colors">Trouver un Prof</Link>
          <a href="#how-it-works" onClick={(e) => handleScrollToSection(e, 'how-it-works')} className="text-gray-600 hover:text-orange-500 transition-colors">Comment ça marche</a>
          <a href="#verification-section" onClick={(e) => handleScrollToSection(e, 'verification-section')} className="text-gray-600 hover:text-orange-500 transition-colors">Qualité certifiée</a>
        </nav>

        {/* Actions Desktop */}
        <div className="hidden lg:flex items-center gap-4">
          
          {/* Theme Toggle */}
          <button onClick={onToggleTheme} className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
            {theme === 'light' ? <IconMoon /> : <IconSun />}
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              <Link to={getDashboardPath()} className="flex items-center gap-2 px-3 py-1.5 rounded-xl border bg-gray-50 text-gray-700 hover:text-orange-500 transition-colors text-xs font-semibold">
                <IconUser />
                <span>Mon Espace</span>
              </Link>
              <button onClick={handleLogout} className="p-2 text-gray-500 hover:text-red-500 transition-colors">
                <IconLogout />
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 text-sm font-semibold px-4 py-2 hover:text-gray-900 transition-colors">Connexion</Link>
              <Link to="/register" className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-gray-700 transition-colors">
                <IconSparkles />
                <span>Devenir Tuteur</span>
              </Link>
            </>
          )}
        </div>

        {/* Bouton Mobile */}
        <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 text-gray-700">
          {isOpen ? <IconClose /> : <IconMenu />}
        </button>
      </div>

      {/* Menu Mobile */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t py-4 px-4 space-y-3">
          <Link to="/teachers" onClick={() => setIsOpen(false)} className="block py-2 text-gray-900 hover:text-orange-500 border-b">Trouver un Professeur</Link>
          <a href="#how-it-works" onClick={(e) => { handleScrollToSection(e, 'how-it-works'); setIsOpen(false); }} className="block py-2 text-gray-600 hover:text-gray-900 border-b">Comment ça marche</a>
          <a href="#verification-section" onClick={(e) => { handleScrollToSection(e, 'verification-section'); setIsOpen(false); }} className="block py-2 text-gray-600 hover:text-gray-900 border-b">Qualité certifiée</a>

          <div className="flex flex-col gap-3 pt-2">
            <button onClick={() => { onToggleTheme(); setIsOpen(false); }} className="w-full py-2 rounded-lg border text-gray-700 text-sm bg-gray-50 flex items-center justify-center gap-2">
              {theme === 'light' ? <IconMoon /> : <IconSun />}
              <span>{theme === 'light' ? 'Mode Sombre' : 'Mode Clair'}</span>
            </button>

            {user ? (
              <>
                <Link to={getDashboardPath()} onClick={() => setIsOpen(false)} className="w-full text-center py-2 rounded-lg bg-gray-50 border text-gray-900 font-semibold text-sm">Mon Espace</Link>
                <button onClick={handleLogout} className="w-full text-center py-2 rounded-lg bg-red-50 border border-red-200 text-red-600 font-semibold text-sm">Déconnexion</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsOpen(false)} className="w-full text-center py-2 rounded-lg border text-gray-900 font-semibold text-sm bg-gray-50">Connexion</Link>
                <Link to="/register" onClick={() => setIsOpen(false)} className="w-full text-center py-2 rounded-lg bg-gray-900 text-white font-semibold text-sm flex items-center justify-center gap-2">
                  <IconSparkles />
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