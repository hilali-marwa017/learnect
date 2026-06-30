import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Layout from './components/Layout.jsx';

import Home from './pages/public/Home.jsx';
import Login from './pages/public/Login.jsx';
import Register from './pages/public/Register.jsx';
import RegisterStudent from './pages/public/RegisterStudent.jsx';
import RegisterTeacher from './pages/public/RegisterTeacher.jsx';
import Teachers from './pages/public/Teachers.jsx';
import TeacherProfile from './pages/public/TeacherProfile.jsx';

import StudentDashboard from './pages/student/Dashboard.jsx';
import StudentReservations from './pages/student/Reservations.jsx';
import StudentRequests from './pages/student/Requests.jsx';
import StudentOffres from './pages/student/Offres.jsx';
import StudentMessages from './pages/student/Messages.jsx';
import StudentProfile from './pages/student/Profile.jsx';

import TeacherDashboard from './pages/teacher/Dashboard.jsx';
import TeacherAvailability from './pages/teacher/Availability.jsx';
import TeacherEarnings from './pages/teacher/Earnings.jsx';
import TeacherProfileSettings from './pages/teacher/Profile.jsx';
import TeacherMessages from './pages/teacher/Messages.jsx';

import AdminDashboard from './pages/admin/Dashboard.jsx';

import Notifications from './pages/Notifications.jsx';

function PublicRoute({ children }) {
  const { user, isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (isAuthenticated && user?.role === 'admin') return <Navigate to="/admin" replace />;
  if (isAuthenticated && user?.role === 'enseignant') return <Navigate to="/teacher" replace />;
  if (isAuthenticated && user?.role === 'etudiant') return <Navigate to="/student" replace />;
  return children;
}

function App() {
  return (
    <Routes>

      <Route path="/" element={<Layout />}>
        <Route index element={<PublicRoute><Home /></PublicRoute>} />
        <Route path="login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="register/student" element={<PublicRoute><RegisterStudent /></PublicRoute>} />
        <Route path="register/teacher" element={<PublicRoute><RegisterTeacher /></PublicRoute>} />
        <Route path="teachers" element={<Teachers />} />
        <Route path="teachers/:id" element={<TeacherProfile />} />
      </Route>

      <Route path="/student" element={<Layout />}>
        <Route index element={<ProtectedRoute allowedRole="etudiant"><StudentDashboard /></ProtectedRoute>} />
        <Route path="reservations" element={<ProtectedRoute allowedRole="etudiant"><StudentReservations /></ProtectedRoute>} />
        <Route path="requests" element={<ProtectedRoute allowedRole="etudiant"><StudentRequests /></ProtectedRoute>} />
        <Route path="offres" element={<ProtectedRoute allowedRole="etudiant"><StudentOffres /></ProtectedRoute>} />
        <Route path="messages" element={<ProtectedRoute allowedRole="etudiant"><StudentMessages /></ProtectedRoute>} />
        <Route path="profile" element={<ProtectedRoute allowedRole="etudiant"><StudentProfile /></ProtectedRoute>} />
        {/* Route Notifications pour étudiant */}
        <Route path="notifications" element={<ProtectedRoute allowedRole="etudiant"><Notifications /></ProtectedRoute>} />
      </Route>

      <Route path="/teacher" element={<Layout />}>
        <Route index element={<ProtectedRoute allowedRole="enseignant"><TeacherDashboard /></ProtectedRoute>} />
        <Route path="dashboard" element={<ProtectedRoute allowedRole="enseignant"><TeacherDashboard /></ProtectedRoute>} />
        <Route path="availability" element={<ProtectedRoute allowedRole="enseignant"><TeacherAvailability /></ProtectedRoute>} />
        <Route path="earnings" element={<ProtectedRoute allowedRole="enseignant"><TeacherEarnings /></ProtectedRoute>} />
        <Route path="messages" element={<ProtectedRoute allowedRole="enseignant"><TeacherMessages /></ProtectedRoute>} />
        <Route path="profile" element={<ProtectedRoute allowedRole="enseignant"><TeacherProfileSettings /></ProtectedRoute>} />
        {/* Route Notifications pour enseignant */}
        <Route path="notifications" element={<ProtectedRoute allowedRole="enseignant"><Notifications /></ProtectedRoute>} />
      </Route>

      <Route path="/admin" element={<ProtectedRoute allowedRole="admin"><Layout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}

export default App;