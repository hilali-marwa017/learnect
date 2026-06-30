import Navbar from './Navbar';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

function Layout() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column' 
    }}>
      {/* Navbar */}
      <Navbar />
      
      {/* Contenu principal  */}
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      
      {/* Footer*/}
      <Footer />
    </div>
  );
}

export default Layout;