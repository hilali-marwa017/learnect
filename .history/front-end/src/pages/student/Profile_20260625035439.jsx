import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { StudentNavigationActive } from './Dashboard';
import { Save, User, Phone, Mail, GraduationCap, MapPin, X } from 'lucide-react';
import api from '../../api/axios';

const NIVEAUX = ['Primaire', 'College', 'Lycee - Tronc Commun', 'Lycee - 1ere Bac', 'Lycee - 2eme Bac', 'CPGE', 'Universite', 'Formation Professionnelle'];

export default function StudentProfile() {
  const { user } = useAuth();
  const context = useOutletContext();
  const isDark = context?.isDark || false;

  const bg       = isDark ? '#0a0a0c' : '#ffffff';
  const bgCard   = isDark ? '#1a1a1c' : '#f8f9fc';
  const bgInner  = isDark ? '#111113' : '#ffffff';
  const border   = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const borderSub= isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)';
  const text     = isDark ? '#ffffff' : '#111827';
  const muted    = isDark ? '#9ca3af' : '#6b7280';
  const inputBg  = isDark ? 'rgba(255,255,255,0.05)' : '#ffffff';
  const inputBorder = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

  const inputStyle = { width: '100%', background: inputBg, border: `1px solid ${inputBorder}`, color: text, borderRadius: '10px', padding: '10px 12px', fontSize: '0.8rem', outline: 'none', boxSizing: 'border-box' };
  const labelStyle = { fontSize: '0.6rem', color: muted, fontWeight: 700, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' };

  const [form, setForm]           = useState({ nom: '', prenom: '', telephone: '', ville: '', niveau: '', budget: '' });
  const [villes, setVilles]       = useState([]);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);

  useEffect(() => {
    async function fetchVilles() {
      try {
        const res = await api.get('/villes');
        setVilles(res.data || []);
      } catch (e) { console.error(e); }
    }
    fetchVilles();
  }, []);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await api.get('/etudiant/profile');
        const d = res.data;
        setForm({
          nom:       d.nom       || '',
          prenom:    d.prenom    || '',
          telephone: d.telephone || '',
          ville:     d.ville     || '',
          niveau:    d.niveau    || '',
          budget:    d.budget    || '',
        });
      } catch (e) { console.error(e); }
    }
    fetchProfile();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await api.put('/etudiant/profile', form);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) { setError(err.response?.data?.message || 'Erreur lors de la sauvegarde.'); }
    finally { setLoading(false); }
  }

  return (
    <div style={{ minHeight: '100vh', background: bg, paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

        <div style={{ borderBottom: `1px solid ${border}`, paddingBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.65rem', color: '#e04f00', fontWeight: 700, fontFamily: 'monospace', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>LEARNECT PLATFORM</div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: text, margin: '0 0 0.4rem', letterSpacing: '-0.02em' }}>Parametres de Profil</h1>
          <p style={{ fontSize: '0.8rem', color: muted, margin: 0 }}>Mettez a jour vos coordonnees academiques et informations personnelles.</p>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <StudentNavigationActive activeTab="profile" isDark={isDark} />

          <div style={{ flex: 1, minWidth: 0, background: bgCard, border: `1px solid ${border}`, borderRadius: '20px', padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 800, color: text, margin: '0 0 1.5rem', paddingBottom: '1rem', borderBottom: `1px solid ${borderSub}`, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={18} color="#e04f00" /> Coordonnees Privees
            </h2>

            {error && (
              <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', color: '#dc2626', fontSize: '0.75rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <X size={14} /> {error}
              </div>
            )}
            {saveSuccess && (
              <div style={{ padding: '10px 14px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '10px', color: '#16a34a', fontSize: '0.75rem', fontWeight: 700, marginBottom: '1.25rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Save size={14} /> Profil enregistre avec succes.
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>

                <div><label style={labelStyle}>Prenom</label><input required type="text" value={form.prenom} onChange={e => setForm(p => ({...p, prenom: e.target.value}))} style={inputStyle} /></div>
                <div><label style={labelStyle}>Nom de famille</label><input required type="text" value={form.nom} onChange={e => setForm(p => ({...p, nom: e.target.value}))} style={inputStyle} /></div>

                <div>
                  <label style={labelStyle}>Adresse email</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={14} color={muted} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input disabled type="email" value={user?.email || ''} style={{ ...inputStyle, paddingLeft: '36px', opacity: 0.5, cursor: 'not-allowed' }} />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Telephone (Maroc)</label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={14} color={muted} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input required type="text" value={form.telephone} onChange={e => setForm(p => ({...p, telephone: e.target.value}))} placeholder="06 XX XX XX XX" style={{ ...inputStyle, paddingLeft: '36px' }} />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Niveau scolaire</label>
                  <div style={{ position: 'relative' }}>
                    <GraduationCap size={14} color={muted} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <select value={form.niveau} onChange={e => setForm(p => ({...p, niveau: e.target.value}))} style={{ ...inputStyle, paddingLeft: '36px', cursor: 'pointer', background: isDark ? '#2a2a2c' : '#ffffff' }}>
                      <option value="">Selectionner un niveau</option>
                      {NIVEAUX.map(n => <option key={n} value={n} style={{ background: isDark ? '#1a1a1c' : '#ffffff' }}>{n}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Ville de residence</label>
                  <div style={{ position: 'relative' }}>
                    <MapPin size={14} color={muted} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <select value={form.ville} onChange={e => setForm(p => ({...p, ville: e.target.value}))} style={{ ...inputStyle, paddingLeft: '36px', cursor: 'pointer', background: isDark ? '#2a2a2c' : '#ffffff' }}>
                      <option value="">Selectionner une ville</option>
                      {villes.map(v => <option key={v.id || v.nom || v} value={v.nom || v} style={{ background: isDark ? '#1a1a1c' : '#ffffff' }}>{v.nom || v}</option>)}
                    </select>
                  </div>
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Budget max (MAD/h)</label>
                  <input type="number" min="0" value={form.budget} onChange={e => setForm(p => ({...p, budget: e.target.value}))} placeholder="Ex: 150" style={inputStyle} />
                </div>

              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.5rem', borderTop: `1px solid ${borderSub}` }}>
                <button type="submit" disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 28px', borderRadius: '12px', background: loading ? (isDark ? 'rgba(255,255,255,0.05)' : '#e5e7eb') : (isDark ? '#ffffff' : '#111827'), color: loading ? muted : (isDark ? '#111827' : '#ffffff'), border: 'none', fontSize: '0.78rem', fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'monospace', letterSpacing: '0.06em' }}>
                  <Save size={16} />{loading ? 'SAUVEGARDE...' : 'SAUVEGARDER MON PROFIL'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}