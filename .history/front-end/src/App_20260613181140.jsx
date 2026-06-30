import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import { useState, useEffect } from 'react';

// Public pages
import Home from './pages/public/Home';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import Teachers from './pages/public/Teachers';
import TeacherProfile from './pages/public/TeacherProfile';

// Student pages
import StudentDashboard from './pages/student/Dashboard';
import StudentReservations from './pages/student/Reservations';
import StudentRequests from './pages/student/Requests';
import StudentOffres from './pages/student/Offres';
import StudentMessages from './pages/student/Messages';
import StudentProfile from './pages/student/Profile';

// Teacher pages
import TeacherDashboard from './pages/teacher/Dashboard';
import TeacherAvailability from './pages/teacher/Availability';
import TeacherEarnings from './pages/teacher/Earnings';
import TeacherProfileSettings from './pages/teacher/Profile';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminManageUsers from './pages/admin/ManageUsers';
import AdminSignalements from './pages/admin/Signalements';
import AdminValidatedTeachers from './pages/admin/ValidatedTeachers';

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