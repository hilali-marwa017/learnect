import React, { useState } from 'react';

function RegisterEnseignant(props) {
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    password_confirmation: '',
    telephone: '',
    ville: '',
    role: 'enseignant'
  });

  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    
    // Validation simple
    const newErrors = {};
    if (!form.nom || form.nom.length < 3) newErrors.nom = 'Nom min 3 caractères';
    if (!form.prenom || form.prenom.length < 3) newErrors.prenom = 'Prénom min 3 caractères';
    if (!form.email || !form.email.includes('@')) newErrors.email = 'Email invalide';
    if (!form.password || form.password.length < 8) newErrors.password = 'Mot de passe min 8 caractères';
    if (form.password !== form.password_confirmation) newErrors.password_confirmation = 'Les mots de passe ne correspondent pas';
    if (!form.telephone) newErrors.telephone = 'Téléphone requis';
    if (!form.ville) newErrors.ville = 'Ville requise';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Appel API
    props.onRegister(form);
  }

  return (
    <div className="min-vh-100 bg-light py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-6 col-lg-5">
            
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4 p-md-5">
                
                <div className="text-center mb-4">
                  <h2 className="fw-bold text-dark">Devenir tuteur</h2>
                  <p className="text-secondary small">Rejoignez Learnect.ma et partagez votre savoir</p>
                </div>

                <form onSubmit={handleSubmit}>
                  
                  <div className="row g-3">
                    
                    <div className="col-6">
                      <label className="form-label small fw-bold text-dark">Nom</label>
                      <input
                        type="text"
                        name="nom"
                        value={form.nom}
                        onChange={handleChange}
                        className={`form-control ${errors.nom ? 'is-invalid' : ''}`}
                        placeholder="Votre nom"
                      />
                      {errors.nom && <div className="invalid-feedback small">{errors.nom}</div>}
                    </div>

                    <div className="col-6">
                      <label className="form-label small fw-bold text-dark">Prénom</label>
                      <input
                        type="text"
                        name="prenom"
                        value={form.prenom}
                        onChange={handleChange}
                        className={`form-control ${errors.prenom ? 'is-invalid' : ''}`}
                        placeholder="Votre prénom"
                      />
                      {errors.prenom && <div className="invalid-feedback small">{errors.prenom}</div>}
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-bold text-dark">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        placeholder="exemple@email.com"
                      />
                      {errors.email && <div className="invalid-feedback small">{errors.email}</div>}
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-bold text-dark">Téléphone</label>
                      <input
                        type="text"
                        name="telephone"
                        value={form.telephone}
                        onChange={handleChange}
                        className={`form-control ${errors.telephone ? 'is-invalid' : ''}`}
                        placeholder="06 XX XX XX XX"
                      />
                      {errors.telephone && <div className="invalid-feedback small">{errors.telephone}</div>}
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-bold text-dark">Ville</label>
                      <input
                        type="text"
                        name="ville"
                        value={form.ville}
                        onChange={handleChange}
                        className={`form-control ${errors.ville ? 'is-invalid' : ''}`}
                        placeholder="Casablanca, Rabat..."
                      />
                      {errors.ville && <div className="invalid-feedback small">{errors.ville}</div>}
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-bold text-dark">Mot de passe</label>
                      <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        placeholder="Min 8 caractères"
                      />
                      {errors.password && <div className="invalid-feedback small">{errors.password}</div>}
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-bold text-dark">Confirmer le mot de passe</label>
                      <input
                        type="password"
                        name="password_confirmation"
                        value={form.password_confirmation}
                        onChange={handleChange}
                        className={`form-control ${errors.password_confirmation ? 'is-invalid' : ''}`}
                        placeholder="Répétez le mot de passe"
                      />
                      {errors.password_confirmation && <div className="invalid-feedback small">{errors.password_confirmation}</div>}
                    </div>

                    <div className="col-12">
                      <button type="submit" className="btn btn-primary w-100 fw-bold py-2">
                        S'inscrire comme enseignant
                      </button>
                    </div>

                  </div>
                </form>

                <div className="text-center mt-3">
                  <p className="small text-secondary mb-0">
                    Déjà membre ? <button onClick={() => props.onSetActiveView('login')} className="btn btn-link p-0 text-primary fw-bold text-decoration-none">Se connecter</button>
                  </p>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterEnseignant;