import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { GraduationCap, Lightbulb, Mail, Lock, Eye, EyeOff, LogIn, X } from 'lucide-react'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    try {
      await login(email, password)
      setSuccess(true)
      const role = localStorage.getItem('learnect_role')
      let dest = '/student'
      if (role === 'admin') dest = '/admin'
      else if (role === 'teacher') dest = '/teacher'
      setTimeout(() => navigate(dest), 1000)
    } catch (err) {
      setErrorMsg(err.message || 'Email ou mot de passe incorrect.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center pt-24 pb-16 bg-canvas px-4">
      <div className="relative w-full max-w-4xl bg-surface-card border border-hairline-strong rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[500px]">

        {/* Left panel */}
        <div className="bg-surface-deep md:col-span-12 lg:col-span-5 p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-hairline-strong relative overflow-hidden">
          <div className="absolute top-[-20%] left-[-20%] w-60 h-60 rounded-full bg-accent-orange-glow blur-3xl opacity-60 pointer-events-none" />
          <div className="absolute bottom-[-20%] right-[-20%] w-60 h-60 rounded-full bg-accent-blue-glow blur-3xl opacity-60 pointer-events-none" />
          <div className="relative z-10 space-y-8">
            <div className="inline-flex items-center justify-center p-3 rounded-xl bg-accent-orange-glow border border-accent-orange/15 shadow-sm">
              <GraduationCap className="h-6 w-6 text-accent-orange" />
            </div>
            <div className="space-y-1">
              <div className="font-display-xl text-3xl text-ink tracking-tight">
                Learnect<span className="text-accent-orange font-bold">.ma</span>
              </div>
              <p className="text-[10px] tracking-[0.2em] font-mono text-mute font-bold uppercase">PORTAIL ACADÉMIQUE MAROCAIN</p>
            </div>
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-surface-card border border-hairline text-ink shadow-sm">
              <div className="p-1.5 rounded-lg bg-accent-yellow/10 border border-accent-yellow/20 text-accent-yellow shrink-0">
                <Lightbulb className="h-4 w-4" />
              </div>
              <p className="text-xs font-semibold text-body leading-relaxed">
                Connectez-vous avec votre email et mot de passe enregistrés sur Learnect.
              </p>
            </div>
          </div>
          <div className="relative z-10 space-y-3 pt-6">
            <h3 className="text-xl font-bold font-sans text-ink leading-tight">Réussissez vos examens<br />avec nos tuteurs d'élite.</h3>
            <p className="text-xs text-mute leading-relaxed font-medium">Plateforme préférée pour le soutien scolaire personnalisé au Maroc.</p>
          </div>
        </div>

        {/* Right form panel */}
        <div className="md:col-span-12 lg:col-span-7 p-8 md:p-12 flex flex-col justify-center relative bg-surface-card">
          <Link to="/" className="absolute top-6 right-6 p-2 rounded-full border border-hairline bg-surface-card hover:bg-surface-elevated text-charcoal hover:text-ink transition-all flex items-center justify-center">
            <X className="h-4 w-4" />
          </Link>
          <div className="w-full max-w-sm mx-auto space-y-6">
            <div className="text-center space-y-1.5">
              <h2 className="text-2xl font-black text-ink tracking-tight">Authentification</h2>
              <p className="text-xs text-mute font-medium leading-relaxed">Veuillez saisir vos identifiants pour accéder à votre espace</p>
            </div>

            {success ? (
              <div className="p-6 bg-accent-green/10 border border-accent-green/20 rounded-xl text-accent-green text-xs font-bold text-center animate-in zoom-in space-y-1">
                <span className="block text-sm">✓ Connexion acceptée</span>
                <p className="font-normal text-mute">Redirection automatique...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMsg && (
                  <div className="p-3 bg-accent-red/10 border border-accent-red/20 rounded-lg text-accent-red text-xs font-bold font-mono">{errorMsg}</div>
                )}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-mute uppercase font-caption tracking-wider font-bold block">ADRESSE EMAIL</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-mute" />
                    <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nom.prenom@domain.ma"
                      className="w-full bg-surface-deep/50 border border-hairline-strong text-ink rounded-lg pl-10 pr-4 py-2.5 text-xs focus:ring-1 focus:ring-accent-orange outline-none placeholder:text-stone/60" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-mute uppercase font-caption tracking-wider font-bold block">MOT DE PASSE</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-mute" />
                    <input required type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                      className="w-full bg-surface-deep/50 border border-hairline-strong text-ink rounded-lg pl-10 pr-10 py-2.5 text-xs focus:ring-1 focus:ring-accent-orange outline-none placeholder:text-stone/60" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-mute hover:text-ink cursor-pointer">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full bg-ink text-canvas hover:bg-accent-orange hover:text-white py-3 px-4 rounded-lg text-xs font-bold font-mono tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60">
                  <LogIn className="h-4 w-4" />
                  <span>{loading ? 'CONNEXION...' : 'OUVRIR MA SESSION SECURISEE'}</span>
                </button>
              </form>
            )}
            <div className="text-center pt-2">
              <p className="text-xs text-mute font-medium">
                Pas encore adhérent ?{' '}
                <Link to="/register" className="text-accent-orange hover:underline font-bold transition-all">Créer un espace gratuit</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}