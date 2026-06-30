import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { TeacherNavigationActive } from './Dashboard';
import { Calendar, Plus, Trash2, Save, X, Pencil, Check } from 'lucide-react';
import api from '../../api/axios';

const JOURS       = ['lundi','mardi','mercredi','jeudi','vendredi','samedi','dimanche'];
const JOURS_LABELS = { lundi:'Lundi', mardi:'Mardi', mercredi:'Mercredi', jeudi:'Jeudi', vendredi:'Vendredi', samedi:'Samedi', dimanche:'Dimanche' };
const TIME_SLOTS  = ['08:00','10:00','12:00','14:00','16:00','18:00','20:00','22:00'];

export default function TeacherAvailability() {
  const context = useOutletContext();
  const isDark  = context?.isDark || false;

  const bg          = isDark ? '#0a0a0c' : '#ffffff';
  const bgCard      = isDark ? '#1a1a1c' : '#ffffff';
  const bgSurf      = isDark ? '#1a1a1c' : '#f8f9fc';
  const border      = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const borderSub   = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  const text        = isDark ? '#ffffff' : '#111827';
  const muted       = isDark ? '#9ca3af' : '#6b7280';
  const inputBg     = isDark ? 'rgba(255,255,255,0.05)' : '#f8f9fc';
  const inputBorder = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

  const inputStyle = { width: '100%', background: inputBg, border: `1px solid ${inputBorder}`, color: text, borderRadius: '10px', padding: '10px 12px', fontSize: '0.8rem', outline: 'none', cursor: 'pointer', boxSizing: 'border-box' };
  const labelStyle = { fontSize: '0.6rem', color: muted, fontWeight: 700, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' };

  const [creneaux,     setCreneaux]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [saveSuccess,  setSaveSuccess]  = useState(false);
  const [error,        setError]        = useState('');
  const [newJour,      setNewJour]      = useState('lundi');
  const [newDebut,     setNewDebut]     = useState('08:00');
  const [newFin,       setNewFin]       = useState('10:00');
  const [adding,       setAdding]       = useState(false);
  const [editId,       setEditId]       = useState(null);
  const [editDebut,    setEditDebut]    = useState('');
  const [editFin,      setEditFin]      = useState('');
  const [saving,       setSaving]       = useState(false);

  useEffect(() => {
    async function fetchCreneaux() {
      try {
        // ✅ URL corrigée - utilisation de la bonne route
        const res = await api.get('/enseignant/dashboard');
        setCreneaux(res.data.enseignant?.creneaux || []);
      } catch (e) {
        setError('Impossible de charger les créneaux.');
      } finally {
        setLoading(false);
      }
    }
    fetchCreneaux();
  }, []);

  async function handleAdd(e) {
    e.preventDefault();
    if (newDebut >= newFin) { setError("L'heure de fin doit être après l'heure de début."); return; }
    setAdding(true); setError('');
    try {
      const res = await api.post('/creneaux', { jour: newJour, heureDebut: newDebut, heureFin: newFin });
      setCreneaux(prev => [...prev, res.data.creneau]);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (e) { setError(e.response?.data?.message || 'Erreur ajout.'); }
    finally { setAdding(false); }
  }

  function handleEdit(c) {
    setEditId(c.id_creneau);
    setEditDebut(c.heureDebut?.slice(0,5));
    setEditFin(c.heureFin?.slice(0,5));
    setError('');
  }

  function handleCancelEdit() { setEditId(null); }

  async function handleSaveEdit(id) {
    if (editDebut >= editFin) { setError("L'heure de fin doit être après l'heure de début."); return; }
    setSaving(true); setError('');
    try {
      const res = await api.put(`/creneaux/${id}`, { heureDebut: editDebut, heureFin: editFin });
      setCreneaux(prev => prev.map(c => c.id_creneau === id ? res.data.creneau : c));
      setEditId(null);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (e) { setError(e.response?.data?.message || 'Erreur modification.'); }
    finally { setSaving(false); }
  }

  async function handleToggle(c) {
    try {
      const res = await api.put(`/creneaux/${c.id_creneau}`, { estDisponible: !c.estDisponible });
      setCreneaux(prev => prev.map(x => x.id_creneau === c.id_creneau ? res.data.creneau : x));
    } catch (e) { setError('Erreur mise à jour.'); }
  }

  async function handleDelete(id) {
    if (!window.confirm('Supprimer ce créneau ?')) return;
    try {
      await api.delete(`/creneaux/${id}`);
      setCreneaux(prev => prev.filter(c => c.id_creneau !== id));
    } catch (e) { setError('Erreur suppression.'); }
  }

  const creneauxParJour = JOURS.reduce((acc, jour) => {
    acc[jour] = creneaux.filter(c => c.jour === jour);
    return acc;
  }, {});

  return (
    <div style={{ minHeight: '100vh', background: bg, paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

        <div style={{ borderBottom: `1px solid ${border}`, paddingBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.65rem', color: '#e04f00', fontWeight: 700, fontFamily: 'monospace', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>LEARNECT PROF PLATFORM</div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: text, margin: '0 0 0.4rem', letterSpacing: '-0.02em' }}>Disponibilités & Créneaux</h1>
          <p style={{ fontSize: '0.8rem', color: muted, margin: 0 }}>Configurez vos créneaux réguliers de soutien scolaire.</p>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <TeacherNavigationActive activeTab="availability" isDark={isDark} />

          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Formulaire ajout */}
            <div style={{ background: bgSurf, border: `1px solid ${border}`, borderRadius: '20px', padding: '1.5rem' }}>
              <h2 style={{ fontSize: '0.85rem', fontWeight: 700, color: text, margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={16} color="#e04f00" /> Ajouter un créneau
              </h2>

              {error && (
                <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', color: '#dc2626', fontSize: '0.75rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <X size={14} /> {error}
                </div>
              )}
              {saveSuccess && (
                <div style={{ padding: '10px 14px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '10px', color: '#16a34a', fontSize: '0.75rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Save size={14} /> Opération effectuée avec succès.
                </div>
              )}

              <form onSubmit={handleAdd} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
                <div>
                  <label style={labelStyle}>Jour</label>
                  <select value={newJour} onChange={e => setNewJour(e.target.value)} style={{ ...inputStyle, background: isDark ? '#2a2a2c' : '#f8f9fc' }}>
                    {JOURS.map(j => <option key={j} value={j} style={{ background: isDark ? '#1a1a1c' : '#fff' }}>{JOURS_LABELS[j]}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Heure début</label>
                  <select value={newDebut} onChange={e => setNewDebut(e.target.value)} style={{ ...inputStyle, background: isDark ? '#2a2a2c' : '#f8f9fc' }}>
                    {TIME_SLOTS.map(t => <option key={t} value={t} style={{ background: isDark ? '#1a1a1c' : '#fff' }}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Heure fin</label>
                  <select value={newFin} onChange={e => setNewFin(e.target.value)} style={{ ...inputStyle, background: isDark ? '#2a2a2c' : '#f8f9fc' }}>
                    {TIME_SLOTS.map(t => <option key={t} value={t} style={{ background: isDark ? '#1a1a1c' : '#fff' }}>{t}</option>)}
                  </select>
                </div>
                <button type="submit" disabled={adding} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 20px', borderRadius: '10px', background: adding ? (isDark ? 'rgba(255,255,255,0.05)' : '#e5e7eb') : '#e04f00', color: adding ? muted : '#ffffff', border: 'none', fontSize: '0.75rem', fontWeight: 700, cursor: adding ? 'not-allowed' : 'pointer', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
                  <Plus size={14} /> {adding ? 'AJOUT...' : 'AJOUTER'}
                </button>
              </form>
            </div>

            {/* Grille hebdomadaire */}
            <div style={{ background: bgCard, border: `1px solid ${border}`, borderRadius: '20px', padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 800, color: text, margin: '0 0 1.25rem', paddingBottom: '1rem', borderBottom: `1px solid ${borderSub}`, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={18} color="#e04f00" /> Grille des Horaires Hebdomadaires
              </h2>

              {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: muted, fontSize: '0.8rem' }}>Chargement...</div>
              ) : (
                <div>
                  {JOURS.map((jour, i) => {
                    const slots = creneauxParJour[jour];
                    return (
                      <div key={jour} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '14px 0', borderBottom: i < JOURS.length - 1 ? `1px solid ${borderSub}` : 'none', flexWrap: 'wrap' }}>
                        <div style={{ width: '120px', flexShrink: 0, paddingTop: '4px' }}>
                          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: text }}>{JOURS_LABELS[jour]}</div>
                          <div style={{ fontSize: '0.65rem', color: muted, marginTop: '2px' }}>{slots.length} créneau{slots.length !== 1 ? 'x' : ''}</div>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', flex: 1 }}>
                          {slots.length === 0 ? (
                            <span style={{ fontSize: '0.72rem', color: isDark ? 'rgba(255,255,255,0.2)' : '#d1d5db', fontStyle: 'italic', fontFamily: 'monospace' }}>Aucun créneau</span>
                          ) : (
                            slots.map(c => (
                              <div key={c.id_creneau}>
                                {editId === c.id_creneau ? (
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9', border: `1px solid ${border}`, borderRadius: '10px', padding: '6px 10px' }}>
                                    <select value={editDebut} onChange={e => setEditDebut(e.target.value)} style={{ background: isDark ? '#2a2a2c' : '#fff', border: `1px solid ${inputBorder}`, color: text, borderRadius: '6px', padding: '4px 6px', fontSize: '0.75rem', outline: 'none' }}>
                                      {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                    <span style={{ color: muted, fontSize: '0.75rem' }}>→</span>
                                    <select value={editFin} onChange={e => setEditFin(e.target.value)} style={{ background: isDark ? '#2a2a2c' : '#fff', border: `1px solid ${inputBorder}`, color: text, borderRadius: '6px', padding: '4px 6px', fontSize: '0.75rem', outline: 'none' }}>
                                      {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                    <button onClick={() => handleSaveEdit(c.id_creneau)} disabled={saving} style={{ width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#16a34a', cursor: 'pointer', borderRadius: '6px', padding: 0 }}>
                                      <Check size={13} />
                                    </button>
                                    <button onClick={handleCancelEdit} style={{ width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#dc2626', cursor: 'pointer', borderRadius: '6px', padding: 0 }}>
                                      <X size={13} />
                                    </button>
                                  </div>
                                ) : (
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <button onClick={() => handleToggle(c)} style={{ padding: '6px 14px', borderRadius: '8px', border: `1px solid ${c.estDisponible ? '#e04f00' : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.12)')}`, background: c.estDisponible ? '#e04f00' : (isDark ? 'rgba(255,255,255,0.04)' : '#f8f9fc'), color: c.estDisponible ? '#ffffff' : muted, fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s', textDecoration: c.estDisponible ? 'none' : 'line-through' }}>
                                      {c.heureDebut?.slice(0,5)} - {c.heureFin?.slice(0,5)}
                                    </button>
                                    <button onClick={() => handleEdit(c)} style={{ width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', color: 'rgba(59,130,246,0.6)', cursor: 'pointer', borderRadius: '6px', padding: 0 }}>
                                      <Pencil size={13} />
                                    </button>
                                    <button onClick={() => handleDelete(c.id_creneau)} style={{ width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', color: 'rgba(239,68,68,0.4)', cursor: 'pointer', borderRadius: '6px', padding: 0 }}>
                                      <Trash2 size={13} />
                                    </button>
                                  </div>
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}