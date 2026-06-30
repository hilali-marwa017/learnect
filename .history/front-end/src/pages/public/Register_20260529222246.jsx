import React, { useState } from 'react';

function Register(props) {
  const [isEnseignant, setIsEnseignant] = useState(false);
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    ville: '',
    password: '',
    password_confirmation: '',
    role: 'etudiant',
    // Champs enseignant
    cin_recto: null,
    cin_verso: null,
    diplome: null
  });

  const [etape, setEtape] = useState(1);
  const [erreur, setErreur] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState({
    cin_recto: null,
    cin_verso: null,
    diplome: null
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  function handleFileChange(e) {
    const { name, files } = e.target;
    const file = files[0];
    if (file) {
      setForm({ ...form, [name]: file });
      setUploadedFiles({ ...uploadedFiles, [name]: file.name });
    }
  }

  function handleRoleChange(role) {
    setIsEnseignant(role === 'enseignant');
    setForm({ ...form, role: role });
    setEtape(1);
  }

  function validateEtape1() {
    if (!form.nom || !form.prenom || !form.email || !form.telephone || !form.ville) {
      setErreur('Veuillez remplir tous les champs obligatoires');
      return false;
    }
    if (form.password !== form.password_confirmation) {
      setErreur('Les mots de passe ne correspondent pas');
      return false;
    }
    if (form.password.length < 8) {
      setErreur('Le mot de passe doit contenir au moins 8 caractères');
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setErreur('Email invalide');
      return false;
    }
    setErreur('');
    return true;
  }

  function validateEtape2() {
    if (isEnseignant) {
      if (!form.cin_recto || !form.cin_verso || !form.diplome) {
        setErreur('Veuillez uploader tous les documents requis');
        return false;
      }
    }
    setErreur('');
    return true;
  }

  async function handleNext(e) {
    e.preventDefault();
    if (etape === 1 && validateEtape1()) {
      if (isEnseignant) {
        setEtape(2);
      } else {
        await handleSubmit(e);
      }
    } else if (etape === 2 && validateEtape2()) {
      await handleSubmit(e);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    setErreur('');

    try {
      const formData = new FormData();
      
      // Données texte
      formData.append('nom', form.nom);
      formData.append('prenom', form.prenom);
      formData.append('email', form.email);
      formData.append('telephone', form.telephone);
      formData.append('ville', form.ville);
      formData.append('password', form.password);
      formData.append('password_confirmation', form.password_confirmation);
      formData.append('role', form.role);
      
      // Fichiers pour enseignant
      if (isEnseignant) {
        formData.append('cin_recto', form.cin_recto);
        formData.append('cin_verso', form.cin_verso);
        formData.append('diplome', form.diplome);
      }

      const response = await fetch('/api/register', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });

      const data = await response.json();

      if (response.ok) {
        // Stocker le token
        if (data.token) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        
        // Redirection selon le rôle
        if (data.user.role === 'enseignant') {
          props.onNavigate('teacher-dashboard');
        } else {
          props.onNavigate('student-dashboard');
        }
      } else {
        setErreur(data.message || 'Erreur lors de l\'inscription');
      }
    } catch (error) {
      setErreur('Erreur de connexion au serveur');
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="register-wrapper">
      <div className="register-container">
        <div className="register-card">
          
          {/* Header */}
          <div className="register-header">
            <div className="register-icon">🎓</div>
            <h1 className="register-title">Créer un compte</h1>
            <p className="register-subtitle">
              Rejoignez Learnect.ma - La plateforme #1 des cours particuliers au Maroc
            </p>
          </div>

          {/* Role Selection */}
          {etape === 1 && (
            <div className="role-section">
              <div className="role-cards">
                <div 
                  className={`role-card ${form.role === 'etudiant' ? 'active' : ''}`}
                  onClick={() => handleRoleChange('etudiant')}
                >
                  <div className="role-emoji">🎓</div>
                  <div className="role-name">Étudiant</div>
                  <div className="role-desc">Je cherche des cours particuliers</div>
                  <div className="role-badge">Plus de 10k étudiants</div>
                  {form.role === 'etudiant' && <div className="role-check">✓</div>}
                </div>
                <div 
                  className={`role-card ${form.role === 'enseignant' ? 'active' : ''}`}
                  onClick={() => handleRoleChange('enseignant')}
                >
                  <div className="role-emoji">👨‍🏫</div>
                  <div className="role-name">Enseignant</div>
                  <div className="role-desc">Je donne des cours particuliers</div>
                  <div className="role-badge">Gagnez jusqu'à 5000 DH/mois</div>
                  {form.role === 'enseignant' && <div className="role-check">✓</div>}
                </div>
              </div>
            </div>
          )}

          {/* Progress Steps for Teacher */}
          {isEnseignant && etape >= 1 && (
            <div className="progress-steps">
              <div className={`step ${etape >= 1 ? 'active' : ''}`}>
                <div className="step-number">1</div>
                <div className="step-label">Profil</div>
              </div>
              <div className={`step-line ${etape >= 2 ? 'filled' : ''}`}></div>
              <div className={`step ${etape >= 2 ? 'active' : ''}`}>
                <div className="step-number">2</div>
                <div className="step-label">Documents</div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {erreur && (
            <div className="error-message">
              <span>⚠️</span>
              <p>{erreur}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleNext}>
            
            {/* Étape 1 - Informations personnelles */}
            {etape === 1 && (
              <div className="form-section">
                <div className="form-row">
                  <div className="form-group">
                    <label>Nom complet</label>
                    <input 
                      type="text" 
                      name="nom" 
                      value={form.nom} 
                      onChange={handleChange} 
                      placeholder="Ex: Benani"
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Prénom</label>
                    <input 
                      type="text" 
                      name="prenom" 
                      value={form.prenom} 
                      onChange={handleChange} 
                      placeholder="Ex: Marwa"
                      required 
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Adresse email</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={form.email} 
                    onChange={handleChange} 
                    placeholder="marwa@example.com"
                    required 
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Téléphone (WhatsApp)</label>
                    <input 
                      type="tel" 
                      name="telephone" 
                      value={form.telephone} 
                      onChange={handleChange} 
                      placeholder="+212 6XX XXX XXX"
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Ville</label>
                    <select 
                      name="ville" 
                      value={form.ville} 
                      onChange={handleChange} 
                      required
                    >
                      <option value="">Sélectionnez votre ville</option>
                      <option>Casablanca</option>
                      <option>Rabat</option>
                      <option>Marrakech</option>
                      <option>Tanger</option>
                      <option>Fès</option>
                      <option>Agadir</option>
                      <option>Tétouan</option>
                      <option>Meknès</option>
                      <option>Oujda</option>
                      <option>Laâyoune</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Mot de passe</label>
                    <input 
                      type="password" 
                      name="password" 
                      value={form.password} 
                      onChange={handleChange} 
                      placeholder="Min. 8 caractères"
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Confirmer le mot de passe</label>
                    <input 
                      type="password" 
                      name="password_confirmation" 
                      value={form.password_confirmation} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Étape 2 - Documents (Enseignant uniquement) */}
            {isEnseignant && etape === 2 && (
              <div className="form-section">
                <div className="info-banner">
                  📄 Téléchargez vos documents pour vérification rapide
                </div>

                <div className="form-group upload-group">
                  <label>Carte d'identité - Recto (JPG/PNG)</label>
                  <div className="upload-area">
                    <input 
                      type="file" 
                      name="cin_recto" 
                      onChange={handleFileChange} 
                      accept=".jpg,.jpeg,.png"
                      id="cin_recto"
                      required 
                    />
                    <label htmlFor="cin_recto" className="upload-label">
                      {uploadedFiles.cin_recto ? (
                        <>
                          <span>✅</span> {uploadedFiles.cin_recto}
                        </>
                      ) : (
                        <>
                          <span>📷</span> Cliquez pour télécharger le recto
                        </>
                      )}
                    </label>
                  </div>
                </div>

                <div className="form-group upload-group">
                  <label>Carte d'identité - Verso (JPG/PNG)</label>
                  <div className="upload-area">
                    <input 
                      type="file" 
                      name="cin_verso" 
                      onChange={handleFileChange} 
                      accept=".jpg,.jpeg,.png"
                      id="cin_verso"
                      required 
                    />
                    <label htmlFor="cin_verso" className="upload-label">
                      {uploadedFiles.cin_verso ? (
                        <>
                          <span>✅</span> {uploadedFiles.cin_verso}
                        </>
                      ) : (
                        <>
                          <span>📷</span> Cliquez pour télécharger le verso
                        </>
                      )}
                    </label>
                  </div>
                </div>

                <div className="form-group upload-group">
                  <label>Diplôme (PDF - Max 5MB)</label>
                  <div className="upload-area">
                    <input 
                      type="file" 
                      name="diplome" 
                      onChange={handleFileChange} 
                      accept=".pdf"
                      id="diplome"
                      required 
                    />
                    <label htmlFor="diplome" className="upload-label">
                      {uploadedFiles.diplome ? (
                        <>
                          <span>✅</span> {uploadedFiles.diplome}
                        </>
                      ) : (
                        <>
                          <span>📑</span> Télécharger votre diplôme (PDF)
                        </>
                      )}
                    </label>
                  </div>
                </div>

                <div className="form-check">
                  <input type="checkbox" id="certification" required />
                  <label htmlFor="certification">
                    Je certifie sur l'honneur l'exactitude des pièces fournies
                  </label>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="form-buttons">
              {etape > 1 && (
                <button 
                  type="button" 
                  onClick={() => setEtape(etape - 1)} 
                  className="btn-secondary"
                  disabled={isLoading}
                >
                  Retour
                </button>
              )}
              <button 
                type="submit" 
                className="btn-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner"></span>
                    Chargement...
                  </>
                ) : (
                  etape === 2 || (etape === 1 && !isEnseignant)
                    ? "Créer mon compte →"
                    : "Continuer →"
                )}
              </button>
            </div>
          </form>

          {/* Login Link */}
          <div className="register-footer">
            <p>
              Déjà un compte ? 
              <button onClick={() => props.onNavigate('login')}>
                Se connecter
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap');

        .register-wrapper {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 40px 20px;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .register-container {
          max-width: 680px;
          margin: 0 auto;
        }

        .register-card {
          background: white;
          border-radius: 32px;
          padding: 48px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          transition: all 0.3s ease;
        }

        /* Header */
        .register-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .register-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .register-title {
          font-size: 32px;
          font-weight: 800;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 12px;
          letter-spacing: -0.5px;
        }

        .register-subtitle {
          color: #6b7280;
          font-size: 14px;
          line-height: 1.5;
        }

        /* Role Cards */
        .role-section {
          margin-bottom: 32px;
        }

        .role-cards {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .role-card {
          position: relative;
          padding: 20px;
          border: 2px solid #e5e7eb;
          border-radius: 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          background: white;
        }

        .role-card:hover {
          border-color: #667eea;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.15);
        }

        .role-card.active {
          border-color: #667eea;
          background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
        }

        .role-emoji {
          font-size: 44px;
          margin-bottom: 12px;
        }

        .role-name {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 4px;
          color: #1f2937;
        }

        .role-desc {
          font-size: 12px;
          color: #6b7280;
          margin-bottom: 8px;
        }

        .role-badge {
          font-size: 10px;
          background: #f3f4f6;
          display: inline-block;
          padding: 4px 8px;
          border-radius: 20px;
          color: #4b5563;
        }

        .role-check {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 22px;
          height: 22px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 12px;
          font-weight: bold;
        }

        /* Progress Steps */
        .progress-steps {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 40px;
          padding: 0 20px;
        }

        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .step-number {
          width: 44px;
          height: 44px;
          background: #f3f4f6;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 18px;
          color: #9ca3af;
          transition: all 0.3s ease;
        }

        .step.active .step-number {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .step-label {
          font-size: 12px;
          font-weight: 600;
          color: #9ca3af;
        }

        .step.active .step-label {
          color: #667eea;
        }

        .step-line {
          flex: 1;
          height: 3px;
          background: #e5e7eb;
          margin: 0 10px;
          border-radius: 3px;
          transition: all 0.3s ease;
        }

        .step-line.filled {
          background: linear-gradient(90deg, #667eea, #764ba2);
        }

        /* Error Message */
        .error-message {
          background: #fee2e2;
          border-left: 4px solid #ef4444;
          padding: 14px 16px;
          border-radius: 12px;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .error-message p {
          margin: 0;
          color: #dc2626;
          font-size: 13px;
          font-weight: 500;
        }

        .info-banner {
          background: linear-gradient(135deg, #fef3c7, #fde68a);
          padding: 16px;
          border-radius: 16px;
          margin-bottom: 24px;
          text-align: center;
          font-weight: 600;
          font-size: 14px;
          color: #92400e;
        }

        /* Form Elements */
        .form-section {
          margin-bottom: 32px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 8px;
          color: #374151;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 12px 16px;
          border: 1.5px solid #e5e7eb;
          border-radius: 14px;
          font-size: 14px;
          transition: all 0.2s ease;
          font-family: inherit;
          background: white;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        /* Upload Area */
        .upload-group {
          margin-bottom: 24px;
        }

        .upload-area {
          position: relative;
        }

        .upload-area input[type="file"] {
          display: none;
        }

        .upload-label {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 20px;
          border: 2px dashed #e5e7eb;
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.2s ease;
          background: #fafbfc;
          font-size: 14px;
          font-weight: 500;
          color: #6b7280;
        }

        .upload-label:hover {
          border-color: #667eea;
          background: #f5f3ff;
          color: #667eea;
        }

        .form-check {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 24px;
          padding: 16px;
          background: #f9fafb;
          border-radius: 12px;
        }

        .form-check input {
          width: 18px;
          height: 18px;
          cursor: pointer;
          accent-color: #667eea;
        }

        .form-check label {
          font-size: 13px;
          color: #4b5563;
          cursor: pointer;
        }

        /* Buttons */
        .form-buttons {
          display: flex;
          gap: 16px;
          margin-top: 8px;
        }

        .btn-primary {
          flex: 1;
          padding: 14px 24px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 40px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
        }

        .btn-primary:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .btn-secondary {
          padding: 14px 32px;
          background: white;
          color: #6b7280;
          border: 1.5px solid #e5e7eb;
          border-radius: 40px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-secondary:hover {
          border-color: #667eea;
          color: #667eea;
          background: #f9fafb;
        }

        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid white;
          border-top-color: transparent;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
          display: inline-block;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Footer */
        .register-footer {
          text-align: center;
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid #e5e7eb;
        }

        .register-footer p {
          font-size: 14px;
          color: #6b7280;
        }

        .register-footer button {
          background: none;
          border: none;
          color: #667eea;
          font-weight: 600;
          cursor: pointer;
          margin-left: 6px;
          font-size: 14px;
          transition: color 0.2s;
        }

        .register-footer button:hover {
          color: #764ba2;
          text-decoration: underline;
        }

        /* Responsive */
        @media (max-width: 640px) {
          .register-card {
            padding: 32px 24px;
          }

          .register-title {
            font-size: 28px;
          }

          .form-row {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .role-cards {
            gap: 12px;
          }

          .role-card {
            padding: 16px;
          }

          .role-emoji {
            font-size: 36px;
          }

          .role-name {
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  );
}

export default Register;