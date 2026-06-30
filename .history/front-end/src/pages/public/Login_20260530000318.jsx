import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [formulaire, setFormulaire] = useState({ email: '', password: '' })
  const [erreur, setErreur] = useState('')
  const [chargement, setChargement] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setFormulaire({ ...formulaire, [name]: value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErreur('')
    setChargement(true)
    try {
      const utilisateur = await login(formulaire)
      // Redirection selon rôle
      if (utilisateur.role === 'admin') navigate('/admin/dashboard')
      else if (utilisateur.role === 'enseignant') navigate('/enseignant/dashboard')
      else navigate('/etudiant/dashboard')
    } catch (err) {
      setErreur(err.response?.data?.message || 'Email ou mot de passe incorrect')
    } finally {
      setChargement(false)
    }
  }

  return (
    <div className="page-auth">
      <div style={{ width: '100%', maxWidth: '440px' }}>

        {/* Retour */}
        <Link to="/" className="d-inline-flex align-items-center gap-2 text-secondary fw-medium mb-4" style={{ fontSize: '14px' }}>
          ← Retour à l'accueil
        </Link>

        <div className="carte-auth">

          {/* Header */}
          <div className="text-center mb-4">
            <div className="logo-auth">🎓</div>
            <h2 style={{ fontFamily: 'var(--police-titre)', fontSize: '24px' }}>
              Connexion
            </h2>
            <p className="text-secondary small mt-1">
              Accédez à votre espace Learnect.ma
            </p>
          </div>

          {/* Erreur */}
          {erreur && (
            <div className="alert alert-danger d-flex align-items-center gap-2 py-2 mb-3">
              <i className="bi bi-exclamation-triangle-fill"></i>
              <span>{erreur}</span>
            </div>
          )}

          {/* Formulaire */}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0" style={{ borderRadius: '10px 0 0 10px' }}>
                  <i className="bi bi-envelope text-secondary"></i>
                </span>
                <input
                  type="email"
                  name="email"
                  className="form-control border-start-0"
                  placeholder="exemple@email.com"
                  value={formulaire.email}
                  onChange={handleChange}
                  required
                  style={{ borderRadius: '0 10px 10px 0' }}
                />
              </div>
            </div>

            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <label className="form-label mb-0">Mot de passe</label>
                <button type="button" className="btn btn-link p-0 small fw-bold" style={{ fontSize: '12px' }}>
                  Mot de passe oublié ?
                </button>
              </div>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0" style={{ borderRadius: '10px 0 0 10px' }}>
                  <i className="bi bi-lock text-secondary"></i>
                </span>
                <input
                  type="password"
                  name="password"
                  className="form-control border-start-0"
                  placeholder="••••••••"
                  value={formulaire.password}
                  onChange={handleChange}
                  required
                  style={{ borderRadius: '0 10px 10px 0' }}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 fw-bold py-2"
              disabled={chargement}
              style={{ borderRadius: '10px', fontSize: '15px' }}
            >
              {chargement
                ? <><span className="spinner-border spinner-border-sm me-2"></span>Connexion...</>
                : <><i className="bi bi-box-arrow-in-right me-2"></i>Se connecter</>
              }
            </button>
          </form>

          {/* Séparateur */}
          <div className="d-flex align-items-center gap-3 my-4">
            <div className="flex-grow-1" style={{ height: '1px', background: 'var(--bordure)' }}></div>
            <span className="text-secondary" style={{ fontSize: '12px', fontWeight: '600' }}>NOUVEAU ?</span>
            <div className="flex-grow-1" style={{ height: '1px', background: 'var(--bordure)' }}></div>
          </div>

          {/* Boutons inscription */}
          <div className="d-flex flex-column gap-2">
            <Link to="/register/etudiant" className="btn btn-outline-primary fw-bold" style={{ borderRadius: '10px' }}>
              <i className="bi bi-person-plus me-2"></i>Créer un compte élève
            </Link>
            <Link to="/register/enseignant" className="btn btn-outline-secondary fw-bold" style={{ borderRadius: '10px' }}>
              <i className="bi bi-mortarboard me-2"></i>Devenir tuteur
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}