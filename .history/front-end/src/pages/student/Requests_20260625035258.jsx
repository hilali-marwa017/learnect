import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { StudentNavigationActive } from './Dashboard';
import { Sparkles, Plus, Trash2, Clock, CheckCircle, X } from 'lucide-react';
import api from '../../api/axios';

export default function StudentRequests() {
  const context = useOutletContext();
  const isDark = context?.isDark || false;

  const bg       = isDark ? '#0a0a0c' : '#ffffff';
  const bgCard   = isDark ? '#1a1a1c' : '#ffffff';
  const bgSurf   = isDark ? '#1a1a1c' : '#f8f9fc';
  const border   = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const borderSub= isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  const text     = isDark ? '#ffffff' : '#111827';
  const muted    = isDark ? '#9ca3af' : '#6b7280';
  const inputBg  = isDark ? 'rgba(255,255,255,0.05)' : '#f8f9fc';
  const inputBorder = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

  const inputStyle = { width: '100%', background: inputBg, border: `1px solid ${inputBorder}`, color: text, borderRadius: '10px', padding: '10px 12px', fontSize: '0.8rem', outline: 'none', boxSizing: 'border-box' };
  const labelStyle = { fontSize: '0.6rem', color: muted, fontWeight: 700, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' };

  const [demandes, setDemandes]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [showForm, setShowForm]       = useState(false);
  const [adding, setAdding]           = useState(false);
  const [error, setError]             = useState('');

  const [form, setForm] = useState({ matiere: '', message: '', budget_max: '' });

  useEffect(() => {
    fetchDemandes();
  }, []);

  async function fetchDemandes() {
    try {
      const res = await api.get('/demandes/mes-demandes');
      setDemandes(res.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  async function handleAdd(e) {
    e.preventDefault();
    setAdding(true); setError('');
    try {
      const res = await api.post('/demandes', form);
      setDemandes(prev => [res.data.demande, ...prev]);
      setForm({ matiere: '', message: '', budget_max: '' });
      setShowForm(false);
    } catch (e) { setError(e.response?.data?.message || 'Erreur.'); }
    finally { setAdding(false); }
  }

  async function handleDelete(id) {
    if (!window.confirm('Supprimer cette demande ?')) return;
    try {
      await api.delete(`/demandes/${id}`);
      setDemandes(prev => prev.filter(d => d.id_demande !== id));
    } catch (e) { alert(e.response?.data?.message || 'Erreur.'); }
  }

  const actives = demandes.filter(d => d.statut === 'active').length;

  return (
    <div style={{ minHeight: '100vh', background: bg, paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

        <div style={{ borderBottom: `1px solid ${border}`, paddingBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.65rem', color: '#e04f00', fontWeight: 700, fontFamily: 'monospace', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>LEARNECT PLATFORM</div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: text, margin: '0 0 0.4rem', letterSpacing: '-0.02em' }}>Mes Demandes de Soutien</h1>
          <p style={{ fontSize: '0.8rem', color: muted, margin: 0 }}>Exprimez vos besoins pour que nos tuteurs vous envoient des propositions ciblees.</p>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <StudentNavigationActive activeTab="requests" isDark={isDark} />

          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* Barre actions */}
            <div style={{ background: bgSurf, border: `1px solid ${border}`, borderRadius: '12px', padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.72rem', color: muted, fontFamily: 'monospace', fontWeight: 700 }}>
                {actives} demande{actives > 1 ? 's' : ''} active{actives > 1 ? 's' : ''}
              </span>
              <button onClick={() => setShowForm(!showForm)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '10px', background: isDark ? '#ffffff' : '#111827', color: isDark ? '#111827' : '#ffffff', border: 'none', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', fontFamily: 'monospace' }}>
                <Plus size={14} /> REDIGER UNE DEMANDE
              </button>
            </div>

            {/* Formulaire */}
            {showForm && (
              <div style={{ background: bgCard, border: `1px solid ${border}`, borderRadius: '16px', padding: '1.5rem' }}>
                <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: text, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 1rem' }}>
                  Formuler mon besoin
                </h3>
                {error && (
                  <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', color: '#dc2626', fontSize: '0.75rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <X size={14} /> {error}
                  </div>
                )}
                <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={labelStyle}>Matiere / Sujet</label>
                      <input required type="text" value={form.matiere} onChange={e => setForm(p => ({...p, matiere: e.target.value}))} placeholder="Ex: Mathematiques - Algebre" style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Budget Max (MAD/h)</label>
                      <input required type="number" min="0" value={form.budget_max} onChange={e => setForm(p => ({...p, budget_max: e.target.value}))} placeholder="Ex: 150" style={inputStyle} />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Description du besoin</label>
                    <textarea required value={form.message} onChange={e => setForm(p => ({...p, message: e.target.value}))} placeholder="Decrivez precisement ce que vous attendez du tuteur..." rows={3} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} />
                  </div>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button type="button" onClick={() => setShowForm(false)} style={{ padding: '8px 16px', borderRadius: '10px', border: `1px solid ${border}`, background: 'transparent', color: muted, fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600 }}>
                      Annuler
                    </button>
                    <button type="submit" disabled={adding} style={{ padding: '8px 20px', borderRadius: '10px', background: adding ? (isDark ? 'rgba(255,255,255,0.05)' : '#e5e7eb') : '#e04f00', color: adding ? muted : '#ffffff', border: 'none', fontSize: '0.78rem', fontWeight: 800, cursor: adding ? 'not-allowed' : 'pointer', fontFamily: 'monospace' }}>
                      {adding ? 'Publication...' : 'Publier la demande'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Liste demandes */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: muted, fontSize: '0.8rem' }}>Chargement...</div>
            ) : demandes.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', background: bgCard, border: `1px solid ${border}`, borderRadius: '20px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(224,79,0,0.08)', border: '1px solid rgba(224,79,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={22} color="#e04f00" />
                </div>
                <p style={{ fontSize: '0.82rem', color: muted, margin: 0, fontWeight: 600 }}>Aucune demande publiee pour le moment</p>
              </div>
            ) : (
              demandes.map(d => (
                <div key={d.id_demande} style={{ background: bgCard, border: `1px solid ${border}`, borderRadius: '16px', padding: '1.25rem 1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.75rem' }}>
                    <div>
                      <span style={{ fontSize: '0.6rem', fontWeight: 700, color: '#e04f00', background: 'rgba(224,79,0,0.08)', border: '1px solid rgba(224,79,0,0.15)', borderRadius: '6px', padding: '2px 8px', fontFamily: 'monospace', textTransform: 'uppercase', display: 'inline-block', marginBottom: '6px' }}>
                        Budget max : {d.budget_max} MAD/h
                      </span>
                      <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: text, margin: '0 0 4px' }}>{d.matiere}</h3>
                      <span style={{ fontSize: '0.65rem', color: muted, fontFamily: 'monospace' }}>
                        {new Date(d.created_at).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.62rem', padding: '3px 10px', borderRadius: '20px', fontWeight: 700, fontFamily: 'monospace', background: d.statut === 'active' ? 'rgba(59,130,246,0.1)' : 'rgba(34,197,94,0.1)', border: d.statut === 'active' ? '1px solid rgba(59,130,246,0.2)' : '1px solid rgba(34,197,94,0.2)', color: d.statut === 'active' ? '#2563eb' : '#16a34a', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {d.statut === 'active' ? <><Clock size={10} /> EN COURS</> : <><CheckCircle size={10} /> RESOLU</>}
                      </span>
                      <button onClick={() => handleDelete(d.id_demande)} style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '8px', color: '#dc2626', cursor: 'pointer' }}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: muted, margin: '0 0 0.75rem', lineHeight: 1.6 }}>{d.message}</p>
                  <div style={{ paddingTop: '0.75rem', borderTop: `1px solid ${borderSub}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.72rem', color: muted }}>Budget max : <strong style={{ color: text }}>{d.budget_max} MAD/h</strong></span>
                    <span style={{ fontSize: '0.72rem', color: muted, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Sparkles size={12} color="#d97706" />
                      <strong style={{ color: text }}>{d.offres?.length || 0} propositions recues</strong>
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}