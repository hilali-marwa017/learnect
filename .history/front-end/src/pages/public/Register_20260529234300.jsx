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
      if (isEnseignant) setIsSubmitted(true);
      else props.onNavigate('student-dashboard');
    } catch (error) {
      setErreur('Erreur de connexion au serveur');
    } finally {
      setIsLoading(false);
    }
  }

  if (isSubmitted) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8">
            <div className="card shadow-sm border-0 rounded-4">
              <div className="card-body p-4 p-md-5">
                <div className="bg-primary rounded-3 mb-4" style={{ height: '4px', width: '60px' }}></div>
                <div className="text-center mb-4">
                  <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center p-3 mb-3">
                    <i className="bi bi-award fs-1 text-primary"></i>
                  </div>
                  <h3 className="fw-bold mb-2">Dossier d'Inscription Enregistré !</h3>
                  <p className="text-muted">Félicitations <strong>{form.prenom} {form.nom}</strong>.</p>
                </div>
                <div className="bg-light rounded-4 p-4 mb-4">
                  <span className="text-primary fw-bold text-uppercase small mb-3 d-block"><i className="bi bi-list-check me-2"></i>Suivi de Validation :</span>
                  <div className="d-flex gap-3 mb-3">
                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '28px', height: '28px' }}><i className="bi bi-check fs-6"></i></div>
                    <div><strong className="d-block">1. Justificatifs sauvegardés</strong><small className="text-muted">CIN et diplôme téléchargés</small></div>
                  </div>
                  <div className="d-flex gap-3 mb-3">
                    <div className="bg-warning text-dark rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '28px', height: '28px' }}><i className="bi bi-hourglass-split fs-6"></i></div>
                    <div><strong className="d-block">2. Vérification administrative</strong><small className="text-muted">Validation sous 24-48h</small></div>
                  </div>
                  <div className="d-flex gap-3">
                    <div className="bg-secondary bg-opacity-25 text-secondary rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '28px', height: '28px' }}><i className="bi bi-star fs-6"></i></div>
                    <div><strong className="d-block">3. Activation du profil</strong><small className="text-muted">Publication dans les résultats</small></div>
                  </div>
                </div>
                <button onClick={() => props.onNavigate('admin-dashboard')} className="btn btn-dark w-100 py-3 fw-bold mb-2 d-flex align-items-center justify-content-center gap-2">
                  <i className="bi bi-shield-lock"></i> Ouvrir l'Espace Admin <i className="bi bi-arrow-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8 col-xl-7">
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-body p-4">
              
              {/* Header */}
              <div className="text-center mb-4">
                <div className="bg-primary text-white rounded-3 d-inline-flex align-items-center justify-content-center p-2 mb-3 shadow-sm" style={{ width: '50px', height: '50px' }}>
                  <i className="bi bi-mortarboard fs-3"></i>
                </div>
                <h2 className="fw-bold mb-1 fs-3">Inscription Learnect.ma</h2>
                <p className="text-muted small">Rejoignez le réseau marocain d'entraide et soutien scolaire</p>
              </div>

              {/* Steps */}
              <div className="d-flex justify-content-center gap-4 mb-4 pb-2 border-bottom">
                <div className={`text-center pb-2 fw-bold small ${etape === 1 ? 'text-primary border-bottom border-2 border-primary' : 'text-muted'}`}>
                  <i className="bi bi-person-circle me-1"></i> Étape 1 : Profil
                </div>
                {isEnseignant && (
                  <div className={`text-center pb-2 fw-bold small ${etape === 2 ? 'text-primary border-bottom border-2 border-primary' : 'text-muted'}`}>
                    <i className="bi bi-file-earmark-text me-1"></i> Étape 2 : Documents
                  </div>
                )}
              </div>

              {/* Role Selection */}
              {etape === 1 && (
                <div className="row g-3 mb-4">
                  <div className="col-6">
                    <div 
                      onClick={() => handleRoleChange('etudiant')} 
                      className={`border rounded-3 p-3 text-center cursor-pointer transition-all ${form.role === 'etudiant' ? 'border-primary bg-primary bg-opacity-5' : 'border-secondary'}`}
                    >
                      <i className="bi bi-person-graduation fs-2 d-block mb-2 text-primary"></i>
                      <div className="fw-bold small">Je cherche un Tuteur</div>
                      <small className="text-muted" style={{ fontSize: '11px' }}>Élève / Étudiant</small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div 
                      onClick={() => handleRoleChange('enseignant')} 
                      className={`border rounded-3 p-3 text-center cursor-pointer transition-all ${form.role === 'enseignant' ? 'border-primary bg-primary bg-opacity-5' : 'border-secondary'}`}
                    >
                      <i className="bi bi-person-workspace fs-2 d-block mb-2 text-primary"></i>
                      <div className="fw-bold small">Je souhaite Enseigner</div>
                      <small className="text-muted" style={{ fontSize: '11px' }}>Professeur / Tuteur</small>
                    </div>
                  </div>
                </div>
              )}

              {erreur && (
                <div className="alert alert-danger alert-dismissible fade show d-flex align-items-center gap-2 mb-3 py-2" role="alert">
                  <i className="bi bi-exclamation-triangle-fill"></i>
                  <span className="small">{erreur}</span>
                  <button type="button" className="btn-close" onClick={() => setErreur('')}></button>
                </div>
              )}

              <form onSubmit={handleNext}>
                
                {/* STEP 1 */}
                {etape === 1 && (
                  <div className="row g-3">
                    <div className="col-6">
                      <label className="form-label fw-semibold small text-uppercase text-secondary mb-1">PRÉNOM</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0 py-2"><i className="bi bi-person text-muted"></i></span>
                        <input type="text" name="prenom" value={form.prenom} onChange={handleChange} className="form-control border-start-0 py-2" placeholder="Marwa" required />
                      </div>
                    </div>
                    <div className="col-6">
                      <label className="form-label fw-semibold small text-uppercase text-secondary mb-1">NOM</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0 py-2"><i className="bi bi-person-badge text-muted"></i></span>
                        <input type="text" name="nom" value={form.nom} onChange={handleChange} className="form-control border-start-0 py-2" placeholder="Benani" required />
                      </div>
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold small text-uppercase text-secondary mb-1">ADRESSE EMAIL</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0 py-2"><i className="bi bi-envelope text-muted"></i></span>
                        <input type="email" name="email" value={form.email} onChange={handleChange} className="form-control border-start-0 py-2" placeholder="marwa@example.com" required />
                      </div>
                    </div>

                    <div className="col-6">
                      <label className="form-label fw-semibold small text-uppercase text-secondary mb-1">TÉLÉPHONE (WHATSAPP)</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0 py-2"><i className="bi bi-whatsapp text-success"></i></span>
                        <input type="tel" name="telephone" value={form.telephone} onChange={handleChange} className="form-control border-start-0 py-2" placeholder="+212 6XX XXX XXX" required />
                      </div>
                    </div>

                    <div className="col-6">
                      <label className="form-label fw-semibold small text-uppercase text-secondary mb-1">VILLE</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0 py-2"><i className="bi bi-geo-alt text-muted"></i></span>
                        <select name="ville" value={form.ville} onChange={handleChange} className="form-select border-start-0 py-2" required>
                          <option value="">Sélectionnez</option>
                          <option>Casablanca</option><option>Rabat</option><option>Marrakech</option>
                          <option>Tanger</option><option>Fès</option><option>Agadir</option>
                        </select>
                      </div>
                    </div>

                    <div className="col-6">
                      <label className="form-label fw-semibold small text-uppercase text-secondary mb-1">MOT DE PASSE</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0 py-2"><i className="bi bi-lock text-muted"></i></span>
                        <input type="password" name="password" value={form.password} onChange={handleChange} className="form-control border-start-0 py-2" placeholder="Min. 6 caractères" required />
                      </div>
                    </div>

                    <div className="col-6">
                      <label className="form-label fw-semibold small text-uppercase text-secondary mb-1">CONFIRMER</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0 py-2"><i className="bi bi-lock-fill text-muted"></i></span>
                        <input type="password" name="password_confirmation" value={form.password_confirmation} onChange={handleChange} className="form-control border-start-0 py-2" placeholder="Confirmer" required />
                      </div>
                    </div>

                    {isEnseignant && (
                      <>
                        <div className="col-7">
                          <label className="form-label fw-semibold small text-uppercase text-secondary mb-1">MATIÈRE</label>
                          <div className="input-group">
                            <span className="input-group-text bg-light border-end-0 py-2"><i className="bi bi-book text-muted"></i></span>
                            <select name="matiere" value={form.matiere} onChange={handleChange} className="form-select border-start-0 py-2" required>
                              <option value="">Sélectionner...</option>
                              <option>Mathématiques</option><option>Physique-Chimie</option>
                              <option>SVT</option><option>Français</option><option>Anglais</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-5">
                          <label className="form-label fw-semibold small text-uppercase text-secondary mb-1">TARIF (DH/h)</label>
                          <div className="input-group">
                            <span className="input-group-text bg-light border-end-0 py-2"><i className="bi bi-cash-stack text-muted"></i></span>
                            <input type="number" name="tarifHeure" value={form.tarifHeure} onChange={handleChange} className="form-control border-start-0 py-2" placeholder="120" min="50" required />
                          </div>
                        </div>
                      </>
                    )}

                    <div className="col-12 mt-2">
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" required id="consent" />
                        <label className="form-check-label small text-muted" htmlFor="consent">
                          Je certifie sur l'honneur l'exactitude des pièces fournies. J'accepte la commission de 10%.
                        </label>
                      </div>
                    </div>

                    <div className="col-12 mt-2">
                      <button type="submit" className="btn btn-primary w-100 py-2 fw-bold d-flex align-items-center justify-content-center gap-2" style={{ borderRadius: '10px', fontSize: '14px' }} disabled={isLoading}>
                        {isLoading ? (
                          <><span className="spinner-border spinner-border-sm"></span> Chargement...</>
                        ) : (
                          <>{!isEnseignant ? "FINALISER INSCRIPTION ÉLÈVE →" : "SUIVANT : DÉPOSER JUSTIFICATIFS →"}</>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2 - Documents */}
                {isEnseignant && etape === 2 && (
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label fw-semibold small text-uppercase text-secondary mb-1">INTITULÉ DU DIPLÔME</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light py-2"><i className="bi bi-award text-primary"></i></span>
                        <input type="text" name="diplomeTitle" value={form.diplomeTitle} onChange={handleChange} className="form-control py-2" placeholder="Ex: Master en Énergétique" required />
                      </div>
                    </div>

                    <div className="col-6">
                      <div className="border rounded-3 p-3 text-center bg-light">
                        <i className="bi bi-person-badge fs-2 text-primary d-block mb-2"></i>
                        <div className="fw-bold small mb-1">CIN Recto</div>
                        {uploadedFiles.cin_recto ? (
                          <><span className="badge bg-success small"><i className="bi bi-check-circle me-1"></i> {uploadedFiles.cin_recto.substring(0, 15)}</span>
                          <button type="button" onClick={() => simulateUpload('recto')} className="btn btn-sm btn-link text-primary mt-1">Changer</button></>
                        ) : (
                          <button type="button" onClick={() => simulateUpload('recto')} className="btn btn-outline-primary btn-sm" disabled={uploadingRecto}>
                            {uploadingRecto ? "Dépose..." : <><i className="bi bi-cloud-upload me-1"></i>Simuler</>}
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="col-6">
                      <div className="border rounded-3 p-3 text-center bg-light">
                        <i className="bi bi-person-vcard fs-2 text-primary d-block mb-2"></i>
                        <div className="fw-bold small mb-1">CIN Verso</div>
                        {uploadedFiles.cin_verso ? (
                          <><span className="badge bg-success small"><i className="bi bi-check-circle me-1"></i> {uploadedFiles.cin_verso.substring(0, 15)}</span>
                          <button type="button" onClick={() => simulateUpload('verso')} className="btn btn-sm btn-link text-primary mt-1">Changer</button></>
                        ) : (
                          <button type="button" onClick={() => simulateUpload('verso')} className="btn btn-outline-primary btn-sm" disabled={uploadingVerso}>
                            {uploadingVerso ? "Dépose..." : <><i className="bi bi-cloud-upload me-1"></i>Simuler</>}
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="border rounded-3 p-3 text-center bg-light">
                        <i className="bi bi-file-earmark-pdf fs-2 text-danger d-block mb-2"></i>
                        <div className="fw-bold small mb-1">Diplôme (PDF)</div>
                        {uploadedFiles.diplome ? (
                          <><span className="badge bg-success small"><i className="bi bi-check-circle me-1"></i> {uploadedFiles.diplome.substring(0, 15)}</span>
                          <button type="button" onClick={() => simulateUpload('diplome')} className="btn btn-sm btn-link text-primary mt-1">Changer</button></>
                        ) : (
                          <button type="button" onClick={() => simulateUpload('diplome')} className="btn btn-outline-primary btn-sm" disabled={uploadingDiplome}>
                            {uploadingDiplome ? "Dépose..." : <><i className="bi bi-cloud-upload me-1"></i>Simuler</>}
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-check">
                        <input type="checkbox" className="form-check-input" id="certif" required />
                        <label className="form-check-label small text-muted" htmlFor="certif">
                          Je certifie sur l'honneur l'exactitude des pièces fournies
                        </label>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="d-flex gap-2">
                        <button type="button" onClick={() => setEtape(1)} className="btn btn-outline-secondary flex-grow-1 py-2 fw-bold small" style={{ borderRadius: '10px' }}>
                          <i className="bi bi-arrow-left me-1"></i> Retour
                        </button>
                        <button type="submit" className="btn btn-primary flex-grow-1 py-2 fw-bold d-flex align-items-center justify-content-center gap-1" style={{ borderRadius: '10px', fontSize: '13px' }} disabled={isLoading || !uploadedFiles.cin_recto || !uploadedFiles.cin_verso || !uploadedFiles.diplome}>
                          {isLoading ? "..." : <><i className="bi bi-send-check"></i> SOUMETTRE</>}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              </form>

              {/* Login Link */}
              <div className="text-center mt-3 pt-2 border-top">
                <small className="text-muted">
                  Déjà membre ?{' '}
                  <button onClick={() => props.onNavigate('login')} className="btn btn-link p-0 text-primary fw-bold text-decoration-none small">
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
        .transition-all { transition: all 0.2s ease; }
        .btn-primary { background-color: #0d6efd !important; border-color: #0d6efd !important; transition: all 0.2s ease; }
        .btn-primary:hover { background-color: #0b5ed7 !important; transform: translateY(-1px); box-shadow: 0 2px 8px rgba(13,110,253,0.3); }
        .btn-outline-primary { border-color: #0d6efd !important; color: #0d6efd !important; }
        .btn-outline-primary:hover { background-color: #0d6efd !important; color: white !important; }
        .form-control:focus, .form-select:focus { border-color: #0d6efd; box-shadow: 0 0 0 0.15rem rgba(13,110,253,0.2); }
        .card { transition: transform 0.2s ease; }
        .card:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.08) !important; }
        .form-control, .form-select, .input-group-text { font-size: 13px; }
        .btn { font-size: 13px; }
      `}</style>
    </div>
  );
}

export default Register;