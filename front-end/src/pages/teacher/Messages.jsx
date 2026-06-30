import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext, useLocation } from 'react-router-dom';
import { TeacherNavigationActive } from './Dashboard';
import { Send, Search, CheckCheck, MessageSquare, Trash2 } from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

export default function TeacherMessages() {
  const { user } = useAuth();
  const context = useOutletContext();
  const isDark = context?.isDark || false;
  const location = useLocation();
  const preselectedReservationId = location.state?.reservationId || null;

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
  const activeConvBg = isDark ? '#2a2a2c' : '#fff5f0';

  // groupé par étudiant
  const [grouped, setGrouped] = useState([]);
  const [activeGroup, setActiveGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [typedText, setTypedText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState('');
  const bottomRef = useRef(null);

  // Charger et grouper par étudiant
  useEffect(() => {
    async function fetchConversations() {
      try {
        const res = await api.get('/messages/conversations/enseignant');
        const data = res.data || [];

        const map = {};
        data.forEach(r => {
          const etudiantId = r.etudiant?.utilisateur_id || r.id_utilisateur;
          if (!etudiantId) return;
          if (!map[etudiantId]) {
            map[etudiantId] = {
              etudiantId,
              etudiantUser: r.etudiant,
              reservations: [],
            };
          }
          map[etudiantId].reservations.push(r);
        });

        const groups = Object.values(map);
        setGrouped(groups);

        if (groups.length > 0) {
          if (preselectedReservationId) {
            const matched = groups.find(g =>
              g.reservations.some(r => r.id_reservation === preselectedReservationId)
            );
            setActiveGroup(matched || groups[0]);
          } else {
            setActiveGroup(groups[0]);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchConversations();
  }, [preselectedReservationId]);

  // Charger les messages de toutes les réservations du groupe actif
  useEffect(() => {
    if (!activeGroup) return;
    setMessages([]);

    async function fetchMessages() {
      try {
        const responses = await Promise.all(
          activeGroup.reservations.map(r =>
            api.get(`/messages/conversations/${r.id_reservation}`)
          )
        );
        const merged = responses.flatMap(res => res.data || []);
        merged.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        setMessages(merged);

        await Promise.all(
          activeGroup.reservations.map(r =>
            api.put(`/messages/${r.id_reservation}/lu`).catch(() => {})
          )
        );
      } catch (e) {
        console.error('erreur chargement messages:', e);
      }
    }
    fetchMessages();
  }, [activeGroup?.etudiantId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend(e) {
    e.preventDefault();
    if (!typedText.trim() || !activeGroup) return;
    setSending(true);
    try {
      const lastReservation = activeGroup.reservations[activeGroup.reservations.length - 1];
      const res = await api.post('/messages', {
        contenu: typedText,
        id_destinataire: activeGroup.etudiantId,
        id_reservation: lastReservation.id_reservation,
      });
      setMessages(prev => [...prev, res.data.data]);
      setTypedText('');
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  }

  async function handleDelete(id_message) {
    try {
      await api.delete(`/messages/${id_message}`);
      setMessages(prev => prev.filter(m => m.id_message !== id_message));
    } catch (e) {
      console.error(e);
    }
  }

  const filteredGroups = grouped.filter(g => {
    const ens = g.etudiantUser;
    return `${ens?.prenom || ''} ${ens?.nom || ''}`.toLowerCase().includes(search.toLowerCase());
  });

  const etudiantDisplay = activeGroup?.etudiantUser;

  return (
    <div style={{ minHeight: '100vh', background: bg, paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

        <div style={{ borderBottom: '1px solid ' + border, paddingBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.65rem', color: '#e04f00', fontWeight: 700, fontFamily: 'monospace', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>LEARNECT PLATFORM</div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: text, margin: '0 0 0.4rem', letterSpacing: '-0.02em' }}>Mes Messages</h1>
          <p style={{ fontSize: '0.8rem', color: muted, margin: 0 }}>Échangez avec vos étudiants.</p>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <TeacherNavigationActive activeTab="messages" isDark={isDark} />

          <div style={{ flex: 1, minWidth: 0, background: bgCard, border: '1px solid ' + border, borderRadius: '20px', overflow: 'hidden', display: 'grid', gridTemplateColumns: '280px 1fr', minHeight: '500px' }}>

            {/* Liste conversations groupées par étudiant */}
            <div style={{ borderRight: '1px solid ' + border, display: 'flex', flexDirection: 'column', background: bgSurf }}>
              <div style={{ padding: '1rem', borderBottom: '1px solid ' + border, display: 'flex', alignItems: 'center', gap: '8px', background: bgCard }}>
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
                ) : filteredGroups.length === 0 ? (
                  <div style={{ padding: '2rem', textAlign: 'center', color: muted, fontSize: '0.75rem' }}>Aucune conversation</div>
                ) : (
                  filteredGroups.map(g => {
                    const isActive = activeGroup?.etudiantId === g.etudiantId;
                    const etudiant = g.etudiantUser;
                    return (
                      <button
                        key={g.etudiantId}
                        onClick={() => setActiveGroup(g)}
                        style={{
                          width: '100%', textAlign: 'left', padding: '1rem',
                          display: 'flex', gap: '12px', alignItems: 'center',
                          background: isActive ? activeConvBg : 'transparent',
                          borderLeft: isActive ? '3px solid #e04f00' : '3px solid transparent',
                          border: 'none', borderBottom: '1px solid ' + borderSub,
                          cursor: 'pointer', transition: 'all 0.15s'
                        }}
                      >
                        <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#e04f00', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <span style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 700 }}>
                            {etudiant?.prenom?.charAt(0)}{etudiant?.nom?.charAt(0)}
                          </span>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '2px' }}>
                            {etudiant?.prenom} {etudiant?.nom}
                          </div>
                          <span style={{ fontSize: '0.65rem', color: muted, fontFamily: 'monospace' }}>
                            {g.reservations.length} réservation{g.reservations.length > 1 ? 's' : ''}
                          </span>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Zone messages */}
            {activeGroup ? (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid ' + border, display: 'flex', alignItems: 'center', gap: '12px', background: bgCard }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#e04f00', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ color: '#fff', fontSize: '0.8rem', fontWeight: 700 }}>
                      {etudiantDisplay?.prenom?.charAt(0)}{etudiantDisplay?.nom?.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: text }}>
                      {etudiantDisplay?.prenom} {etudiantDisplay?.nom}
                    </div>
                    <div style={{ fontSize: '0.65rem', color: muted, fontFamily: 'monospace' }}>
                      {activeGroup.reservations.length} réservation{activeGroup.reservations.length > 1 ? 's' : ''} confirmée{activeGroup.reservations.length > 1 ? 's' : ''}
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
                            <div style={{ padding: '10px 14px', borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px', background: isMe ? '#e04f00' : msgBg, color: isMe ? '#ffffff' : text, fontSize: '0.82rem', lineHeight: 1.5, fontWeight: 500, border: isMe ? 'none' : '1px solid ' + border }}>
                              {msg.contenu}
                            </div>
                          </div>
                          <span style={{ fontSize: '0.65rem', color: muted, fontFamily: 'monospace', marginTop: '4px', paddingInline: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            {msg.created_at ? new Date(msg.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : "À l'instant"}
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
                    value={typedText}
                    onChange={e => setTypedText(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) handleSend(e); }}
                    placeholder="Tapez votre message..."
                    style={{ flex: 1, background: inputBg, border: '1px solid ' + inputBorder, color: text, borderRadius: '10px', padding: '10px 14px', fontSize: '0.82rem', outline: 'none' }}
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