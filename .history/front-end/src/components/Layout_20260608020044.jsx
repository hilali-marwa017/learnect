import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

function Layout() {
  const { user, isAuthenticated } = useAuth();

  // Si admin connecté et sur une page publique → redirect direct
  if (isAuthenticated && user?.role === 'admin') {
    const cheminActuel = window.location.pathname;
    const pagesAdmin = cheminActuel.startsWith('/admin');
    if (!pagesAdmin) {
      return <Navigate to="/admin/dashboard" replace />;
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;