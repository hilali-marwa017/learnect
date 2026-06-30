// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (role && user.role !== role) {
    if (user.role === "admin") return <Navigate to="/admin/dashboard" replace />;
    if (user.role === "enseignant") return <Navigate to="/enseignant/dashboard" replace />;
    return <Navigate to="/etudiant/dashboard" replace />;
  }
  
  return children;
}

export default ProtectedRoute;