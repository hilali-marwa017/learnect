import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// composant qui protege les routes selon le role
export default function ProtectedRoute({ children, allowedRole }) {
  const { user, isAuthenticated, loading } = useAuth();

  // attendre que le user soit charge
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '32px', height: '32px', border: '4px solid #e04f00', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  // si pas connecte → redirection login
  if (!isAuthenticated) return <Navigate to="/" replace />;

  // si admin essaie d'acceder a une page non-admin
  if (user?.role === 'admin' && allowedRole !== 'admin') return <Navigate to="/admin" replace />;

  // si mauvais role
  if (allowedRole && user?.role !== allowedRole) return <Navigate to="/" replace />;

  return children;
}