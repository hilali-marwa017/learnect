import React, { useState } from 'react';
import api from '../../api/axios';

function Register(props) {
  const isEnseignant = props.role === 'enseignant';
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    // Étape 1
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    ville: '',
    password: '',
    password_confirmation: '',
    // Étape 2 (enseignant)
    matiere: '',
    tarif: '',
    diplome: '',
    // Rôle
    role: isEnseignant ? 'enseignant' : 'etudiant'
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [accepted, setAccepted] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  function validateStep1() {
    const newErrors = {};
    if (!form.nom || form.nom.length < 3) newErrors.nom = 'Nom min 3 caractères';
    if (!form.prenom || form.prenom.length < 3) newErrors.prenom = 'Prénom min 3 caractères';
    if (!form.email || !form.email.includes('@')) newErrors.email = 'Email invalide';
    if (!form.telephone) newErrors.telephone = 'Numéro requis';
    if (!form.ville) newErrors.ville = 'Ville requise';
    if (!form.password || form.password.length < 8) newErrors.password = 'Min 8 caractères';
    if (form.password !== form.password_confirmation) newErrors.password_confirmation = 'Ne correspond pas';
    return newErrors;
  }

  function validateStep2() {
    const newErrors = {};
    if (!form.matiere) newErrors.matiere = 'Matière requise';
    if (!form.tarif || form.tarif < 5) newErrors.tarif = 'Tarif min 5 DH';
    if (!form.diplome) newErrors.diplome = 'Diplôme requis';
    if (!accepted) newErrors.accepted = 'Vous devez accepter les conditions';
    return newErrors;
  }

  function nextStep() {
    const errs = validateStep1();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setStep(2);
  }

  function prevStep() {
    setStep(1);
    setErrors({});
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validateStep2();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/register', form);
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      props.onNavigate('teacher-dashboard');

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

  if (!isEnseignant) {
    // Version étudiant simple (comme avant)
    return <RegisterStudent {...props} />;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 30%, #0f3460 60%, #e94560 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      {/* Animated background shapes */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '5%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(233,69,96,0.2) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 6s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '5%',
        width: '250px',
        height: '250px',
        background: 'radial-gradient(circle, rgba(15,52,96,0.3) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'float 8s ease-in-out infinite reverse'
      }} />

      {/* Card */}
      <div style={{
        width: '100%',
        maxWidth: '520px',
        background: 'rgba(255,255,255,0.97)',
        borderRadius: '28px',
        boxShadow: '0 32px 64px -16px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1)',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 10
      }}>
        
        {/* Close button */}
        <button
          onClick={() => props.onNavigate('home')}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: 'none',
            background: 'rgba(26,26,46,0.1)',
            color: '#1a1a2e',
            fontSize: '22px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s',
            zIndex: 20
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = '#e94560';
            e.currentTarget.style.color = '#fff';
            e.currentTarget.style.transform = 'rotate(90deg)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(26,26,46,0.1)';
            e.currentTarget.style.color = '#1a1a2e';
            e.currentTarget.style.transform = 'rotate(0deg)';
          }}
        >
          ✕
        </button>

        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          padding: '48px 32px 36px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Decorative elements */}
          <div style={{
            position: 'absolute',
            top: '-40px',
            right: '-40px',
            width: '120px',
            height: '120px',
            border: '3px solid rgba(233,69,96,0.3)',
            borderRadius: '50%'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-20px',
            left: '-20px',
            width: '80px',
            height: '80px',
            background: 'rgba(233,69,96,0.15)',
            borderRadius: '50%'
          }} />

          <div style={{
            width: '72px',
            height: '72px',
            background: 'linear-gradient(135deg, #e94560 0%, #ff6b6b 100%)',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            fontSize: '36px',
            boxShadow: '0 12px 32px -8px rgba(233,69,96,0.4)',
            transform: 'rotate(-5deg)'
          }}>
            👨‍🏫
          </div>
          <h2 style={{
            color: '#fff',
            fontSize: '28px',
            fontWeight: '900',
            margin: '0 0 10px',
            letterSpacing: '-0.5px'
          }}>
            Inscription Learnect.ma
          </h2>
          <p style={{
            color: 'rgba(255,255,255,0.8)',
            fontSize: '14px',
            margin: 0,
            fontWeight: '500',
            lineHeight: '1.6',
            maxWidth: '380px',
            margin: '0 auto'
          }}>
            Rejoignez le réseau marocain d'entraide et soutien scolaire. Rapide, direct, sécurisé.
          </p>

          {/* Steps indicator */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginTop: '24px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: step >= 1 ? '#e94560' : 'rgba(255,255,255,0.2)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: '800'
              }}>
                1
              </div>
              <span style={{
                color: step >= 1 ? '#fff' : 'rgba(255,255,255,0.5)',
                fontSize: '12px',
                fontWeight: '700'
              }}>
                Profil Général
              </span>
            </div>
            <div style={{
              width: '30px',
              height: '2px',
              background: step >= 2 ? '#e94560' : 'rgba(255,255,255,0.2)'
            }} />
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: step >= 2 ? '#e94560' : 'rgba(255,255,255,0.2)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: '800'
              }}>
                2
              </div>
              <span style={{
                color: step >= 2 ? '#fff' : 'rgba(255,255,255,0.5)',
                fontSize: '12px',
                fontWeight: '700'
              }}>
                Justificatifs Pro
              </span>
            </div>
          </div>
        </div>

        {/* Form */}
        <div style={{ padding: '36px 32px' }}>
          
          {errors.general && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              padding: '14px 18px',
              borderRadius: '14px',
              fontSize: '13px',
              fontWeight: '600',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span style={{ fontSize: '18px' }}>⚠️</span>
              {errors.general}
            </div>
          )}

          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              
              <div style={{ display: 'flex', gap: '14px' }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Nom de famille</label>
                  <input
                    type="text"
                    name="nom"
                    value={form.nom}
                    onChange={handleChange}
                    placeholder="Ex: Benali"
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
                    placeholder="Ex: Karim"
                    style={inputStyle(errors.prenom)}
                  />
                  {errors.prenom && <span style={errorStyle}>{errors.prenom}</span>}
                </div>
              </div>

              <div>
                <label style={labelStyle}>Adresse Email Académique</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="professeur@academie.ma"
                  style={inputStyle(errors.email)}
                />
                {errors.email && <span style={errorStyle}>{errors.email}</span>}
              </div>

              <div>
                <label style={labelStyle}>Numéro Téléphone / WhatsApp</label>
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
                <label style={labelStyle}>Ville de résidence</label>
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
                <label style={labelStyle}>Mot de passe confidentiel</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min 8 caractères, sécurisé"
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
                  placeholder="Répétez votre mot de passe"
                  style={inputStyle(errors.password_confirmation)}
                />
                {errors.password_confirmation && <span style={errorStyle}>{errors.password_confirmation}</span>}
              </div>

              <button
                type="button"
                onClick={nextStep}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '16px',
                  padding: '18px',
                  fontSize: '15px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  marginTop: '8px',
                  boxShadow: '0 8px 24px -4px rgba(26,26,46,0.3)',
                  transition: 'all 0.3s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 12px 32px -4px rgba(26,26,46,0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 24px -4px rgba(26,26,46,0.3)';
                }}
              >
                Continuer vers les justificatifs →
              </button>

            </div>
          )}

          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              
              <div>
                <label style={labelStyle}>Matière d'enseignement principale</label>
                <select
                  name="matiere"
                  value={form.matiere}
                  onChange={handleChange}
                  style={inputStyle(errors.matiere)}
                >
                  <option value="">Sélectionnez votre matière</option>
                  <option value="Mathématiques">Mathématiques</option>
                  <option value="Physique-Chimie">Physique-Chimie</option>
                  <option value="SVT">SVT</option>
                  <option value="Français">Français</option>
                  <option value="Anglais">Anglais</option>
                  <option value="Arabe">Arabe</option>
                  <option value="Histoire-Géographie">Histoire-Géographie</option>
                  <option value="Philosophie">Philosophie</option>
                  <option value="Économie">Économie</option>
                  <option value="Informatique">Informatique</option>
                </select>
                {errors.matiere && <span style={errorStyle}>{errors.matiere}</span>}
              </div>

              <div>
                <label style={labelStyle}>Tarif proposé (DH/h)</label>
                <input
                  type="number"
                  name="tarif"
                  value={form.tarif}
                  onChange={handleChange}
                  placeholder="Ex: 150"
                  style={inputStyle(errors.tarif)}
                />
                {errors.tarif && <span style={errorStyle}>{errors.tarif}</span>}
              </div>

              <div>
                <label style={labelStyle}>Intitulé officiel de votre Diplôme Supérieur</label>
                <input
                  type="text"
                  name="diplome"
                  value={form.diplome}
                  onChange={handleChange}
                  placeholder="Ex: Licence en Mathématiques, Master en Physique..."
                  style={inputStyle(errors.diplome)}
                />
                {errors.diplome && <span style={errorStyle}>{errors.diplome}</span>}
              </div>

              {/* Upload section */}
              <div style={{
                background: '#f8fafc',
                borderRadius: '16px',
                padding: '20px',
                border: '2px dashed #cbd5e1'
              }}>
                <p style={{
                  fontSize: '13px',
                  fontWeight: '700',
                  color: '#1e293b',
                  margin: '0 0 12px'
                }}>
                  📎 Dépôt des pièces d'études & CIN
                </p>
                <p style={{
                  fontSize: '12px',
                  color: '#64748b',
                  margin: '0 0 16px'
                }}>
                  Simulations interactives OFPPT
                </p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <label style={uploadStyle}>
                    <span>📄</span>
                    <span>Carte d'Identité (Recto)</span>
                    <input type="file" accept="image/*" style={{ display: 'none' }} />
                  </label>
                  <label style={uploadStyle}>
                    <span>📄</span>
                    <span>Carte d'Identité (Verso)</span>
                    <input type="file" accept="image/*" style={{ display: 'none' }} />
                  </label>
                  <label style={uploadStyle}>
                    <span>🎓</span>
                    <span>Copie du Diplôme Supérieur certifié (PDF ou JPG)</span>
                    <input type="file" accept=".pdf,image/*" style={{ display: 'none' }} />
                  </label>
                </div>
              </div>

              {/* Checkbox conditions */}
              <label style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                cursor: 'pointer',
                padding: '16px',
                background: '#fefce8',
                borderRadius: '14px',
                border: errors.accepted ? '2px solid #ef4444' : '2px solid transparent'
              }}>
                <input
                  type="checkbox"
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                  style={{ marginTop: '4px' }}
                />
                <span style={{
                  fontSize: '12px',
                  color: '#713f12',
                  lineHeight: '1.6',
                  fontWeight: '500'
                }}>
                  Je certifie sur l'honneur l'exactitude des pièces fournies sous peine de radiation. J'accepte les conditions de prélèvement automatique de la commission de 10% par Learnect Maroc.
                </span>
              </label>
              {errors.accepted && <span style={errorStyle}>{errors.accepted}</span>}

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={prevStep}
                  style={{
                    flex: 1,
                    background: '#f1f5f9',
                    color: '#475569',
                    border: 'none',
                    borderRadius: '16px',
                    padding: '18px',
                    fontSize: '15px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  ← Retour
                </button>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={loading}
                  style={{
                    flex: 2,
                    background: 'linear-gradient(135deg, #e94560 0%, #ff6b6b 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '16px',
                    padding: '18px',
                    fontSize: '15px',
                    fontWeight: '800',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1,
                    boxShadow: '0 8px 24px -4px rgba(233,69,96,0.3)',
                    transition: 'all 0.3s'
                  }}
                >
                  {loading ? 'Inscription...' : 'Finaliser mon inscription'}
                </button>
              </div>

            </div>
          )}

          {/* Footer */}
          <div style={{
            textAlign: 'center',
            marginTop: '28px',
            paddingTop: '24px',
            borderTop: '2px solid #f1f5f9'
          }}>
            <p style={{
              color: '#94a3b8',
              fontSize: '14px',
              margin: '0 0 16px',
              fontWeight: '500'
            }}>
              Déjà membre de la communauté ?{' '}
              <button
                onClick={() => props.onNavigate('login')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#e94560',
                  fontWeight: '800',
                  cursor: 'pointer',
                  padding: 0,
                  fontSize: '14px'
                }}
              >
                Connexion
              </button>
            </p>

            {/* Portail de simulation */}
            <div style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              borderRadius: '16px',
              padding: '20px',
              marginTop: '20px'
            }}>
              <p style={{
                color: '#e94560',
                fontSize: '11px',
                fontWeight: '800',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                margin: '0 0 12px'
              }}>
                Portail de Simulation Académique
              </p>
              <p style={{
                color: 'rgba(255,255,255,0.7)',
                fontSize: '12px',
                margin: '0 0 16px',
                lineHeight: '1.5'
              }}>
                PFE HILALI MARWA : Naviguez d'un clic pour tester le parcours utilisateur.
              </p>
              
              <button
                type="button"
                onClick={() => {
                  props.onSetRole('etudiant');
                  props.onNavigate('simulator');
                }}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '12px',
                  padding: '14px',
                  color: '#fff',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  transition: 'all 0.3s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(233,69,96,0.3)';
                  e.currentTarget.style.borderColor = '#e94560';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                }}
              >
                <span>🎓</span>
                <span>Statut de test : Élève Marwa Hilali</span>
              </button>
              
              <p style={{
                color: 'rgba(255,255,255,0.5)',
                fontSize: '11px',
                margin: '12px 0 0',
                fontWeight: '500'
              }}>
                Marwa Hilali — 🎓 Apprenant
              </p>
            </div>

          </div>

        </div>
      </div>

      {/* CSS animation */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
}

