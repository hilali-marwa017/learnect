import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { StudentNavigationActive } from './Dashboard';
import { Award, Check, X, CheckCircle, MessageSquare, ExternalLink } from 'lucide-react';
import api from '../../api/axios';

export default function StudentOffres() {
  const context = useOutletContext();
  const navigate = useNavigate();
  const isDark = context?.isDark || false;

  const bg        = isDark ? '#0a0a0c' : '#ffffff';
  const bgCard    = isDark ? '#1a1a1c' : '#ffffff';
  const bgSurf    = isDark ? '#1a1a1c' : '#f8f9fc';
  const border    = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const borderSub = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  const text      = isDark ? '#ffffff' : '#111827';
  const muted     = isDark ? '#9ca3af' : '#6b7280';

  const [demandes, setDemandes]         = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [activeTab, setActiveTab]       = useState(null);

  useEffect(() => {
    async function fetchAll() {
      try {
        const [demRes, resRes] = await Promise.all([
          api.get('/demandes/mes-demandes'),
          api.get('/reservations'),
        ]);
        const data = demRes.data || [];
        setDemandes(data);
        if (data.length > 0) setActiveTab(data[0].id_demande);
        const resData = resRes.data || [];
        setReservations(resData);

        // DEBUG : voir la structure exacte des reservations
        console.log('=== RESERVATIONS CHARGEES ===');
        resData.forEach(r => {
          console.log({
            id_reservation: r.id_reservation,
            statut: r.statut,
            creneau: r.creneau,
            'creneau.id_enseignant': r.creneau?.id_enseignant,
            'creneau.enseignant': r.creneau?.enseignant,
            'creneau.enseignant.utilisateur_id': r.creneau?.enseignant?.utilisateur_id,
          });
        });
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    fetchAll();
  }, []);

  async function fetchOffres(id_demande) {
    try {
      const res = await api.get('/offres/demande/' + id_demande);
      setDemandes(prev => prev.map(d => d.id_demande === id_demande ? { ...d, offres: res.data } : d));
    } catch (e) { console.error(e); }
  }

  async function handleAccepter(id_offre, id_demande) {
    if (!window.confirm('Accepter cette offre ?')) return;
    try {
      await api.put('/offres/' + id_offre + '/accepter');
      setDemandes(prev => prev.map(d => {
        if (d.id_demande !== id_demande) return d;
        return {
          ...d,
          offres: (d.offres || []).map(o => {
            if (o.id_offre === id_offre) return { ...o, statut: 'acceptee' };
            if (o.statut === 'en_attente') return { ...o, statut: 'refusee' };
            return o;
          })
        };
      }));
    } catch (e) { alert(e.response?.data?.message || 'Erreur.'); }
  }

  async function handleRefuser(id_offre, id_demande) {
    if (!window.confirm('Refuser cette offre ?')) return;
    try {
      await api.put('/offres/' + id_offre + '/refuser');
      setDemandes(prev => prev.map(d => {
        if (d.id_demande !== id_demande) return d;
        return {
          ...d,
          offres: (d.offres || []).map(o =>
            o.id_offre === id_offre ? { ...o, statut: 'refusee' } : o
          )
        };
      }));
    } catch (e) { alert(e.response?.data?.message || 'Erreur.'); }
  }

  function handleContacter(offre) {
    const ensId = Number(offre.enseignant?.utilisateur_id || offre.id_enseignant);

    console.log('=== CONTACTER CLICKED ===');
    console.log('ensId from offre:', ensId);
    console.log('offre complete:', offre);
    console.log('reservations disponibles:', reservations.map(r => ({
      id_reservation: r.id_reservation,
      statut: r.statut,
      'creneau.id_enseignant': r.creneau?.id_enseignant,
      'creneau.enseignant.utilisateur_id': r.creneau?.enseignant?.utilisateur_id,
      creneau_complet: r.creneau,
    })));

    const res = reservations.find(r => {
      if (r.statut !== 'confirmee') return false;
      const ids = [
        r.creneau?.enseignant?.utilisateur_id,
        r.creneau?.id_enseignant,
        r.creneau?.enseignant?.user?.utilisateur_id,
      ].map(Number).filter(Boolean);
      console.log('ids pour reservation', r.id_reservation, ':', ids, '| match:', ids.includes(ensId));
      return ids.includes(ensId);
    });

    console.log('reservation trouvee:', res ? res.id_reservation : 'AUCUNE');

    navigate('/student/messages', {
      state: { reservationId: res ? res.id_reservation : null }
    });
  }

  const activeDemande = demandes.find(d => d.id_demande === activeTab);

  return (
    <div style={{ minHeight: '100vh', background: bg, paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

        <div style={{ borderBottom: '1px solid ' + border, paddingBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.65rem', color: '#e04f00', fontWeight: 700, fontFamily: 'monospace', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>LEARNECT PLATFORM</div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: text, margin: '0 0 0.4rem', letterSpacing: '-0.02em' }}>Offres des Professeurs</h1>
          <p style={{ fontSize: '0.8rem', color: muted, margin: 0 }}>Consultez et acceptez les propositions des tuteurs pour vos demandes.</p>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <StudentNavigationActive activeTab="offres" isDark={isDark} />

          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: muted, fontSize: '0.8rem' }}>Chargement...</div>
            ) : demandes.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', background: bgCard, border: '1px solid ' + border, borderRadius: '20px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(224,79,0,0.08)', border: '1px solid rgba(224,79,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Award size={22} color="#e04f00" />
                </div>
                <p style={{ fontSize: '0.82rem', color: muted, margin: 0, fontWeight: 600 }}>Aucune demande publiee — les offres apparaitront ici</p>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {demandes.map(d => {
                    const nbOffresEnAttente = (d.offres || []).filter(o => o.statut === 'en_attente').length;
                    const isActive = activeTab === d.id_demande;
                    return (
                      <button
                        key={d.id_demande}
                        onClick={() => { setActiveTab(d.id_demande); fetchOffres(d.id_demande); }}
                        style={{ position: 'relative', padding: '8px 16px', borderRadius: '10px', border: '1px solid ' + (isActive ? '#e04f00' : border), background: isActive ? '#e04f00' : 'transparent', color: isActive ? '#ffffff' : muted, fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'monospace' }}
                      >
                        {d.matiere}
                        {nbOffresEnAttente > 0 && (
                          <span style={{ position: 'absolute', top: '-8px', right: '-8px', minWidth: '18px', height: '18px', background: isActive ? '#fff' : '#e04f00', color: isActive ? '#e04f00' : '#fff', borderRadius: '999px', fontSize: '0.6rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px' }}>
                            {nbOffresEnAttente}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {activeDemande && (
                  <div style={{ background: bgCard, border: '1px solid ' + border, borderRadius: '20px', padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '0.8rem', fontWeight: 700, color: text, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 1rem', paddingBottom: '0.75rem', borderBottom: '1px solid ' + borderSub }}>
                      Propositions pour : {activeDemande.matiere}
                    </h3>

                    {!activeDemande.offres ? (
                      <div style={{ textAlign: 'center', padding: '2rem', color: muted, fontSize: '0.8rem' }}>
                        <button onClick={() => fetchOffres(activeDemande.id_demande)} style={{ background: 'none', border: 'none', color: '#e04f00', cursor: 'pointer', fontWeight: 700, fontSize: '0.78rem' }}>
                          Charger les offres
                        </button>
                      </div>
                    ) : activeDemande.offres.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '2rem', color: muted, fontSize: '0.8rem' }}>
                        Aucune offre recue pour cette demande pour le moment.
                      </div>
                    ) : (
                      activeDemande.offres.map((o, i) => {
                        const ensId = o.enseignant?.utilisateur_id || o.id_enseignant;
                        const msgOffre = o.message ? (o.message.length > 120 ? o.message.slice(0, 120) + '...' : o.message) : '';

                        return (
                          <div key={o.id_offre} style={{ padding: '1.25rem', borderRadius: '14px', background: bgSurf, border: '1px solid ' + border, marginBottom: i < activeDemande.offres.length - 1 ? '0.75rem' : 0 }}>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#e04f00', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                  <span style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 700 }}>{o.enseignant?.user?.prenom?.charAt(0)}{o.enseignant?.user?.nom?.charAt(0)}</span>
                                </div>
                                <div>
                                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: text }}>{o.enseignant?.user?.prenom} {o.enseignant?.user?.nom}</div>
                                  <div style={{ fontSize: '0.7rem', color: '#e04f00', fontWeight: 700 }}>{o.enseignant?.titre || 'Professeur'}</div>
                                  {ensId && (
                                    <button onClick={() => navigate('/teachers/' + ensId)} style={{ background: 'none', border: '1px solid ' + border, borderRadius: '6px', cursor: 'pointer', color: muted, fontSize: '0.65rem', fontWeight: 600, padding: '2px 8px', display: 'inline-flex', alignItems: 'center', gap: '3px', marginTop: '4px' }}>
                                      <ExternalLink size={10} /> Voir profil
                                    </button>
                                  )}
                                </div>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '1.05rem', fontWeight: 900, color: text }}>{o.prix} MAD/h</span>
                                <span style={{ fontSize: '0.6rem', padding: '3px 10px', borderRadius: '20px', fontWeight: 700, fontFamily: 'monospace', background: o.statut === 'acceptee' ? 'rgba(34,197,94,0.1)' : o.statut === 'refusee' ? 'rgba(220,38,38,0.08)' : 'rgba(245,158,11,0.1)', color: o.statut === 'acceptee' ? '#16a34a' : o.statut === 'refusee' ? '#dc2626' : '#d97706' }}>
                                  {o.statut === 'acceptee' ? 'ACCEPTEE' : o.statut === 'refusee' ? 'REFUSEE' : 'EN ATTENTE'}
                                </span>
                              </div>
                            </div>

                            {msgOffre && (
                              <p style={{ fontSize: '0.78rem', color: muted, margin: '0.75rem 0 0', lineHeight: 1.6, padding: '10px 12px', background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)', borderRadius: '8px', borderLeft: '3px solid rgba(224,79,0,0.3)', fontStyle: 'italic' }}>
                                "{msgOffre}"
                              </p>
                            )}

                            {o.statut === 'en_attente' && (
                              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '1rem' }}>
                                <button onClick={() => handleRefuser(o.id_offre, activeDemande.id_demande)} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 14px', borderRadius: '8px', border: '1px solid rgba(220,38,38,0.3)', background: 'rgba(220,38,38,0.06)', color: '#dc2626', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}>
                                  <X size={13} /> Refuser
                                </button>
                                <button onClick={() => handleAccepter(o.id_offre, activeDemande.id_demande)} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 14px', borderRadius: '8px', border: '1px solid rgba(34,197,94,0.3)', background: 'rgba(34,197,94,0.08)', color: '#16a34a', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}>
                                  <Check size={13} /> Accepter
                                </button>
                              </div>
                            )}

                            {o.statut === 'acceptee' && (
                              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '1rem' }}>
                                <button
                                  onClick={() => handleContacter(o)}
                                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 20px', borderRadius: '10px', background: '#e04f00', border: 'none', color: '#fff', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', fontFamily: 'monospace' }}
                                >
                                  <MessageSquare size={14} /> Contacter le professeur
                                </button>
                              </div>
                            )}

                            {o.statut === 'refusee' && (
                              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.75rem' }}>
                                <span style={{ fontSize: '0.65rem', color: muted, fontFamily: 'monospace' }}>Offre refusee</span>
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}