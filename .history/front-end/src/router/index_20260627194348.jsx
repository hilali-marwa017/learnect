import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Composant ProtectedRoute corrigé
function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  // ✅ Attendre que le chargement soit terminé
  if (loading) {
    return <div>Chargement...</div>; // ou un spinner
  }

  // ✅ Vérifier si l'utilisateur est connecté
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Vérifier les rôles autorisés
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}