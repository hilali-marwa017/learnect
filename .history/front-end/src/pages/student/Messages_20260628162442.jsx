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

  // configuration des couleurs selon le theme
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

  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [typedText, setTypedText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState('');
  const [expandedReservations, setExpandedReservations] = useState({});
  const bottomRef = useRef(null);

  // reservationId passe depuis Offres ou Reservations
  const targetReservationId = location.state?.reservationId ?? null;

  // fonction pure pour grouper les conversations par professeur
  const groupConversationsByProfessor = (reservations) => {
    const grouped = reservations.reduce((acc, r) => {
      const profId = r.creneau?.enseignant?.utilisateur_id || r.creneau?.id_enseignant;
      if (!profId) return acc;
      
      if (!acc[profId]) {
        acc[profId] = {
          id: profId,
          enseignant: r.creneau?.enseignant,
          reservations: [],
          dernierMessage: null
        };
      }
      acc[profId].reservations.push(r);
      return acc;
    }, {});
    
    return Object.values(grouped);
  };

  // fonction pure pour filtrer les conversations
  const filterConversations = (conversations, searchTerm) => {
    return conversations.filter(conv => {
      const prenom = conv.enseignant?.user?.prenom || '';
      const nom = conv.enseignant?.user?.nom || '';
      const fullName = prenom + ' ' + nom;
      return fullName.toLowerCase().includes(searchTerm.toLowerCase());
    });
  };

  // fonction pure pour formater l'heure
  const formatTime = (dateString) => {
    if (!dateString) return "À l'instant";
    return new Date(dateString).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  // fonction pure pour les initiales du professeur
  const getInitials = (prenom, nom) => {
    return (prenom?.charAt(0) || '') + (nom?.charAt(0) || '');
  };

  // fonction pure pour le nom complet du professeur
  const getFullName = (prenom, nom) => {
    return (prenom || '') + ' ' + (nom || '');
  };

  // fonction pure pour les reservations du professeur
  const getReservationsInfo = (reservations) => {
    return reservations.map(r => ({
      id: r.id_reservation,
      jour: r.creneau?.jour || '',
      heureDebut: r.creneau?.heureDebut?.slice(0, 5) || '',
      heureFin: r.creneau?.heureFin?.slice(0, 5) || '',
      date: r.date || '',
      statut: r.statut || ''
    }));
  };

  // fonction asynchrone pour envoyer un message
  const sendMessage = async (text, activeConversation) => {
    if (!text.trim() || !activeConversation) return null;
    try {
      const premiereReservation = activeConversation.reservations[0];
      const destinataire = premiereReservation.creneau?.enseignant?.utilisateur_id || premiereReservation.creneau?.id_enseignant;
      const res = await api.post('/messages', {
        contenu: text,
        id_destinataire: destinataire,
        id_reservation: premiereReservation.id_reservation,
      });
      return res.data.data;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  // fonction asynchrone pour supprimer un message
  const deleteMessage = async (id_message) => {
    try {
      await api.delete('/messages/' + id_message);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  // fonction asynchrone pour charger les conversations
  const loadConversations = async () => {
    try {
      const res = await api.get('/reservations');
      const confirmed = (res.data || []).filter(r => r.statut === 'confirmee');
      const grouped = groupConversationsByProfessor(confirmed);
      setConversations(grouped);

      if (grouped.length > 0) {
        let targetConv = null;
        if (targetReservationId) {
          targetConv = grouped.find(conv => 
            conv.reservations.some(r => r.id_reservation === Number(targetReservationId))
          );
        }
        setActiveConv(targetConv || grouped[0]);
      }
    } catch (e) { 
      console.error('erreur chargement conversations:', e); 
    } finally { 
      setLoading(false); 
    }
  };

  // recuperation des conversations
  useEffect(() => {
    loadConversations();
  }, []); // eslint-disable-line

  // recuperation des messages
  useEffect(() => {
    if (!activeConv) return;
    async function fetchMessages() {
      try {
        const premiereReservation = activeConv.reservations[0];
        const res = await api.get('/messages/conversations/' + premiereReservation.id_reservation);
        setMessages(res.data || []);
        try { 
          await api.put('/messages/' + premiereReservation.id_reservation + '/lu'); 
        } catch (e) {}
      } catch (e) { 
        console.error('erreur chargement messages:', e); 
      }
    }
    fetchMessages();
  }, [activeConv]);

  // scroll vers le dernier message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // gestionnaire d'envoi de message
  const handleSend = async (e) => {
    e.preventDefault();
    if (!typedText.trim() || !activeConv || sending) return;
    setSending(true);
    const newMsg = await sendMessage(typedText, activeConv);
    if (newMsg) {
      setMessages(prev => [...prev, newMsg]);
      setTypedText('');
    }
    setSending(false);
  };

  // gestionnaire de suppression de message
  const handleDelete = async (id_message) => {
    const deleted = await deleteMessage(id_message);
    if (deleted) {
      setMessages(prev => prev.filter(m => m.id_message !== id_message));
    }
  };

  // toggle affichage des reservations
  const toggleReservations = (convId) => {
    setExpandedReservations(prev => ({
      ...prev,
      [convId]: !prev[convId]
    }));
  };

  const filteredConversations = filterConversations(conversations, search);
  const activeReservations = activeConv ? getReservationsInfo(activeConv.reservations) : [];

  return (
    <div style={{ minHeight: '100vh', background: bg, paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

        {/* en-tete */}
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

        {/* contenu principal */}
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <StudentNavigationActive activeTab="messages" isDark={isDark} />

          <div style={{ flex: 1, minWidth: 0, background: bgCard, border: '1px solid ' + border, borderRadius: '20px', overflow: 'hidden', display: 'grid', gridTemplateColumns: '280px 1fr', minHeight: '500px' }}>

            {/* liste des conversations */}
            <div style={{ borderRight: '1px solid ' + border, display: 'flex', flexDirection: 'column', background: bgSurf }}>
              <div style={{ padding: '1rem', borderBottom: '1px solid ' + border, display: 'flex', alignItems: 'center', gap: '8px', background: bgCard }}>
                <Search size={14} color={muted} style={{ flexShrink: 0 }} />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Rechercher un professeur..."
                  style={{ background: 'none', border: 'none', outline: 'none', color: text, fontSize: '0.78rem', width: '100%' }}
                />
              </div>

              <div style={{ flex: 1, overflowY: 'auto' }}>
                {loading ? (
                  <div style={{ padding: '2rem', textAlign: 'center', color: muted, fontSize: '0.75rem' }}>
                    Chargement...
                  </div>
                ) : filteredConversations.length === 0 ? (
                  <div style={{ padding: '2rem', textAlign: 'center', color: muted, fontSize: '0.75rem' }}>
                    Aucune conversation disponible
                  </div>
                ) : (
                  filteredConversations.map(conv => {
                    const isActive = activeConv?.id === conv.id;
                    const prof = conv.enseignant?.user;
                    const initials = getInitials(prof?.prenom, prof?.nom);
                    const fullName = getFullName(prof?.prenom, prof?.nom);
                    const nbReservations = conv.reservations.length;
                    const isExpanded = expandedReservations[conv.id] || false;
                    
                    return (
                      <div key={conv.id}>
                        <button
                          onClick={() => setActiveConv(conv)}
                          style={{
                            width: '100%', textAlign: 'left', padding: '1rem',
                            display: 'flex', gap: '12px', alignItems: 'flex-start',
                            background: isActive ? activeConvBg : 'transparent',
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
                                {nbReservations}
                              </span>
                            </div>
                            <div style={{ fontSize: '0.62rem', color: muted, marginTop: '4px' }}>
                              {nbReservations} réservation{nbReservations > 1 ? 's' : ''}
                            </div>
                            {conv.enseignant?.utilisateur_id && (
                              <span
                                onClick={e => { e.stopPropagation(); navigate('/teachers/' + conv.enseignant.utilisateur_id); }}
                                style={{ fontSize: '0.62rem', color: '#2563eb', cursor: 'pointer', textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: '2px', marginTop: '4px' }}
                              >
                                <ExternalLink size={9} /> Voir profil
                              </span>
                            )}
                          </div>
                        </button>
                        
                        {/* afficher les reservations si actif */}
                        {isActive && nbReservations > 1 && (
                          <div style={{ padding: '0 1rem 0.75rem 1rem', background: isActive ? activeConvBg : 'transparent', borderBottom: '1px solid ' + borderSub }}>
                            <button
                              onClick={() => toggleReservations(conv.id)}
                              style={{ 
                                display: 'flex', alignItems: 'center', gap: '4px', 
                                background: 'none', border: 'none', color: muted, 
                                fontSize: '0.65rem', cursor: 'pointer', padding: '4px 0'
                              }}
                            >
                              {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                              {isExpanded ? 'Masquer les réservations' : 'Voir toutes les réservations'}
                            </button>
                            {isExpanded && (
                              <div style={{ marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                {conv.reservations.map((r, idx) => (
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

            {/* zone de chat */}
            {activeConv ? (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {/* en-tete du chat */}
                <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid ' + border, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', background: bgCard }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#e04f00', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ color: '#fff', fontSize: '0.8rem', fontWeight: 700 }}>
                        {getInitials(activeConv.enseignant?.user?.prenom, activeConv.enseignant?.user?.nom)}
                      </span>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: text }}>
                        {getFullName(activeConv.enseignant?.user?.prenom, activeConv.enseignant?.user?.nom)}
                      </div>
                      <div style={{ fontSize: '0.6rem', color: muted }}>
                        {activeConv.reservations.length} réservation{activeConv.reservations.length > 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                  {activeConv.enseignant?.utilisateur_id && (
                    <button
                      onClick={() => navigate('/teachers/' + activeConv.enseignant.utilisateur_id)}
                      style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 14px', borderRadius: '8px', border: '1px solid ' + border, background: 'transparent', color: muted, fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer' }}
                    >
                      <ExternalLink size={12} /> Voir profil
                    </button>
                  )}
                </div>

                {/* messages */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '380px', background: bgSurf }}>
                  {messages.length === 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: '1rem', padding: '2rem' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(224,79,0,0.08)', border: '1px solid rgba(224,79,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <MessageSquare size={22} color="#e04f00" />
                      </div>
                      <p style={{ fontSize: '0.8rem', color: muted, margin: 0 }}>
                        Aucun message pour le moment. Envoyez le premier !
                      </p>
                    </div>
                  ) : (
                    messages.map((msg, i) => {
                      const isMe = msg.id_expediteur === user?.utilisateur_id;
                      const time = formatTime(msg.created_at);
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

                {/* input d'envoi */}
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