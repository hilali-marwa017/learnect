import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { Mail, Lock, Eye, EyeOff, GraduationCap, ArrowRight } from 'lucide-react'

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
      if (user.role === 'admin') navigate('/admin/dashboard')
      else if (user.role === 'enseignant') navigate('/enseignant/dashboard')
      else navigate('/etudiant/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Email ou mot de passe incorrect')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%',
    paddingTop: '13px',
    paddingBottom: '13px',
    paddingRight: '16px',
    background: '#f4f4f6',
    border: '1px solid rgba(0,0,0,0.08)',
    borderRadius: '10px',
    color: '#07090d',
    fontSize: '0.85rem',
    outline: 'none',
    boxSizing: 'border-box'
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f0f0f2',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '900px',
        background: '#ffffff',
        border: '1px solid rgba(0,0,0,0.08)',
        borderRadius: '20px',
        overflow: 'hidden',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        boxShadow: '0 4px 32px rgba(0,0,0,0.08)'
      }}>

        {/* LEFT PANEL */}
        <div style={{
          background: '#0a0a0c',
          padding: '3rem 2.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          gap: '2rem',
          borderRight: '1px solid rgba(255,255,255,0.06)'
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '40px', height: '40px',
              background: '#e04f00',
              borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <GraduationCap size={22} color="#fff" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>
                Learnect<span style={{ color: '#e04f00' }}>.ma</span>
              </div>
              <div style={{ fontSize: '0.6rem', color: '#555', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                Portail académique marocain
              </div>
            </div>
          </div>

          {/* Tagline */}
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', lineHeight: 1.3, marginBottom: '0.75rem', margin: 0 }}>
              Réussissez vos examens<br />avec nos tuteurs d'élite.
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#666', lineHeight: 1.6, margin: '0.75rem 0 0 0' }}>
              Plateforme préférée pour le soutien scolaire personnalisé au Maroc.
            </p>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div style={{ padding: '3rem 2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: '#fff' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#07090d', marginBottom: '0.4rem' }}>
              Content De Vous Revoir !
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#718096', margin: 0 }}>
              Veuillez saisir votre e-mail pour accéder à vos panels sécurisés
            </p>
          </div>

          {error && (
            <div style={{
              background: 'rgba(220,38,38,0.08)',
              border: '1px solid rgba(220,38,38,0.25)',
              color: '#dc2626',
              fontSize: '0.82rem',
              padding: '10px 14px',
              borderRadius: '8px',
              marginBottom: '1.2rem'
            }}>
              {error}
            </div>
          )}

          {/* Email */}
          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
              Adresse Email
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={15} color="#aaa" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                style={{ ...inputStyle, paddingLeft: '40px' }}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: '1.8rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ fontSize: '0.7rem', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Mot de passe
              </label>
              <span style={{ fontSize: '0.78rem', color: '#e04f00', cursor: 'pointer' }}>Perdu ?</span>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={15} color="#aaa" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ ...inputStyle, paddingLeft: '40px', paddingRight: '44px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: showPassword ? '#e04f00' : '#aaa',
                  padding: 0, display: 'flex', alignItems: 'center'
                }}
              >
                {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: '100%',
              background: '#0a0a0c',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              padding: '14px',
              fontWeight: 700,
              fontSize: '0.82rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginBottom: '1.5rem'
            }}
          >
            <ArrowRight size={16} />
            {loading ? 'Connexion...' : 'Ouvrir ma session sécurisée'}
          </button>

          <p style={{ textAlign: 'center', fontSize: '0.82rem', color: '#718096', margin: 0 }}>
            Pas encore adhérent ?{' '}
            <Link to="/register" style={{ color: '#e04f00', fontWeight: 600, textDecoration: 'none' }}>
              Créer un espace gratuit
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}