import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function TeacherProfile() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    prenom: user?.prenom || '',
    nom: user?.nom || '',
    email: user?.email || '',
    telephone: user?.telephone || '',
    ville: user?.ville || 'Casablanca',
    description: 'Enseignant passionné par la transmission des connaissances.'
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      // await api.put('/enseignant/profile', form);
      setMessage('✅ Profil mis à jour avec succès !');
    } catch (err) {
      setMessage('❌ Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">Mon profil</h2>

      {message && (
        <div className={`alert ${message.includes('✅') ? 'alert-success' : 'alert-danger'} mb-3`}>
          {message}
        </div>
      )}

      <div className="row">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm text-center p-4 mb-3">
            <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '100px', height: '100px', fontSize: '40px' }}>
              {user?.prenom?.[0]}{user?.nom?.[0]}
            </div>
            <h5>{user?.prenom} {user?.nom}</h5>
            <p className="text-muted small mb-0">{user?.role === 'enseignant' ? '👨‍🏫 Enseignant' : '👨‍🎓 Étudiant'}</p>
          </div>
          <div className="card border-0 shadow-sm p-3">
            <div className="text-center">
              <div className="fw-bold">Note moyenne</div>
              <div className="fs-1 text-warning">4.8 ★</div>
              <small className="text-muted">(12 avis)</small>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card border-0 shadow-sm p-4">
            <h5 className="fw-bold mb-3">Informations personnelles</h5>
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
                  <input type="email" name="email" className="form-control" value={form.email} readOnly disabled />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Téléphone</label>
                  <input type="tel" name="telephone" className="form-control" value={form.telephone} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Ville</label>
                  <select name="ville" className="form-select" value={form.ville} onChange={handleChange}>
                    <option>Casablanca</option>
                    <option>Rabat</option>
                    <option>Marrakech</option>
                    <option>Tanger</option>
                    <option>Fès</option>
                    <option>Agadir</option>
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label small fw-semibold">Description</label>
                  <textarea name="description" className="form-control" rows="4" value={form.description} onChange={handleChange}></textarea>
                </div>
                <div className="col-12">
                  <button type="submit" className="btn btn-primary px-4" disabled={loading}>
                    {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="mt-3">
        <Link to="/enseignant/dashboard" className="text-muted text-decoration-none">
          <i className="bi bi-arrow-left me-1"></i> Retour au tableau de bord
        </Link>
      </div>
    </div>
  );
}

export default TeacherProfile;