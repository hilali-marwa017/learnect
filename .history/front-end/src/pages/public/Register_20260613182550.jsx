import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { Mail, Lock, User, Phone, MapPin, ArrowLeft, Upload } from 'lucide-react'

export default function Register() {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    password_confirmation: '',
    telephone: '',
    ville: '',
    role: 'etudiant',
  })
  const [documents, setDocuments] = useState({
    cin_recto: null,
    cin_verso: null,
    diplome: null,
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    setDocuments({ ...documents, [e.target.name]: e.target.files[0] })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = new FormData()
      Object.keys(formData).forEach(key => data.append(key, formData[key]))
      
      if (formData.role === 'enseignant') {
        if (documents.cin_recto) data.append('cin_recto', documents.cin_recto)
        if (documents.cin_verso) data.append('cin_verso', documents.cin_verso)
        if (documents.diplome) data.append('diplome', documents.diplome)
      }

      const user = await register(data)
      if (user.role === 'admin') navigate('/admin/dashboard')
      else if (user.role === 'enseignant') navigate('/enseignant/dashboard')
      else navigate('/etudiant/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || Object.values(err.response?.data?.errors || {}).flat().join(', ') || 'Erreur lors de l\'inscription')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-charcoal hover:text-ink mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Retour à l'accueil
        </Link>

        <div className="bg-surface-card border border-hairline-strong rounded-2xl p-8 shadow-lg">
          <h1 className="text-2xl font-black text-ink mb-2">Inscription</h1>
          <p className="text-sm text-charcoal mb-6">Créez votre compte pour commencer.</p>

          {error && (
            <div className="bg-accent-red/10 border border-accent-red/30 text-accent-red text-sm px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-ash uppercase tracking-wider mb-1.5">Nom</label>
                <input type="text" name="nom" value={formData.nom} onChange={handleChange} required
                  className="w-full px-4 py-3 bg-surface-deep border border-hairline rounded-lg text-sm text-ink focus:outline-none focus:border-accent-orange" />
              </div>
              <div>
                <label className="block text-xs font-bold text-ash uppercase tracking-wider mb-1.5">Prénom</label>
                <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} required
                  className="w-full px-4 py-3 bg-surface-deep border border-hairline rounded-lg text-sm text-ink focus:outline-none focus:border-accent-orange" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-ash uppercase tracking-wider mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-mute" />
                <input type="email" name="email" value={formData.email} onChange={handleChange} required
                  className="w-full pl-10 pr-4 py-3 bg-surface-deep border border-hairline rounded-lg text-sm text-ink focus:outline-none focus:border-accent-orange" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-ash uppercase tracking-wider mb-1.5">Mot de passe</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required minLength={8}
                  className="w-full px-4 py-3 bg-surface-deep border border-hairline rounded-lg text-sm text-ink focus:outline-none focus:border-accent-orange" />
              </div>
              <div>
                <label className="block text-xs font-bold text-ash uppercase tracking-wider mb-1.5">Confirmation</label>
                <input type="password" name="password_confirmation" value={formData.password_confirmation} onChange={handleChange} required
                  className="w-full px-4 py-3 bg-surface-deep border border-hairline rounded-lg text-sm text-ink focus:outline-none focus:border-accent-orange" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-ash uppercase tracking-wider mb-1.5">Téléphone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-mute" />
                  <input type="tel" name="telephone" value={formData.telephone} onChange={handleChange} required
                    className="w-full pl-10 pr-4 py-3 bg-surface-deep border border-hairline rounded-lg text-sm text-ink focus:outline-none focus:border-accent-orange" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-ash uppercase tracking-wider mb-1.5">Ville</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-mute" />
                  <input type="text" name="ville" value={formData.ville} onChange={handleChange} required
                    className="w-full pl-10 pr-4 py-3 bg-surface-deep border border-hairline rounded-lg text-sm text-ink focus:outline-none focus:border-accent-orange" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-ash uppercase tracking-wider mb-1.5">Rôle</label>
              <select name="role" value={formData.role} onChange={handleChange}
                className="w-full px-4 py-3 bg-surface-deep border border-hairline rounded-lg text-sm text-ink focus:outline-none focus:border-accent-orange">
                <option value="etudiant">Étudiant</option>
                <option value="enseignant">Enseignant</option>
              </select>
            </div>

            {formData.role === 'enseignant' && (
              <div className="space-y-3 border border-hairline rounded-lg p-4 bg-surface-deep/30">
                <p className="text-xs font-bold text-ash uppercase">Documents requis</p>
                <div>
                  <label className="block text-xs text-charcoal mb-1">CIN Recto (image)</label>
                  <input type="file" name="cin_recto" accept="image/*" onChange={handleFileChange} required
                    className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-accent-orange file:text-canvas file:font-bold" />
                </div>
                <div>
                  <label className="block text-xs text-charcoal mb-1">CIN Verso (image)</label>
                  <input type="file" name="cin_verso" accept="image/*" onChange={handleFileChange} required
                    className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-accent-orange file:text-canvas file:font-bold" />
                </div>
                <div>
                  <label className="block text-xs text-charcoal mb-1">Diplôme (PDF)</label>
                  <input type="file" name="diplome" accept=".pdf" onChange={handleFileChange} required
                    className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-accent-orange file:text-canvas file:font-bold" />
                </div>
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-accent-orange text-canvas py-3 rounded-lg font-bold text-sm hover:bg-accent-orange/90 transition-colors disabled:opacity-50">
              {loading ? 'Inscription...' : 'S\'inscrire'}
            </button>
          </form>

          <p className="text-center text-sm text-charcoal mt-6">
            Déjà un compte ?{' '}
            <Link to="/login" className="text-accent-orange font-semibold hover:underline">Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  )
}