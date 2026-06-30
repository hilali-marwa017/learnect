import React, { useState } from 'react';
import api from '../../api/axios';

function Register(props) {
  const isEnseignant = props.role === 'enseignant';

  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    password_confirmation: '',
    telephone: '',
    ville: '',
    role: isEnseignant ? 'enseignant' : 'etudiant'
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    // Validation
    const newErrors = {};
    if (!form.nom || form.nom.length < 3) newErrors.nom = 'Nom min 3 caractères';
    if (!form.prenom || form.prenom.length < 3) newErrors.prenom = 'Prénom min 3 caractères';
    if (!form.email || !form.email.includes('@')) newErrors.email = 'Email invalide';
    if (!form.password || form.password.length < 8) newErrors.password = 'Min 8 caractères';
    if (form.password !== form.password_confirmation) newErrors.password_confirmation = 'Ne correspond pas';
    if (!form.telephone) newErrors.telephone = 'Requis';
    if (!form.ville) newErrors.ville = 'Requise';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/register', form);
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      if (user.role === 'etudiant') {
        props.onNavigate('student-dashboard');
      } else {
        props.onNavigate('teacher-dashboard');
      }

    } catch (err) {
      const serverErrors = err.response?.data?.errors;
      if (serverErrors) {
        setErrors(serverErrors);
      } else {
        setErrors({ general: err.response?.data?.message || 'Erreur inscription' });
      }
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      {/* Glow */}
      <div style={{
        position: 'absolute',
        top: '-100px',
        right: '-100px',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none'
      }} />

      <div style={{
        width: '100%',
        maxWidth: '460px',
        background: 'rgba(30,41,59,0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        border: '1px solid rgba(255,255,255,0.1)',
        padding: '40px',
        position: 'relative',
        zIndex: 10,
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
      }}>
        
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: '28px'
          }}>
            {isEnseignant ? '👨‍🏫' : '🎓'}
          </div>
          <h2 style={{
            color: '#fff',
            fontSize: '24px',
            fontWeight: '900',
            margin: '0 0 8px'
          }}>
            {isEnseignant ? 'Devenir tuteur' : 'Créer un compte'}
          </h2>
          <p style={{
            color: '#94a3b8',
            fontSize: '13px',
            margin: 0,
            fontWeight: '500'
          }}>
            {isEnseignant 
              ? 'Rejoignez Learnect et partagez votre savoir' 
              : 'Commencez votre apprentissage dès maintenant'}
          </p>
        </div>

        {/* Error */}
        {errors.general && (
          <div style={{
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)',
            color: '#f87171',
            padding: '12px 16px',
            borderRadius: '12px',
            fontSize: '13px',
            fontWeight: '600',
            marginBottom: '20px'
          }}>
            {errors.general}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Nom</label>
              <input
                type="text"
                name="nom"
                value={form.nom}
                onChange={handleChange}
                placeholder="Votre nom"
                style={inputStyle(errors.nom)}
              />
              {errors.nom && <span style={errorStyle}>{errors.nom}</span>}
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Prénom</label>
              <input
                type="text"
                name="prenom"
                value={form.prenom}
                onChange={handleChange}
                placeholder="Votre prénom"
                style={inputStyle(errors.prenom)}
              />
              {errors.prenom && <span style={errorStyle}>{errors.prenom}</span>}
            </div>
          </div>

          <div>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="exemple@email.com"
              style={inputStyle(errors.email)}
            />
            {errors.email && <span style={errorStyle}>{errors.email}</span>}
          </div>

          <div>
            <label style={labelStyle}>Téléphone</label>
            <input
              type="text"
              name="telephone"
              value={form.telephone}
              onChange={handleChange}
              placeholder="06 XX XX XX XX"
              style={inputStyle(errors.telephone)}
            />
            {errors.telephone && <span style={errorStyle}>{errors.telephone}</span>}
          </div>

          <div>
            <label style={labelStyle}>Ville</label>
            <input
              type="text"
              name="ville"
              value={form.ville}
              onChange={handleChange}
              placeholder="Casablanca, Rabat..."
              style={inputStyle(errors.ville)}
            />
            {errors.ville && <span style={errorStyle}>{errors.ville}</span>}
          </div>

          <div>
            <label style={labelStyle}>Mot de passe</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Min 8 caractères"
              style={inputStyle(errors.password)}
            />
            {errors.password && <span style={errorStyle}>{errors.password}</span>}
          </div>

          <div>
            <label style={labelStyle}>Confirmer</label>
            <input
              type="password"
              name="password_confirmation"
              value={form.password_confirmation}
              onChange={handleChange}
              placeholder="Répétez le mot de passe"
              style={inputStyle(errors.password_confirmation)}
            />
            {errors.password_confirmation && <span style={errorStyle}>{errors.password_confirmation}</span>}
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '14px',
              padding: '16px',
              fontSize: '14px',
              fontWeight: '800',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              marginTop: '8px',
              boxShadow: '0 10px 25px -5px rgba(16,185,129,0.3)'
            }}
          >
            {loading ? 'Inscription...' : (isEnseignant ? 'Devenir tuteur' : 'S\'inscrire')}
          </button>

        </form>

        <p style={{
          textAlign: 'center',
          color: '#64748b',
          fontSize: '13px',
          marginTop: '24px',
          fontWeight: '500'
        }}>
          Déjà membre ?{' '}
          <button
            onClick={() => props.onNavigate('login')}
            style={{
              background: 'none',
              border: 'none',
              color: '#10b981',
              fontWeight: '700',
              cursor: 'pointer',
              padding: 0
            }}
          >
            Se connecter
          </button>
        </p>

      </div>
    </div>
  );
}

// Styles helpers
const labelStyle = {
  display: 'block',
  color: '#64748b',
  fontSize: '11px',
  fontWeight: '700',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  marginBottom: '6px',
  paddingLeft: '4px'
};

const inputStyle = (error) => ({
  width: '100%',
  background: 'rgba(255,255,255,0.05)',
  border: `1px solid ${error ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.1)'}`,
  borderRadius: '14px',
  padding: '14px 16px',
  color: '#fff',
  fontSize: '14px',
  fontWeight: '600',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'all 0.2s'
});

const errorStyle = {
  color: '#f87171',
  fontSize: '12px',
  fontWeight: '600',
  marginTop: '4px',
  display: 'block'
};

export default Register;