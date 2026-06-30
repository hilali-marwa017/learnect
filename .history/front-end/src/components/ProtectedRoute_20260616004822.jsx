// Dans App.jsx ou router - route vers /
// Si l'user est admin, redirige vers /admin
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function AdminRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'admin') return <Navigate to="/" />;
  return children;
}

export function BlockAdmin({ children }) {
  const { user } = useAuth();
  if (user?.role === 'admin') return <Navigate to="/admin" />;
  return children;
}