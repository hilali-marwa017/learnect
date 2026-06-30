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

  function getDashboardPath() {
    if (role === 'admin') return '/admin/dashboard';
    if (role === 'enseignant') return '/enseignant/dashboard';
    if (role === 'etudiant') return '/etudiant/dashboard';
    return '/';
  }

  return (
    <header className="fixed top-0 w-full z-50 bg-white/85 backdrop-blur-md border-b shadow-sm">
      <div className="flex justify-between items-center h-16 px-6 max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-gray-900">
          <i className="bi bi-mortarboard text-orange-500"></i>
          <span>Learnect<span className="text-orange-500">.ma</span></span>
        </Link>

        <div className="hidden lg:flex items-center gap-6">
          <button onClick={onToggleTheme} className="p-2 rounded-lg bg-gray-100">
            {theme === 'light' ? <i className="bi bi-moon"></i> : <i className="bi bi-sun text-yellow-500"></i>}
          </button>

          {user ? (
            <>
              <Link to={getDashboardPath()} className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <i className="bi bi-person-circle"></i>
                <span>Mon Espace</span>
              </Link>
              <button onClick={handleLogout} className="text-gray-500 hover:text-red-500">
                <i className="bi bi-box-arrow-right"></i>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-orange-500">Connexion</Link>
              <Link to="/register" className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-700">
                <i className="bi bi-stars text-orange-500 mr-1"></i> Devenir Tuteur
              </Link>
            </>
          )}
        </div>

        <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2">
          {isOpen ? <i className="bi bi-x-lg text-xl"></i> : <i className="bi bi-list text-xl"></i>}
        </button>
      </div>

      {isOpen && (
        <div className="lg:hidden p-4 bg-white border-t flex flex-col gap-3">
          <Link to="/teachers" onClick={() => setIsOpen(false)} className="py-2 border-b">Trouver un Prof</Link>
          <Link to="/login" onClick={() => setIsOpen(false)} className="py-2 text-orange-500 font-semibold">Connexion</Link>
          <Link to="/register" onClick={() => setIsOpen(false)} className="bg-gray-900 text-white text-center py-2 rounded-lg">Devenir Tuteur</Link>
          <button onClick={onToggleTheme} className="py-2 text-center border rounded-lg">
            {theme === 'light' ? '🌙 Mode Sombre' : '☀️ Mode Clair'}
          </button>
        </div>
      )}
    </header>
  );
}