import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { TeacherNavigationActive } from './Dashboard';
import { Send, Search, CheckCheck, MessageSquare, Trash2 } from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

export default function TeacherMessages() {
  const { user }  = useAuth();
  const context   = useOutletContext();
  const isDark    = context?.isDark || false;

  const bg          = isDark ? '#0a0a0c' : '#ffffff';
  const bgCard      = isDark ? '#1a1a1c' : '#ffffff';
  const bgSurf      = isDark ? '#111113' : '#f8f9fc';
  const border      = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const borderSub   = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  const text        = isDark ? '#ffffff' : '#111827';
  const muted       = isDark ? '#9ca3af' : '#6b7280';
  const inputBg     = isDark ? 'rgba(255,255,255,0.05)' : '#f8f9fc';
  const inputBorder = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const msgBg       = isDark ? 'rgba(255,255,255,0.06)' : '#f1f3f5';
  const activeConvBg = isDark ? '#2a2a2c' : '#fff5f0';

  const [reservations, setReservations] = useState([]);
  const [activeRes,    setActiveRes]    = useState(null);
  const [messages,     setMessages]     = useState([]);
  const [typedText,    setTypedText]    = useState('');
  const [loading,      setLoading]      = useState(true);
  const [sending,      setSending]      = useState(false);
  const [search,       setSearch]       = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    async function fetchConversations() {
      try {
        // ✅ URL corrigée + structure : tableau de creneaux avec reservations imbriquées
        const res = await api.get('/enseignant/reservations');
        const all = [];
        (res.data || []).forEach(creneau => {
          (creneau.reservations || []).forEach(r => {
            if (r.statut === 'confirmee') {
              // ✅ Normaliser : etudiant vient de r.etudiant.user (relation User)
              all.push({
                ...r,
                creneau,
                // etudiant_display = l'objet user de l'étudiant
                etudiant_display: r.etudiant?.user || r.etudiant || {},
              });
            }
          });
        });
        setReservations(all);
        if (all.length > 0) setActiveRes(all[0]);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    fetchConversations();
  }, []);

  useEffect(() => {
    if (!activeRes) return;
    async function fetchMessages() {
      try {
        const res = await api.get(`/messages/conversations/${activeRes.id_reservation}`);
        setMessages(res.data || []);
      } catch (e) { console.error(e); }
    }
    fetchMessages();
  }, [activeRes]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend(e) {
    e.preventDefault();
    if (!typedText.trim() || !activeRes) return;
    setSending(true);
    try {
      const res = await api.post('/messages', {
        contenu:         typedText,
        id_destinataire: activeRes.id_utilisateur,
        id_reservation:  activeRes.id_reservation,
      });
      setMessages(prev => [...prev, res.data.data]);
      setTypedText('');
    } catch (e) { console.error(e); }
    finally { setSending(false); }
  }

  async function handleDelete(id_message) {
    try {
      await api.delete(`/messages/${id_message}`);
      setMessages(prev => prev.filter(m => m.id_message !== id_message));
    } catch (e) { console.error(e); }
  }

  const filteredReservations = reservations.filter(r => {
    const d = r.etudiant_display;
    return `${d?.prenom || ''} ${d?.nom || ''}`.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div style={{ minHeight: '100vh', background: bg, paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

        <div style={{ borderBottom: `1px solid ${border}`, paddingBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.65rem', color: '#e04f00', fontWeight: 700, fontFamily: 'monospace', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>LEARNECT PROF PLATFORM</div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: text, margin: '0 0 0.4rem', letterSpacing: '-0.02em' }}>Messagerie Sécurisée</h1>
          <p style={{ fontSize: '0.8rem', color: muted, margin: 0 }}>Échangez avec vos étudiants après confirmation de réservation.</p>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <TeacherNavigationActive activeTab="messages" isDark={isDark} />

          <div style={{ flex: 1, minWidth: 0, background: bgCard, border: `1px solid ${border}`, borderRadius: '20px', overflow: 'hidden', display: 'grid', gridTemplateColumns: '280px 1fr', minHeight: '500px' }}>

            {/* Sidebar */}
            <div style={{ borderRight: `1px solid ${border}`, display: 'flex', flexDirection: 'column', background: bgSurf }}>
              <div style={{ padding: '1rem', borderBottom: `1px solid ${border}`, display: 'flex', alignItems: 'center', gap: '8px', background: bgCard }}>
                <Search size={14} color={muted} style={{ flexShrink: 0 }} />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Rechercher un étudiant..."
                  style={{ background: 'none', border: 'none', outline: 'none', color: text, fontSize: '0.78rem', width: '100%' }}
                />
              </div>

              <div style={{ flex: 1, overflowY: 'auto' }}>
                {loading ? (
                  <div style={{ padding: '2rem', textAlign: 'center', color: muted, fontSize: '0.75rem' }}>Chargement...</div>
                ) : filteredReservations.length === 0 ? (
                  <div style={{ padding: '2rem', textAlign: 'center', color: muted, fontSize: '0.75rem' }}>Aucune conversation</div>
                ) : (
                  filteredReservations.map(r => {
                    const isActive = activeRes?.id_reservation === r.id_reservation;
                    const d = r.etudiant_display;
                    return (
                      <button
                        key={r.id_reservation}
                        onClick={() => setActiveRes(r)}
                        style={{ width: '100%', textAlign: 'left', padding: '1rem', display: 'flex', gap: '12px', alignItems: 'center', background: isActive ? activeConvBg : 'transparent', borderLeft: isActive ? '3px solid #e04f00' : '3px solid transparent', border: 'none', borderBottom: `1px solid ${borderSub}`, cursor: 'pointer', transition: 'all 0.15s' }}
                      >
                        <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#e04f00', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <span style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 700 }}>
                            {d?.prenom?.charAt(0)}{d?.nom?.charAt(0)}
                          </span>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '2px' }}>
                            {d?.prenom} {d?.nom}
                          </div>
                          <span style={{ fontSize: '0.65rem', color: '#e04f00', fontWeight: 700, fontFamily: 'monospace', textTransform: 'uppercase' }}>
                            {r.creneau?.jour} {r.creneau?.heureDebut?.slice(0,5)}
                          </span>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Zone chat */}
            {activeRes ? (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '1rem 1.25rem', borderBottom: `1px solid ${border}`, display: 'flex', alignItems: 'center', gap: '12px', background: bgCard }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#e04f00', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ color: '#fff', fontSize: '0.8rem', fontWeight: 700 }}>
                      {activeRes.etudiant_display?.prenom?.charAt(0)}{activeRes.etudiant_display?.nom?.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: text }}>
                      {activeRes.etudiant_display?.prenom} {activeRes.etudiant_display?.nom}
                    </div>
                    <div style={{ fontSize: '0.65rem', color: '#e04f00', fontWeight: 700, fontFamily: 'monospace', textTransform: 'uppercase' }}>
                      {activeRes.creneau?.jour} — {activeRes.creneau?.heureDebut?.slice(0,5)} à {activeRes.creneau?.heureFin?.slice(0,5)}
                    </div>
                  </div>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '380px', background: bgSurf }}>
                  {messages.length === 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: '1rem', padding: '2rem' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(224,79,0,0.08)', border: '1px solid rgba(224,79,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <MessageSquare size={22} color="#e04f00" />
                      </div>
                      <p style={{ fontSize: '0.8rem', color: muted, margin: 0 }}>Aucun message pour le moment</p>
                    </div>
                  ) : (
                    messages.map((msg, i) => {
                      const isMe = msg.id_expediteur === user?.utilisateur_id;
                      return (
                        <div key={msg.id_message || i} style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start', maxWidth: '80%', alignSelf: isMe ? 'flex-end' : 'flex-start' }}>
                          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px' }}>
                            {isMe && (
                              <button onClick={() => handleDelete(msg.id_message)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(239,68,68,0.4)', padding: 0, display: 'flex' }}>
                                <Trash2 size={12} />
                              </button>
                            )}
                            <div style={{ padding: '10px 14px', borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px', background: isMe ? '#e04f00' : msgBg, color: isMe ? '#ffffff' : text, fontSize: '0.82rem', lineHeight: 1.5, fontWeight: 500, border: isMe ? 'none' : `1px solid ${border}` }}>
                              {msg.contenu}
                            </div>
                          </div>
                          <span style={{ fontSize: '0.65rem', color: muted, fontFamily: 'monospace', marginTop: '4px', paddingInline: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            {msg.created_at ? new Date(msg.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : "A l'instant"}
                            {isMe && <CheckCheck size={12} color="#2563eb" />}
                          </span>
                        </div>
                      );
                    })
                  )}
                  <div ref={bottomRef} />
                </div>

                <div
                  onSubmit={handleSend}
                  style={{ padding: '1rem 1.25rem', borderTop: `1px solid ${border}`, display: 'flex', gap: '10px', background: bgCard }}
                >
                  <input
                    type="text"
                    value={typedText}
                    onChange={e => setTypedText(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) handleSend(e); }}
                    placeholder="Tapez votre message..."
                    style={{ flex: 1, background: inputBg, border: `1px solid ${inputBorder}`, color: text, borderRadius: '10px', padding: '10px 14px', fontSize: '0.82rem', outline: 'none' }}
                  />
                  <button
                    onClick={handleSend}
                    disabled={sending}
                    style={{ background: sending ? (isDark ? 'rgba(255,255,255,0.05)' : '#e5e7eb') : '#111827', color: sending ? muted : '#ffffff', border: 'none', borderRadius: '10px', padding: '10px 18px', cursor: sending ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
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