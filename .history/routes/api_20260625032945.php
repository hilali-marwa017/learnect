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
        {/* ❌ supprime la route notifications ici — plus besoin */}
      </Route>

      <Route path="/student" element={<Layout />}>
        <Route index element={<ProtectedRoute allowedRole="etudiant"><StudentDashboard /></ProtectedRoute>} />
        <Route path="reservations" element={<ProtectedRoute allowedRole="etudiant"><StudentReservations /></ProtectedRoute>} />
        <Route path="requests" element={<ProtectedRoute allowedRole="etudiant"><StudentRequests /></ProtectedRoute>} />
        <Route path="offres" element={<ProtectedRoute allowedRole="etudiant"><StudentOffres /></ProtectedRoute>} />
        <Route path="messages" element={<ProtectedRoute allowedRole="etudiant"><StudentMessages /></ProtectedRoute>} />
        <Route path="profile" element={<ProtectedRoute allowedRole="etudiant"><StudentProfile /></ProtectedRoute>} />
        <Route path="notifications" element={<ProtectedRoute allowedRole="etudiant"><Notifications /></ProtectedRoute>} />
      </Route>

      <Route path="/teacher" element={<Layout />}>
        <Route index element={<ProtectedRoute allowedRole="enseignant"><TeacherDashboard /></ProtectedRoute>} />
        <Route path="dashboard" element={<ProtectedRoute allowedRole="enseignant"><TeacherDashboard /></ProtectedRoute>} />
        <Route path="availability" element={<ProtectedRoute allowedRole="enseignant"><TeacherAvailability /></ProtectedRoute>} />
        <Route path="earnings" element={<ProtectedRoute allowedRole="enseignant"><TeacherEarnings /></ProtectedRoute>} />
        <Route path="messages" element={<ProtectedRoute allowedRole="enseignant"><TeacherMessages /></ProtectedRoute>} />
        <Route path="profile" element={<ProtectedRoute allowedRole="enseignant"><TeacherProfileSettings /></ProtectedRoute>} />
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