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
    matiere: '',
    tarifHeure: '',
    cin_recto: null,
    cin_verso: null,
    diplome: null,
    diplomeTitle: ''
  });

  const [etape, setEtape] = useState(1);
  const [erreur, setErreur] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState({
    cin_recto: null,
    cin_verso: null,
    diplome: null
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
        setForm({ ...form, cin_recto: fileName || 'CIN_Recto_Scanne.jpg' });
        setUploadedFiles({ ...uploadedFiles, cin_recto: fileName || 'CIN_Recto_Scanne.jpg' });
        setUploadingRecto(false);
      }, 700);
    } else if (fileType === 'verso') {
      setUploadingVerso(true);
      setTimeout(() => {
        setForm({ ...form, cin_verso: fileName || 'CIN_Verso_Scanne.jpg' });
        setUploadedFiles({ ...uploadedFiles, cin_verso: fileName || 'CIN_Verso_Scanne.jpg' });
        setUploadingVerso(false);
      }, 700);
    } else if (fileType === 'diplome') {
      setUploadingDiplome(true);
      setTimeout(() => {
        setForm({ ...form, diplome: fileName || 'Diplome_Master_Academique.pdf' });
        setUploadedFiles({ ...uploadedFiles, diplome: fileName || 'Diplome_Master_Academique.pdf' });
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
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setErreur('Email invalide');
      return false;
    }
    if (isEnseignant && (!form.matiere || !form.tarifHeure)) {
      setErreur('Veuillez sélectionner une matière et un tarif');
      return false;
    }
    if (isEnseignant && Number(form.tarifHeure) < 50) {
      setErreur('Le tarif minimum est de 50 DH/h');
      return false;
    }
    setErreur('');
    return true;
  }

  function validateEtape2() {
    if (!form.cin_recto || !form.cin_verso || !form.diplome) {
      setErreur('Veuillez télécharger tous les documents requis');
      return false;
    }
    if (!form.diplomeTitle) {
      setErreur('Veuillez renseigner l\'intitulé de votre diplôme');
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
      
      if (isEnseignant) {
        setIsSubmitted(true);
      } else {
        props.onNavigate('student-dashboard');
      }
    } catch (error) {
      setErreur('Erreur de connexion au serveur');
    } finally {
      setIsLoading(false);
    }
  }

  const handleAdminBypass = () => {
    props.onNavigate('admin-dashboard');
  };

  // Écran de soumission
  if (isSubmitted) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-9 col-lg-7">
            <div className="card shadow-sm border-0 rounded-4 bg-white position-relative overflow-hidden">
              <div className="position-absolute top-0 start-0 w-100 bg-primary" style={{ height: '5px' }} />
              
              <div className="card-body p-5 text-center">
                <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4" style={{ width: '80px', height: '80px', fontSize: '40px' }}>
                  🎓
                </div>

                <h3 className="fw-bold mb-3 fs-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Dossier d'Inscription Enregistré !</h3>
                <p className="text-muted mb-4">
                  Félicitations <strong className="text-dark">{form.prenom} {form.nom}</strong> ! Votre demande de certification est enregistrée.
                </p>

                <div className="bg-light rounded-4 p-4 text-start mb-4">
                  <span className="text-primary fw-bold text-uppercase small mb-3 d-block">📋 Suivi de Validation :</span>

                  <div className="d-flex gap-3 mb-3">
                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '24px', height: '24px', fontSize: '12px' }}>
                      ✓
                    </div>
                    <div>
                      <strong className="d-block">1. Justificatifs sauvegardés</strong>
                      <small className="text-muted">CIN et diplôme téléchargés avec succès</small>
                    </div>
                  </div>

                  <div className="d-flex gap-3 mb-3">
                    <div className="bg-warning text-dark rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '24px', height: '24px', fontSize: '12px' }}>
                      ⏰
                    </div>
                    <div>
                      <strong className="d-block">2. Vérification administrative</strong>
                      <small className="text-muted">Validation sous 24-48 heures</small>
                    </div>
                  </div>

                  <div className="d-flex gap-3">
                    <div className="bg-secondary bg-opacity-25 text-secondary rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '24px', height: '24px', fontSize: '12px', fontWeight: 'bold' }}>
                      3
                    </div>
                    <div>
                      <strong className="d-block">3. Activation du profil</strong>
                      <small className="text-muted">Publication dans les résultats de recherche</small>
                    </div>
                  </div>
                </div>

                <button onClick={handleAdminBypass} className="btn btn-primary w-100 py-3 fw-bold rounded-3 mb-3 d-flex align-items-center justify-content-center gap-2">
                  🛡️ Accéder à l'espace Admin
                </button>

                <button onClick={() => props.onNavigate('home')} className="btn btn-outline-secondary w-100 py-2 rounded-3">
                  Retour à l'accueil
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
            
            {/* Header */}
            <div className="bg-primary bg-opacity-5 px-4 py-4 border-bottom">
              <div className="text-center">
                <div className="bg-primary text-white rounded-3 d-inline-flex align-items-center justify-content-center p-3 mb-3 shadow-sm" style={{ width: '56px', height: '56px', fontSize: '28px' }}>
                  🎓
                </div>
                <h2 className="fw-bold mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Inscription</h2>
                <p className="text-muted small mb-0">Rejoignez la plateforme #1 des cours particuliers au Maroc</p>
              </div>
            </div>

            <div className="card-body p-4 p-md-5">
              
              {/* Role Selection */}
              {etape === 1 && (
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <div 
                      onClick={() => handleRoleChange('etudiant')}
                      className={`border rounded-3 p-4 text-center cursor-pointer transition-all ${form.role === 'etudiant' ? 'border-primary bg-primary bg-opacity-5 shadow-sm' : 'border-secondary bg-white'}`}
                      style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                    >
                      <div className="fs-1 mb-2">🎓</div>
                      <div className="fw-bold fs-5">Étudiant</div>
                      <small className="text-muted">Je cherche des cours particuliers</small>
                      {form.role === 'etudiant' && (
                        <div className="mt-2">
                          <span className="badge bg-primary rounded-pill">✓ Sélectionné</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div 
                      onClick={() => handleRoleChange('enseignant')}
                      className={`border rounded-3 p-4 text-center cursor-pointer transition-all ${form.role === 'enseignant' ? 'border-primary bg-primary bg-opacity-5 shadow-sm' : 'border-secondary bg-white'}`}
                      style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                    >
                      <div className="fs-1 mb-2">👨‍🏫</div>
                      <div className="fw-bold fs-5">Enseignant</div>
                      <small className="text-muted">Je donne des cours particuliers</small>
                      {form.role === 'enseignant' && (
                        <div className="mt-2">
                          <span className="badge bg-primary rounded-pill">✓ Sélectionné</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Progress Steps */}
              {isEnseignant && (
                <div className="mb-5">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="text-center flex-grow-1">
                      <div className={`rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2 transition-all ${etape >= 1 ? 'bg-primary text-white shadow-sm' : 'bg-secondary bg-opacity-25 text-secondary'}`} style={{ width: '40px', height: '40px', fontSize: '14px', fontWeight: 'bold' }}>
                        1
                      </div>
                      <small className={`fw-semibold ${etape >= 1 ? 'text-primary' : 'text-muted'}`}>Profil</small>
                    </div>
                    <div className="flex-grow-1 mx-2">
                      <div className="progress rounded-pill" style={{ height: '4px' }}>
                        <div className="progress-bar bg-primary rounded-pill transition-all" style={{ width: etape >= 2 ? '100%' : '0%' }}></div>
                      </div>
                    </div>
                    <div className="text-center flex-grow-1">
                      <div className={`rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2 transition-all ${etape >= 2 ? 'bg-primary text-white shadow-sm' : 'bg-secondary bg-opacity-25 text-secondary'}`} style={{ width: '40px', height: '40px', fontSize: '14px', fontWeight: 'bold' }}>
                        2
                      </div>
                      <small className={`fw-semibold ${etape >= 2 ? 'text-primary' : 'text-muted'}`}>Documents</small>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {erreur && (
                <div className="alert alert-danger alert-dismissible fade show rounded-3 mb-4 d-flex align-items-center gap-2" role="alert">
                  <span>⚠️</span>
                  <span className="flex-grow-1">{erreur}</span>
                  <button type="button" className="btn-close" onClick={() => setErreur('')}></button>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleNext}>
                
                {/* STEP 1 */}
                {etape === 1 && (
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small text-uppercase text-muted mb-2">Prénom</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">👤</span>
                        <input type="text" name="prenom" value={form.prenom} onChange={handleChange} className="form-control border-start-0" placeholder="Marwa" required />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small text-uppercase text-muted mb-2">Nom</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">👤</span>
                        <input type="text" name="nom" value={form.nom} onChange={handleChange} className="form-control border-start-0" placeholder="Benani" required />
                      </div>
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold small text-uppercase text-muted mb-2">Email</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">📧</span>
                        <input type="email" name="email" value={form.email} onChange={handleChange} className="form-control border-start-0" placeholder="marwa@example.com" required />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold small text-uppercase text-muted mb-2">Téléphone</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">📞</span>
                        <input type="tel" name="telephone" value={form.telephone} onChange={handleChange} className="form-control border-start-0" placeholder="+212 6XX XXX XXX" required />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold small text-uppercase text-muted mb-2">Ville</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">📍</span>
                        <select name="ville" value={form.ville} onChange={handleChange} className="form-select border-start-0" required>
                          <option value="">Sélectionnez</option>
                          <option>Casablanca</option>
                          <option>Rabat</option>
                          <option>Marrakech</option>
                          <option>Tanger</option>
                          <option>Fès</option>
                          <option>Agadir</option>
                          <option>Tétouan</option>
                          <option>Meknès</option>
                          <option>Oujda</option>
                        </select>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold small text-uppercase text-muted mb-2">Mot de passe</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">🔒</span>
                        <input type="password" name="password" value={form.password} onChange={handleChange} className="form-control border-start-0" placeholder="Min. 6 caractères" required />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold small text-uppercase text-muted mb-2">Confirmer</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">🔒</span>
                        <input type="password" name="password_confirmation" value={form.password_confirmation} onChange={handleChange} className="form-control border-start-0" placeholder="Confirmer" required />
                      </div>
                    </div>

                    {isEnseignant && (
                      <>
                        <div className="col-md-7">
                          <label className="form-label fw-semibold small text-uppercase text-muted mb-2">Matière d'enseignement</label>
                          <div className="input-group">
                            <span className="input-group-text bg-light border-end-0">📚</span>
                            <select name="matiere" value={form.matiere} onChange={handleChange} className="form-select border-start-0" required>
                              <option value="">Sélectionner...</option>
                              <option>Mathématiques</option>
                              <option>Physique-Chimie</option>
                              <option>SVT</option>
                              <option>Français</option>
                              <option>Anglais</option>
                              <option>Informatique</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-md-5">
                          <label className="form-label fw-semibold small text-uppercase text-muted mb-2">Tarif (DH/h)</label>
                          <div className="input-group">
                            <span className="input-group-text bg-light border-end-0">💰</span>
                            <input type="number" name="tarifHeure" value={form.tarifHeure} onChange={handleChange} className="form-control border-start-0" placeholder="120" min="50" required />
                          </div>
                        </div>
                      </>
                    )}

                    <div className="col-12 mt-3">
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" required id="consent" />
                        <label className="form-check-label small text-muted" htmlFor="consent">
                          J'accepte les conditions générales et la commission de 10%
                        </label>
                      </div>
                    </div>

                    <div className="col-12 mt-3">
                      <button type="submit" className="btn btn-primary w-100 py-3 fw-bold rounded-3 d-flex align-items-center justify-content-center gap-2" disabled={isLoading}>
                        {isLoading ? (
                          <>⏳ Chargement...</>
                        ) : (
                          <>{isEnseignant ? "Continuer vers les documents →" : "Créer mon compte →"}</>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2 - Documents */}
                {isEnseignant && etape === 2 && (
                  <div className="row g-3">
                    <div className="col-12">
                      <div className="alert alert-info d-flex align-items-center gap-2 rounded-3">
                        <span>📄</span>
                        <span className="small">Téléchargez vos documents pour vérification rapide</span>
                      </div>
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold small text-uppercase text-muted mb-2">Intitulé du diplôme</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">🎓</span>
                        <input type="text" name="diplomeTitle" value={form.diplomeTitle} onChange={handleChange} className="form-control border-start-0" placeholder="Master en ..." required />
                      </div>
                    </div>

                    {/* CIN Recto */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small text-muted mb-2">Carte d'Identité (Recto)</label>
                      <div className="border rounded-3 p-4 text-center bg-light">
                        <div className="fs-1 mb-2">🪪</div>
                        {uploadedFiles.cin_recto ? (
                          <div>
                            <span className="badge bg-success mb-2">✓ {uploadedFiles.cin_recto}</span>
                            <button type="button" onClick={() => simulateUpload('recto')} className="btn btn-sm btn-outline-secondary w-100 mt-2">Changer</button>
                          </div>
                        ) : (
                          <button type="button" onClick={() => simulateUpload('recto', `CIN_Recto_${form.nom.toUpperCase()}.jpg`)} className="btn btn-primary btn-sm" disabled={uploadingRecto}>
                            {uploadingRecto ? "Téléchargement..." : "Simuler téléversement"}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* CIN Verso */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small text-muted mb-2">Carte d'Identité (Verso)</label>
                      <div className="border rounded-3 p-4 text-center bg-light">
                        <div className="fs-1 mb-2">🪪</div>
                        {uploadedFiles.cin_verso ? (
                          <div>
                            <span className="badge bg-success mb-2">✓ {uploadedFiles.cin_verso}</span>
                            <button type="button" onClick={() => simulateUpload('verso')} className="btn btn-sm btn-outline-secondary w-100 mt-2">Changer</button>
                          </div>
                        ) : (
                          <button type="button" onClick={() => simulateUpload('verso', `CIN_Verso_${form.nom.toUpperCase()}.jpg`)} className="btn btn-primary btn-sm" disabled={uploadingVerso}>
                            {uploadingVerso ? "Téléchargement..." : "Simuler téléversement"}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Diplôme */}
                    <div className="col-12">
                      <label className="form-label fw-semibold small text-muted mb-2">Diplôme (PDF)</label>
                      <div className="border rounded-3 p-4 text-center bg-light">
                        <div className="fs-1 mb-2">📑</div>
                        {uploadedFiles.diplome ? (
                          <div>
                            <span className="badge bg-success mb-2">✓ {uploadedFiles.diplome}</span>
                            <button type="button" onClick={() => simulateUpload('diplome')} className="btn btn-sm btn-outline-secondary w-100 mt-2">Changer</button>
                          </div>
                        ) : (
                          <button type="button" onClick={() => simulateUpload('diplome', `${form.diplomeTitle?.replace(/\s+/g, '_') || 'Diplome'}.pdf`)} className="btn btn-primary btn-sm" disabled={uploadingDiplome}>
                            {uploadingDiplome ? "Téléchargement..." : "Simuler téléversement"}
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="col-12 mt-2">
                      <div className="form-check">
                        <input type="checkbox" className="form-check-input" id="certification" required />
                        <label className="form-check-label small" htmlFor="certification">
                          Je certifie sur l'honneur l'exactitude des pièces fournies
                        </label>
                      </div>
                    </div>

                    <div className="col-12 mt-3">
                      <div className="d-flex gap-3">
                        <button type="button" onClick={() => setEtape(1)} className="btn btn-outline-secondary flex-grow-1 py-2 rounded-3">Retour</button>
                        <button type="submit" className="btn btn-primary flex-grow-1 py-2 rounded-3 d-flex align-items-center justify-content-center gap-2" disabled={isLoading || !uploadedFiles.cin_recto || !uploadedFiles.cin_verso || !uploadedFiles.diplome}>
                          {isLoading ? <>⏳ Soumission...</> : <>Soumettre mon dossier →</>}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              </form>

              {/* Login Link */}
              <div className="text-center mt-4 pt-3 border-top">
                <small className="text-muted">
                  Déjà inscrit ?{' '}
                  <button onClick={() => props.onNavigate('login')} className="btn btn-link p-0 text-primary fw-bold text-decoration-none">
                    Se connecter
                  </button>
                </small>
              </div>

            </div>
          </div>
        </div>
      </div>

      <style>{`
        .cursor-pointer { cursor: pointer; }
        .transition-all { transition: all 0.2s ease-in-out; }
        .btn-primary { background-color: #0d6efd !important; border-color: #0d6efd !important; }
        .btn-primary:hover { background-color: #0b5ed7 !important; border-color: #0b5ed7 !important; transform: translateY(-1px); }
        .bg-primary { background-color: #0d6efd !important; }
        .text-primary { color: #0d6efd !important; }
        .border-primary { border-color: #0d6efd !important; }
        .progress-bar { background-color: #0d6efd !important; }
        .form-control:focus, .form-select:focus {
          border-color: #0d6efd;
          box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
        }
      `}</style>
    </div>
  );
}

export default Register;