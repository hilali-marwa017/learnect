import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/public/Home';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import RegisterStudent from './pages/public/RegisterStudent';
import RegisterTeacher from './pages/public/RegisterTeacher';
import Teachers from './pages/public/Teachers';
import TeacherProfile from './pages/public/TeacherProfile';

// ✅ IMPORTS CORRECTS
import StudentDashboard from './pages/student/Dashboard';
import StudentReservations from './pages/student/Reservations';
import StudentMessages from './pages/student/Messages';  // ✅ BON DOSSIER
import StudentOffres from './pages/student/Offres';
import StudentRequests from './pages/student/Requests';
import StudentProfile from './pages/student/Profile';

import TeacherDashboard from './pages/teacher/Dashboard';
import TeacherAvailability from './pages/teacher/Availability';
import TeacherDemandes from './pages/teacher/Demandes';
import TeacherEarnings from './pages/teacher/Earnings';
import TeacherMessages from './pages/teacher/Messages';
import TeacherProfile from './pages/teacher/Profile';

import AdminDashboard from './pages/admin/Dashboard';
import AdminManageUsers from './pages/admin/ManageUsers';
import AdminSignalements from './pages/admin/Signalements';
import AdminValidatedTeachers from './pages/admin/ValidatedTeachers';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register/student" element={<RegisterStudent />} />
          <Route path="/register/teacher" element={<RegisterTeacher />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/teachers/:id" element={<TeacherProfile />} />

          {/* Student */}
          <Route path="/student" element={<ProtectedRoute role="etudiant" />}>
            <Route index element={<StudentDashboard />} />
            <Route path="reservations" element={<StudentReservations />} />
            <Route path="messages" element={<StudentMessages />} />
            <Route path="offres" element={<StudentOffres />} />
            <Route path="requests" element={<StudentRequests />} />
            <Route path="profile" element={<StudentProfile />} />
          </Route>

          {/* Teacher */}
          <Route path="/teacher" element={<ProtectedRoute role="enseignant" />}>
            <Route index element={<TeacherDashboard />} />
            <Route path="availability" element={<TeacherAvailability />} />
            <Route path="demandes" element={<TeacherDemandes />} />
            <Route path="earnings" element={<TeacherEarnings />} />
            <Route path="messages" element={<TeacherMessages />} />
            <Route path="profile" element={<TeacherProfile />} />
          </Route>

          {/* Admin */}
          <Route path="/admin" element={<ProtectedRoute role="admin" />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminManageUsers />} />
            <Route path="signalements" element={<AdminSignalements />} />
            <Route path="validate" element={<AdminValidatedTeachers />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;