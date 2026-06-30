import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function TeacherProfile() {
  const { user } = useAuth();
  const location = useLocation();
  const [form, setForm] = useState({
    prenom: user?.prenom || '',
    nom: user?.nom || '',
    email: user?.email || '',
    telephone: user?.telephone || '',
    ville: user?.ville || 'Casablanca'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const navItems = [
    { path: '/enseignant/dashboard', label: 'Synthèse & Élèves', icon: 'bi-graph-up' },
    { path: '/enseignant/disponibilites', label: 'Créneaux libres', icon: 'bi-calendar-week' },
    { path: '/enseignant/revenus', label: 'Portefeuille & Revenus', icon: 'bi-wallet2' },
    { path: '/enseignant/profil', label: 'Mon Profil', icon: 'bi-person-gear' }
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // await api.put('/enseignant/profile', form);
      setMessage('success');
    } catch (err) {
      setMessage('error');
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="container py-4">
      
      {/* En-tête */}
      <div className="d-flex align-items-center gap-3 mb-4 pb-2 border-bottom">
        <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '56px', height: '56px' }}>
          <i className="bi bi-person fs-2"></i>
        </div>
        <div>
          <h4 className="fw-bold mb-0">{user?.prenom} {user?.nom}</h4>
          <p className="text-muted mb-0">
            <i className="bi bi-briefcase me-1"></i>Enseignant · {user?.ville || 'Casablanca'}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="row g-3 mb-4">
        {navItems.map((item) => (
          <div key={item.path} className="col-md-3 col-6">
            <Link to={item.path} className="text-decoration-none">
              <div className={`card border-0 shadow-sm p-3 text-center ${location.pathname === item.path ? 'active-card' : ''}`}>
                <i className={`${item.icon} fs-2 ${location.pathname === item.path ? 'text-primary' : 'text-secondary'}`}></i>
                <div className="fw-semibold mt-2">{item.label}</div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Formulaire profil */}
      <div className="card border-0 shadow-sm p-4">
        <h5 className="fw-bold mb-3"><i className="bi bi-person-badge me-2 text-primary"></i>Mes informations</h5>

        {message === 'success' && (
          <div className="alert alert-success py-2">✓ Profil mis à jour</div>
        )}
        {message === 'error' && (
          <div className="alert alert-danger py-2">✗ Erreur lors de la mise à jour</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label small fw-semibold">Prénom</label>
              <input type="text" name="prenom" className="form-control" value={form.prenom} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold">Nom</label>
              <input type="text" name="nom" className="form-control" value={form.nom} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold">Email</label>
              <input type="email" className="form-control" value={form.email} disabled readOnly />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold">Téléphone</label>
              <input type="tel" name="telephone" className="form-control" value={form.telephone} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold">Ville</label>
              <select name="ville" className="form-select" value={form.ville} onChange={handleChange}>
                <option>Casablanca</option><option>Rabat</option><option>Marrakech</option>
                <option>Tanger</option><option>Fès</option><option>Agadir</option>
              </select>
            </div>
            <div className="col-12">
              <button type="submit" className="btn btn-primary px-4" disabled={loading}>
                {loading ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </form>
      </div>

      <style>{`
        .active-card {
          border-color: #0d6efd !important;
          background: rgba(13, 110, 253, 0.05);
        }
      `}</style>
    </div>
  );
}

export default TeacherProfile;