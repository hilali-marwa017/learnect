import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Bell, Check, CheckCheck, Trash2, MessageSquare, CreditCard, Star, Calendar, Tag, BookOpen, ArrowLeft } from 'lucide-react';
import api from '../api/axios';

const TYPE_ICONS = {
  message: MessageSquare,
  paiement: CreditCard,
  avis: Star,
  reservation: Calendar,
  offre: Tag,
  cours: BookOpen,
};

const TYPE_COLORS = {
  message: '#3b82f6',
  paiement: '#10b981',
  avis: '#f59e0b',
  reservation: '#e04f00',
  offre: '#8b5cf6',
  cours: '#06b6d4',
};

function getIcon(type) {
  const Icon = TYPE_ICONS[type] || Bell;
  return <Icon size={16} />;
}

function getColor(type) {
  return TYPE_COLORS[type] || '#6b7280';
}

export default function Notifications() {
  const navigate = useNavigate();
  const context = useOutletContext();
  const isDark = context?.isDark || false;

  const bg = isDark ? '#0a0a0c' : '#ffffff';
  const bgCard = isDark ? '#1a1a1c' : '#ffffff';
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const text = isDark ? '#ffffff' : '#111827';
  const muted = isDark ? '#9ca3af' : '#6b7280';

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/notifications')
      .then(res => setNotifications(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function markRead(id) {
    try {
      await api.put('/notifications/' + id + '/read');
      setNotifications(prev => prev.map(n => n.id_notification === id ? { ...n, est_lue: true } : n));
    } catch (e) { console.error(e); }
  }

  async function markAllRead() {
    try {
      await api.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, est_lue: true })));
    } catch (e) { console.error(e); }
  }

  async function deleteNotification(id) {
    try {
      await api.delete('/notifications/' + id);
      setNotifications(prev => prev.filter(n => n.id_notification !== id));
    } catch (e) { console.error(e); }
  }

  const nonLues = notifications.filter(n => !n.est_lue).length;

  // Fonction retour
  function goBack() {
    navigate(-1);
  }

  return (
    <div style={{ minHeight: '100vh', background: bg, paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

        {/* Bouton Retour */}
        <button
          onClick={goBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'transparent',
            border: 'none',
            color: text,
            cursor: 'pointer',
            padding: '8px 4px',
            fontSize: '0.85rem',
            fontWeight: 600,
            width: 'fit-content',
            alignSelf: 'flex-start'
          }}
        >
          <ArrowLeft size={20} /> Retour
        </button>

        <div style={{ borderBottom: '1px solid ' + border, paddingBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.65rem', color: '#e04f00', fontWeight: 700, fontFamily: 'monospace', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>LEARNECT PLATFORM</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: 900, color: text, margin: '0 0 0.3rem', letterSpacing: '-0.02em' }}>Notifications</h1>
              <p style={{ fontSize: '0.8rem', color: muted, margin: 0 }}>
                {nonLues > 0 ? nonLues + ' non lue(s)' : 'Tout est lu'}
              </p>
            </div>
            {nonLues > 0 && (
              <button onClick={markAllRead} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', borderRadius: '10px', background: 'rgba(224,79,0,0.08)', border: '1px solid rgba(224,79,0,0.25)', color: '#e04f00', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', fontFamily: 'monospace' }}>
                <CheckCheck size={14} /> Tout marquer comme lu
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: muted }}>Chargement...</div>
        ) : notifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', background: bgCard, border: '1px solid ' + border, borderRadius: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(224,79,0,0.08)', border: '1px solid rgba(224,79,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bell size={24} color="#e04f00" />
            </div>
            <p style={{ fontSize: '0.85rem', color: muted, margin: 0 }}>Aucune notification pour le moment</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {notifications.map(n => {
              const color = getColor(n.type);
              return (
                <div key={n.id_notification} style={{ background: n.est_lue ? bgCard : (isDark ? 'rgba(224,79,0,0.04)' : 'rgba(224,79,0,0.03)'), border: '1px solid ' + (n.est_lue ? border : 'rgba(224,79,0,0.15)'), borderRadius: '14px', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: color + '15', border: '1px solid ' + color + '30', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: color }}>
                    {getIcon(n.type)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '0.82rem', color: text, fontWeight: n.est_lue ? 400 : 700, margin: '0 0 4px', lineHeight: 1.5 }}>{n.contenu}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.62rem', color: color, fontWeight: 700, fontFamily: 'monospace', background: color + '15', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>{n.type}</span>
                      <span style={{ fontSize: '0.65rem', color: muted }}>{new Date(n.created_at).toLocaleString('fr-FR')}</span>
                      {!n.est_lue && <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#e04f00', display: 'inline-block' }} />}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                    {!n.est_lue && (
                      <button onClick={() => markRead(n.id_notification)} style={{ width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', border: '1px solid rgba(34,197,94,0.3)', background: 'rgba(34,197,94,0.08)', color: '#16a34a', cursor: 'pointer' }}>
                        <Check size={13} />
                      </button>
                    )}
                    <button onClick={() => deleteNotification(n.id_notification)} style={{ width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', border: '1px solid rgba(220,38,38,0.2)', background: 'rgba(220,38,38,0.06)', color: '#dc2626', cursor: 'pointer' }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}