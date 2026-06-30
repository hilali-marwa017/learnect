import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useOutletContext } from 'react-router-dom';
import { Mail, Lock, LogIn, GraduationCap, AlertCircle } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const context = useOutletContext?.() || {};
  const isDark = context?.isDark || false;

  const bg      = isDark ? '#0a0a0c' : '#f8f9fc';
  const bgCard  = isDark ? '#1a1a1c' : '#ffffff';
  const border  = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const text    = isDark ? '#ffffff' : '#111827';
  const muted   = isDark ? '#9ca3af' : '#6b7280';
  const inputBg = isDark ? 'rgba(255,255,255,0.05)' : '#f8f9fc';
  const inputBorder = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true); setError('');
    const result = await login(email, password);
    if (result.success) {
      if (result.role === 'admin')      navigate('/admin');
      else if (result.role === 'enseignant') navigate('/teacher');
      else navigate('/student');
    } else {
      setError(result.message);
    }
    setLoading(false);
  }

  return (
    <div style={{ minHeight: '100vh', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ background: bgCard, border: '1px solid ' + border, borderRadius: '24px', padding: '2.5rem', width: '100%', maxWidth: '420px' }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '2rem' }}>
          <GraduationCap size={28} color="#e04f00" />
          <span style={{ fontWeight: 900, fontSize: '1.4rem', color: text }}>Learn<span style={{ color: '#e04f00' }}>ect</span>.ma</span>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: text, margin: '0 0 6px', textAlign: 'center' }}>Connexion</h1>
          <p style={{ fontSize: '0.8rem', color: muted, textAlign: 'center', margin: 0 }}>Accedez a votre espace personnel</p>
        </div>

        {/* Erreur */}
        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: '10px', color: '#dc2626', fontSize: '0.78rem', fontWeight: 700, marginBottom: '1.25rem' }}>
            <AlertCircle size={15} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Email */}
          <div>
            <label style={{ fontSize: '0.6rem', color: muted, fontWeight: 700, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' }}>Adresse email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={15} color={muted} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="votre@email.com" style={{ width: '100%', background: inputBg, border: '1px solid ' + inputBorder, color: text, borderRadius: '10px', padding: '11px 12px 11px 36px', fontSize: '0.82rem', outline: 'none', boxSizing: 'border-box' }} />
            </div>
          </div>

          {/* Mot de passe */}
          <div>
            <label style={{ fontSize: '0.6rem', color: muted, fontWeight: 700, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' }}>Mot de passe</label>
            <div style={{ position: 'relative' }}>
              <Lock size={15} color={muted} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" style={{ width: '100%', background: inputBg, border: '1px solid ' + inputBorder, color: text, borderRadius: '10px', padding: '11px 12px 11px 36px', fontSize: '0.82rem', outline: 'none', boxSizing: 'border-box' }} />
            </div>
          </div>

          {/* Bouton */}
          <button type="submit" disabled={loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '13px', borderRadius: '12px', background: loading ? (isDark ? 'rgba(255,255,255,0.06)' : '#e5e7eb') : '#e04f00', color: loading ? muted : '#ffffff', border: 'none', fontSize: '0.82rem', fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'monospace', letterSpacing: '0.06em', marginTop: '0.5rem' }}>
            <LogIn size={16} /> {loading ? 'CONNEXION...' : 'SE CONNECTER'}
          </button>
        </form>

        <p style={{ fontSize: '0.78rem', color: muted, textAlign: 'center', marginTop: '1.5rem' }}>
          Pas encore de compte ?{' '}
          <Link to="/register" style={{ color: '#e04f00', fontWeight: 700, textDecoration: 'none' }}>Inscription</Link>
        </p>
      </div>
    </div>
  );
}