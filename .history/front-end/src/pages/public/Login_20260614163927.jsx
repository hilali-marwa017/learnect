  import React, { useState } from 'react'
  import { Link, useNavigate } from 'react-router-dom'
  import { useAuth } from '../../context/AuthContext.jsx'
  import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react'

  export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
      e.preventDefault()
      setError('')
      setLoading(true)

      try {
        const user = await login(email, password)
        // Redirect based on role
        if (user.role === 'admin') navigate('/admin/dashboard')
        else if (user.role === 'enseignant') navigate('/enseignant/dashboard')
        else navigate('/etudiant/dashboard')
      } catch (err) {
        setError(err.response?.data?.message || 'Email ou mot de passe incorrect')
      } finally {
        setLoading(false)
      }
    }

    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-charcoal hover:text-ink mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Retour à l'accueil
          </Link>

          <div className="bg-surface-card border border-hairline-strong rounded-2xl p-8 shadow-lg">
            <h1 className="text-2xl font-black text-ink mb-2">Connexion</h1>
            <p className="text-sm text-charcoal mb-6">Connectez-vous pour accéder à votre compte.</p>

            {error && (
              <div className="bg-accent-red/10 border border-accent-red/30 text-accent-red text-sm px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-ash uppercase tracking-wider mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-mute" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-surface-deep border border-hairline rounded-lg text-sm text-ink focus:outline-none focus:border-accent-orange transition-colors"
                    placeholder="votre@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-ash uppercase tracking-wider mb-1.5">Mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-mute" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-10 py-3 bg-surface-deep border border-hairline rounded-lg text-sm text-ink focus:outline-none focus:border-accent-orange transition-colors"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-mute hover:text-ink"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-ink text-canvas py-3 rounded-lg font-bold text-sm hover:bg-ash transition-colors disabled:opacity-50"
              >
                {loading ? 'Connexion...' : 'Se connecter'}
              </button>
            </form>

            <p className="text-center text-sm text-charcoal mt-6">
              Pas encore de compte ?{' '}
              <Link to="/register" className="text-accent-orange font-semibold hover:underline">S'inscrire</Link>
            </p>
          </div>
        </div>
      </div>
    )
  }