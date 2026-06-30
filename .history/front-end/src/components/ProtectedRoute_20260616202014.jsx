import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute({ children, allowedRole }) {
  const { user, isAuthenticated, loading, isLoggingOut } = useAuth();

  if (loading || isLoggingOut) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)' }}>
        <div style={{ width: '32px', height: '32px', border: '4px solid #e04f00', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (user?.role === 'admin' && allowedRole !== 'admin') return <Navigate to="/admin" replace />;
  if (allowedRole && user?.role !== allowedRole) return <Navigate to="/" replace />;

  return children;
}