import React, { useState } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { Mail, Lock, Eye, EyeOff, GraduationCap, ArrowRight } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const context = useOutletContext();
  const isDark = context?.isDark || false;
const handleSubmit = async (e) => {
    e.preventDefault(); // ← Important: empêche le refresh
    setError('');
    setLoading(true);}

  // Couleurs - Left panel BLANC en dark mode, Right panel FONCÉ en dark mode
  const bgPage = isDark ? '#0a0a0c' : '#f0f0f2';
  const bgCard = isDark ? '#0a0a0c' : '#ffffff';
  
  // LEFT PANEL: blanc en dark mode, foncé en light mode
  const bgLeft = isDark ? '#ffffff' : '#0a0a0c';
  const textLeft = isDark ? '#07090d' : '#ffffff';
  const textLeftMuted = isDark ? '#718096' : '#888';
  const leftBorder = isDark ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.06)';
  const leftIconBg = isDark ? '#e04f00' : '#e04f00';
  const leftTitle = isDark ? '#07090d' : '#ffffff';
  
  // RIGHT PANEL: foncé en dark mode, blanc en light mode
  const bgRight = isDark ? '#0a0a0c' : '#ffffff';
  const textRight = isDark ? '#ffffff' : '#07090d';
  const textRightMuted = isDark ? '#a1a4a5' : '#718096';
  const inputBg = isDark ? '#1a1a1c' : '#f4f4f6';
  const inputBorder = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const orange = '#e04f00';
  const btnBg = isDark ? '#1a1a1c' : '#0a0a0c';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await login(email, password);
      if (result.success) {
        if (result.role === 'admin') navigate('/admin');
        else if (result.role === 'enseignant') navigate('/teacher');
        else navigate('/student');
      } else {
        setError(result.message || 'Email ou mot de passe incorrect');
      }
    } catch (err) {
      setError('Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    paddingTop: '13px',
    paddingBottom: '13px',
    paddingRight: '16px',
    background: inputBg,
    border: `1px solid ${inputBorder}`,
    borderRadius: '10px',
    color: textRight,
    fontSize: '0.85rem',
    outline: 'none',
    boxSizing: 'border-box'
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: bgPage,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '900px',
        background: bgCard,
        border: `1px solid ${borderColor}`,
        borderRadius: '20px',
        overflow: 'hidden',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        boxShadow: isDark ? '0 4px 32px rgba(0,0,0,0.3)' : '0 4px 32px rgba(0,0,0,0.08)'
      }}>

        {/* LEFT PANEL - Blanc en dark mode, foncé en light mode */}
        <div style={{
          background: bgLeft,
          padding: '3rem 2.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          gap: '2rem',
          borderRight: `1px solid ${leftBorder}`
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '40px', height: '40px',
              background: leftIconBg,
              borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <GraduationCap size={22} color="#fff" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: textLeft }}>
                Learnect<span style={{ color: orange }}>.ma</span>
              </div>
              <div style={{ fontSize: '0.6rem', color: textLeftMuted, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                Portail académique marocain
              </div>
            </div>
          </div>

          {/* Tagline */}
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: textLeft, lineHeight: 1.3, margin: 0 }}>
              Réussissez vos examens<br />avec nos tuteurs d'élite.
            </h2>
            <p style={{ fontSize: '0.85rem', color: textLeftMuted, lineHeight: 1.6, margin: '0.75rem 0 0 0' }}>
              Plateforme préférée pour le soutien scolaire personnalisé au Maroc.
            </p>
          </div>
        </div>

        {/* RIGHT PANEL - Foncé en dark mode, blanc en light mode */}
        <div style={{ padding: '3rem 2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: bgRight }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: textRight, marginBottom: '0.4rem' }}>
              Content De Vous Revoir !
            </h1>
            <p style={{ fontSize: '0.85rem', color: textRightMuted, margin: 0 }}>
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
            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: textRightMuted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
              Adresse Email
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={15} color={textRightMuted} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
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
              <label style={{ fontSize: '0.7rem', fontWeight: 700, color: textRightMuted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Mot de passe
              </label>
              <span style={{ fontSize: '0.78rem', color: orange, cursor: 'pointer' }}>Perdu ?</span>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={15} color={textRightMuted} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
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
                  color: showPassword ? orange : textRightMuted,
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
              background: btnBg,
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

          <p style={{ textAlign: 'center', fontSize: '0.82rem', color: textRightMuted, margin: 0 }}>
            Pas encore adhérent ?{' '}
            <Link to="/register" style={{ color: orange, fontWeight: 600, textDecoration: 'none' }}>
              Créer un espace gratuit
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}