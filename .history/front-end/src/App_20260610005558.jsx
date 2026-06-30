// src/App.jsx
import { Routes, Route } from 'react-router-dom';  // ← pas de BrowserRouter ici !
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import Home from './pages/public/Home';
import AdminDashboard from './pages/admin/AdminDashboard';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <div>
      <Navbar />
      <Routes>               {/* ← Routes seulement, pas de BrowserRouter */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;