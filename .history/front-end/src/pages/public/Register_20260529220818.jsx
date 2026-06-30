import React, { useState } from 'react';

function Register(props) {
  const [isEnseignant, setIsEnseignant] = useState(false);
  const [form, setForm] = useState({
    // Étape 1 (Commun)
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    ville: '',
    password: '',
    password_confirmation: '',
    // Étape 2 (Enseignant seulement)
    matiere: '',
    tarif: '',
    diplome: null,
    experience: '',
    description: '',
    // Rôle
    role: 'etudiant'
  });

  const [etape, setEtape] = useState(1);
  const [erreur, setErreur] = useState('');
  const [succes, setSucces] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  function handleFileChange(e) {
    const { name, files } = e.target;
    setForm({ ...form, [name]: files[0] });
  }

  function handleRoleChange(e) {
    const role = e.target.value;
    setIsEnseignant(role === 'enseignant');
    setForm({ ...form, role: role });
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

    // Pour les enseignants, vérifier la description
    if (isEnseignant && etape === 3 && !form.description) {
      setErreur('Veuillez compléter votre description');
      return;
    }

    // Sauvegarde locale dans l'état global du parent (App.js)
    props.onAjouterUtilisateur(form);
    
    // Redirection selon le rôle
    if (form.role === 'enseignant') {
      props.onNavigate('teacher-dashboard');
    } else {
      props.onNavigate('student-dashboard');
    }
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          
          {/* Choice de rôle au début */}
          {etape === 1 && (
            <div className="mb-4">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                  <label className="form-label fw-bold mb-3">Je m'inscris en tant que :</label>
                  <div className="d-flex gap-3">
                    <div className="flex-grow-1">
                      <input 
                        type="radio" 
                        name="role" 
                        value="etudiant" 
                        id="roleEtudiant"
                        checked={form.role === 'etudiant'}
                        onChange={handleRoleChange}
                        className="btn-check"
                      />
                      <label htmlFor="roleEtudiant" className="btn btn-outline-primary w-100 py-3" style={{ borderRadius: '12px' }}>
                        <div className="fs-2 mb-2">🎓</div>
                        <div className="fw-bold">Étudiant</div>
                        <small>Je cherche des cours particuliers</small>
                      </label>
                    </div>
                    <div className="flex-grow-1">
                      <input 
                        type="radio" 
                        name="role" 
                        value="enseignant" 
                        id="roleEnseignant"
                        checked={form.role === 'enseignant'}
                        onChange={handleRoleChange}
                        className="btn-check"
                      />
                      <label htmlFor="roleEnseignant" className="btn btn-outline-primary w-100 py-3" style={{ borderRadius: '12px' }}>
                        <div className="fs-2 mb-2">👨‍🏫</div>
                        <div className="fw-bold">Enseignant</div>
                        <small>Je donne des cours particuliers</small>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Progress Steps */}
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center">
              <div className="text-center flex-grow-1">
                <div className={`rounded-circle bg-${etape >= 1 ? 'primary' : 'secondary'} text-white d-inline-flex align-items-center justify-content-center mb-2`} 
                     style={{ width: '40px', height: '40px' }}>
                  1
                </div>
                <div className="small fw-bold">Profil</div>
              </div>
              {isEnseignant && (
                <>
                  <div className="flex-grow-1 mx-2">
                    <div className="progress" style={{ height: '4px' }}>
                      <div className="progress-bar bg-primary" role="progressbar" 
                           style={{ width: etape >= 2 ? '100%' : '0%' }}></div>
                    </div>
                  </div>
                  <div className="text-center flex-grow-1">
                    <div className={`rounded-circle bg-${etape >= 2 ? 'primary' : 'secondary'} text-white d-inline-flex align-items-center justify-content-center mb-2`}
                         style={{ width: '40px', height: '40px' }}>
                      2
                    </div>
                    <div className="small fw-bold">Profil Pro</div>
                  </div>
                  <div className="flex-grow-1 mx-2">
                    <div className="progress" style={{ height: '4px' }}>
                      <div className="progress-bar bg-primary" role="progressbar"
                           style={{ width: etape >= 3 ? '100%' : '0%' }}></div>
                    </div>
                  </div>
                  <div className="text-center flex-grow-1">
                    <div className={`rounded-circle bg-${etape >= 3 ? 'primary' : 'secondary'} text-white d-inline-flex align-items-center justify-content-center mb-2`}
                         style={{ width: '40px', height: '40px' }}>
                      3
                    </div>
                    <div className="small fw-bold">Validation</div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Formulaire Card */}
          <div className="card border-0 shadow-lg" style={{ borderRadius: '20px' }}>
            <div className="card-body p-5">
              
              {erreur && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {erreur}
                  <button type="button" className="btn-close" onClick={() => setErreur('')}></button>
                </div>
              )}

              <form onSubmit={handleNext}>
                
                {/* ÉTAPE 1 : Profil Général */}
                {etape === 1 && (
                  <div className="fade-in">
                    <h3 className="h4 mb-4 fw-bold">
                      <span className="text-primary">📝 Créer mon compte</span>
                    </h3>
                    
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-semibold">Nom *</label>
                        <input 
                          type="text" 
                          name="nom" 
                          value={form.nom} 
                          onChange={handleChange} 
                          className="form-control form-control-lg"
                          placeholder="Ex: Benani"
                          required 
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-semibold">Prénom *</label>
                        <input 
                          type="text" 
                          name="prenom" 
                          value={form.prenom} 
                          onChange={handleChange} 
                          className="form-control form-control-lg"
                          placeholder="Ex: Marwa"
                          required 
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">Adresse Email *</label>
                      <input 
                        type="email" 
                        name="email" 
                        value={form.email} 
                        onChange={handleChange} 
                        className="form-control form-control-lg"
                        placeholder="marwa.benani@example.com"
                        required 
                      />
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-semibold">Téléphone (WhatsApp) *</label>
                        <input 
                          type="tel" 
                          name="telephone" 
                          value={form.telephone} 
                          onChange={handleChange} 
                          className="form-control form-control-lg"
                          placeholder="+212 6XX XXX XXX"
                          required 
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-semibold">Ville *</label>
                        <select 
                          name="ville" 
                          value={form.ville} 
                          onChange={handleChange} 
                          className="form-select form-select-lg"
                          required
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

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-semibold">Mot de passe *</label>
                        <input 
                          type="password" 
                          name="password" 
                          value={form.password} 
                          onChange={handleChange} 
                          className="form-control form-control-lg"
                          placeholder="Min. 6 caractères"
                          required 
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-semibold">Confirmer *</label>
                        <input 
                          type="password" 
                          name="password_confirmation" 
                          value={form.password_confirmation} 
                          onChange={handleChange} 
                          className="form-control form-control-lg"
                          required 
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ÉTAPE 2 : Justificatifs Pro (Enseignant seulement) */}
                {isEnseignant && etape === 2 && (
                  <div className="fade-in">
                    <h3 className="h4 mb-4 fw-bold">
                      <span className="text-primary">📂 Informations professionnelles</span>
                    </h3>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">Matière d'enseignement *</label>
                      <select 
                        name="matiere" 
                        value={form.matiere} 
                        onChange={handleChange} 
                        className="form-select form-select-lg"
                        required
                      >
                        <option value="">Sélectionner une discipline...</option>
                        <option>Mathématiques</option>
                        <option>Physique-Chimie</option>
                        <option>SVT</option>
                        <option>Français</option>
                        <option>Anglais</option>
                        <option>Arabe</option>
                        <option>Informatique</option>
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">Tarif horaire (DH) *</label>
                      <input 
                        type="number" 
                        name="tarif" 
                        value={form.tarif} 
                        onChange={handleChange} 
                        className="form-control form-control-lg"
                        placeholder="Ex: 150"
                        min="50"
                        required 
                      />
                      <small className="text-muted">Tarif minimum : 50 DH</small>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">Années d'expérience</label>
                      <select 
                        name="experience" 
                        value={form.experience} 
                        onChange={handleChange} 
                        className="form-select form-select-lg"
                      >
                        <option value="">Sélectionnez votre expérience</option>
                        <option>Moins d'1 an</option>
                        <option>1-3 ans</option>
                        <option>3-5 ans</option>
                        <option>5-10 ans</option>
                        <option>Plus de 10 ans</option>
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">Diplôme (PDF ou JPG) *</label>
                      <input 
                        type="file" 
                        name="diplome" 
                        onChange={handleFileChange} 
                        className="form-control form-control-lg"
                        accept=".pdf,.jpg,.jpeg,.png"
                        required 
                      />
                      <small className="text-muted">Format accepté : PDF, JPG, PNG (Max 5MB)</small>
                    </div>

                    <div className="form-check mb-3">
                      <input 
                        type="checkbox" 
                        className="form-check-input" 
                        id="certification"
                        required
                      />
                      <label className="form-check-label" htmlFor="certification">
                        Je certifie sur l'honneur l'exactitude des pièces fournies
                      </label>
                    </div>
                  </div>
                )}

                {/* ÉTAPE 3 : Validation (Enseignant seulement) */}
                {isEnseignant && etape === 3 && (
                  <div className="fade-in">
                    <h3 className="h4 mb-4 fw-bold">
                      <span className="text-primary">✅ Validation du dossier</span>
                    </h3>

                    <div className="alert alert-info">
                      <i className="bi bi-info-circle-fill me-2"></i>
                      Dernière étape avant de devenir tuteur !
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">Description personnelle *</label>
                      <textarea 
                        name="description" 
                        value={form.description} 
                        onChange={handleChange} 
                        className="form-control"
                        rows="4"
                        placeholder="Présentez-vous, votre parcours, votre méthode d'enseignement..."
                        required
                      ></textarea>
                    </div>

                    <div className="bg-light p-3 rounded mb-3">
                      <h6 className="fw-bold mb-3">Récapitulatif :</h6>
                      <div className="row small">
                        <div className="col-md-6"><strong>Nom :</strong> {form.nom} {form.prenom}</div>
                        <div className="col-md-6"><strong>Email :</strong> {form.email}</div>
                        <div className="col-md-6"><strong>Ville :</strong> {form.ville}</div>
                        <div className="col-md-6"><strong>Matière :</strong> {form.matiere}</div>
                        <div className="col-md-6"><strong>Tarif :</strong> {form.tarif} DH/h</div>
                        <div className="col-md-6"><strong>Expérience :</strong> {form.experience || 'Non précisée'}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Boutons de navigation */}
                <div className="d-flex justify-content-between mt-4">
                  {etape > 1 && (
                    <button 
                      type="button" 
                      onClick={() => setEtape(etape - 1)}
                      className="btn btn-outline-secondary btn-lg px-4"
                    >
                      ← Retour
                    </button>
                  )}
                  
                  <button 
                    type="submit" 
                    className="btn btn-primary btn-lg px-5 ms-auto"
                  >
                    {etape === 1 && !isEnseignant 
                      ? "✓ S'inscrire" 
                      : etape === 3 || (etape === 1 && !isEnseignant)
                        ? "✓ Finaliser mon inscription"
                        : "Suivant →"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Lien connexion */}
          <div className="text-center mt-4">
            <p className="text-muted">
              Déjà un compte ? 
              <button 
                onClick={() => props.onNavigate('login')}
                className="btn btn-link text-primary fw-bold"
              >
                Se connecter
              </button>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .fade-in {
          animation: fadeIn 0.3s ease-in;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .form-control:focus, .form-select:focus {
          border-color: #0d6efd;
          box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.15);
        }
        
        .btn-primary {
          background: #0d6efd;
          border: none;
          transition: all 0.2s ease;
        }
        
        .btn-primary:hover {
          background: #0b5ed7;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(13, 110, 253, 0.25);
        }
        
        .btn-outline-primary {
          transition: all 0.2s ease;
        }
        
        .btn-outline-primary:hover {
          transform: translateY(-1px);
        }
        
        .progress-bar {
          transition: width 0.3s ease;
        }
      `}</style>
    </div>
  );
}

export default Register