import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext, useNavigate, useLocation } from 'react-router-dom';
import { StudentNavigationActive } from './Dashboard';
import { Send, Search, CheckCheck, MessageSquare, Trash2, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

export default function StudentMessages() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const context = useOutletContext();
  const isDark = context?.isDark || false;

  // couleurs
  const bg = isDark ? '#0a0a0c' : '#ffffff';
  const bgCard = isDark ? '#1a1a1c' : '#ffffff';
  const bgSurf = isDark ? '#111113' : '#f8f9fc';
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const borderSub = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  const text = isDark ? '#ffffff' : '#111827';
  const muted = isDark ? '#9ca3af' : '#6b7280';
  const inputBg = isDark ? 'rgba(255,255,255,0.05)' : '#f8f9fc';
  const inputBorder = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const msgBg = isDark ? 'rgba(255,255,255,0.06)' : '#f1f3f5';
  const activeBg = isDark ? '#2a2a2c' : '#fff5f0';

  // etats
  const [convs, setConvs] = useState([]);
  const [active, setActive] = useState(null);
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState('');
  const [load, setLoad] = useState(true);
  const [sendLoad, setSendLoad] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [showReservations, setShowReservations] = useState({});
  const bottomRef = useRef(null);

  const targetId = location.state?.reservationId ?? null;

  // fonctions pures
  const groupByProf = (reservations) => {
    const grouped = reservations.reduce((acc, r) => {
      const profId = r.creneau?.enseignant?.utilisateur_id || r.creneau?.id_enseignant;
      if (!profId) return acc;
      
      if (!acc[profId]) {
        acc[profId] = {
          id: profId,
          prof: r.creneau?.enseignant,
          reservations: []
        };
      }
      acc[profId].reservations.push(r);
      return acc;
    }, {});
    
    return Object.values(grouped);
  };

  const filterConvs = (convs, term) => {
    return convs.filter(c => {
      const prenom = c.prof?.user?.prenom || '';
      const nom = c.prof?.user?.nom || '';
      return (prenom + ' ' + nom).toLowerCase().includes(term.toLowerCase());
    });
  };

  const formatHour = (date) => {
    if (!date) return "À l'instant";
    return new Date(date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const getInitials = (p, n) => {
    return (p?.charAt(0) || '') + (n?.charAt(0) || '');
  };

  const getFullName = (p, n) => {
    return (p || '') + ' ' + (n || '');
  };

  const getReservationsList = (reservations) => {
    return reservations.map(r => ({
      id: r.id_reservation,
      jour: r.creneau?.jour || '',
      debut: r.creneau?.heureDebut?.slice(0, 5) || '',
      fin: r.creneau?.heureFin?.slice(0, 5) || '',
      date: r.date || ''
    }));
  };

  // fonctions async
  const sendMsg = async (txt, conv) => {
    if (!txt.trim() || !conv) return null;
    try {
      const first = conv.reservations[0];
      const destinataire = first.creneau?.enseignant?.utilisateur_id || first.creneau?.id_enseignant;
      const res = await api.post('/messages', {
        contenu: txt,
        id_destinataire: destinataire,
        id_reservation: first.id_reservation,
      });
      return res.data.data;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const deleteMsg = async (id) => {
    try {
      await api.delete('/messages/' + id);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const loadConvs = async () => {
    try {
      const res = await api.get('/reservations');
      const confirmed = (res.data || []).filter(r => r.statut === 'confirmee');
      const grouped = groupByProf(confirmed);
      setConvs(grouped);

      if (grouped.length > 0) {
        let target = null;
        if (targetId) {
          target = grouped.find(c => 
            c.reservations.some(r => r.id_reservation === Number(targetId))
          );
        }
        setActive(target || grouped[0]);
      }
    } catch (e) { 
      console.error('erreur:', e); 
    } finally { 
      setLoad(false); 
    }
  };

  // effets
  useEffect(() => {
    loadConvs();
  }, []);

  useEffect(() => {
    if (!active) return;
    async function fetchMsgs() {
      try {
        const first = active.reservations[0];
        const res = await api.get('/messages/conversations/' + first.id_reservation);
        setMsgs(res.data || []);
        try { 
          await api.put('/messages/' + first.id_reservation + '/lu'); 
        } catch (e) {}
      } catch (e) { 
        console.error('erreur:', e); 
      }
    }
    fetchMsgs();
  }, [active]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs]);

  // gestionnaires
  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !active || sendLoad) return;
    setSendLoad(true);
    const newMsg = await sendMsg(text, active);
    if (newMsg) {
      setMsgs(prev => [...prev, newMsg]);
      setText('');
    }
    setSendLoad(false);
  };

  const handleDelete = async (id) => {
    const deleted = await deleteMsg(id);
    if (deleted) {
      setMsgs(prev => prev.filter(m => m.id_message !== id));
    }
  };

  const toggleReservations = (id) => {
    setShowReservations(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filtered = filterConvs(convs, searchVal);
  const activeReservations = active ? getReservationsList(active.reservations) : [];

  return (
    <div style={{ minHeight: '100vh', background: bg, paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

        {/* header */}
        <div style={{ borderBottom: '1px solid ' + border, paddingBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.65rem', color: '#e04f00', fontWeight: 700, fontFamily: 'monospace', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            LEARNECT PLATFORM
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: text, margin: '0 0 0.4rem', letterSpacing: '-0.02em' }}>
            Messagerie Sécurisée
          </h1>
          <p style={{ fontSize: '0.8rem', color: muted, margin: 0 }}>
            Échangez avec vos professeurs après confirmation de réservation.
          </p>
        </div>

        {/* body */}
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <StudentNavigationActive activeTab="messages" isDark={isDark} />

          <div style={{ flex: 1, minWidth: 0, background: bgCard, border: '1px solid ' + border, borderRadius: '20px', overflow: 'hidden', display: 'grid', gridTemplateColumns: '280px 1fr', minHeight: '500px' }}>

            {/* liste conversations */}
            <div style={{ borderRight: '1px solid ' + border, display: 'flex', flexDirection: 'column', background: bgSurf }}>
              <div style={{ padding: '1rem', borderBottom: '1px solid ' + border, display: 'flex', alignItems: 'center', gap: '8px', background: bgCard }}>
                <Search size={14} color={muted} style={{ flexShrink: 0 }} />
                <input
                  type="text"
                  value={searchVal}
                  onChange={e => setSearchVal(e.target.value)}
                  placeholder="Rechercher un professeur..."
                  style={{ background: 'none', border: 'none', outline: 'none', color: text, fontSize: '0.78rem', width: '100%' }}
                />
              </div>

              <div style={{ flex: 1, overflowY: 'auto' }}>
                {load ? (
                  <div style={{ padding: '2rem', textAlign: 'center', color: muted, fontSize: '0.75rem' }}>
                    Chargement...
                  </div>
                ) : filtered.length === 0 ? (
                  <div style={{ padding: '2rem', textAlign: 'center', color: muted, fontSize: '0.75rem' }}>
                    Aucune conversation
                  </div>
                ) : (
                  filtered.map(c => {
                    const isActive = active?.id === c.id;
                    const prof = c.prof?.user;
                    const initials = getInitials(prof?.prenom, prof?.nom);
                    const fullName = getFullName(prof?.prenom, prof?.nom);
                    const nb = c.reservations.length;
                    const isExpanded = showReservations[c.id] || false;
                    
                    return (
                      <div key={c.id}>
                        <button
                          onClick={() => setActive(c)}
                          style={{
                            width: '100%', textAlign: 'left', padding: '1rem',
                            display: 'flex', gap: '12px', alignItems: 'flex-start',
                            background: isActive ? activeBg : 'transparent',
                            borderTop: 'none', borderRight: 'none',
                            borderBottom: '1px solid ' + borderSub,
                            borderLeft: isActive ? '3px solid #e04f00' : '3px solid transparent',
                            cursor: 'pointer', transition: 'all 0.15s'
                          }}
                        >
                          <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#e04f00', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <span style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 700 }}>
                              {initials}
                            </span>
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: isActive ? '#e04f00' : text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {fullName}
                              </div>
                              <span style={{ fontSize: '0.6rem', background: 'rgba(224,79,0,0.1)', color: '#e04f00', padding: '1px 8px', borderRadius: '10px', fontWeight: 700, marginLeft: '4px', flexShrink: 0 }}>
                                {nb}
                              </span>
                            </div>
                            <div style={{ fontSize: '0.62rem', color: muted, marginTop: '4px' }}>
                              {nb} réservation{nb > 1 ? 's' : ''}
                            </div>
                            {c.prof?.utilisateur_id && (
                              <span
                                onClick={e => { e.stopPropagation(); navigate('/teachers/' + c.prof.utilisateur_id); }}
                                style={{ fontSize: '0.62rem', color: '#2563eb', cursor: 'pointer', textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: '2px', marginTop: '4px' }}
                              >
                                <ExternalLink size={9} /> Voir profil
                              </span>
                            )}
                          </div>
                        </button>
                        
                        {isActive && nb > 1 && (
                          <div style={{ padding: '0 1rem 0.75rem 1rem', background: isActive ? activeBg : 'transparent', borderBottom: '1px solid ' + borderSub }}>
                            <button
                              onClick={() => toggleReservations(c.id)}
                              style={{ 
                                display: 'flex', alignItems: 'center', gap: '4px', 
                                background: 'none', border: 'none', color: muted, 
                                fontSize: '0.65rem', cursor: 'pointer', padding: '4px 0'
                              }}
                            >
                              {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                              {isExpanded ? 'Masquer' : 'Voir toutes les réservations'}
                            </button>
                            {isExpanded && (
                              <div style={{ marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                {c.reservations.map((r, idx) => (
                                  <div key={r.id_reservation} style={{ 
                                    fontSize: '0.6rem', color: muted, 
                                    padding: '4px 8px', background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
                                    borderRadius: '4px',
                                    borderLeft: idx === 0 ? '2px solid #e04f00' : '2px solid transparent'
                                  }}>
                                    {r.creneau?.jour} — {r.creneau?.heureDebut?.slice(0,5)} à {r.creneau?.heureFin?.slice(0,5)} — Le {r.date}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* chat */}
            {active ? (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid ' + border, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', background: bgCard }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#e04f00', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ color: '#fff', fontSize: '0.8rem', fontWeight: 700 }}>
                        {getInitials(active.prof?.user?.prenom, active.prof?.user?.nom)}
                      </span>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: text }}>
                        {getFullName(active.prof?.user?.prenom, active.prof?.user?.nom)}
                      </div>
                      <div style={{ fontSize: '0.6rem', color: muted }}>
                        {active.reservations.length} réservation{active.reservations.length > 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                  {active.prof?.utilisateur_id && (
                    <button
                      onClick={() => navigate('/teachers/' + active.prof.utilisateur_id)}
                      style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 14px', borderRadius: '8px', border: '1px solid ' + border, background: 'transparent', color: muted, fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer' }}
                    >
                      <ExternalLink size={12} /> Voir profil
                    </button>
                  )}
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '380px', background: bgSurf }}>
                  {msgs.length === 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: '1rem', padding: '2rem' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(224,79,0,0.08)', border: '1px solid rgba(224,79,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <MessageSquare size={22} color="#e04f00" />
                      </div>
                      <p style={{ fontSize: '0.8rem', color: muted, margin: 0 }}>
                        Aucun message. Envoyez le premier !
                      </p>
                    </div>
                  ) : (
                    msgs.map((msg, i) => {
                      const isMe = msg.id_expediteur === user?.utilisateur_id;
                      const time = formatHour(msg.created_at);
                      return (
                        <div key={msg.id_message || i} style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start', maxWidth: '80%', alignSelf: isMe ? 'flex-end' : 'flex-start' }}>
                          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px' }}>
                            {isMe && (
                              <button onClick={() => handleDelete(msg.id_message)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(239,68,68,0.4)', padding: 0, display: 'flex' }}>
                                <Trash2 size={12} />
                              </button>
                            )}
                            <div style={{ padding: '10px 14px', borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px', background: isMe ? '#e04f00' : msgBg, color: isMe ? '#ffffff' : text, fontSize: '0.82rem', lineHeight: 1.5, fontWeight: 500, border: isMe ? 'none' : '1px solid ' + border }}>
                              {msg.contenu}
                            </div>
                          </div>
                          <span style={{ fontSize: '0.65rem', color: muted, fontFamily: 'monospace', marginTop: '4px', paddingInline: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            {time}
                            {isMe && <CheckCheck size={12} color="#2563eb" />}
                          </span>
                        </div>
                      );
                    })
                  )}
                  <div ref={bottomRef} />
                </div>

                <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid ' + border, display: 'flex', gap: '10px', background: bgCard }}>
                  <input
                    type="text"
                    value={text}
                    onChange={e => setText(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleSend(e); }}
                    placeholder="Tapez votre message..."
                    style={{ flex: 1, background: inputBg, border: '1px solid ' + inputBorder, color: text, borderRadius: '10px', padding: '10px 14px', fontSize: '0.82rem', outline: 'none' }}
                  />
                  <button
                    onClick={handleSend}
                    disabled={sendLoad}
                    style={{ background: sendLoad ? (isDark ? 'rgba(255,255,255,0.05)' : '#e5e7eb') : '#111827', color: sendLoad ? muted : '#ffffff', border: 'none', borderRadius: '10px', padding: '10px 18px', cursor: sendLoad ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: '1rem', color: muted }}>
                <MessageSquare size={32} color="#e04f00" />
                <p style={{ fontSize: '0.85rem', margin: 0 }}>Sélectionnez une conversation</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}