import { Outlet } from 'react-router-dom';

function Layout() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Cercles décoratifs */}
      <div style={{
        position: 'absolute',
        width: 400,
        height: 400,
        borderRadius: '50%',
        background: 'rgba(13,110,253,0.06)',
        top: -100,
        right: -100,
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: '50%',
        background: 'rgba(13,110,253,0.04)',
        bottom: -80,
        left: -80,
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: '50%',
        background: 'rgba(13,110,253,0.03)',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none'
      }} />
      
      {/* Contenu principal */}
      <Outlet />
    </div>
  );
}

export default Layout;