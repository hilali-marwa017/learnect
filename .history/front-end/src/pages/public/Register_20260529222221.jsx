import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Role } from '../../types';
import { 
  GraduationCap, Shield, UploadCloud, Check, ArrowRight, Clock, 
  Award, Phone, Mail, Lock, User, MapPin, BookOpen, DollarSign
} from 'lucide-react';

export default function Register() {
  const { onRegisterUser, onSetRole, setActiveView, setActiveAdminTab } = useAuth();
  const [roleSelection, setRoleSelection] = useState(Role.Etudiant);
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [registeredTeacherId, setRegisteredTeacherId] = useState(null);

  // General fields
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [ville, setVille] = useState('Casablanca');

  // Teacher-specific fields
  const [matiere, setMatiere] = useState('');
  const [tarifHeure, setTarifHeure] = useState('120');
  const [diplomeTitle, setDiplomeTitle] = useState('');
  const [erreur, setErreur] = useState('');

  // Upload states
  const [cinRectoFile, setCinRectoFile] = useState(null);
  const [cinVersoFile, setCinVersoFile] = useState(null);
  const [diplomeFile, setDiplomeFile] = useState(null);
  const [uploadingRecto, setUploadingRecto] = useState(false);
  const [uploadingVerso, setUploadingVerso] = useState(false);
  const [uploadingDiplome, setUploadingDiplome] = useState(false);

  // Validation functions (OFPPT style)
  const validateEtape1 = () => {
    if (!nom || !prenom || !email || !telephone || !ville) {
      setErreur('Veuillez remplir tous les champs obligatoires');
      return false;
    }
    if (password !== passwordConfirmation) {
      setErreur('Les mots de passe ne correspondent pas');
      return false;
    }
    if (password.length < 6) {
      setErreur('Le mot de passe doit contenir au moins 6 caractères');
      return false;
    }
    if (roleSelection === Role.Enseignant && (!matiere || !tarifHeure)) {
      setErreur('Veuillez sélectionner une matière et un tarif');
      return false;
    }
    setErreur('');
    return true;
  };

  const validateEtape2 = () => {
    if (!cinRectoFile || !cinVersoFile || !diplomeFile) {
      setErreur('Veuillez télécharger tous les documents requis');
      return false;
    }
    if (!diplomeTitle) {
      setErreur('Veuillez renseigner l\'intitulé de votre diplôme');
      return false;
    }
    setErreur('');
    return true;
  };

  const simulateUpload = (fileType, fileName) => {
    if (fileType === 'recto') {
      setUploadingRecto(true);
      setTimeout(() => {
        setCinRectoFile(fileName || 'CIN_Recto_Scanne.jpg');
        setUploadingRecto(false);
      }, 700);
    } else if (fileType === 'verso') {
      setUploadingVerso(true);
      setTimeout(() => {
        setCinVersoFile(fileName || 'CIN_Verso_Scanne.jpg');
        setUploadingVerso(false);
      }, 700);
    } else if (fileType === 'diplome') {
      setUploadingDiplome(true);
      setTimeout(() => {
        setDiplomeFile(fileName || 'Diplome_Master_Academique.pdf');
        setUploadingDiplome(false);
      }, 950);
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setErreur('');

    if (roleSelection === Role.Enseignant && step === 1) {
      if (validateEtape1()) {
        setStep(2);
      }
      return;
    }

    if (roleSelection === Role.Enseignant && step === 2) {
      if (!validateEtape2()) return;
    }

    if (roleSelection === Role.Etudiant && !validateEtape1()) return;

    // Creating actual user
    const userData = {
      prenom,
      nom,
      email,
      telephone,
      ville,
      role: roleSelection,
      photo: roleSelection === Role.Etudiant 
        ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80' 
        : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80'
    };

    let teacherData = null;
    if (roleSelection === Role.Enseignant) {
      teacherData = {
        diplome: diplomeTitle,
        cin_recto: cinRectoFile,
        cin_verso: cinVersoFile,
        matiere,
        tarifHeure: parseInt(tarifHeure)
      };
    }

    const newUserId = onRegisterUser(userData, teacherData);

    if (roleSelection === Role.Etudiant) {
      onSetRole(Role.Etudiant);
      setActiveView('simulator');
    } else {
      setRegisteredTeacherId(newUserId);
      setIsSubmitted(true);
    }
  };

  const handleAdminBypass = () => {
    onSetRole(Role.Admin);
    setActiveAdminTab('verifications');
    setActiveView('simulator');
  };

  if (isSubmitted) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-9 col-lg-7">
            <div className="card shadow-sm border-0 rounded-4 bg-white position-relative">
              <div className="position-absolute top-0 start-0 w-100 bg-primary rounded-top-4" style={{ height: '6px' }} />
              
              <div className="card-body p-5 text-center">
                <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4" style={{ width: '80px', height: '80px' }}>
                  <Award size={40} className="text-primary" />
                </div>

                <h3 className="fw-bold mb-3">Dossier d'Inscription Enregistré !</h3>
                <p className="text-muted mb-4">
                  Félicitations <strong className="text-dark">{prenom} {nom}</strong> ! Votre demande de certification est enregistrée.
                  Toutes les pièces sont en cours d'évaluation par notre équipe.
                </p>

                <div className="bg-light rounded-4 p-4 text-start mb-4">
                  <span className="text-primary fw-bold text-uppercase small mb-3 d-block">Suivi de Validation :</span>

                  <div className="d-flex gap-3 mb-3">
                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '24px', height: '24px' }}>
                      <Check size={14} />
                    </div>
                    <div>
                      <strong className="d-block">1. Justificatifs sauvegardés</strong>
                      <small className="text-muted">CIN et diplôme téléchargés avec succès</small>
                    </div>
                  </div>

                  <div className="d-flex gap-3 mb-3">
                    <div className="bg-warning text-dark rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '24px', height: '24px' }}>
                      <Clock size={14} />
                    </div>
                    <div>
                      <strong className="d-block">2. Vérification administrative</strong>
                      <small className="text-muted">Validation sous 24-48 heures</small>
                    </div>
                  </div>

                  <div className="d-flex gap-3">
                    <div className="bg-secondary bg-opacity-25 text-secondary rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '24px', height: '24px' }}>
                      3
                    </div>
                    <div>
                      <strong className="d-block">3. Activation du profil</strong>
                      <small className="text-muted">Publication dans les résultats de recherche</small>
                    </div>
                  </div>
                </div>

                <button onClick={handleAdminBypass} className="btn btn-primary w-100 py-3 fw-bold rounded-3 mb-2">
                  <Shield size={18} className="me-2" />
                  Accéder à l'espace Admin
                </button>

                <button onClick={() => { onSetRole(Role.Enseignant); setActiveView('simulator'); }} className="btn btn-link text-muted small">
                  Continuer vers l'espace Tuteur
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4 py-md-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-body p-4 p-md-5">
              
              {/* Header */}
              <div className="text-center mb-4">
                <div className="bg-primary bg-opacity-10 rounded-3 d-inline-flex align-items-center justify-content-center p-3 mb-3">
                  <GraduationCap size={32} className="text-primary" />
                </div>
                <h2 className="fw-bold mb-2">Inscription</h2>
                <p className="text-muted small">Rejoignez la plateforme #1 des cours particuliers au Maroc</p>
              </div>

              {/* Role Selection */}
              {step === 1 && (
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <div 
                      onClick={() => setRoleSelection(Role.Etudiant)}
                      className={`border rounded-3 p-3 text-center cursor-pointer transition-all ${roleSelection === Role.Etudiant ? 'border-primary bg-primary bg-opacity-5' : 'border-secondary'}`}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="fs-1 mb-2">🎓</div>
                      <div className="fw-bold">Étudiant</div>
                      <small className="text-muted">Je cherche des cours</small>
                      {roleSelection === Role.Etudiant && <div className="mt-2 text-primary">✓ Sélectionné</div>}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div 
                      onClick={() => setRoleSelection(Role.Enseignant)}
                      className={`border rounded-3 p-3 text-center cursor-pointer transition-all ${roleSelection === Role.Enseignant ? 'border-primary bg-primary bg-opacity-5' : 'border-secondary'}`}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="fs-1 mb-2">👨‍🏫</div>
                      <div className="fw-bold">Enseignant</div>
                      <small className="text-muted">Je donne des cours</small>
                      {roleSelection === Role.Enseignant && <div className="mt-2 text-primary">✓ Sélectionné</div>}
                    </div>
                  </div>
                </div>
              )}

              {/* Progress Steps for Teacher */}
              {roleSelection === Role.Enseignant && (
                <div className="d-flex justify-content-between mb-4 px-2">
                  <div className="text-center flex-grow-1">
                    <div className={`rounded-circle bg-${step >= 1 ? 'primary' : 'secondary'} bg-opacity-${step >= 1 ? '100' : '25'} text-white d-flex align-items-center justify-content-center mx-auto mb-1`} style={{ width: '32px', height: '32px' }}>
                      1
                    </div>
                    <small className={step >= 1 ? 'text-primary fw-bold' : 'text-muted'}>Profil</small>
                  </div>
                  <div className="flex-grow-1 mx-2">
                    <div className="progress rounded-pill" style={{ height: '4px' }}>
                      <div className="progress-bar bg-primary" style={{ width: step >= 2 ? '100%' : '0%' }}></div>
                    </div>
                  </div>
                  <div className="text-center flex-grow-1">
                    <div className={`rounded-circle bg-${step >= 2 ? 'primary' : 'secondary'} bg-opacity-${step >= 2 ? '100' : '25'} text-white d-flex align-items-center justify-content-center mx-auto mb-1`} style={{ width: '32px', height: '32px' }}>
                      2
                    </div>
                    <small className={step >= 2 ? 'text-primary fw-bold' : 'text-muted'}>Documents</small>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {erreur && (
                <div className="alert alert-danger alert-dismissible fade show rounded-3 mb-4" role="alert">
                  <span className="fw-bold">⚠️ {erreur}</span>
                  <button type="button" className="btn-close" onClick={() => setErreur('')}></button>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleRegisterSubmit}>
                
                {/* STEP 1 */}
                {step === 1 && (
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small text-uppercase text-muted">Prénom</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0"><User size={16} className="text-muted" /></span>
                        <input type="text" required value={prenom} onChange={(e) => setPrenom(e.target.value)} className="form-control border-start-0" placeholder="Marwa" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small text-uppercase text-muted">Nom</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0"><User size={16} className="text-muted" /></span>
                        <input type="text" required value={nom} onChange={(e) => setNom(e.target.value)} className="form-control border-start-0" placeholder="Benani" />
                      </div>
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold small text-uppercase text-muted">Email</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0"><Mail size={16} className="text-muted" /></span>
                        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="form-control border-start-0" placeholder="marwa@example.com" />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold small text-uppercase text-muted">Téléphone</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0"><Phone size={16} className="text-muted" /></span>
                        <input type="tel" required value={telephone} onChange={(e) => setTelephone(e.target.value)} className="form-control border-start-0" placeholder="+212 6XX XXX XXX" />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold small text-uppercase text-muted">Ville</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0"><MapPin size={16} className="text-muted" /></span>
                        <select value={ville} onChange={(e) => setVille(e.target.value)} className="form-select border-start-0">
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
                      <label className="form-label fw-semibold small text-uppercase text-muted">Mot de passe</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0"><Lock size={16} className="text-muted" /></span>
                        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="form-control border-start-0" placeholder="Min. 6 caractères" />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold small text-uppercase text-muted">Confirmer</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0"><Lock size={16} className="text-muted" /></span>
                        <input type="password" required value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} className="form-control border-start-0" placeholder="Confirmer le mot de passe" />
                      </div>
                    </div>

                    {roleSelection === Role.Enseignant && (
                      <>
                        <div className="col-md-7">
                          <label className="form-label fw-semibold small text-uppercase text-muted">Matière</label>
                          <div className="input-group">
                            <span className="input-group-text bg-light border-end-0"><BookOpen size={16} className="text-muted" /></span>
                            <select required value={matiere} onChange={(e) => setMatiere(e.target.value)} className="form-select border-start-0">
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
                          <label className="form-label fw-semibold small text-uppercase text-muted">Tarif (DH/h)</label>
                          <div className="input-group">
                            <span className="input-group-text bg-light border-end-0"><DollarSign size={16} className="text-muted" /></span>
                            <input type="number" required value={tarifHeure} onChange={(e) => setTarifHeure(e.target.value)} className="form-control border-start-0" min="50" />
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
                      <button type="submit" className="btn btn-primary w-100 py-2 fw-bold rounded-3">
                        {roleSelection === Role.Etudiant ? "Créer mon compte →" : "Continuer vers les documents →"}
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2 - Documents (Teacher only) */}
                {step === 2 && roleSelection === Role.Enseignant && (
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label fw-semibold small text-uppercase text-muted">Intitulé du diplôme</label>
                      <input type="text" required value={diplomeTitle} onChange={(e) => setDiplomeTitle(e.target.value)} className="form-control" placeholder="Master en ..." />
                    </div>

                    <div className="col-md-6">
                      <div className="border rounded-3 p-3 text-center bg-light">
                        <UploadCloud size={32} className="text-primary mx-auto mb-2 d-block" />
                        <strong className="d-block small">CIN Recto</strong>
                        {cinRectoFile ? (
                          <span className="badge bg-success mt-2">✓ {cinRectoFile}</span>
                        ) : (
                          <button type="button" onClick={() => simulateUpload('recto')} className="btn btn-primary btn-sm mt-2" disabled={uploadingRecto}>
                            {uploadingRecto ? "Upload..." : "Simuler téléversement"}
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="border rounded-3 p-3 text-center bg-light">
                        <UploadCloud size={32} className="text-primary mx-auto mb-2 d-block" />
                        <strong className="d-block small">CIN Verso</strong>
                        {cinVersoFile ? (
                          <span className="badge bg-success mt-2">✓ {cinVersoFile}</span>
                        ) : (
                          <button type="button" onClick={() => simulateUpload('verso')} className="btn btn-primary btn-sm mt-2" disabled={uploadingVerso}>
                            {uploadingVerso ? "Upload..." : "Simuler téléversement"}
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="border rounded-3 p-3 text-center bg-light">
                        <UploadCloud size={32} className="text-primary mx-auto mb-2 d-block" />
                        <strong className="d-block small">Diplôme (PDF)</strong>
                        {diplomeFile ? (
                          <span className="badge bg-success mt-2">✓ {diplomeFile}</span>
                        ) : (
                          <button type="button" onClick={() => simulateUpload('diplome')} className="btn btn-primary btn-sm mt-2" disabled={uploadingDiplome}>
                            {uploadingDiplome ? "Upload..." : "Simuler téléversement"}
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="col-12 mt-3">
                      <div className="d-flex gap-3">
                        <button type="button" onClick={() => setStep(1)} className="btn btn-outline-secondary flex-grow-1 py-2 rounded-3">
                          Retour
                        </button>
                        <button type="submit" disabled={!cinRectoFile || !cinVersoFile || !diplomeFile} className="btn btn-primary flex-grow-1 py-2 rounded-3">
                          Soumettre mon dossier →
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
                  <button onClick={() => setActiveView('login')} className="btn btn-link p-0 text-primary fw-bold text-decoration-none">
                    Se connecter
                  </button>
                </small>
              </div>

            </div>
          </div>
        </div>
      </div>

      <style>{`
        .cursor-pointer {
          cursor: pointer;
        }
        .transition-all {
          transition: all 0.2s ease;
        }
        .btn-primary {
          background-color: #0d6efd !important;
          border-color: #0d6efd !important;
        }
        .btn-primary:hover {
          background-color: #0b5ed7 !important;
          border-color: #0b5ed7 !important;
          transform: translateY(-1px);
        }
        .bg-primary {
          background-color: #0d6efd !important;
        }
        .text-primary {
          color: #0d6efd !important;
        }
        .border-primary {
          border-color: #0d6efd !important;
        }
        .progress-bar {
          background-color: #0d6efd !important;
        }
      `}</style>
    </div>
  );
}