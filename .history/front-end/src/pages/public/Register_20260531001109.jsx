import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  // État pour savoir quel rôle est sélectionné
  const [role, setRole] = useState('etudiant'); // 'etudiant' ou 'enseignant'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Formulaire commun + spécifique
  const [form, setForm] = useState({
    prenom: '', nom: '', email: '', telephone: '', ville: '',
    password: '', password_confirmation: '',
    // Champs enseignant
    matiere: '', tarifHeure: '', diplomeTitle: ''
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (form.password !== form.password_confirmation) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    if (role === 'enseignant' && !form.matiere) {
      setError('Veuillez sélectionner une matière');
      setLoading(false);
      return;
    }

    try {
      await register({ ...form, role });
      if (role === 'enseignant') {
        navigate('/teacher/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 140px)',
      padding: '24px',
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '40px 36px',
        width: '100%',
        maxWidth: '460px',
        boxShadow: '0 20px 35px -12px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e9ecef',
      }}>
        
        {/* Bouton retour */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <Link to="/" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.8rem',
            color: '#94a3b8',
            textDecoration: 'none',
          }}>
            ← Retour à l'accueil
          </Link>
        </div>

        {/* TOGGLE - Le cœur du système (comme Superprof) */}
        <div style={{
          display: 'flex',
          background: '#f1f5f9',
          borderRadius: '40px',
          padding: '4px',
          marginBottom: '28px',
        }}>
          <button
            type="button"
            onClick={() => setRole('etudiant')}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '40px',
              border: 'none',
              background: role === 'etudiant' ? '#0d6efd' : 'transparent',
              color: role === 'etudiant' ? 'white' : '#64748b',
              fontWeight: '600',
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            🎓 Je suis élève
          </button>
          <button
            type="button"
            onClick={() => setRole('enseignant')}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '40px',
              border: 'none',
              background: role === 'enseignant' ? '#0d6efd' : 'transparent',
              color: role === 'enseignant' ? 'white' : '#64748b',
              fontWeight: '600',
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            👨‍🏫 Je suis enseignant
          </button>
        </div>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            background: 'linear-gradient(135deg, #0d6efd, #0a58ca)',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px',
          }}>
            <i className="bi bi-mortarboard" style={{ fontSize: '24px', color: 'white' }}></i>
          </div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#1a1a2e' }}>
            Créer un compte
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
            Rejoignez la communauté Learnect
          </p>
        </div>

        {error && (
          <div style={{
            background: '#fee2e2',
            color: '#dc2626',
            padding: '10px 14px',
            borderRadius: '10px',
            marginBottom: '20px',
            fontSize: '0.8rem',
          }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Champs communs (toujours visibles) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <input
              type="text"
              name="prenom"
              placeholder="Prénom"
              value={form.prenom}
              onChange={handleChange}
              required
              style={{ padding: '10px 12px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '0.85rem', outline: 'none' }}
              onFocus={e => e.target.style.borderColor = '#0d6efd'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'}
            />
            <input
              type="text"
              name="nom"
              placeholder="Nom"
              value={form.nom}
              onChange={handleChange}
              required
              style={{ padding: '10px 12px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '0.85rem', outline: 'none' }}
              onFocus={e => e.target.style.borderColor = '#0d6efd'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '0.85rem', outline: 'none', marginBottom: '14px' }}
            onFocus={e => e.target.style.borderColor = '#0d6efd'}
            onBlur={e => e.target.style.borderColor = '#e2e8f0'}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <input
              type="tel"
              name="telephone"
              placeholder="Téléphone"
              value={form.telephone}
              onChange={handleChange}
              required
              style={{ padding: '10px 12px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '0.85rem', outline: 'none' }}
              onFocus={e => e.target.style.borderColor = '#0d6efd'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'}
            />
            <select
              name="ville"
              value={form.ville}
              onChange={handleChange}
              required
              style={{ padding: '10px 12px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '0.85rem', background: 'white' }}
            >
              <option value="">Ville</option>
              <option>Casablanca</option>
              <option>Rabat</option>
              <option>Marrakech</option>
              <option>Tanger</option>
              <option>Fès</option>
              <option>Agadir</option>
            </select>
          </div>

          {/* Champs spécifiques ENSEIGNANT (apparaissent seulement si rôle = enseignant) */}
          {role === 'enseignant' && (
            <div style={{ 
              background: '#f8fafc', 
              padding: '16px', 
              borderRadius: '12px', 
              marginBottom: '14px',
              border: '1px solid #e2e8f0'
            }}>
              <p style={{ fontSize: '0.7rem', fontWeight: '600', color: '#0d6efd', marginBottom: '12px' }}>
                📚 Informations professionnelles
              </p>
              <select
                name="matiere"
                value={form.matiere}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '10px', background: 'white' }}
              >
                <option value="">Matière d'enseignement</option>
                <option>Mathématiques</option>
                <option>Physique-Chimie</option>
                <option>SVT</option>
                <option>Français</option>
                <option>Anglais</option>
                <option>Informatique</option>
              </select>
              <input
                type="number"
                name="tarifHeure"
                placeholder="Tarif horaire (DH/h)"
                value={form.tarifHeure}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '10px', outline: 'none' }}
                onFocus={e => e.target.style.borderColor = '#0d6efd'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
              <input
                type="text"
                name="diplomeTitle"
                placeholder="Intitulé du diplôme"
                value={form.diplomeTitle}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '0.85rem', outline: 'none' }}
                onFocus={e => e.target.style.borderColor = '#0d6efd'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>
          )}

          {/* Mot de passe */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Mot de passe"
                value={form.password}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '0.85rem', outline: 'none' }}
                onFocus={e => e.target.style.borderColor = '#0d6efd'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password_confirmation"
                placeholder="Confirmer"
                value={form.password_confirmation}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '0.85rem', outline: 'none' }}
                onFocus={e => e.target.style.borderColor = '#0d6efd'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>
          </div>

          {/* Afficher/masquer mot de passe */}
          <div style={{ textAlign: 'right', marginBottom: '20px' }}>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '0.7rem',
                color: '#94a3b8',
                cursor: 'pointer',
              }}
            >
              {showPassword ? '🙈 Cacher' : '👁️ Afficher'} le mot de passe
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: 'linear-gradient(135deg, #0d6efd, #0a58ca)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontWeight: '600',
              fontSize: '0.9rem',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Création en cours...' : 'Créer mon compte →'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #e9ecef' }}>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            Déjà un compte ?{' '}
            <Link to="/login" style={{ color: '#0d6efd', fontWeight: '600', textDecoration: 'none' }}>
              Se connecter
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Register;