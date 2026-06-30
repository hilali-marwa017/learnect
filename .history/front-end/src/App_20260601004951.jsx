function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          
          {/* Pages PUBLIQUES (accessibles sans connexion) */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Pages PROTÉGÉES (nécessitent connexion) */}
          <Route path="/student/dashboard" element={
            <ProtectedRoute role="etudiant">
              <EtudiantDashboard />
            </ProtectedRoute>
          } />
          <Route path="/teacher/dashboard" element={
            <ProtectedRoute role="enseignant">
              <EnseignantDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}