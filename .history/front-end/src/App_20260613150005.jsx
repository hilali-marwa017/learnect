import React from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'

import Home from './pages/public/Home'
import Login from './pages/public/Login'
import Register from './pages/public/Register'
import Teachers from './pages/public/Teachers'
import TeacherProfile from './pages/public/TeacherProfile'

import StudentDashboard from './pages/student/Dashboard'
import StudentMessages from './pages/student/Messages'
import StudentOffres from './pages/student/Offres'
import StudentProfile from './pages/student/Profile'
import StudentRequests from './pages/student/Requests'
import StudentReservations from './pages/student/Reservations'

import TeacherDashboard from './pages/teacher/Dashboard'
import TeacherAvailability from './pages/teacher/Availability'
import TeacherEarnings from './pages/teacher/Earnings'
import TeacherProfileSettings from './pages/teacher/Profile'

import AdminDashboard from './pages/admin/Dashboard'
import AdminManageUsers from './pages/admin/ManageUsers'
import AdminSignalements from './pages/admin/Signalements'
import AdminValidatedTeachers from './pages/admin/ValidatedTeachers'

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="teachers" element={<Teachers />} />
            <Route path="teacher/:id" element={<TeacherProfile />} />

            <Route path="student" element={<ProtectedRoute allowedRole="student"><StudentDashboard /></ProtectedRoute>} />
            <Route path="student/messages" element={<ProtectedRoute allowedRole="student"><StudentMessages /></ProtectedRoute>} />
            <Route path="student/offres" element={<ProtectedRoute allowedRole="student"><StudentOffres /></ProtectedRoute>} />
            <Route path="student/profile" element={<ProtectedRoute allowedRole="student"><StudentProfile /></ProtectedRoute>} />
            <Route path="student/requests" element={<ProtectedRoute allowedRole="student"><StudentRequests /></ProtectedRoute>} />
            <Route path="student/reservations" element={<ProtectedRoute allowedRole="student"><StudentReservations /></ProtectedRoute>} />

            <Route path="teacher" element={<ProtectedRoute allowedRole="teacher"><TeacherDashboard /></ProtectedRoute>} />
            <Route path="teacher/availability" element={<ProtectedRoute allowedRole="teacher"><TeacherAvailability /></ProtectedRoute>} />
            <Route path="teacher/earnings" element={<ProtectedRoute allowedRole="teacher"><TeacherEarnings /></ProtectedRoute>} />
            <Route path="teacher/profile" element={<ProtectedRoute allowedRole="teacher"><TeacherProfileSettings /></ProtectedRoute>} />

            <Route path="admin" element={<ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>} />
            <Route path="admin/users" element={<ProtectedRoute allowedRole="admin"><AdminManageUsers /></ProtectedRoute>} />
            <Route path="admin/signalements" element={<ProtectedRoute allowedRole="admin"><AdminSignalements /></ProtectedRoute>} />
            <Route path="admin/validated" element={<ProtectedRoute allowedRole="admin"><AdminValidatedTeachers /></ProtectedRoute>} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}