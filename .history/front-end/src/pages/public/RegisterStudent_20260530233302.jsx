import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function RegisterStudent() {
  const navigate = useNavigate()
  const { register } = useAuth()

  const [formulaire, setFormulaire] = useState({
    prenom: '', nom: '', email: '', telephone: '',
    ville: '', password: '', password_confirmation: ''
  })
  const [erreur, setErreur] = useState('')
  const [chargement, setChargement] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setFormulaire({ ...formulaire, [name]: value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErreur('')

    if (formulaire.password !== formulaire.password_confirmation) {
      setErreur('Les mots de passe ne correspondent pas')
      return
    }
    if (formulaire.password.length < 8) {
      setErreur('Le mot de passe doit contenir au moins 8 caractères')
      return
    }

    setChargement(true)
    try {
      await register({ ...formulaire, role: 'etudiant' })
      navigate('/etudiant/dashboard')
    } catch (err) {
      setErreur(err.response?.data?.message || "Erreur lors de l'inscription")
    } finally {
      setChargement(false)
    }
  }

  return (
    <div className="page-auth" style={{ alignItems: 'flex-start', paddingTop: '40px' }}>
      <div style={{ width: '100%', maxWidth: '560px' }}>

        <Link to="/register" className="d-inline-flex align-items-center gap-2 text-secondary fw-medium mb-4" style={{ fontSize: '14px' }}>
          ← Retour au choix du profil
        </Link>

        <div className="carte-auth" style={{ maxWidth: '560px' }}>

          {/* Header */}
          <div className="text-center mb-4">
            <div className="logo-auth">🧑‍🎓</div>
            <h3 style={{ fontFamily: 'var(--police-titre)' }}>Inscription Élève</h3>
            <p className="text-secondary small mt-1">Trouvez le professeur idéal</p>
          </div>

          {erreur && (
            <div className="alert alert-danger d-flex align-items-center gap-2 py-2 mb-3">
              <i className="bi bi-exclamation-triangle-fill"></i>
              <span>{erreur}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="row g-3">

              <div className="col-6">
                <label className="form-label">Prénom</label>
                <input type="text" name="prenom" className="form-control" onChange={handleChange} required />
              </div>
              <div className="col-6">
                <label className="form-label">Nom</label>
                <input type="text" name="nom" className="form-control" onChange={handleChange} required />
              </div>

              <div className="col-12">
                <label className="form-label">Email</label>
                <input type="email" name="email" className="form-control" onChange={handleChange} required />
              </div>

              <div className="col-6">
                <label className="form-label">Téléphone</label>
                <input type="tel" name="telephone" className="form-control" placeholder="06XXXXXXXX" onChange={handleChange} required />
              </div>
              <div className="col-6">
                <label className="form-label">Ville</label>
                <select name="ville" className="form-select" onChange={handleChange} required>
                  <option value="">Choisir...</option>
                  {['Casablanca', 'Rabat', 'Marrakech', 'Tanger', 'Fès', 'Agadir', 'Meknès', 'Oujda'].map(v => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </div>

              <div className="col-6">
                <label className="form-label">Mot de passe</label>
                <input type="password" name="password" className="form-control" placeholder="8 caractères min." onChange={handleChange} required />
              </div>
              <div className="col-6">
                <label className="form-label">Confirmer</label>
                <input type="password" name="password_confirmation" className="form-control" placeholder="••••••••" onChange={handleChange} required />
              </div>

              <div className="col-12">
                <div className="form-check">
                  <input type="checkbox" className="form-check-input" id="cgv" required />
                  <label className="form-check-label small text-secondary" htmlFor="cgv">
                    J'accepte les{' '}
                    <span className="text-primary fw-bold" style={{ cursor: 'pointer' }}>conditions générales d'utilisation</span>
                  </label>
                </div>
              </div>

              <div className="col-12 mt-2">
                <button type="submit" className="btn btn-primary w-100 fw-bold py-2" disabled={chargement} style={{ borderRadius: '10px', fontSize: '15px' }}>
                  {chargement
                    ? <><span className="spinner-border spinner-border-sm me-2"></span>Création...</>
                    : <><i className="bi bi-person-check me-2"></i>Créer mon compte élève</>
                  }
                </button>
              </div>
            </div>
          </form>

          <div className="text-center mt-3 pt-3 border-top">
            <small className="text-secondary">
              Déjà inscrit ?{' '}
              <Link to="/login" className="text-primary fw-bold">Se connecter</Link>
            </small>
          </div>

        </div>
      </div>
    </div>
  )
}