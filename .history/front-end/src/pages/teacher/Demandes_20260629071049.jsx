import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { TeacherNavigationActive } from './Dashboard';
import { Sparkles, Send, CheckCircle, MapPin, Wallet, X } from 'lucide-react';
import api from '../../api/axios';

export default function TeacherDemandes() {
  const context = useOutletContext();
  const isDark = context?.isDark || false;

  // Couleurs
  const bg = isDark ? '#0a0a0c' : '#ffffff';
  const bgCard = isDark ? '#1a1a1c' : '#ffffff';
  const bgSurf = isDark ? '#1a1a1c' : '#f8f9fc';
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const text = isDark ? '#ffffff' : '#111827';
  const muted = isDark ? '#9ca3af' : '#6b7280';
  const inputBg = isDark ? 'rgba(255,255,255,0.05)' : '#f8f9fc';
  const inputBorder = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

  // States
  const [demandes, setDemandes] = useState([]);
  const [mesOffres, setMesOffres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpenId, setFormOpenId] = useState(null);
  const [prix, setPrix] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  // Charger les demandes et mes offres
  useEffect(() => {
    async function fetchAll() {
      try {
        const demRes = await api.get('/demandes');
        setDemandes(demRes.data || []);

        const offRes = await api.get('/offres/mes-offres');
        setMesOffres(offRes.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  // Vérifier si déjà postulé
  function dejaPostule(id_demande) {
    return mesOffres.some(o => o.id_demande === id_demande);
  }

  // Envoyer une offre
  async function handleEnvoyer(id_demande) {
    if (!prix || !message.trim()) {
      setError('Veuillez renseigner un prix et un message.');
      return;
    }
    setSending(true);
    setError('');
    try {
      const res = await api.post('/offres', { id_demande, prix, message });
      setMesOffres(prev => [...prev, res.data.offre]);
      setFormOpenId(null);
      setPrix('');
      setMessage('');
    } catch (e) {
      setError(e.response?.data?.message || "Erreur lors de l'envoi.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: bg, paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

        {/* Header */}
        <div style={{ borderBottom: '1px solid ' + border, paddingBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.65rem', color: '#e04f00', fontWeight: 700, fontFamily: 'monospace', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>LEARNECT PROF PLATFORM</div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: text, margin: '0 0 0.4rem', letterSpacing: '-0.02em' }}>Demandes des Étudiants</h1>
          <p style={{ fontSize: '0.8rem', color: muted, margin: 0 }}>Parcourez les demandes actives et envoyez vos propositions personnalisées.</p>
        </div>

        {/* Contenu */}
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <TeacherNavigationActive activeTab="demandes" isDark={isDark} />

          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: muted, fontSize: '0.8rem' }}>Chargement...</div>
            ) : demandes.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', background: bgCard, border: '1px solid ' + border, borderRadius: '20px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(224,79,0,0.08)', border: '1px solid rgba(224,79,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={22} color="#e04f00" />
                </div>
                <p style={{ fontSize: '0.82rem', color: muted, margin: 0, fontWeight: 600 }}>Aucune demande active pour le moment.</p>
              </div>
            ) : (
              demandes.map(d => {
                const postule = dejaPostule(d.id_demande);
                const isFormOpen = formOpenId === d.id_demande;
                return (
                  <div key={d.id_demande} style={{ background: bgCard, border: '1px solid ' + border, borderRadius: '16px', padding: '1.25rem 1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                      <div>
                        <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: text, margin: '0 0 4px' }}>{d.matiere}</h3>
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '6px' }}>
                          <span style={{ fontSize: '0.72rem', color: muted, display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <MapPin size={12} color="#e04f00" /> {d.ville}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: muted, display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Wallet size={12} color="#e04f00" /> Budget max : {d.budgetMax} MAD/h
                          </span>
                        </div>
                        <p style={{ fontSize: '0.78rem', color: muted, margin: '0 0 4px', lineHeight: 1.6 }}>{d.message}</p>
                        <span style={{ fontSize: '0.65rem', color: muted }}>
                          Par {d.etudiant?.prenom} {d.etudiant?.nom} — {new Date(d.created_at).toLocaleDateString('fr-FR')}
                        </span>
                      </div>

                      {postule ? (
                        <span style={{ fontSize: '0.65rem', padding: '6px 14px', borderRadius: '20px', fontWeight: 700, fontFamily: 'monospace', background: 'rgba(34,197,94,0.1)', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                          <CheckCircle size={12} /> OFFRE ENVOYÉE
                        </span>
                      ) : (
                        <button onClick={() => { setFormOpenId(isFormOpen ? null : d.id_demande); setError(''); }} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '10px', background: isFormOpen ? 'transparent' : '#e04f00', border: isFormOpen ? '1px solid ' + border : 'none', color: isFormOpen ? muted : '#fff', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'monospace', flexShrink: 0 }}>
                          {isFormOpen ? <><X size={13} /> Annuler</> : <><Send size={13} /> Faire une offre</>}
                        </button>
                      )}
                    </div>

                    {/* Formulaire offre */}
                    {isFormOpen && !postule && (
                      <div style={{ marginTop: '1rem', padding: '1rem', background: bgSurf, border: '1px solid ' + border, borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {error && <p style={{ fontSize: '0.72rem', color: '#dc2626', margin: 0, fontWeight: 700 }}>{error}</p>}
                        <input type="number" min="0" value={prix} onChange={e => setPrix(e.target.value)} placeholder="Votre prix proposé (MAD/h)" style={{ background: inputBg, border: '1px solid ' + inputBorder, color: text, borderRadius: '8px', padding: '8px 12px', fontSize: '0.78rem', outline: 'none' }} />
                        <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Présentez-vous et votre méthode pédagogique..." rows={2} style={{ background: inputBg, border: '1px solid ' + inputBorder, color: text, borderRadius: '8px', padding: '8px 12px', fontSize: '0.78rem', outline: 'none', resize: 'vertical' }} />
                        <button onClick={() => handleEnvoyer(d.id_demande)} disabled={sending} style={{ alignSelf: 'flex-end', padding: '7px 16px', borderRadius: '8px', background: sending ? '#e5e7eb' : '#e04f00', color: sending ? muted : '#fff', border: 'none', fontSize: '0.72rem', fontWeight: 800, cursor: sending ? 'not-allowed' : 'pointer', fontFamily: 'monospace' }}>
                          {sending ? 'Envoi...' : 'Envoyer ma proposition'}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}