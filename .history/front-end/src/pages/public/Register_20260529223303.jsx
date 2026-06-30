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
      <div className="submitted-screen">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-12 col-md-9 col-lg-7">
              <div className="card border-0 shadow-lg rounded-4">
                <div className="card-body p-5 text-center">
                  <div className="success-icon mx-auto mb-4">🎓</div>
                  <h3 className="fw-bold mb-3">Dossier d'Inscription Enregistré !</h3>
                  <p className="text-muted mb-4">
                    Félicitations <strong>{form.prenom} {form.nom}</strong> ! Votre demande de certification est enregistrée.
                  </p>
                  <div className="validation-timeline mb-4">
                    <div className="timeline-item">
                      <div className="timeline-icon success">✓</div>
                      <div className="timeline-content">
                        <strong>1. Justificatifs sauvegardés</strong>
                        <small>CIN et diplôme téléchargés avec succès</small>
                      </div>
                    </div>
                    <div className="timeline-item">
                      <div className="timeline-icon warning">⏰</div>
                      <div className="timeline-content">
                        <strong>2. Vérification administrative</strong>
                        <small>Validation sous 24-48 heures</small>
                      </div>
                    </div>
                    <div className="timeline-item">
                      <div className="timeline-icon pending">3</div>
                      <div className="timeline-content">
                        <strong>3. Activation du profil</strong>
                        <small>Publication dans les résultats de recherche</small>
                      </div>
                    </div>
                  </div>
                  <button onClick={handleAdminBypass} className="btn btn-primary w-100 py-3 fw-bold mb-3">
                    🛡️ Accéder à l'espace Admin
                  </button>
                  <button onClick={() => props.onNavigate('home')} className="btn btn-outline-secondary w-100 py-2">
                    Retour à l'accueil
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="register-container">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8">
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
              
              {/* Header */}
              <div className="register-header">
                <div className="text-center">
                  <div className="brand-logo mx-auto mb-3">🎓</div>
                  <h2 className="fw-bold mb-2">Inscription</h2>
                  <p className="text-muted small">Rejoignez la plateforme #1 des cours particuliers au Maroc</p>
                </div>
              </div>

              <div className="card-body p-4 p-md-5">
                
                {/* Role Selection */}
                {etape === 1 && (
                  <div className="role-selection mb-4">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <div 
                          onClick={() => handleRoleChange('etudiant')}
                          className={`role-card ${form.role === 'etudiant' ? 'active' : ''}`}
                        >
                          <div className="role-emoji">🎓</div>
                          <div className="role-title">Étudiant</div>
                          <div className="role-desc">Je cherche des cours particuliers</div>
                          {form.role === 'etudiant' && <span className="role-check">✓</span>}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div 
                          onClick={() => handleRoleChange('enseignant')}
                          className={`role-card ${form.role === 'enseignant' ? 'active' : ''}`}
                        >
                          <div className="role-emoji">👨‍🏫</div>
                          <div className="role-title">Enseignant</div>
                          <div className="role-desc">Je donne des cours particuliers</div>
                          {form.role === 'enseignant' && <span className="role-check">✓</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Progress Steps */}
                {isEnseignant && (
                  <div className="progress-steps mb-5">
                    <div className="step-item">
                      <div className={`step-circle ${etape >= 1 ? 'active' : ''}`}>1</div>
                      <div className={`step-label ${etape >= 1 ? 'active' : ''}`}>Profil</div>
                    </div>
                    <div className="step-line">
                      <div className={`step-line-fill ${etape >= 2 ? 'filled' : ''}`}></div>
                    </div>
                    <div className="step-item">
                      <div className={`step-circle ${etape >= 2 ? 'active' : ''}`}>2</div>
                      <div className={`step-label ${etape >= 2 ? 'active' : ''}`}>Documents</div>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {erreur && (
                  <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
                    <span>⚠️ {erreur}</span>
                    <button type="button" className="btn-close" onClick={() => setErreur('')}></button>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleNext}>
                  
                  {/* STEP 1 */}
                  {etape === 1 && (
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label fw-semibold small text-uppercase text-secondary">Prénom</label>
                        <input type="text" name="prenom" value={form.prenom} onChange={handleChange} className="form-control" placeholder="Marwa" required />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold small text-uppercase text-secondary">Nom</label>
                        <input type="text" name="nom" value={form.nom} onChange={handleChange} className="form-control" placeholder="Benani" required />
                      </div>

                      <div className="col-12">
                        <label className="form-label fw-semibold small text-uppercase text-secondary">Email</label>
                        <input type="email" name="email" value={form.email} onChange={handleChange} className="form-control" placeholder="marwa@example.com" required />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold small text-uppercase text-secondary">Téléphone</label>
                        <input type="tel" name="telephone" value={form.telephone} onChange={handleChange} className="form-control" placeholder="+212 6XX XXX XXX" required />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold small text-uppercase text-secondary">Ville</label>
                        <select name="ville" value={form.ville} onChange={handleChange} className="form-select" required>
                          <option value="">Sélectionnez</option>
                          <option>Casablanca</option>
                          <option>Rabat</option>
                          <option>Marrakech</option>
                          <option>Tanger</option>
                          <option>Fès</option>
                          <option>Agadir</option>
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold small text-uppercase text-secondary">Mot de passe</label>
                        <input type="password" name="password" value={form.password} onChange={handleChange} className="form-control" placeholder="Min. 6 caractères" required />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold small text-uppercase text-secondary">Confirmer</label>
                        <input type="password" name="password_confirmation" value={form.password_confirmation} onChange={handleChange} className="form-control" placeholder="Confirmer" required />
                      </div>

                      {isEnseignant && (
                        <>
                          <div className="col-md-7">
                            <label className="form-label fw-semibold small text-uppercase text-secondary">Matière d'enseignement</label>
                            <select name="matiere" value={form.matiere} onChange={handleChange} className="form-select" required>
                              <option value="">Sélectionner...</option>
                              <option>Mathématiques</option>
                              <option>Physique-Chimie</option>
                              <option>SVT</option>
                              <option>Français</option>
                              <option>Anglais</option>
                              <option>Informatique</option>
                            </select>
                          </div>
                          <div className="col-md-5">
                            <label className="form-label fw-semibold small text-uppercase text-secondary">Tarif (DH/h)</label>
                            <input type="number" name="tarifHeure" value={form.tarifHeure} onChange={handleChange} className="form-control" placeholder="120" min="50" required />
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
                        <button type="submit" className="btn btn-primary w-100 py-3 fw-bold" disabled={isLoading}>
                          {isLoading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2"></span>
                              Chargement...
                            </>
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
                        <div className="alert alert-info d-flex align-items-center gap-2">
                          <span>📄</span>
                          <span>Téléchargez vos documents pour vérification rapide</span>
                        </div>
                      </div>

                      <div className="col-12">
                        <label className="form-label fw-semibold small text-uppercase text-secondary">Intitulé du diplôme</label>
                        <input type="text" name="diplomeTitle" value={form.diplomeTitle} onChange={handleChange} className="form-control" placeholder="Master en ..." required />
                      </div>

                      {/* CIN Recto */}
                      <div className="col-md-6">
                        <label className="form-label fw-semibold small text-secondary">Carte d'Identité (Recto)</label>
                        <div className="upload-box">
                          <div className="upload-icon">🪪</div>
                          {uploadedFiles.cin_recto ? (
                            <>
                              <span className="badge bg-success mb-2 d-inline-block">✓ {uploadedFiles.cin_recto}</span>
                              <button type="button" onClick={() => simulateUpload('recto')} className="btn btn-sm btn-outline-secondary w-100 mt-2">Changer</button>
                            </>
                          ) : (
                            <button type="button" onClick={() => simulateUpload('recto', `CIN_Recto_${form.nom.toUpperCase()}.jpg`)} className="btn btn-primary btn-sm" disabled={uploadingRecto}>
                              {uploadingRecto ? "Téléchargement..." : "Simuler téléversement"}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* CIN Verso */}
                      <div className="col-md-6">
                        <label className="form-label fw-semibold small text-secondary">Carte d'Identité (Verso)</label>
                        <div className="upload-box">
                          <div className="upload-icon">🪪</div>
                          {uploadedFiles.cin_verso ? (
                            <>
                              <span className="badge bg-success mb-2 d-inline-block">✓ {uploadedFiles.cin_verso}</span>
                              <button type="button" onClick={() => simulateUpload('verso')} className="btn btn-sm btn-outline-secondary w-100 mt-2">Changer</button>
                            </>
                          ) : (
                            <button type="button" onClick={() => simulateUpload('verso', `CIN_Verso_${form.nom.toUpperCase()}.jpg`)} className="btn btn-primary btn-sm" disabled={uploadingVerso}>
                              {uploadingVerso ? "Téléchargement..." : "Simuler téléversement"}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Diplôme */}
                      <div className="col-12">
                        <label className="form-label fw-semibold small text-secondary">Diplôme (PDF)</label>
                        <div className="upload-box">
                          <div className="upload-icon">📑</div>
                          {uploadedFiles.diplome ? (
                            <>
                              <span className="badge bg-success mb-2 d-inline-block">✓ {uploadedFiles.diplome}</span>
                              <button type="button" onClick={() => simulateUpload('diplome')} className="btn btn-sm btn-outline-secondary w-100 mt-2">Changer</button>
                            </>
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
                          <button type="button" onClick={() => setEtape(1)} className="btn btn-outline-secondary flex-grow-1 py-2">Retour</button>
                          <button type="submit" className="btn btn-primary flex-grow-1 py-2" disabled={isLoading || !uploadedFiles.cin_recto || !uploadedFiles.cin_verso || !uploadedFiles.diplome}>
                            {isLoading ? "Soumission..." : "Soumettre mon dossier →"}
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
                    <button onClick={() => props.onNavigate('login')} className="btn-link-custom">
                      Se connecter
                    </button>
                  </small>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;