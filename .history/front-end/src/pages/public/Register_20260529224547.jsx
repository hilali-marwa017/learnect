import React, { useState } from 'react';

function Register(props) {
  const [isEnseignant, setIsEnseignant] = useState(false);
  const [form, setForm] = useState({
    nom: '', prenom: '', email: '', telephone: '', ville: '',
    password: '', password_confirmation: '',
    role: 'etudiant', matiere: '', tarifHeure: '',
    cin_recto: null, cin_verso: null, diplome: null, diplomeTitle: ''
  });

  const [etape, setEtape] = useState(1);
  const [erreur, setErreur] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState({
    cin_recto: null, cin_verso: null, diplome: null
  });
  const [uploadingRecto, setUploadingRecto] = useState(false);
  const [uploadingVerso, setUploadingVerso] = useState(false);
  const [uploadingDiplome, setUploadingDiplome] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  function simulateUpload(fileType, fileName) {
    if (fileType === 'recto') {
      setUploadingRecto(true);
      setTimeout(() => {
        setForm({ ...form, cin_recto: fileName || 'CIN_Recto.jpg' });
        setUploadedFiles({ ...uploadedFiles, cin_recto: fileName || 'CIN_Recto.jpg' });
        setUploadingRecto(false);
      }, 700);
    } else if (fileType === 'verso') {
      setUploadingVerso(true);
      setTimeout(() => {
        setForm({ ...form, cin_verso: fileName || 'CIN_Verso.jpg' });
        setUploadedFiles({ ...uploadedFiles, cin_verso: fileName || 'CIN_Verso.jpg' });
        setUploadingVerso(false);
      }, 700);
    } else if (fileType === 'diplome') {
      setUploadingDiplome(true);
      setTimeout(() => {
        setForm({ ...form, diplome: fileName || 'Diplome.pdf' });
        setUploadedFiles({ ...uploadedFiles, diplome: fileName || 'Diplome.pdf' });
        setUploadingDiplome(false);
      }, 950);
    }
  }

  function handleRoleChange(role) {
    setIsEnseignant(role === 'enseignant');
    setForm({ ...form, role: role });
    setEtape(1);
    setErreur('');
  }

  function validateEtape1() {
    if (!form.nom || !form.prenom || !form.email || !form.telephone || !form.ville) {
      setErreur('Remplis tous les champs champion 🏆');
      return false;
    }
    if (form.password !== form.password_confirmation) {
      setErreur('Les mots de passe ne matchent pas 🔐');
      return false;
    }
    if (form.password.length < 6) {
      setErreur('Mot de passe trop court (min 6) 🔒');
      return false;
    }
    if (isEnseignant && (!form.matiere || !form.tarifHeure)) {
      setErreur('Matière et tarif requis pour enseigner 📚');
      return false;
    }
    if (isEnseignant && Number(form.tarifHeure) < 50) {
      setErreur('Tarif minimum 50 DH/h (sois pas radin 😄)');
      return false;
    }
    setErreur('');
    return true;
  }

  function validateEtape2() {
    if (!form.cin_recto || !form.cin_verso || !form.diplome) {
      setErreur('Upload tous les documents requis 📎');
      return false;
    }
    if (!form.diplomeTitle) {
      setErreur('Titre du diplôme nécessaire 🎓');
      return false;
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
      await new Promise(resolve => setTimeout(resolve, 1500));
      if (isEnseignant) setIsSubmitted(true);
      else props.onNavigate('student-dashboard');
    } catch (error) {
      setErreur('Erreur réseau !');
    } finally {
      setIsLoading(false);
    }
  }

  if (isSubmitted) {
    return (
      <div className="creative-container">
        <div className="confetti-bg"></div>
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-12 col-md-9 col-lg-7">
              <div className="success-card bounce-in">
                <div className="success-glow"></div>
                <div className="success-icon-wave">🎉</div>
                <h2 className="fw-bold gradient-text">Dossier Envoyé ! 🚀</h2>
                <p className="text-muted">Félicitations <strong className="text-gradient">{form.prenom}</strong> !</p>
                <div className="timeline-creative">
                  <div className="timeline-creative-item">
                    <div className="timeline-dot done">✓</div>
                    <div>📁 Documents sauvegardés</div>
                  </div>
                  <div className="timeline-creative-item">
                    <div className="timeline-dot pulse">⏳</div>
                    <div>🛡️ Vérification en cours...</div>
                  </div>
                  <div className="timeline-creative-item">
                    <div className="timeline-dot">🌟</div>
                    <div>🎯 Activation imminente</div>
                  </div>
                </div>
                <button onClick={() => props.onNavigate('admin-dashboard')} className="btn-glow">👑 Espace Admin</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="creative-wrapper">
      {/* Floating animated shapes */}
      <div className="floating-shape shape-1"></div>
      <div className="floating-shape shape-2"></div>
      <div className="floating-shape shape-3"></div>
      
      <div className="container py-4 py-md-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8">
            <div className="glass-card fade-in-up">
              
              {/* Header créatif */}
              <div className="creative-header">
                <div className="logo-pulse">
                  <span className="logo-3d">🎓</span>
                </div>
                <h1 className="creative-title">On commence ?</h1>
                <p className="creative-subtitle">Rejoins la tribu Learnect.ma ✨</p>
              </div>

              {/* Role toggle */}
              {etape === 1 && (
                <div className="role-switch">
                  <div className="switch-bg"></div>
                  <button 
                    className={`role-btn ${form.role === 'etudiant' ? 'active' : ''}`}
                    onClick={() => handleRoleChange('etudiant')}
                  >
                    <span className="role-btn-icon">🎓</span>
                    <span>Étudiant</span>
                  </button>
                  <button 
                    className={`role-btn ${form.role === 'enseignant' ? 'active' : ''}`}
                    onClick={() => handleRoleChange('enseignant')}
                  >
                    <span className="role-btn-icon">👨‍🏫</span>
                    <span>Enseignant</span>
                  </button>
                </div>
              )}

              {/* Progress steps créatif */}
              {isEnseignant && (
                <div className="steps-creative">
                  <div className={`step-creative ${etape >= 1 ? 'active' : ''}`}>
                    <div className="step-creative-number">1</div>
                    <div className="step-creative-label">Profil</div>
                  </div>
                  <div className="step-creative-line">
                    <div className={`step-creative-line-fill ${etape >= 2 ? 'filled' : ''}`}></div>
                  </div>
                  <div className={`step-creative ${etape >= 2 ? 'active' : ''}`}>
                    <div className="step-creative-number">2</div>
                    <div className="step-creative-label">Documents</div>
                  </div>
                </div>
              )}

              {/* Error toast */}
              {erreur && (
                <div className="toast-error">
                  <span>💥</span>
                  <span>{erreur}</span>
                  <button onClick={() => setErreur('')}>✕</button>
                </div>
              )}

              <form onSubmit={handleNext}>
                
                {etape === 1 && (
                  <div className="form-grid">
                    <div className="input-group-creative">
                      <span className="input-icon">👤</span>
                      <input type="text" name="prenom" value={form.prenom} onChange={handleChange} placeholder="Prénom" required />
                    </div>
                    <div className="input-group-creative">
                      <span className="input-icon">👤</span>
                      <input type="text" name="nom" value={form.nom} onChange={handleChange} placeholder="Nom" required />
                    </div>
                    <div className="input-group-creative full-width">
                      <span className="input-icon">📧</span>
                      <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" required />
                    </div>
                    <div className="input-group-creative">
                      <span className="input-icon">📞</span>
                      <input type="tel" name="telephone" value={form.telephone} onChange={handleChange} placeholder="Téléphone" required />
                    </div>
                    <div className="input-group-creative">
                      <span className="input-icon">📍</span>
                      <select name="ville" value={form.ville} onChange={handleChange} required>
                        <option value="">Ville</option>
                        <option>Casablanca</option><option>Rabat</option><option>Marrakech</option>
                        <option>Tanger</option><option>Fès</option><option>Agadir</option>
                      </select>
                    </div>
                    <div className="input-group-creative">
                      <span className="input-icon">🔒</span>
                      <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Mot de passe" required />
                    </div>
                    <div className="input-group-creative">
                      <span className="input-icon">🔒</span>
                      <input type="password" name="password_confirmation" value={form.password_confirmation} onChange={handleChange} placeholder="Confirmer" required />
                    </div>

                    {isEnseignant && (
                      <>
                        <div className="input-group-creative">
                          <span className="input-icon">📚</span>
                          <select name="matiere" value={form.matiere} onChange={handleChange} required>
                            <option value="">Matière</option>
                            <option>Maths</option><option>Physique</option><option>SVT</option>
                            <option>Français</option><option>Anglais</option>
                          </select>
                        </div>
                        <div className="input-group-creative">
                          <span className="input-icon">💰</span>
                          <input type="number" name="tarifHeure" value={form.tarifHeure} onChange={handleChange} placeholder="Tarif DH/h" min="50" required />
                        </div>
                      </>
                    )}

                    <div className="checkbox-creative">
                      <input type="checkbox" id="consent" required />
                      <label htmlFor="consent">✅ J'accepte les conditions</label>
                    </div>

                    <button type="submit" className="btn-creative" disabled={isLoading}>
                      {isLoading ? (
                        <span className="loader"></span>
                      ) : (
                        <span>{isEnseignant ? "Continuer →" : "🚀 Créer mon compte"}</span>
                      )}
                    </button>
                  </div>
                )}

                {isEnseignant && etape === 2 && (
                  <div className="form-grid">
                    <div className="input-group-creative full-width">
                      <span className="input-icon">🎓</span>
                      <input type="text" name="diplomeTitle" value={form.diplomeTitle} onChange={handleChange} placeholder="Intitulé du diplôme" required />
                    </div>

                    <div className="upload-creative">
                      <div className="upload-card" onClick={() => simulateUpload('recto')}>
                        <div className="upload-card-icon">🪪</div>
                        <div className="upload-card-title">CIN Recto</div>
                        {uploadedFiles.cin_recto ? (
                          <span className="upload-success">✓ {uploadedFiles.cin_recto}</span>
                        ) : (
                          <span className="upload-btn">{uploadingRecto ? "📤 Upload..." : "📎 Télécharger"}</span>
                        )}
                      </div>
                      <div className="upload-card" onClick={() => simulateUpload('verso')}>
                        <div className="upload-card-icon">🪪</div>
                        <div className="upload-card-title">CIN Verso</div>
                        {uploadedFiles.cin_verso ? (
                          <span className="upload-success">✓ {uploadedFiles.cin_verso}</span>
                        ) : (
                          <span className="upload-btn">{uploadingVerso ? "📤 Upload..." : "📎 Télécharger"}</span>
                        )}
                      </div>
                      <div className="upload-card full-width" onClick={() => simulateUpload('diplome')}>
                        <div className="upload-card-icon">📜</div>
                        <div className="upload-card-title">Diplôme (PDF)</div>
                        {uploadedFiles.diplome ? (
                          <span className="upload-success">✓ {uploadedFiles.diplome}</span>
                        ) : (
                          <span className="upload-btn">{uploadingDiplome ? "📤 Upload..." : "📎 Télécharger"}</span>
                        )}
                      </div>
                    </div>

                    <div className="checkbox-creative">
                      <input type="checkbox" id="certif" required />
                      <label htmlFor="certif">📜 Je certifie l'exactitude des documents</label>
                    </div>

                    <div className="btn-group-creative">
                      <button type="button" onClick={() => setEtape(1)} className="btn-outline-creative">← Retour</button>
                      <button type="submit" className="btn-creative" disabled={isLoading || !uploadedFiles.cin_recto}>
                        {isLoading ? <span className="loader"></span> : "✨ Soumettre mon dossier"}
                      </button>
                    </div>
                  </div>
                )}

              </form>

              <div className="login-link-creative">
                <span>Déjà membre ?</span>
                <button onClick={() => props.onNavigate('login')}>Se connecter →</button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;