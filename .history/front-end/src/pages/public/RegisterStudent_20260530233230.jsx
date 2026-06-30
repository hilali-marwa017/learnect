import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

const VILLES = ['Casablanca','Rabat','Marrakech','Fès','Tanger','Agadir','Meknès','Oujda','Salé','Tétouan'];

function RegisterStudent() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nom: '', prenom: '', email: '', password: '',
    password_confirmation: '', telephone: '', ville: '',
  });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const fd = new FormData();
      Object.entries({ ...form, role: 'etudiant' }).forEach(([k, v]) => fd.append(k, v));
      const res  = await fetch('http://localhost:8000/api/register', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw data;
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.location.href = '/student/dashboard';
    } catch (err) {
      setError(err.message || Object.values(err.errors || {})[0]?.[0] || 'Erreur inscription');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-bg">
      <div className="auth-card" style={{ maxWidth: 500 }}>

        <div className="auth-logo">
          <div className="auth-logo-icon">
            <i className="bi bi-book-fill"></i>
          </div>
          <h2 className="auth-title">Inscription <span>Élève</span></h2>
          <p className="auth-subtitle">Créez votre compte étudiant</p>
        </div>

        {error && (
          <div className="auth-error">
            <i className="bi bi-exclamation-circle me-2"></i>{error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Nom</label>
              <input name="nom" type="text" className="form-control" placeholder="Benali"
                value={form.nom} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Prénom</label>
              <input name="prenom" type="text" className="form-control" placeholder="Sara"
                value={form.prenom} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <div className="input-icon-wrap">
              <i className="bi bi-envelope input-icon"></i>
              <input name="email" type="email" className="form-control input-with-icon"
                placeholder="vous@example.com" value={form.email} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Téléphone</label>
            <div className="input-icon-wrap">
              <i className="bi bi-phone input-icon"></i>
              <input name="telephone" type="text" className="form-control input-with-icon"
                placeholder="0612345678" value={form.telephone} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Ville</label>
            <div className="input-icon-wrap">
              <i className="bi bi-geo-alt input-icon"></i>
              <select name="ville" className="form-control input-with-icon"
                value={form.ville} onChange={handleChange} required>
                <option value="">Choisir une ville</option>
                {VILLES.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Mot de passe</label>
              <div className="input-icon-wrap">
                <i className="bi bi-lock input-icon"></i>
                <input name="password" type="password" className="form-control input-with-icon"
                  placeholder="••••••••" value={form.password} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Confirmer</label>
              <div className="input-icon-wrap">
                <i className="bi bi-lock-fill input-icon"></i>
                <input name="password_confirmation" type="password" className="form-control input-with-icon"
                  placeholder="••••••••" value={form.password_confirmation} onChange={handleChange} required />
              </div>
            </div>
          </div>

          <button type="submit" className="btn-auth" disabled={loading}>
            {loading
              ? <><i className="bi bi-arrow-repeat me-2"></i>Inscription...</>
              : <><i className="bi bi-person-check me-2"></i>Créer mon compte</>
            }
          </button>
        </form>

        <div className="auth-links">
          <p>Déjà un compte ? <Link to="/login">Se connecter</Link></p>
          <Link to="/register" className="auth-back">
            <i className="bi bi-arrow-left me-1"></i>Changer de rôle
          </Link>
        </div>

      </div>
    </div>
  );
}

export default RegisterStudent;