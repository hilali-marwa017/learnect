import { Routes, Route } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Layout from './components/Layout.jsx'

import Home from './pages/public/Home.jsx'
import Login from './pages/public/Login.jsx'
import Register from './pages/public/Register.jsx'
import Teachers from './pages/public/Teachers.jsx'
import TeacherProfile from './pages/public/TeacherProfile.jsx'

import StudentDashboard from './pages/student/Dashboard.jsx'
import StudentReservations from './pages/student/Reservations.jsx'
import StudentRequests from './pages/student/Requests.jsx'
import StudentOffres from './pages/student/Offres.jsx'
import StudentMessages from './pages/student/Messages.jsx'
import StudentProfile from './pages/student/Profile.jsx'

import TeacherDashboard from './pages/teacher/Dashboard.jsx'
import TeacherAvailability from './pages/teacher/Availability.jsx'
import TeacherEarnings from './pages/teacher/Earnings.jsx'
import TeacherProfileSettings from './pages/teacher/Profile.jsx'

import AdminDashboard from './pages/admin/Dashboard.jsx'
import AdminManageUsers from './pages/admin/ManageUsers.jsx'
import AdminSignalements from './pages/admin/Signalements.jsx'
import AdminValidatedTeachers from './pages/admin/ValidatedTeachers.jsx'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/teachers" element={<Teachers />} />
        <Route path="/teachers/:id" element={<TeacherProfile />} />

        <Route path="/student" element={<ProtectedRoute allowedRole="student"><StudentDashboard /></ProtectedRoute>} />
        <Route path="/student/reservations" element={<ProtectedRoute allowedRole="student"><StudentReservations /></ProtectedRoute>} />
        <Route path="/student/requests" element={<ProtectedRoute allowedRole="student"><StudentRequests /></ProtectedRoute>} />
        <Route path="/student/offres" element={<ProtectedRoute allowedRole="student"><StudentOffres /></ProtectedRoute>} />
        <Route path="/student/messages" element={<ProtectedRoute allowedRole="student"><StudentMessages /></ProtectedRoute>} />
        <Route path="/student/profile" element={<ProtectedRoute allowedRole="student"><StudentProfile /></ProtectedRoute>} />

        <Route path="/teacher" element={<ProtectedRoute allowedRole="teacher"><TeacherDashboard /></ProtectedRoute>} />
        <Route path="/teacher/availability" element={<ProtectedRoute allowedRole="teacher"><TeacherAvailability /></ProtectedRoute>} />
        <Route path="/teacher/earnings" element={<ProtectedRoute allowedRole="teacher"><TeacherEarnings /></ProtectedRoute>} />
        <Route path="/teacher/profile" element={<ProtectedRoute allowedRole="teacher"><TeacherProfileSettings /></ProtectedRoute>} />

        <Route path="/admin" element={<ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute allowedRole="admin"><AdminManageUsers /></ProtectedRoute>} />
        <Route path="/admin/signalements" element={<ProtectedRoute allowedRole="admin"><AdminSignalements /></ProtectedRoute>} />
        <Route path="/admin/validated" element={<ProtectedRoute allowedRole="admin"><AdminValidatedTeachers /></ProtectedRoute>} />
      </Route>
    </Routes>
  )
}

export default App