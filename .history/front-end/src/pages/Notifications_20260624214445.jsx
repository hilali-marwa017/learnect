import React, { useState, useEffect } from 'react';
import { Bell, Check, CheckCheck, Trash2 } from 'lucide-react';
import api from '../../api/axios';

export default function Notifications() {
  // Utiliser un hook personnalisé pour le dark mode ou une approche différente
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Vérifier le dark mode via la classe sur l'élément html
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    checkDark();
    
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

  const bg = isDark ? '#0a0a0c' : '#ffffff';
  const bgCard = isDark ? '#1a1a1c' : '#ffffff';
  const bgSurf = isDark ? '#111113' : '#f8f9fc';
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const borderSub = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  const text = isDark ? '#ffffff' : '#111827';
  const muted = isDark ? '#9ca3af' : '#6b7280';

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  async function fetchNotifications() {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data || []);
    } catch (e) {
      console.error('Erreur chargement notifications:', e);
    } finally {
      setLoading(false);
    }
  }

  async function handleMarkRead(id) {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n =>
        n.id_notification === id ? { ...n, est_lue: true } : n
      ));
    } catch (e) {
      console.error('Erreur:', e);
    }
  }

  async function handleMarkAllRead() {
    try {
      await api.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, est_lue: true })));
    } catch (e) {
      console.error('Erreur:', e);
    }
  }

  async function handleDelete(id) {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n.id_notification !== id));
    } catch (e) {
      console.error('Erreur:', e);
    }
  }

  const unread = notifications.filter(n => !n.est_lue).length;

  const getIcon = (type) => {
    const icons = {
      'reservation': '📅',
      'message': '💬',
      'paiement': '💰',
      'avis': '⭐',
      'validation': '✅',
    };
    return icons[type] || '🔔';
  };

  const getColor = (type) => {
    const colors = {
      'reservation': '#2563eb',
      'message': '#e04f00',
      'paiement': '#16a34a',
      'avis': '#d97706',
      'validation': '#16a34a',
    };
    return colors[type] || '#6b7280';
  };

  return (
    <div style={{ minHeight: '100vh', background: bg, paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* Header */}
        <div style={{ borderBottom: `1px solid ${border}`, paddingBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.65rem', color: '#e04f00', fontWeight: 700, fontFamily: 'monospace', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>LEARNECT PLATFORM</div>
            <h1 style={{ fontSize: '2rem', fontWeight: 900, color: text, margin: '0 0 0.4rem', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <Bell size={28} color="#e04f00" />
              Notifications
              {unread > 0 && (
                <span style={{ background: '#e04f00', color: '#fff', fontSize: '0.7rem', fontWeight: 800, borderRadius: '999px', padding: '2px 10px', fontFamily: 'monospace' }}>
                  {unread} non lues
                </span>
              )}
            </h1>
          </div>
          {unread > 0 && (
            <button
              onClick={handleMarkAllRead}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '10px', background: isDark ? 'rgba(255,255,255,0.05)' : '#f8f9fc', border: `1px solid ${border}`, color: text, fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'monospace' }}
            >
              <CheckCheck size={14} /> Tout marquer comme lu
            </button>
          )}
        </div>

        {/* Liste */}
        <div style={{ background: bgCard, border: `1px solid ${border}`, borderRadius: '20px', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: muted, fontSize: '0.8rem' }}>Chargement...</div>
          ) : notifications.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(224,79,0,0.08)', border: '1px solid rgba(224,79,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bell size={24} color="#e04f00" />
              </div>
              <p style={{ color: muted, fontSize: '0.85rem', margin: 0 }}>Aucune notification pour le moment</p>
            </div>
          ) : (
            notifications.map((n, i) => (
              <div
                key={n.id_notification || i}
                style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '1rem 1.25rem', borderBottom: i < notifications.length - 1 ? `1px solid ${borderSub}` : 'none', background: n.est_lue ? 'transparent' : (isDark ? 'rgba(224,79,0,0.04)' : 'rgba(224,79,0,0.03)'), transition: 'background 0.15s' }}
              >
                {/* Dot non lu */}
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: n.est_lue ? 'transparent' : '#e04f00', flexShrink: 0, marginTop: '6px' }} />

                {/* Icone type */}
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${getColor(n.type)}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1rem' }}>
                  {getIcon(n.type)}
                </div>

                {/* Contenu */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '0.85rem', color: n.est_lue ? muted : text, margin: '0 0 4px', fontWeight: n.est_lue ? 400 : 600, lineHeight: 1.5 }}>
                    {n.contenu}
                  </p>
                  <span style={{ fontSize: '0.68rem', color: muted, fontFamily: 'monospace' }}>
                    {new Date(n.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                  {!n.est_lue && (
                    <button
                      onClick={() => handleMarkRead(n.id_notification)}
                      title="Marquer comme lu"
                      style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '8px', color: '#16a34a', cursor: 'pointer' }}
                    >
                      <Check size={13} />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(n.id_notification)}
                    title="Supprimer"
                    style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '8px', color: '#dc2626', cursor: 'pointer' }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}