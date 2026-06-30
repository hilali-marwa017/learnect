import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Layout from './components/Layout.jsx';

// Pages publiques
import Home from './pages/public/Home.jsx';
import Login from './pages/public/Login.jsx';
import Register from './pages/public/Register.jsx';
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
import AdminManageUsers from './pages/admin/ManageUsers.jsx';
import AdminSignalements from './pages/admin/Signalements.jsx';
import AdminValidatedTeachers from './pages/admin/ValidatedTeachers.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes publiques avec Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="register/teacher" element={<RegisterTeacher />} />
          <Route path="teachers" element={<Teachers />} />
          <Route path="teachers/:id" element={<TeacherProfile />} />
        </Route>

        {/* Routes étudiant */}
        <Route path="/student" element={<Layout />}>
          <Route index element={
            <ProtectedRoute allowedRole="etudiant">
              <StudentDashboard />
            </ProtectedRoute>
          } />
          <Route path="reservations" element={
            <ProtectedRoute allowedRole="etudiant">
              <StudentReservations />
            </ProtectedRoute>
          } />
          <Route path="requests" element={
            <ProtectedRoute allowedRole="etudiant">
              <StudentRequests />
            </ProtectedRoute>
          } />
          <Route path="offres" element={
            <ProtectedRoute allowedRole="etudiant">
              <StudentOffres />
            </ProtectedRoute>
          } />
          <Route path="messages" element={
            <ProtectedRoute allowedRole="etudiant">
              <StudentMessages />
            </ProtectedRoute>
          } />
          <Route path="profile" element={
            <ProtectedRoute allowedRole="etudiant">
              <StudentProfile />
            </ProtectedRoute>
          } />
        </Route>

        {/* Routes enseignant */}
        <Route path="/teacher" element={<Layout />}>
          <Route index element={
            <ProtectedRoute allowedRole="enseignant">
              <TeacherDashboard />
            </ProtectedRoute>
          } />
          <Route path="availability" element={
            <ProtectedRoute allowedRole="enseignant">
              <TeacherAvailability />
            </ProtectedRoute>
          } />
          <Route path="earnings" element={
            <ProtectedRoute allowedRole="enseignant">
              <TeacherEarnings />
            </ProtectedRoute>
          } />
          <Route path="profile" element={
            <ProtectedRoute allowedRole="enseignant">
              <TeacherProfileSettings />
            </ProtectedRoute>
          } />
        </Route>

        {/* Routes admin */}
        <Route path="/admin" element={<Layout />}>
          <Route index element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="users" element={
            <ProtectedRoute allowedRole="admin">
              <AdminManageUsers />
            </ProtectedRoute>
          } />
          <Route path="signalements" element={
            <ProtectedRoute allowedRole="admin">
              <AdminSignalements />
            </ProtectedRoute>
          } />
          <Route path="validated" element={
            <ProtectedRoute allowedRole="admin">
              <AdminValidatedTeachers />
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;