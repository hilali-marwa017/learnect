import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ theme, onToggleTheme }) {
  var [isOpen, setIsOpen] = useState(false);
  var { user, role, logout } = useAuth();
  var navigate = useNavigate();
  var location = useLocation();

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
    <header className="fixed top-0 w-full z-50 bg-white/85 backdrop-blur-md border-b shadow-sm">
      <div className="flex justify-between items-center h-16 px-6 max-w-7xl mx-auto">
        
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-gray-900">
            <i className="bi bi-mortarboard text-orange-500"></i>
            <span>Learnect<span className="text-orange-500">.ma</span></span>
          </Link>
          
          <nav className="hidden lg:flex items-center gap-6 text-sm">
            <Link to="/teachers" className="text-gray-600 hover:text-orange-500 transition-colors">Trouver un Prof</Link>
            <a href="#how-it-works" onClick={function(e) { handleScrollToSection(e, 'how-it-works'); }} className="text-gray-600 hover:text-orange-500 transition-colors">Comment ça marche</a>
            <a href="#verification-section" onClick={function(e) { handleScrollToSection(e, 'verification-section'); }} className="text-gray-600 hover:text-orange-500 transition-colors">Qualité certifiée</a>
          </nav>
        </div>

        <div className="hidden lg:flex items-center gap-4">
          
          <button onClick={onToggleTheme} className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all cursor-pointer">
            {theme === 'light' ? (
              <i className="bi bi-moon text-gray-700"></i>
            ) : (
              <i className="bi bi-sun text-yellow-500"></i>
            )}
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              <Link to={getDashboardPath()} className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border bg-gray-50 text-gray-700 hover:text-orange-500 transition-all text-xs font-semibold">
                <i className="bi bi-person-circle"></i>
                <span>Mon Espace</span>
              </Link>
              <button onClick={handleLogout} className="p-2 text-gray-500 hover:text-red-500 transition-all cursor-pointer">
                <i className="bi bi-box-arrow-right"></i>
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 text-sm font-semibold px-4 py-2 hover:text-gray-900 transition-colors">Connexion</Link>
              <Link to="/register" className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-gray-700 transition-all">
                <i className="bi bi-stars text-orange-500"></i>
                <span>Devenir Tuteur / Élève</span>
              </Link>
            </>
          )}
        </div>

        <button onClick={function() { setIsOpen(!isOpen); }} className="lg:hidden p-2 text-gray-700 hover:text-gray-900 transition-colors">
          {isOpen ? <i className="bi bi-x-lg text-xl"></i> : <i className="bi bi-list text-xl"></i>}
        </button>
      </div>

      {isOpen && (
        <div className="lg:hidden w-full bg-white/95 border-b py-4 px-6 space-y-4 backdrop-blur-lg flex flex-col">
          <Link to="/teachers" onClick={function() { setIsOpen(false); }} className="text-left py-2 text-gray-900 hover:text-orange-500 border-b">Trouver un Professeur</Link>
          <a href="#how-it-works" onClick={function(e) { handleScrollToSection(e, 'how-it-works'); }} className="text-left py-2 text-gray-600 hover:text-gray-900 border-b">Comment ça marche</a>
          <a href="#verification-section" onClick={function(e) { handleScrollToSection(e, 'verification-section'); }} className="text-left py-2 text-gray-600 hover:text-gray-900 border-b">Qualité certifiée</a>

          <div className="flex flex-col gap-3 pt-2">
            <button onClick={function() { onToggleTheme(); setIsOpen(false); }} className="w-full text-center py-2.5 rounded-lg border text-gray-700 text-sm bg-gray-50 flex items-center justify-center gap-2">
              {theme === 'light' ? <><i className="bi bi-moon"></i><span>Mode Sombre</span></> : <><i className="bi bi-sun text-yellow-500"></i><span>Mode Clair</span></>}
            </button>

            {user ? (
              <>
                <Link to={getDashboardPath()} onClick={function() { setIsOpen(false); }} className="w-full text-center py-2.5 rounded-lg bg-gray-50 border text-gray-900 font-bold text-sm">Mon Espace</Link>
                <button onClick={handleLogout} className="w-full text-center py-2.5 rounded-lg bg-red-50 border border-red-200 text-red-600 font-bold text-sm">Déconnexion</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={function() { setIsOpen(false); }} className="w-full text-center py-2.5 rounded-lg border text-gray-900 font-bold text-sm bg-gray-50">Connexion</Link>
                <Link to="/register" onClick={function() { setIsOpen(false); }} className="w-full text-center py-2.5 rounded-lg bg-gray-900 text-white font-bold text-sm flex items-center justify-center gap-2">
                  <i className="bi bi-stars text-orange-500"></i>
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