import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children, role }) => {
    const { isAuthenticated, user } = useAuth()

    if (!isAuthenticated) return <Navigate to="/login" replace />

    if (role && user?.role !== role) {
        // Rediriger vers le bon dashboard selon le rôle
        if (user?.role === 'admin') return <Navigate to="/admin/dashboard" replace />
        if (user?.role === 'enseignant') return <Navigate to="/enseignant/dashboard" replace />
        return <Navigate to="/etudiant/dashboard" replace />
    }

    return children
}

export default ProtectedRoute