// Register student simple version
function RegisterStudent(props) {
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    password_confirmation: '',
    telephone: '',
    ville: '',
    role: 'etudiant'
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
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/register', form);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      props.onNavigate('student-dashboard');
    } catch (err) {
      setErrors({ general: err.response?.data?.message || 'Erreur' });
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #f0fdf4 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '480px',
        background: '#fff',
        borderRadius: '24px',
        boxShadow: '0 20px 60px -15px rgba(0,0,0,0.15)',
        overflow: 'hidden'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
          padding: '40px 32px',
          textAlign: 'center'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            background: '#fff',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: '32px'
          }}>
            🎓
          </div>
          <h2 style={{ color: '#fff', fontSize: '26px', fontWeight: '800', margin: 0 }}>
            Créer un compte
          </h2>
        </div>
        
        <div style={{ padding: '32px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Nom</label>
                <input type="text" name="nom" value={form.nom} onChange={handleChange} style={inputStyle(errors.nom)} />
                {errors.nom && <span style={errorStyle}>{errors.nom}</span>}
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Prénom</label>
                <input type="text" name="prenom" value={form.prenom} onChange={handleChange} style={inputStyle(errors.prenom)} />
                {errors.prenom && <span style={errorStyle}>{errors.prenom}</span>}
              </div>
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} style={inputStyle(errors.email)} />
              {errors.email && <span style={errorStyle}>{errors.email}</span>}
            </div>
            <div>
              <label style={labelStyle}>Téléphone</label>
              <input type="text" name="telephone" value={form.telephone} onChange={handleChange} style={inputStyle(errors.telephone)} />
              {errors.telephone && <span style={errorStyle}>{errors.telephone}</span>}
            </div>
            <div>
              <label style={labelStyle}>Ville</label>
              <input type="text" name="ville" value={form.ville} onChange={handleChange} style={inputStyle(errors.ville)} />
              {errors.ville && <span style={errorStyle}>{errors.ville}</span>}
            </div>
            <div>
              <label style={labelStyle}>Mot de passe</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} style={inputStyle(errors.password)} />
              {errors.password && <span style={errorStyle}>{errors.password}</span>}
            </div>
            <div>
              <label style={labelStyle}>Confirmer</label>
              <input type="password" name="password_confirmation" value={form.password_confirmation} onChange={handleChange} style={inputStyle(errors.password_confirmation)} />
              {errors.password_confirmation && <span style={errorStyle}>{errors.password_confirmation}</span>}
            </div>
            <button type="submit" disabled={loading} style={{
              width: '100%',
              background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '14px',
              padding: '16px',
              fontSize: '15px',
              fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}>
              {loading ? 'Inscription...' : 'S\'inscrire'}
            </button>
          </form>
          <p style={{ textAlign: 'center', marginTop: '20px', color: '#64748b', fontSize: '14px' }}>
            Déjà membre ? <button onClick={() => props.onNavigate('login')} style={{ background: 'none', border: 'none', color: '#059669', fontWeight: '700', cursor: 'pointer' }}>Connexion</button>
          </p>
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

const uploadStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '14px 16px',
  background: '#fff',
  borderRadius: '12px',
  border: '2px solid #e2e8f0',
  cursor: 'pointer',
  fontSize: '13px',
  color: '#475569',
  fontWeight: '600',
  transition: 'all 0.2s'
};

export default Register;