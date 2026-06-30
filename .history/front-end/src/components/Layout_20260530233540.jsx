import Navbar from './Navbar';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

function Layout() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navbar fixée en haut */}
      <Navbar />
      
      {/* Contenu principal - prend tout l'espace restant */}
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      
      {/* Footer en bas */}
      <Footer />
    </div>
  );
}

export default Layout;