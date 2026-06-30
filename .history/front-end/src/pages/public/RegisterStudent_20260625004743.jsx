import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../../api/axios'

const CITIES = ['Casablanca', 'Rabat', 'Marrakech', 'Tanger', 'Agadir', 'Fès', 'Meknès', 'Oujda', 'Kénitra', 'Tétouan', 'Salé', 'Mohammedia', 'Nador']
const NIVEAUX = ['Primaire', 'Collège', 'Lycée - Tronc Commun', 'Lycée - 1ère Bac', 'Lycée - 2ème Bac', 'CPGE', 'Université', 'Adulte / Formation Continue']

export default function RegisterStudent() {
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [errors, setErrors] = useState({})

  const [form, setForm] = useState({
    prenom: '',
    nom: '',
    email: '',
    password: '',
    password_confirmation: '',
    telephone: '',
    ville: '',
    niveau: '',
    budget: '',
  })

  function handleChange(e) {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  function validateStep1() {
    const newErrors = {}
    if (form.prenom.trim().length < 3) newErrors.prenom = 'Minimum 3 caractères'
    if (form.nom.trim().length < 3) newErrors.nom = 'Minimum 3 caractères'
    if (!form.email.includes('@')) newErrors.email = 'Email invalide'
    if (form.password.length < 8) newErrors.password = 'Minimum 8 caractères'
    if (form.password !== form.password_confirmation) newErrors.password_confirmation = 'Les mots de passe ne correspondent pas'
    if (!form.telephone.trim()) newErrors.telephone = 'Téléphone requis'
    if (!form.ville) newErrors.ville = 'Ville requise'
    return newErrors
  }

  function validateStep2() {
    const newErrors = {}
    if (!form.niveau) newErrors.niveau = 'Niveau requis'
    if (!form.budget || Number(form.budget) < 0) newErrors.budget = 'Budget invalide'
    return newErrors
  }

  function handleNext() {
    const v = validateStep1()
    setErrors(v)
    if (Object.keys(v).length === 0) {
      setStep(2)
    }
  }

  function handleBack() {
    setStep(1)
  }

  async function handleSubmit(e) {
    e.preventDefault()

    const v = validateStep2()
    setErrors(v)
    if (Object.keys(v).length > 0) return

    setLoading(true)
    setError('')

    try {
      const data = {
        nom: form.nom,
        prenom: form.prenom,
        email: form.email,
        password: form.password,
        password_confirmation: form.password_confirmation,
        telephone: form.telephone,
        ville: form.ville,
        role: 'etudiant',
        niveau: form.niveau,
        budget: form.budget,
      }

      const res = await api.post('/register', data)

      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      navigate('/student')

    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message)
      } else {
        setError('Une erreur est survenue, veuillez réessayer.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="register-container">
      <h2>Inscription Étudiant</h2>

      <div className="steps-indicator">
        <span className={step === 1 ? 'active' : ''}>1. Identité & Compte</span>
        <span className={step === 2 ? 'active' : ''}>2. Niveau & Budget</span>
      </div>

      <form onSubmit={handleSubmit}>

        {error && <p className="error-message">{error}</p>}

        {/* ETAPE 1 */}
        {step === 1 && (
          <div>
            <label>Prénom</label>
            <input type="text" name="prenom" value={form.prenom} onChange={handleChange} />
            {errors.prenom && <p className="error-text">{errors.prenom}</p>}

            <label>Nom</label>
            <input type="text" name="nom" value={form.nom} onChange={handleChange} />
            {errors.nom && <p className="error-text">{errors.nom}</p>}

            <label>Adresse Email</label>
            <input type="email" name="email" placeholder="votre.email@domain.ma" value={form.email} onChange={handleChange} />
            {errors.email && <p className="error-text">{errors.email}</p>}

            <label>Téléphone</label>
            <input type="text" name="telephone" value={form.telephone} onChange={handleChange} />
            {errors.telephone && <p className="error-text">{errors.telephone}</p>}

            <label>Mot de passe</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} />
            {errors.password && <p className="error-text">{errors.password}</p>}

            <label>Confirmer le mot de passe</label>
            <input type="password" name="password_confirmation" value={form.password_confirmation} onChange={handleChange} />
            {errors.password_confirmation && <p className="error-text">{errors.password_confirmation}</p>}

            <label>Ville</label>
            <select name="ville" value={form.ville} onChange={handleChange}>
              <option value="">-- Sélectionner --</option>
              {CITIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {errors.ville && <p className="error-text">{errors.ville}</p>}

            <button type="button" onClick={handleNext}>Continuer</button>
          </div>
        )}

        {/* ETAPE 2 */}
        {step === 2 && (
          <div>
            <label>Niveau scolaire</label>
            <select name="niveau" value={form.niveau} onChange={handleChange}>
              <option value="">-- Sélectionner --</option>
              {NIVEAUX.map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
            {errors.niveau && <p className="error-text">{errors.niveau}</p>}

            <label>Budget par heure (MAD)</label>
            <input type="number" name="budget" value={form.budget} onChange={handleChange} />
            {errors.budget && <p className="error-text">{errors.budget}</p>}

            <div className="recap">
              <p>Récapitulatif :</p>
              <p>{form.prenom} {form.nom} — {form.email}</p>
              <p>{form.ville} — {form.telephone}</p>
            </div>

            <button type="button" onClick={handleBack}>Retour</button>
            <button type="submit" disabled={loading}>
              {loading ? 'Création...' : 'Créer mon compte'}
            </button>
          </div>
        )}

      </form>

      <p>
        Déjà un compte ? <Link to="/login">Se connecter</Link>
      </p>
    </div>
  )
}