import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Layout from './components/Layout.jsx';

// Pages publiques
import Home from './pages/public/Home.jsx';
import Login from './pages/public/Login.jsx';
import Register from './pages/public/Register.jsx';
import RegisterStudent from './pages/public/RegisterStudent.jsx';
import RegisterTeacher from './pages/public/RegisterTeacher.jsx';
import Teachers from './pages/public/Teachers.jsx';
import TeacherProfile from './pages/public/TeacherProfile.jsx';

// Pages étudiant
import StudentDashboard from './pages/student/Dashboard.jsx';
import StudentReservations from './pages/student/Reservations.jsx';
import StudentRequests from './pages/student/Requests.jsx';
import StudentOffres from './pages/student/Offres.jsx';
import StudentMessages from './pages/student/Messages.jsx';
import StudentProfile from './pages/student/Profile.jsx';

// Pages enseignant
import TeacherDashboard from './pages/teacher/Dashboard.jsx';
import TeacherAvailability from './pages/teacher/Availability.jsx';
import TeacherEarnings from './pages/teacher/Earnings.jsx';
import TeacherProfileSettings from './pages/teacher/Profile.jsx';

// Pages admin
import AdminDashboard from './pages/admin/Dashboard.jsx';

// Composant pour bloquer l'admin des pages publiques
function PublicRoute({ children }) {
  const { user, isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (isAuthenticated && user?.role === 'admin') return <Navigate to="/admin" replace />;
  return children;
}

function App() {
  return (
    <Routes>

      {/* Routes publiques avec Layout */}
      <Route path="/" element={<Layout />}>
        <Route index element={<PublicRoute><Home /></PublicRoute>} />
        <Route path="login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="register/student" element={<PublicRoute><RegisterStudent /></PublicRoute>} />
        <Route path="register/teacher" element={<PublicRoute><RegisterTeacher /></PublicRoute>} />
        <Route path="teachers" element={<PublicRoute><Teachers /></PublicRoute>} />
        <Route path="teachers/:id" element={<PublicRoute><TeacherProfile /></PublicRoute>} />
      </Route>

      {/* Routes étudiant */}
      <Route path="/student" element={<Layout />}>
        <Route index element={<ProtectedRoute allowedRole="etudiant"><StudentDashboard /></ProtectedRoute>} />
        <Route path="reservations" element={<ProtectedRoute allowedRole="etudiant"><StudentReservations /></ProtectedRoute>} />
        <Route path="requests" element={<ProtectedRoute allowedRole="etudiant"><StudentRequests /></ProtectedRoute>} />
        <Route path="offres" element={<ProtectedRoute allowedRole="etudiant"><StudentOffres /></ProtectedRoute>} />
        <Route path="messages" element={<ProtectedRoute allowedRole="etudiant"><StudentMessages /></ProtectedRoute>} />
        <Route path="profile" element={<ProtectedRoute allowedRole="etudiant"><StudentProfile /></ProtectedRoute>} />
      </Route>

      {/* Routes enseignant */}
      <Route path="/teacher" element={<Layout />}>
        <Route index element={<ProtectedRoute allowedRole="enseignant"><TeacherDashboard /></ProtectedRoute>} />
        <Route path="availability" element={<ProtectedRoute allowedRole="enseignant"><TeacherAvailability /></ProtectedRoute>} />
        <Route path="earnings" element={<ProtectedRoute allowedRole="enseignant"><TeacherEarnings /></ProtectedRoute>} />
        <Route path="profile" element={<ProtectedRoute allowedRole="enseignant"><TeacherProfileSettings /></ProtectedRoute>} />
      </Route>

      {/* Routes admin — sans Layout (dashboard propre) */}
      <Route path="/admin" element={<ProtectedRoute allowedRole="admin"><Layout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}

export default App;