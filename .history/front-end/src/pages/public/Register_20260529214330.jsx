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
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f1f5f9 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative'
    }}>
      
      {/* Card */}
      <div style={{
        width: '100%',
        maxWidth: '480px',
        background: '#fff',
        borderRadius: '24px',
        boxShadow: '0 20px 60px -15px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)',
        overflow: 'hidden',
        position: 'relative'
      }}>
        
        {/* Croix fermer */}
        <button
          onClick={() => props.onNavigate('home')}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            border: 'none',
            background: 'rgba(0,0,0,0.05)',
            color: '#64748b',
            fontSize: '20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
            zIndex: 10
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(239,68,68,0.1)';
            e.currentTarget.style.color = '#ef4444';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(0,0,0,0.05)';
            e.currentTarget.style.color = '#64748b';
          }}
        >
          ✕
        </button>

        {/* Header */}
        <div style={{
          background: isEnseignant 
            ? 'linear-gradient(135deg, #0d6efd 0%, #0b5ed7 100%)' 
            : 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
          padding: '40px 32px 32px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Decorative circles */}
          <div style={{
            position: 'absolute',
            top: '-20px',
            right: '-20px',
            width: '100px',
            height: '100px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '50%'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-30px',
            left: '-30px',
            width: '120px',
            height: '120px',
            background: 'rgba(255,255,255,0.08)',
            borderRadius: '50%'
          }} />

          <div style={{
            width: '64px',
            height: '64px',
            background: '#fff',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: '32px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
          }}>
            {isEnseignant ? '👨‍🏫' : '🎓'}
          </div>
          <h2 style={{
            color: '#fff',
            fontSize: '26px',
            fontWeight: '800',
            margin: '0 0 8px',
            letterSpacing: '-0.5px'
          }}>
            {isEnseignant ? 'Inscription Learnect.ma' : 'Créer un compte'}
          </h2>
          <p style={{
            color: 'rgba(255,255,255,0.85)',
            fontSize: '14px',
            margin: 0,
            fontWeight: '500',
            lineHeight: '1.5'
          }}>
            {isEnseignant 
              ? 'Rejoignez le réseau marocain d\'entraide et soutien scolaire. Rapide, direct, sécurisé.'
              : 'Commencez votre apprentissage avec les meilleurs professeurs du Maroc.'}
          </p>
        </div>

        {/* Form */}
        <div style={{ padding: '32px' }}>
          
          {errors.general && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              padding: '12px 16px',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: '600',
              marginBottom: '20px'
            }}>
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
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
                placeholder="Casablanca, Rabat, Marrakech..."
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
              <label style={labelStyle}>Confirmer le mot de passe</label>
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
                background: isEnseignant
                  ? 'linear-gradient(135deg, #0d6efd 0%, #0b5ed7 100%)'
                  : 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '14px',
                padding: '16px',
                fontSize: '15px',
                fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                marginTop: '8px',
                boxShadow: isEnseignant
                  ? '0 8px 24px -4px rgba(13,110,253,0.3)'
                  : '0 8px 24px -4px rgba(16,185,129,0.3)',
                transition: 'all 0.2s'
              }}
            >
              {loading ? 'Inscription en cours...' : (isEnseignant ? 'Devenir tuteur' : 'S\'inscrire')}
            </button>

          </form>

          {/* Footer link */}
          <div style={{
            textAlign: 'center',
            marginTop: '24px',
            paddingTop: '20px',
            borderTop: '1px solid #e2e8f0'
          }}>
            <p style={{
              color: '#94a3b8',
              fontSize: '14px',
              margin: 0,
              fontWeight: '500'
            }}>
              Vous avez déjà un compte ?{' '}
              <button
                onClick={() => props.onNavigate('login')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: isEnseignant ? '#0d6efd' : '#059669',
                  fontWeight: '700',
                  cursor: 'pointer',
                  padding: 0,
                  fontSize: '14px'
                }}
              >
                Connexion
              </button>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

// Styles
const labelStyle = {
  display: 'block',
  color: '#475569',
  fontSize: '12px',
  fontWeight: '700',
  marginBottom: '6px',
  paddingLeft: '4px'
};

const inputStyle = (error) => ({
  width: '100%',
  background: '#f8fafc',
  border: `2px solid ${error ? '#fecaca' : '#e2e8f0'}`,
  borderRadius: '12px',
  padding: '14px 16px',
  color: '#1e293b',
  fontSize: '14px',
  fontWeight: '600',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'all 0.2s'
});

const errorStyle = {
  color: '#dc2626',
  fontSize: '12px',
  fontWeight: '600',
  marginTop: '4px',
  display: 'block'
};

export default Register;