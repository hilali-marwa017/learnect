import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

// Pages publiques
import Home from "./pages/public/Home";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";
import RegisterStudent from "./pages/public/RegisterStudent";
import RegisterTeacher from "./pages/public/RegisterTeacher";
import Teachers from "./pages/public/Teachers";
import TeacherProfile from "./pages/public/TeacherProfile";

// Pages étudiant
import EtudiantDashboard from "./pages/student/Dashboard";
import EtudiantReservations from "./pages/student/Reservations";
import EtudiantRequests from "./pages/student/Requests";
import EtudiantOffers from "./pages/student/Offres";
import EtudiantMessages from "./pages/student/Messages";
import EtudiantProfile from "./pages/student/Profile";

// Pages enseignant
import EnseignantDashboard from "./pages/teacher/Dashboard";
import EnseignantAvailability from "./pages/teacher/Availability";
import EnseignantProfile from "./pages/teacher/Profile";
import EnseignantEarnings from "./pages/teacher/Earnings";

// Pages admin
import AdminDashboard from "./pages/admin/Dashboard";
import AdminValidateTeachers from "./pages/admin/ValidatedTeachers";
import AdminManageUsers from "./pages/admin/ManageUsers";
import AdminSignalements from "./pages/admin/Signalements";

const RedirectByRole = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (user?.role === "enseignant") {
    return <Navigate to="/enseignant/dashboard" replace />;
  }

  return <Navigate to="/etudiant/dashboard" replace />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          
          <Route element={<Layout />}>
            
            {/* Pages publiques */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/register/etudiant" element={<RegisterStudent />} />
            <Route path="/register/enseignant" element={<RegisterTeacher />} />
            <Route path="/enseignants" element={<Teachers />} />
            <Route path="/enseignants/:id" element={<TeacherProfile />} />

            {/* Redirection dashboard */}
            <Route path="/dashboard" element={<RedirectByRole />} />

            {/* Routes étudiant */}
            <Route path="/etudiant/dashboard" element={
              <ProtectedRoute role="etudiant">
                <EtudiantDashboard />
              </ProtectedRoute>
            } />
            <Route path="/etudiant/reservations" element={
              <ProtectedRoute role="etudiant">
                <EtudiantReservations />
              </ProtectedRoute>
            } />
            <Route path="/etudiant/demandes" element={
              <ProtectedRoute role="etudiant">
                <EtudiantRequests />
              </ProtectedRoute>
            } />
            <Route path="/etudiant/offres" element={
              <ProtectedRoute role="etudiant">
                <EtudiantOffers />
              </ProtectedRoute>
            } />
            <Route path="/etudiant/messages" element={
              <ProtectedRoute role="etudiant">
                <EtudiantMessages />
              </ProtectedRoute>
            } />
            <Route path="/etudiant/profil" element={
              <ProtectedRoute role="etudiant">
                <EtudiantProfile />
              </ProtectedRoute>
            } />

            {/* Routes enseignant */}
            <Route path="/enseignant/dashboard" element={
              <ProtectedRoute role="enseignant">
                <EnseignantDashboard />
              </ProtectedRoute>
            } />
            <Route path="/enseignant/disponibilites" element={
              <ProtectedRoute role="enseignant">
                <EnseignantAvailability />
              </ProtectedRoute>
            } />
            <Route path="/enseignant/profil" element={
              <ProtectedRoute role="enseignant">
                <EnseignantProfile />
              </ProtectedRoute>
            } />
            <Route path="/enseignant/revenus" element={
              <ProtectedRoute role="enseignant">
                <EnseignantEarnings />
              </ProtectedRoute>
            } />

            {/* Routes admin */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/enseignants" element={
              <ProtectedRoute role="admin">
                <AdminValidateTeachers />
              </ProtectedRoute>
            } />
            <Route path="/admin/utilisateurs" element={
              <ProtectedRoute role="admin">
                <AdminManageUsers />
              </ProtectedRoute>
            } />
            <Route path="/admin/signalements" element={
              <ProtectedRoute role="admin">
                <AdminSignalements />
              </ProtectedRoute>
            } />

          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;