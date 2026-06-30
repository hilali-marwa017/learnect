import Navbar from './Navbar';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

function Layout() {
  return (
    <div style={{minHeight: '100vh', display: 'flex', flexDirection: 'column'}}>
      {/* Navbar */}
      <Navbar />
      
      {/*contenu*/}
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      
      {/*footer*/}
      <Footer />
    </div>
  );
}

export default Layout;