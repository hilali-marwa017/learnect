import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="pt-32 text-center"><div className="spinner-border text-accent-orange"></div></div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (user.role === 'enseignant') return <Navigate to="/enseignant/dashboard" replace />;
    return <Navigate to="/etudiant/dashboard" replace />;
  }

  return children;
}