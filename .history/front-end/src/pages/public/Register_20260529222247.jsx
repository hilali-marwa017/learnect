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
    matiere: '',
    tarif: '',
    diplome: null,
    experience: '',
    description: '',
    role: 'etudiant'
  });

  const [etape, setEtape] = useState(1);
  const [erreur, setErreur] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file.name);
      setForm({ ...form, diplome: file });
    }
  }

  function handleRoleChange(e) {
    const role = e.target.value;
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
    if (form.password.length < 6) {
      setErreur('Le mot de passe doit contenir au moins 6 caractères');
      return false;
    }
    setErreur('');
    return true;
  }

  function validateEtape2() {
    if (isEnseignant) {
      if (!form.matiere || !form.tarif || !form.diplome) {
        setErreur('Veuillez remplir tous les champs professionnels');
        return false;
      }
      if (Number(form.tarif) < 50) {
        setErreur('Le tarif minimum doit être de 50 DH');
        return false;
      }
    }
    setErreur('');
    return true;
  }

  function handleNext(e) {
    e.preventDefault();
    if (etape === 1 && validateEtape1()) {
      if (isEnseignant) {
        setEtape(2);
      } else {
        handleSubmit(e);
      }
    } else if (etape === 2 && validateEtape2()) {
      setEtape(3);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    setErreur('');

    if (isEnseignant && etape === 3 && !form.description) {
      setErreur('Veuillez compléter votre description');
      return;
    }

    props.onAjouterUtilisateur(form);
    
    if (form.role === 'enseignant') {
      props.onNavigate('teacher-dashboard');
    } else {
      props.onNavigate('student-dashboard');
    }
  }

  return (
    <div className="register-wrapper">
      <div className="register-container">
        <div className="register-card">
          
          {/* Header */}
          <div className="register-header">
            <div className="register-icon">✨</div>
            <h1 className="register-title">Créer un compte</h1>
            <p className="register-subtitle">
              Rejoignez la plus grande communauté de cours particuliers au Maroc
            </p>
          </div>

          {/* Role Selection */}
          {etape === 1 && (
            <div className="role-section">
              <div className="role-cards">
                <div 
                  className={`role-card ${form.role === 'etudiant' ? 'active' : ''}`}
                  onClick={() => handleRoleChange({ target: { value: 'etudiant' } })}
                >
                  <div className="role-emoji">🎓</div>
                  <div className="role-name">Étudiant</div>
                  <div className="role-desc">Je cherche des cours</div>
                  {form.role === 'etudiant' && <div className="role-check">✓</div>}
                </div>
                <div 
                  className={`role-card ${form.role === 'enseignant' ? 'active' : ''}`}
                  onClick={() => handleRoleChange({ target: { value: 'enseignant' } })}
                >
                  <div className="role-emoji">👨‍🏫</div>
                  <div className="role-name">Enseignant</div>
                  <div className="role-desc">Je donne des cours</div>
                  {form.role === 'enseignant' && <div className="role-check">✓</div>}
                </div>
              </div>
            </div>
          )}

          {/* Progress Steps */}
          {isEnseignant && etape >= 1 && (
            <div className="progress-steps">
              <div className={`step ${etape >= 1 ? 'active' : ''}`}>
                <div className="step-number">1</div>
                <div className="step-label">Profil</div>
              </div>
              <div className={`step-line ${etape >= 2 ? 'filled' : ''}`}></div>
              <div className={`step ${etape >= 2 ? 'active' : ''}`}>
                <div className="step-number">2</div>
                <div className="step-label">Profil Pro</div>
              </div>
              <div className={`step-line ${etape >= 3 ? 'filled' : ''}`}></div>
              <div className={`step ${etape >= 3 ? 'active' : ''}`}>
                <div className="step-number">3</div>
                <div className="step-label">Validation</div>
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
            
            {/* Étape 1 */}
            {etape === 1 && (
              <div className="form-section">
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
                      <option value="">Sélectionnez</option>
                      <option>Casablanca</option>
                      <option>Rabat</option>
                      <option>Marrakech</option>
                      <option>Tanger</option>
                      <option>Fès</option>
                      <option>Agadir</option>
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
                      placeholder="Min. 6 caractères"
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Confirmer</label>
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

            {/* Étape 2 - Enseignant */}
            {isEnseignant && etape === 2 && (
              <div className="form-section">
                <div className="form-group">
                  <label>Matière d'enseignement</label>
                  <select 
                    name="matiere" 
                    value={form.matiere} 
                    onChange={handleChange} 
                    required
                  >
                    <option value="">Sélectionner une discipline</option>
                    <option>Mathématiques</option>
                    <option>Physique-Chimie</option>
                    <option>SVT</option>
                    <option>Français</option>
                    <option>Anglais</option>
                    <option>Informatique</option>
                  </select>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Tarif horaire (DH)</label>
                    <input 
                      type="number" 
                      name="tarif" 
                      value={form.tarif} 
                      onChange={handleChange} 
                      placeholder="150"
                      min="50"
                      required 
                    />
                    <small>Minimum 50 DH</small>
                  </div>
                  <div className="form-group">
                    <label>Expérience</label>
                    <select 
                      name="experience" 
                      value={form.experience} 
                      onChange={handleChange}
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

                <div className="form-group upload-group">
                  <label>Diplôme (PDF ou JPG)</label>
                  <div className="upload-area">
                    <input 
                      type="file" 
                      name="diplome" 
                      onChange={handleFileChange} 
                      accept=".pdf,.jpg,.jpeg,.png"
                      id="diplome-upload"
                      required 
                    />
                    <label htmlFor="diplome-upload" className="upload-label">
                      {uploadedFile ? (
                        <>
                          <span>📄</span> {uploadedFile}
                        </>
                      ) : (
                        <>
                          <span>📁</span> Cliquez pour télécharger
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

            {/* Étape 3 - Enseignant */}
            {isEnseignant && etape === 3 && (
              <div className="form-section">
                <div className="form-group">
                  <label>Description personnelle</label>
                  <textarea 
                    name="description" 
                    value={form.description} 
                    onChange={handleChange} 
                    placeholder="Présentez-vous, votre parcours, votre méthode d'enseignement..."
                    rows="5"
                    required
                  ></textarea>
                </div>

                <div className="recap-card">
                  <h4>📋 Récapitulatif</h4>
                  <div className="recap-grid">
                    <div><strong>Nom :</strong> {form.nom} {form.prenom}</div>
                    <div><strong>Email :</strong> {form.email}</div>
                    <div><strong>Ville :</strong> {form.ville}</div>
                    <div><strong>Matière :</strong> {form.matiere}</div>
                    <div><strong>Tarif :</strong> {form.tarif} DH/h</div>
                    <div><strong>Expérience :</strong> {form.experience || 'Non précisée'}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="form-buttons">
              {etape > 1 && (
                <button type="button" onClick={() => setEtape(etape - 1)} className="btn-secondary">
                  Retour
                </button>
              )}
              <button type="submit" className="btn-primary">
                {etape === 1 && !isEnseignant 
                  ? "Créer mon compte →" 
                  : etape === 3 || (etape === 1 && !isEnseignant)
                    ? "Finaliser mon inscription →"
                    : "Continuer →"}
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

      {/* Styles intégrés */}
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
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 8px;
          letter-spacing: -0.5px;
        }

        .register-subtitle {
          color: #666;
          font-size: 15px;
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
          padding: 24px;
          border: 2px solid #e5e7eb;
          border-radius: 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s ease;
          background: white;
        }

        .role-card:hover {
          border-color: #0d6efd;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(13, 110, 253, 0.1);
        }

        .role-card.active {
          border-color: #0d6efd;
          background: linear-gradient(135deg, #f0f7ff 0%, #e8f0fe 100%);
        }

        .role-emoji {
          font-size: 40px;
          margin-bottom: 12px;
        }

        .role-name {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 4px;
          color: #1a1a1a;
        }

        .role-desc {
          font-size: 13px;
          color: #666;
        }

        .role-check {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 20px;
          height: 20px;
          background: #0d6efd;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 12px;
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
          width: 40px;
          height: 40px;
          background: #f3f4f6;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: #9ca3af;
          transition: all 0.3s ease;
        }

        .step.active .step-number {
          background: #0d6efd;
          color: white;
          box-shadow: 0 4px 12px rgba(13, 110, 253, 0.3);
        }

        .step-label {
          font-size: 12px;
          font-weight: 600;
          color: #9ca3af;
        }

        .step.active .step-label {
          color: #0d6efd;
        }

        .step-line {
          flex: 1;
          height: 2px;
          background: #e5e7eb;
          margin: 0 10px;
        }

        .step-line.filled {
          background: #0d6efd;
        }

        /* Error Message */
        .error-message {
          background: #fee2e2;
          border-left: 4px solid #ef4444;
          padding: 16px;
          border-radius: 12px;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .error-message p {
          margin: 0;
          color: #dc2626;
          font-size: 14px;
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
          color: #1a1a1a;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 12px 16px;
          border: 1.5px solid #e5e7eb;
          border-radius: 12px;
          font-size: 15px;
          transition: all 0.2s ease;
          font-family: inherit;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #0d6efd;
          box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.1);
        }

        .form-group small {
          display: block;
          margin-top: 6px;
          font-size: 12px;
          color: #9ca3af;
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
          color: #666;
        }

        .upload-label:hover {
          border-color: #0d6efd;
          background: #f0f7ff;
        }

        .form-check {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 20px;
        }

        .form-check input {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }

        .form-check label {
          font-size: 13px;
          color: #666;
          cursor: pointer;
        }

        /* Recap Card */
        .recap-card {
          background: linear-gradient(135deg, #f8f9fa 0%, #f1f3f5 100%);
          border-radius: 20px;
          padding: 24px;
          margin-top: 24px;
        }

        .recap-card h4 {
          margin: 0 0 16px 0;
          font-size: 16px;
          font-weight: 700;
          color: #1a1a1a;
        }

        .recap-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          font-size: 14px;
        }

        .recap-grid div {
          color: #4b5563;
        }

        /* Buttons */
        .form-buttons {
          display: flex;
          gap: 16px;
          margin-top: 32px;
        }

        .btn-primary {
          flex: 1;
          padding: 14px 24px;
          background: #0d6efd;
          color: white;
          border: none;
          border-radius: 40px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-primary:hover {
          background: #0b5ed7;
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(13, 110, 253, 0.3);
        }

        .btn-secondary {
          padding: 14px 24px;
          background: white;
          color: #666;
          border: 1.5px solid #e5e7eb;
          border-radius: 40px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-secondary:hover {
          border-color: #0d6efd;
          color: #0d6efd;
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
          color: #666;
        }

        .register-footer button {
          background: none;
          border: none;
          color: #0d6efd;
          font-weight: 600;
          cursor: pointer;
          margin-left: 6px;
          font-size: 14px;
        }

        .register-footer button:hover {
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
            font-size: 32px;
          }
        }
      `}</style>
    </div>
  );
}

export default Register;