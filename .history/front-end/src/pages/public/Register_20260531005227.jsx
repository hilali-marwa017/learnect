import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('etudiant');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    prenom: '', nom: '', email: '', telephone: '', ville: '',
    password: '', password_confirmation: '',
    matiere: '', tarifHeure: '', diplomeTitle: '', experience: '',
    cin_recto: null, cin_verso: null, diplome: null
  });

  const [uploadedFiles, setUploadedFiles] = useState({
    cin_recto: null, cin_verso: null, diplome: null
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (file) {
      setForm({ ...form, [name]: file });
      setUploadedFiles({ ...uploadedFiles, [name]: file.name });
    }
  };

  const validateForm = () => {
    if (!form.prenom || !form.nom || !form.email || !form.telephone || !form.ville) {
      setError('Tous les champs obligatoires doivent être remplis');
      return false;
    }
    if (form.password !== form.password_confirmation) {
      setError('Les mots de passe ne correspondent pas');
      return false;
    }
    if (form.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return false;
    }
    if (role === 'enseignant') {
      if (!form.matiere || !form.tarifHeure || !form.diplomeTitle) {
        setError('Veuillez compléter tous les champs professionnels');
        return false;
      }
      if (Number(form.tarifHeure) < 50) {
        setError('Le tarif minimum est de 50 DH/h');
        return false;
      }
      if (!form.cin_recto || !form.cin_verso || !form.diplome) {
        setError('Veuillez télécharger tous les documents requis');
        return false;
      }
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => {
        if (key !== 'cin_recto' && key !== 'cin_verso' && key !== 'diplome') {
          formData.append(key, form[key]);
        }
      });
      if (form.cin_recto) formData.append('cin_recto', form.cin_recto);
      if (form.cin_verso) formData.append('cin_verso', form.cin_verso);
      if (form.diplome) formData.append('diplome', form.diplome);
      formData.append('role', role);
      
      await register(formData);
      navigate(role === 'enseignant' ? '/teacher/dashboard' : '/student/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 140px)',
      padding: '24px',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
    }}>
      <div style={{
        background: 'white',
        borderRadius: '28px',
        padding: '44px 40px',
        width: '100%',
        maxWidth: '560px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
        border: '1px solid rgba(13, 110, 253, 0.08)',
      }}>
        
        {/* Bouton retour centré */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <Link 
            to="/" 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8rem',
              color: '#94a3b8',
              textDecoration: 'none',
              transition: 'color 0.2s',
              fontWeight: 500,
            }}
            onMouseOver={e => e.currentTarget.style.color = '#0d6efd'}
            onMouseOut={e => e.currentTarget.style.color = '#94a3b8'}
          >
            <i className="bi bi-arrow-left"></i> Retour à l'accueil
          </Link>
        </div>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            background: 'linear-gradient(135deg, #0d6efd, #0a58ca)',
            borderRadius: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 10px 25px -5px rgba(13, 110, 253, 0.3)',
          }}>
            <i className="bi bi-person-plus-fill" style={{ fontSize: '28px', color: 'white' }}></i>
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a', letterSpacing: '-0.5px', marginBottom: '4px' }}>
            Créer un compte
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Rejoignez la communauté Learnect.ma</p>
        </div>

        {/* TOGGLE RÔLE - ICÔNES SIMPLES */}
        <div style={{
          display: 'flex',
          background: '#f1f5f9',
          borderRadius: '60px',
          padding: '5px',
          marginBottom: '32px',
          gap: '5px',
        }}>
          <button
            type="button"
            onClick={() => setRole('etudiant')}
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: '60px',
              border: 'none',
              background: role === 'etudiant' ? 'white' : 'transparent',
              color: role === 'etudiant' ? '#0d6efd' : '#64748b',
              fontWeight: '600',
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: role === 'etudiant' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
            }}
          >
            <i className="bi bi-person"></i>
            <span>Je suis élève</span>
          </button>
          <button
            type="button"
            onClick={() => setRole('enseignant')}
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: '60px',
              border: 'none',
              background: role === 'enseignant' ? 'white' : 'transparent',
              color: role === 'enseignant' ? '#0d6efd' : '#64748b',
              fontWeight: '600',
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: role === 'enseignant' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
            }}
          >
            <i className="bi bi-briefcase"></i>
            <span>Je suis enseignant</span>
          </button>
        </div>

        {/* Message d'erreur */}
        {error && (
          <div style={{
            background: '#fef2f2',
            borderLeft: '3px solid #ef4444',
            padding: '12px 16px',
            borderRadius: '12px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.8rem',
            color: '#dc2626',
          }}>
            <i className="bi bi-exclamation-triangle-fill"></i>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          
          {/* Prénom + Nom */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
            <div>
              <label style={{ fontSize: '0.7rem', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>
                <i className="bi bi-person" style={{ marginRight: '4px' }}></i> Prénom
              </label>
              <input
                type="text"
                name="prenom"
                placeholder="Marwa"
                value={form.prenom}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '14px',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
                onFocus={e => e.target.style.borderColor = '#0d6efd'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.7rem', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>
                <i className="bi bi-person-badge" style={{ marginRight: '4px' }}></i> Nom
              </label>
              <input
                type="text"
                name="nom"
                placeholder="Benani"
                value={form.nom}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '14px',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
                onFocus={e => e.target.style.borderColor = '#0d6efd'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>
          </div>

          {/* Email */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '0.7rem', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>
              <i className="bi bi-envelope" style={{ marginRight: '4px' }}></i> Adresse email
            </label>
            <input
              type="email"
              name="email"
              placeholder="marwa@example.com"
              value={form.email}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px 14px',
                border: '1.5px solid #e2e8f0',
                borderRadius: '14px',
                fontSize: '0.85rem',
                outline: 'none',
              }}
              onFocus={e => e.target.style.borderColor = '#0d6efd'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          {/* Téléphone + Ville */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
            <div>
              <label style={{ fontSize: '0.7rem', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>
                <i className="bi bi-whatsapp" style={{ marginRight: '4px' }}></i> Téléphone
              </label>
              <input
                type="tel"
                name="telephone"
                placeholder="+212 6XX XXX XXX"
                value={form.telephone}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '14px',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
                onFocus={e => e.target.style.borderColor = '#0d6efd'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.7rem', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>
                <i className="bi bi-geo-alt" style={{ marginRight: '4px' }}></i> Ville
              </label>
              <select
                name="ville"
                value={form.ville}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '14px',
                  fontSize: '0.85rem',
                  background: 'white',
                  cursor: 'pointer',
                }}
                onFocus={e => e.target.style.borderColor = '#0d6efd'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              >
                <option value="">Sélectionnez votre ville</option>
                <option>Casablanca</option>
                <option>Rabat</option>
                <option>Marrakech</option>
                <option>Tanger</option>
                <option>Fès</option>
                <option>Agadir</option>
              </select>
            </div>
          </div>

          {/* SECTION ENSEIGNANT */}
          {role === 'enseignant' && (
            <div style={{
              background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
              padding: '20px',
              borderRadius: '20px',
              marginBottom: '20px',
              border: '1px solid #e2e8f0',
            }}>
              <p style={{
                fontSize: '0.7rem',
                fontWeight: '700',
                color: '#0d6efd',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}>
                <i className="bi bi-briefcase-fill"></i>
                Informations professionnelles
              </p>
              
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.7rem', fontWeight: '500', color: '#475569', display: 'block', marginBottom: '4px' }}>
                  <i className="bi bi-book" style={{ marginRight: '4px' }}></i> Matière
                </label>
                <select
                  name="matiere"
                  value={form.matiere}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '0.85rem',
                    background: 'white',
                  }}
                >
                  <option value="">Choisissez une matière</option>
                  <option>Mathématiques</option>
                  <option>Physique-Chimie</option>
                  <option>SVT</option>
                  <option>Français</option>
                  <option>Anglais</option>
                  <option>Informatique</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.7rem', fontWeight: '500', color: '#475569', display: 'block', marginBottom: '4px' }}>
                    <i className="bi bi-cash-stack" style={{ marginRight: '4px' }}></i> Tarif (DH/h)
                  </label>
                  <input
                    type="number"
                    name="tarifHeure"
                    placeholder="150"
                    value={form.tarifHeure}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1.5px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '0.85rem',
                      outline: 'none',
                    }}
                    onFocus={e => e.target.style.borderColor = '#0d6efd'}
                    onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.7rem', fontWeight: '500', color: '#475569', display: 'block', marginBottom: '4px' }}>
                    <i className="bi bi-calendar" style={{ marginRight: '4px' }}></i> Expérience
                  </label>
                  <select
                    name="experience"
                    value={form.experience}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1.5px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '0.85rem',
                      background: 'white',
                    }}
                  >
                    <option value="">Sélectionnez</option>
                    <option>Moins d'1 an</option>
                    <option>1-3 ans</option>
                    <option>3-5 ans</option>
                    <option>5-10 ans</option>
                    <option>Plus de 10 ans</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.7rem', fontWeight: '500', color: '#475569', display: 'block', marginBottom: '4px' }}>
                  <i className="bi bi-award" style={{ marginRight: '4px' }}></i> Diplôme
                </label>
                <input
                  type="text"
                  name="diplomeTitle"
                  placeholder="Master / Licence ..."
                  value={form.diplomeTitle}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '0.85rem',
                    outline: 'none',
                  }}
                  onFocus={e => e.target.style.borderColor = '#0d6efd'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>

              <p style={{
                fontSize: '0.7rem',
                fontWeight: '700',
                color: '#0d6efd',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginTop: '8px',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}>
                <i className="bi bi-file-text"></i>
                Documents
              </p>

              {/* CIN Recto */}
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.7rem', fontWeight: '500', color: '#475569', display: 'block', marginBottom: '4px' }}>
                  <i className="bi bi-card-image"></i> CIN Recto
                </label>
                <div style={{
                  border: '1.5px dashed #cbd5e1',
                  borderRadius: '12px',
                  padding: '12px',
                  textAlign: 'center',
                  background: 'white',
                }}
                onMouseOver={e => e.currentTarget.style.borderColor = '#0d6efd'}
                onMouseOut={e => e.currentTarget.style.borderColor = '#cbd5e1'}>
                  <input type="file" name="cin_recto" id="cin_recto" onChange={handleFileChange} accept=".jpg,.jpeg,.png,.pdf" style={{ display: 'none' }} />
                  <label htmlFor="cin_recto" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <i className="bi bi-cloud-upload" style={{ fontSize: '18px', color: '#0d6efd' }}></i>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{uploadedFiles.cin_recto || 'Télécharger'}</span>
                  </label>
                </div>
              </div>

              {/* CIN Verso */}
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.7rem', fontWeight: '500', color: '#475569', display: 'block', marginBottom: '4px' }}>
                  <i className="bi bi-card-image"></i> CIN Verso
                </label>
                <div style={{
                  border: '1.5px dashed #cbd5e1',
                  borderRadius: '12px',
                  padding: '12px',
                  textAlign: 'center',
                  background: 'white',
                }}
                onMouseOver={e => e.currentTarget.style.borderColor = '#0d6efd'}
                onMouseOut={e => e.currentTarget.style.borderColor = '#cbd5e1'}>
                  <input type="file" name="cin_verso" id="cin_verso" onChange={handleFileChange} accept=".jpg,.jpeg,.png,.pdf" style={{ display: 'none' }} />
                  <label htmlFor="cin_verso" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <i className="bi bi-cloud-upload" style={{ fontSize: '18px', color: '#0d6efd' }}></i>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{uploadedFiles.cin_verso || 'Télécharger'}</span>
                  </label>
                </div>
              </div>

              {/* Diplôme */}
              <div style={{ marginBottom: '8px' }}>
                <label style={{ fontSize: '0.7rem', fontWeight: '500', color: '#475569', display: 'block', marginBottom: '4px' }}>
                  <i className="bi bi-file-earmark-pdf"></i> Diplôme
                </label>
                <div style={{
                  border: '1.5px dashed #cbd5e1',
                  borderRadius: '12px',
                  padding: '12px',
                  textAlign: 'center',
                  background: 'white',
                }}
                onMouseOver={e => e.currentTarget.style.borderColor = '#0d6efd'}
                onMouseOut={e => e.currentTarget.style.borderColor = '#cbd5e1'}>
                  <input type="file" name="diplome" id="diplome" onChange={handleFileChange} accept=".jpg,.jpeg,.png,.pdf" style={{ display: 'none' }} />
                  <label htmlFor="diplome" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <i className="bi bi-cloud-upload" style={{ fontSize: '18px', color: '#0d6efd' }}></i>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{uploadedFiles.diplome || 'Télécharger'}</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Mot de passe avec œil */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
            <div>
              <label style={{ fontSize: '0.7rem', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>
                <i className="bi bi-lock" style={{ marginRight: '4px' }}></i> Mot de passe
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    paddingRight: '45px',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: '14px',
                    fontSize: '0.85rem',
                    outline: 'none',
                  }}
                  onFocus={e => e.target.style.borderColor = '#0d6efd'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    color: '#adb5bd',
                  }}
                >
                  {showPassword ? (
                    <i className="bi bi-eye" style={{ fontSize: '1.1rem' }}></i>
                  ) : (
                    <i className="bi bi-eye-slash" style={{ fontSize: '1.1rem' }}></i>
                  )}
                </button>
              </div>
            </div>
            <div>
              <label style={{ fontSize: '0.7rem', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>
                <i className="bi bi-lock-fill" style={{ marginRight: '4px' }}></i> Confirmer
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password_confirmation"
                placeholder="••••••"
                value={form.password_confirmation}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '14px',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
                onFocus={e => e.target.style.borderColor = '#0d6efd'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>
          </div>

          {/* Bouton principal */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: 'linear-gradient(135deg, #0d6efd, #0a58ca)',
              color: 'white',
              border: 'none',
              borderRadius: '14px',
              fontWeight: '700',
              fontSize: '0.9rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(13, 110, 253, 0.25)',
            }}
            onMouseOver={e => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(13, 110, 253, 0.35)';
              }
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(13, 110, 253, 0.25)';
            }}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm"></span>
                Création...
              </>
            ) : (
              <>
                <i className="bi bi-person-plus-fill"></i>
                Créer mon compte
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '28px', paddingTop: '20px', borderTop: '1px solid #e9ecef' }}>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            Déjà un compte ?{' '}
            <Link to="/login" style={{ color: '#0d6efd', fontWeight: '600', textDecoration: 'none' }}>
              Se connecter
            </Link>
          </p>
        </div>

      </div>

      <style>{`
        .spinner-border {
          width: 14px;
          height: 14px;
          border: 2px solid white;
          border-top-color: transparent;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
          display: inline-block;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default Register