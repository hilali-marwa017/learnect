import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Layout from './components/Layout.jsx';
import { useState, useEffect } from 'react';

// Public pages
import Home from './pages/public/Home.jsx';
import Login from './pages/public/Login.jsx';
import Register from './pages/public/Register.jsx';
import Teachers from './pages/public/Teachers.jsx';
import TeacherProfile from './pages/public/TeacherProfile.jsx';

// Student pages
import StudentDashboard from './pages/student/Dashboard.jsx';
import StudentReservations from './pages/student/Reservations.jsx';
import StudentRequests from './pages/student/Requests.jsx';
import StudentOffres from './pages/student/Offres.jsx';
import StudentMessages from './pages/student/Messages.jsx';
import StudentProfile from './pages/student/Profile.jsx';

// Teacher pages
import TeacherDashboard from './pages/teacher/Dashboard.jsx';
import TeacherAvailability from './pages/teacher/Availability.jsx';
import TeacherEarnings from './pages/teacher/Earnings.jsx';
import TeacherProfileSettings from './pages/teacher/Profile.jsx';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard.jsx';
import AdminManageUsers from './pages/admin/ManageUsers.jsx';
import AdminSignalements from './pages/admin/Signalements.jsx';
import AdminValidatedTeachers from './pages/admin/ValidatedTeachers.jsx';

function App() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const saved = localStorage.getItem('learnect_theme');
    if (saved) setTheme(saved);
    if (saved === 'dark') document.documentElement.classList.add('dark');
  }, []);

  function toggleTheme() {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('learnect_theme', newTheme);
    if (newTheme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }

  return (
    <Routes>
      <Route element={<Layout theme={theme} onToggleTheme={toggleTheme} />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/teachers" element={<Teachers />} />
        <Route path="/teachers/:id" element={<TeacherProfile />} />

        <Route path="/etudiant/dashboard" element={<ProtectedRoute role="etudiant"><StudentDashboard /></ProtectedRoute>} />
        <Route path="/etudiant/reservations" element={<ProtectedRoute role="etudiant"><StudentReservations /></ProtectedRoute>} />
        <Route path="/etudiant/demandes" element={<ProtectedRoute role="etudiant"><StudentRequests /></ProtectedRoute>} />
        <Route path="/etudiant/offres" element={<ProtectedRoute role="etudiant"><StudentOffres /></ProtectedRoute>} />
        <Route path="/etudiant/messages" element={<ProtectedRoute role="etudiant"><StudentMessages /></ProtectedRoute>} />
        <Route path="/etudiant/profil" element={<ProtectedRoute role="etudiant"><StudentProfile /></ProtectedRoute>} />

        <Route path="/enseignant/dashboard" element={<ProtectedRoute role="enseignant"><TeacherDashboard /></ProtectedRoute>} />
        <Route path="/enseignant/disponibilites" element={<ProtectedRoute role="enseignant"><TeacherAvailability /></ProtectedRoute>} />
        <Route path="/enseignant/revenus" element={<ProtectedRoute role="enseignant"><TeacherEarnings /></ProtectedRoute>} />
        <Route path="/enseignant/profil" element={<ProtectedRoute role="enseignant"><TeacherProfileSettings /></ProtectedRoute>} />

        <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/utilisateurs" element={<ProtectedRoute role="admin"><AdminManageUsers /></ProtectedRoute>} />
        <Route path="/admin/signalements" element={<ProtectedRoute role="admin"><AdminSignalements /></ProtectedRoute>} />
        <Route path="/admin/enseignants" element={<ProtectedRoute role="admin"><AdminValidatedTeachers /></ProtectedRoute>} />
      </Route>
    </Routes>
  );
}

export default App;