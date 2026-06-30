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

  // Écran de soumission (comme sur l'image)
  if (isSubmitted) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8">
            <div className="card shadow-sm border-0 rounded-4">
              <div className="card-body p-4 p-md-5">
                
                {/* Header avec bandeau bleu */}
                <div className="bg-primary rounded-3 mb-4" style={{ height: '4px', width: '60px' }}></div>
                
                <div className="text-center mb-4">
                  <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center p-3 mb-3">
                    <i className="bi bi-award fs-1 text-primary"></i>
                  </div>
                  <h3 className="fw-bold mb-2">Dossier d'Inscription Enregistré !</h3>
                  <p className="text-muted">
                    Félicitations <strong>{form.prenom} {form.nom}</strong>. Votre demande de certification tuteur est bien enregistrée par Learnect.ma.
                    Toutes les pièces d'identité et justificatifs de diplômes sont en cours d'évaluation.
                  </p>
                </div>

                {/* Timeline de validation */}
                <div className="bg-light rounded-4 p-4 mb-4">
                  <span className="text-primary fw-bold text-uppercase small mb-3 d-block">
                    <i className="bi bi-list-check me-2"></i>Suivi de Validation du Profil Académique :
                  </span>

                  <div className="d-flex gap-3 mb-3">
                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '28px', height: '28px' }}>
                      <i className="bi bi-check fs-6"></i>
                    </div>
                    <div>
                      <strong className="d-block">1. Justificatifs Inscrits & Sauvegardés</strong>
                      <small className="text-muted">Copies de votre CIN et de votre diplôme ({form.diplomeTitle || 'Diplome.pdf'}) ont bien été indexées.</small>
                    </div>
                  </div>

                  <div className="d-flex gap-3 mb-3">
                    <div className="bg-warning text-dark rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '28px', height: '28px' }}>
                      <i className="bi bi-hourglass-split fs-6"></i>
                    </div>
                    <div>
                      <strong className="d-block">2. Instruction Administrative par ISTA-AG</strong>
                      <small className="text-muted">L'administrateur <strong>Yassine El Amrani</strong> procède à la vérification d'authenticité. Validation sous 24 heures.</small>
                    </div>
                  </div>

                  <div className="d-flex gap-3">
                    <div className="bg-secondary bg-opacity-25 text-secondary rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '28px', height: '28px' }}>
                      <i className="bi bi-star fs-6"></i>
                    </div>
                    <div>
                      <strong className="d-block">3. Publication en favoris & Activation des cours</strong>
                      <small className="text-muted">Votre profil tuteur apparaîtra en haut des résultats de recherche pour les cours particuliers à Casablanca ou en ligne.</small>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="text-center">
                  <span className="badge bg-primary bg-opacity-10 text-primary text-uppercase px-3 py-2 mb-3">
                    🎯 Mode Évaluation Académique
                  </span>
                  <button onClick={() => props.onNavigate('admin-dashboard')} className="btn btn-dark w-100 py-3 fw-bold mb-2 d-flex align-items-center justify-content-center gap-2">
                    <i className="bi bi-shield-lock"></i>
                    <span>Ouvrir l'Espace Admin pour Valider mon Compte</span>
                    <i className="bi bi-arrow-right"></i>
                  </button>
                  <button onClick={() => props.onNavigate('teacher-dashboard')} className="btn btn-link text-muted small">
                    Continuer vers l'Espace Tuteur (Mode restreint)
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
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-body p-4 p-md-5">
              
              {/* Header */}
              <div className="text-center mb-4">
                <div className="bg-primary text-white rounded-3 d-inline-flex align-items-center justify-content-center p-3 mb-3 shadow-sm">
                  <i className="bi bi-mortarboard fs-1"></i>
                </div>
                <h2 className="fw-bold mb-2">Inscription Learnect.ma</h2>
                <p className="text-muted small">Rejoignez le réseau marocain d'entraide et soutien scolaire</p>
              </div>

              {/* Steps Header */}
              <div className="row g-2 mb-4 pb-2 border-bottom">
                <div className={`col-6 text-center pb-2 fw-bold ${etape === 1 ? 'text-primary border-bottom border-2 border-primary' : 'text-muted'}`}>
                  <i className="bi bi-person-circle me-1"></i> Étape 1 : Profil Général
                </div>
                <div className={`col-6 text-center pb-2 fw-bold ${etape === 2 ? 'text-primary border-bottom border-2 border-primary' : 'text-muted'}`}>
                  <i className="bi bi-file-earmark-text me-1"></i> Étape 2 : Justificatifs Pro
                </div>
              </div>

              {/* Error */}
              {erreur && (
                <div className="alert alert-danger alert-dismissible fade show d-flex align-items-center gap-2 mb-4" role="alert">
                  <i className="bi bi-exclamation-triangle-fill"></i>
                  <span>{erreur}</span>
                  <button type="button" className="btn-close" onClick={() => setErreur('')}></button>
                </div>
              )}

              {/* Role Selection - Style comme image */}
              {etape === 1 && (
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <div 
                      onClick={() => handleRoleChange('etudiant')}
                      className={`border rounded-3 p-3 text-center cursor-pointer transition-all ${form.role === 'etudiant' ? 'border-primary bg-primary bg-opacity-5' : 'border-secondary'}`}
                    >
                      <i className="bi bi-person-graduation fs-1 d-block mb-2"></i>
                      <div className="fw-bold">Je cherche un Tuteur</div>
                      <small className="text-muted">Élève / Étudiant</small>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div 
                      onClick={() => handleRoleChange('enseignant')}
                      className={`border rounded-3 p-3 text-center cursor-pointer transition-all ${form.role === 'enseignant' ? 'border-primary bg-primary bg-opacity-5' : 'border-secondary'}`}
                    >
                      <i className="bi bi-person-workspace fs-1 d-block mb-2"></i>
                      <div className="fw-bold">Je souhaite Enseigner</div>
                      <small className="text-muted">Professeur / Tuteur</small>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleNext}>
                
                {/* STEP 1 - Profil Général */}
                {etape === 1 && (
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small text-muted">PRÉNOM</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <i className="bi bi-person text-muted"></i>
                        </span>
                        <input 
                          type="text" 
                          name="prenom" 
                          value={form.prenom} 
                          onChange={handleChange} 
                          className="form-control border-start-0" 
                          placeholder="Ex: Marwa"
                          required 
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small text-muted">NOM</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <i className="bi bi-person-badge text-muted"></i>
                        </span>
                        <input 
                          type="text" 
                          name="nom" 
                          value={form.nom} 
                          onChange={handleChange} 
                          className="form-control border-start-0" 
                          placeholder="Ex: Benani"
                          required 
                        />
                      </div>
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold small text-muted">ADRESSE EMAIL</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <i className="bi bi-envelope text-muted"></i>
                        </span>
                        <input 
                          type="email" 
                          name="email" 
                          value={form.email} 
                          onChange={handleChange} 
                          className="form-control border-start-0" 
                          placeholder="marwa.benani@example.com"
                          required 
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold small text-muted">NUMÉRO TÉLÉPHONE (WHATSAPP)</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <i className="bi bi-whatsapp text-success"></i>
                        </span>
                        <input 
                          type="tel" 
                          name="telephone" 
                          value={form.telephone} 
                          onChange={handleChange} 
                          className="form-control border-start-0" 
                          placeholder="+212 6XX XXX XXX"
                          required 
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold small text-muted">VILLE DE RÉSIDENCE</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <i className="bi bi-geo-alt text-muted"></i>
                        </span>
                        <select name="ville" value={form.ville} onChange={handleChange} className="form-select border-start-0" required>
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

                    <div className="col-md-6">
                      <label className="form-label fw-semibold small text-muted">MOT DE PASSE</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <i className="bi bi-lock text-muted"></i>
                        </span>
                        <input 
                          type="password" 
                          name="password" 
                          value={form.password} 
                          onChange={handleChange} 
                          className="form-control border-start-0" 
                          placeholder="Min. 6 caractères"
                          required 
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold small text-muted">CONFIRMER MOT DE PASSE</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <i className="bi bi-lock-fill text-muted"></i>
                        </span>
                        <input 
                          type="password" 
                          name="password_confirmation" 
                          value={form.password_confirmation} 
                          onChange={handleChange} 
                          className="form-control border-start-0" 
                          placeholder="Confirmer"
                          required 
                        />
                      </div>
                    </div>

                    {/* Champs enseignant - comme sur image */}
                    {isEnseignant && (
                      <>
                        <div className="col-md-7">
                          <label className="form-label fw-semibold small text-muted">MATIÈRE D'ENSEIGNEMENT PRINCIPALE</label>
                          <div className="input-group">
                            <span className="input-group-text bg-light border-end-0">
                              <i className="bi bi-book text-muted"></i>
                            </span>
                            <select name="matiere" value={form.matiere} onChange={handleChange} className="form-select border-start-0" required>
                              <option value="">Sélectionner une discipline...</option>
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
                          <label className="form-label fw-semibold small text-muted">TARIF PRINCIPAL (DH/h)</label>
                          <div className="input-group">
                            <span className="input-group-text bg-light border-end-0">
                              <i className="bi bi-cash-stack text-muted"></i>
                            </span>
                            <input 
                              type="number" 
                              name="tarifHeure" 
                              value={form.tarifHeure} 
                              onChange={handleChange} 
                              className="form-control border-start-0" 
                              placeholder="120"
                              min="50"
                              required 
                            />
                          </div>
                        </div>
                      </>
                    )}

                    <div className="col-12 mt-3">
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" required id="consent" />
                        <label className="form-check-label small text-muted" htmlFor="consent">
                          Je certifie sur l'honneur l'exactitude des pièces fournies. J'accepte les conditions de commission de 10%.
                        </label>
                      </div>
                    </div>

                    <div className="col-12 mt-3">
                      <button type="submit" className="btn btn-primary w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <span className="spinner-border spinner-border-sm"></span>
                            Chargement...
                          </>
                        ) : (
                          <>
                            <span>{isEnseignant ? "SUIVANT : DÉPOSER JUSTIFICATIFS" : "CRÉER MON COMPTE"}</span>
                            <i className="bi bi-arrow-right"></i>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2 - Justificatifs Pro (Enseignant) - Exactement comme image */}
                {isEnseignant && etape === 2 && (
                  <div className="row g-3">
                    <div className="col-12">
                      <div className="bg-light rounded-3 p-3 mb-2">
                        <i className="bi bi-info-circle text-primary me-2"></i>
                        <span className="small fw-semibold">1. INTITULÉ OFFICIEL DE VOTRE DIPLÔME SUPÉRIEUR</span>
                      </div>
                      <div className="input-group">
                        <span className="input-group-text bg-light">
                          <i className="bi bi-award text-primary"></i>
                        </span>
                        <input 
                          type="text" 
                          name="diplomeTitle" 
                          value={form.diplomeTitle} 
                          onChange={handleChange} 
                          className="form-control" 
                          placeholder="Ex: Master en Énergétique, Licence Pro, etc."
                          required 
                        />
                      </div>
                    </div>

                    <div className="col-12 mt-3">
                      <div className="bg-light rounded-3 p-3 mb-3">
                        <i className="bi bi-cloud-upload text-primary me-2"></i>
                        <span className="small fw-semibold">DÉPÔT DES PIÈCES D'ÉTUDES & CIN :</span>
                      </div>
                    </div>

                    {/* Upload CIN Recto - comme image */}
                    <div className="col-md-6">
                      <div className="border rounded-3 p-4 text-center bg-white">
                        <i className="bi bi-person-badge fs-1 text-primary d-block mb-3"></i>
                        <div className="fw-bold mb-2">Carte d'Identité (Recto)</div>
                        {uploadedFiles.cin_recto ? (
                          <div className="mt-2">
                            <span className="badge bg-success">
                              <i className="bi bi-check-circle me-1"></i> {uploadedFiles.cin_recto}
                            </span>
                            <button type="button" onClick={() => simulateUpload('recto')} className="btn btn-sm btn-link text-primary mt-2 d-block mx-auto">
                              <i className="bi bi-arrow-repeat"></i> Changer
                            </button>
                          </div>
                        ) : (
                          <button type="button" onClick={() => simulateUpload('recto', `CIN_Recto_${form.nom.toUpperCase()}.jpg`)} className="btn btn-outline-primary" disabled={uploadingRecto}>
                            {uploadingRecto ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2"></span>
                                Dépose en cours...
                              </>
                            ) : (
                              <>
                                <i className="bi bi-cloud-upload me-2"></i>
                                Simuler téléversement
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Upload CIN Verso - comme image */}
                    <div className="col-md-6">
                      <div className="border rounded-3 p-4 text-center bg-white">
                        <i className="bi bi-person-vcard fs-1 text-primary d-block mb-3"></i>
                        <div className="fw-bold mb-2">Carte d'Identité (Verso)</div>
                        {uploadedFiles.cin_verso ? (
                          <div className="mt-2">
                            <span className="badge bg-success">
                              <i className="bi bi-check-circle me-1"></i> {uploadedFiles.cin_verso}
                            </span>
                            <button type="button" onClick={() => simulateUpload('verso')} className="btn btn-sm btn-link text-primary mt-2 d-block mx-auto">
                              <i className="bi bi-arrow-repeat"></i> Changer
                            </button>
                          </div>
                        ) : (
                          <button type="button" onClick={() => simulateUpload('verso', `CIN_Verso_${form.nom.toUpperCase()}.jpg`)} className="btn btn-outline-primary" disabled={uploadingVerso}>
                            {uploadingVerso ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2"></span>
                                Dépose en cours...
                              </>
                            ) : (
                              <>
                                <i className="bi bi-cloud-upload me-2"></i>
                                Simuler téléversement
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Upload Diplôme - comme image */}
                    <div className="col-12">
                      <div className="border rounded-3 p-4 text-center bg-white">
                        <i className="bi bi-file-earmark-pdf fs-1 text-danger d-block mb-3"></i>
                        <div className="fw-bold mb-2">Copie du Diplôme Supérieur certifié (Format PDF ou JPG)</div>
                        {uploadedFiles.diplome ? (
                          <div className="mt-2">
                            <span className="badge bg-success">
                              <i className="bi bi-check-circle me-1"></i> {uploadedFiles.diplome}
                            </span>
                            <button type="button" onClick={() => simulateUpload('diplome')} className="btn btn-sm btn-link text-primary mt-2 d-block mx-auto">
                              <i className="bi bi-arrow-repeat"></i> Changer
                            </button>
                          </div>
                        ) : (
                          <button type="button" onClick={() => simulateUpload('diplome', `${form.diplomeTitle?.replace(/\s+/g, '_') || 'Diplome'}.pdf`)} className="btn btn-outline-primary" disabled={uploadingDiplome}>
                            {uploadingDiplome ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2"></span>
                                Dépose du PDF en cours...
                              </>
                            ) : (
                              <>
                                <i className="bi bi-cloud-upload me-2"></i>
                                Simuler téléversement de mon Diplôme
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="col-12 mt-3">
                      <div className="d-flex gap-3">
                        <button type="button" onClick={() => setEtape(1)} className="btn btn-outline-secondary flex-grow-1 py-2 fw-bold">
                          <i className="bi bi-arrow-left me-2"></i> Retour
                        </button>
                        <button type="submit" className="btn btn-primary flex-grow-1 py-2 fw-bold" disabled={isLoading || !uploadedFiles.cin_recto || !uploadedFiles.cin_verso || !uploadedFiles.diplome}>
                          {isLoading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2"></span>
                              Traitement...
                            </>
                          ) : (
                            <>
                              <i className="bi bi-send-check me-2"></i>
                              SOUMETTRE MON DOSSIER
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              </form>

              {/* Login Link */}
              <div className="text-center mt-4 pt-3 border-top">
                <small className="text-muted">
                  Déjà membre de la communauté ?
                  <button onClick={() => props.onNavigate('login')} className="btn btn-link p-0 text-primary fw-bold text-decoration-none ms-1">
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
        .bg-primary { background-color: #0d6efd !important; }
        .text-primary { color: #0d6efd !important; }
        .border-primary { border-color: #0d6efd !important; }
        .btn-primary { background-color: #0d6efd !important; border-color: #0d6efd !important; }
        .btn-primary:hover { background-color: #0b5ed7 !important; border-color: #0b5ed7 !important; transform: translateY(-1px); }
        .btn-outline-primary { border-color: #0d6efd !important; color: #0d6efd !important; }
        .btn-outline-primary:hover { background-color: #0d6efd !important; color: white !important; }
        .form-control:focus, .form-select:focus {
          border-color: #0d6efd;
          box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
        }
      `}</style>
    </div>
  );
}

export default Register;