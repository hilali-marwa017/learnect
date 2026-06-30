import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

import Home from './pages/public/Home';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import RegisterStudent from './pages/public/RegisterStudent';
import RegisterTeacher from './pages/public/RegisterTeacher';
import Teachers from './pages/public/Teachers';
import TeacherProfile from './pages/public/TeacherProfile';

import StudentDashboard from './pages/student/Dashboard';
import StudentMessages from './pages/student/Messages';
import StudentOffres from './pages/student/Offres';
import StudentProfile from './pages/student/Profile';
import StudentRequests from './pages/student/Requests';
import StudentReservations from './pages/student/Reservations';
import Notifications from './pages/Notifications';

import TeacherDashboard from './pages/teacher/Dashboard';
import TeacherAvailability from './pages/teacher/Availability';
import TeacherEarnings from './pages/teacher/Earnings';
import TeacherMessages from './pages/teacher/Messages';
import TeacherProfile from './pages/teacher/Profile';

import AdminDashboard from './pages/admin/Dashboard';
import AdminManageUsers from './pages/admin/ManageUsers';
import AdminSignalements from './pages/admin/Signalements';
import AdminValidatedTeachers from './pages/admin/ValidatedTeachers';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>

            {/* Routes publiques */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/register/student" element={<RegisterStudent />} />
            <Route path="/register/teacher" element={<RegisterTeacher />} />
            <Route path="/teachers" element={<Teachers />} />
            <Route path="/teachers/:id" element={<TeacherProfile />} />

            {/* Routes etudiant */}
            <Route path="/student" element={<ProtectedRoute allowedRole="etudiant"><StudentDashboard /></ProtectedRoute>} />
            <Route path="/student/reservations" element={<ProtectedRoute allowedRole="etudiant"><StudentReservations /></ProtectedRoute>} />
            <Route path="/student/messages" element={<ProtectedRoute allowedRole="etudiant"><StudentMessages /></ProtectedRoute>} />
            <Route path="/student/offres" element={<ProtectedRoute allowedRole="etudiant"><StudentOffres /></ProtectedRoute>} />
            <Route path="/student/requests" element={<ProtectedRoute allowedRole="etudiant"><StudentRequests /></ProtectedRoute>} />
            <Route path="/student/profile" element={<ProtectedRoute allowedRole="etudiant"><StudentProfile /></ProtectedRoute>} />
            <Route path="/student/notifications" element={<ProtectedRoute allowedRole="etudiant"><Notifications /></ProtectedRoute>} />

            {/* Routes enseignant */}
            <Route path="/teacher" element={<ProtectedRoute allowedRole="enseignant"><TeacherDashboard /></ProtectedRoute>} />
            <Route path="/teacher/availability" element={<ProtectedRoute allowedRole="enseignant"><TeacherAvailability /></ProtectedRoute>} />
            <Route path="/teacher/earnings" element={<ProtectedRoute allowedRole="enseignant"><TeacherEarnings /></ProtectedRoute>} />
            <Route path="/teacher/messages" element={<ProtectedRoute allowedRole="enseignant"><TeacherMessages /></ProtectedRoute>} />
            <Route path="/teacher/profile" element={<ProtectedRoute allowedRole="enseignant"><TeacherProfile /></ProtectedRoute>} />
            <Route path="/teacher/notifications" element={<ProtectedRoute allowedRole="enseignant"><Notifications /></ProtectedRoute>} />

            {/* Routes admin */}
            <Route path="/admin" element={<ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute allowedRole="admin"><AdminManageUsers /></ProtectedRoute>} />
            <Route path="/admin/signalements" element={<ProtectedRoute allowedRole="admin"><AdminSignalements /></ProtectedRoute>} />
            <Route path="/admin/teachers" element={<ProtectedRoute allowedRole="admin"><AdminValidatedTeachers /></ProtectedRoute>} />

            {/* Redirection par defaut */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}