import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useOutletContext } from 'react-router-dom';
import { User, Mail, Lock, Phone, MapPin, AlertCircle, UserPlus } from 'lucide-react';
import api from '../../api/axios';

export default function RegisterStudent() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const context = useOutletContext?.() || {};
  const isDark = context?.isDark || false;

  const bg      = isDark ? '#0a0a0c' : '#f8f9fc';
  const bgCard  = isDark ? '#1a1a1c' : '#ffffff';
  const border  = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const text    = isDark ? '#ffffff' : '#111827';
  const muted   = isDark ? '#9ca3af' : '#6b7280';
  const inputBg = isDark ? 'rgba(255,255,255,0.05)' : '#f8f9fc';
  const inputBorder = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const inputStyle = { width: '100%', background: inputBg, border: '1px solid ' + inputBorder, color: text, borderRadius: '10px', padding: '11px 12px', fontSize: '0.82rem', outline: 'none', boxSizing: 'border-box' };
  const labelStyle = { fontSize: '0.6rem', color: muted, fontWeight: 700, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' };

  const [form, setForm]   = useState({ nom: '', prenom: '', email: '', password: '', password_confirmation: '', telephone: '', ville: '' });
  const [villes, setVilles] = useState([]);
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  // charger les villes depuis l'API
  useEffect(() => {
    api.get('/villes')
      .then(res => setVilles(res.data || []))
      .catch(() => setVilles([]));
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.password !== form.password_confirmation) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    setLoading(true); setError('');
    const result = await register({ ...form, role: 'etudiant' });
    if (result.success) navigate('/student');
    else setError(result.message);
    setLoading(false);
  }

  return (
    <div style={{ minHeight: '100vh', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ background: bgCard, border: '1px solid ' + border, borderRadius: '24px', padding: '2.5rem', width: '100%', maxWidth: '500px' }}>

        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: '0.65rem', color: '#e04f00', fontWeight: 700, fontFamily: 'monospace', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>INSCRIPTION ETUDIANT</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: text, margin: '0 0 6px' }}>Creer mon compte</h1>
          <p style={{ fontSize: '0.8rem', color: muted, margin: 0 }}>Rejoignez Learnect et trouvez votre professeur ideal</p>
        </div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: '10px', color: '#dc2626', fontSize: '0.78rem', fontWeight: 700, marginBottom: '1.25rem' }}>
            <AlertCircle size={15} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div><label style={labelStyle}>Prenom</label><input required type="text" name="prenom" value={form.prenom} onChange={handleChange} placeholder="Sara" style={inputStyle} /></div>
            <div><label style={labelStyle}>Nom</label><input required type="text" name="nom" value={form.nom} onChange={handleChange} placeholder="Alaoui" style={inputStyle} /></div>
          </div>
          <div><label style={labelStyle}>Email</label><input required type="email" name="email" value={form.email} onChange={handleChange} placeholder="sara@email.com" style={inputStyle} /></div>
          <div><label style={labelStyle}>Telephone</label><input required type="text" name="telephone" value={form.telephone} onChange={handleChange} placeholder="06XXXXXXXX" style={inputStyle} /></div>
          <div>
            <label style={labelStyle}>Ville</label>
            <select required name="ville" value={form.ville} onChange={handleChange} style={{ ...inputStyle, cursor: 'pointer', background: isDark ? '#2a2a2c' : '#f8f9fc' }}>
              <option value="">Choisir une ville</option>
              {villes.map(v => <option key={v.id_ville || v.nom} value={v.nom}>{v.nom}</option>)}
            </select>
          </div>
          <div><label style={labelStyle}>Mot de passe</label><input required type="password" name="password" value={form.password} onChange={handleChange} placeholder="Min 8 caracteres" style={inputStyle} /></div>
          <div><label style={labelStyle}>Confirmer mot de passe</label><input required type="password" name="password_confirmation" value={form.password_confirmation} onChange={handleChange} placeholder="Repeter le mot de passe" style={inputStyle} /></div>

          <button type="submit" disabled={loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '13px', borderRadius: '12px', background: loading ? (isDark ? 'rgba(255,255,255,0.06)' : '#e5e7eb') : '#e04f00', color: loading ? muted : '#ffffff', border: 'none', fontSize: '0.82rem', fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'monospace', letterSpacing: '0.06em', marginTop: '0.5rem' }}>
            <UserPlus size={16} /> {loading ? 'CREATION...' : 'CREER MON COMPTE'}
          </button>
        </form>

        <p style={{ fontSize: '0.78rem', color: muted, textAlign: 'center', marginTop: '1.5rem' }}>
          Deja un compte ?{' '}
          <span onClick={() => navigate('/login')} style={{ color: '#e04f00', fontWeight: 700, cursor: 'pointer' }}>Se connecter</span>
        </p>
      </div>
    </div>
  );
}