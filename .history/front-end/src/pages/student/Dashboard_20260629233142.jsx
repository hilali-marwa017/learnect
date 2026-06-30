import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  MessageSquare, 
  Gift, 
  ClipboardList 
} from 'lucide-react';
import api from '../../api/axios';

export function StudentNavigationActive({ activeTab, isDark }) {
  const bg = isDark ? '#1a1a1c' : '#f8f9fc';
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const text = isDark ? '#d1d5db' : '#374151';
  const muted = isDark ? '#6b7280' : '#9ca3af';

  const [msgCount, setMsgCount] = useState(0);

  useEffect(() => {
    async function fetchCounts() {
      try {
        const msgRes = await api.get('/messages/non-lus');
        setMsgCount(msgRes.data?.non_lus || 0);
      } catch (e) {
        console.error(e);
      }
    }
    fetchCounts();
    const interval = setInterval(fetchCounts, 30000);
    return () => clearInterval(interval);
  }, []);

  const links = [
    { label: 'Tableau de bord', path: '/student', icon: LayoutDashboard, id: 'dashboard' },
    { label: 'Réservations', path: '/student/reservations', icon: Calendar, id: 'reservations' },
    { label: 'Messagerie', path: '/student/messages', icon: MessageSquare, id: 'messages', badge: msgCount },
    { label: 'Offres et Packs', path: '/student/offres', icon: Gift, id: 'offres' },
    { label: 'Mes Demandes', path: '/student/requests', icon: ClipboardList, id: 'requests' },
  ];

  return (
    <div style={{ 
      background: bg, 
      border: '1px solid ' + border, 
      borderRadius: '16px', 
      padding: '1rem', 
      width: '220px', 
      flexShrink: 0 
    }}>
      <div style={{ 
        fontSize: '0.6rem', 
        letterSpacing: '0.12em', 
        color: muted, 
        fontWeight: 700, 
        fontFamily: 'monospace', 
        padding: '0 0.75rem 0.75rem', 
        textTransform: 'uppercase' 
      }}>
        Menu Élève
      </div>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {links.map(link => {
          const Icon = link.icon;
          const isActive = activeTab === link.id;
          return (
            <Link 
              key={link.id} 
              to={link.path} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px', 
                padding: '10px 12px', 
                borderRadius: '10px', 
                fontSize: '0.82rem', 
                fontWeight: isActive ? 700 : 500, 
                textDecoration: 'none', 
                background: isActive ? '#e04f00' : 'transparent', 
                color: isActive ? '#ffffff' : text,
                transition: 'all 0.15s'
              }}
            >
              <Icon size={16} style={{ flexShrink: 0 }} />
              <span style={{ flex: 1 }}>{link.label}</span>
              {link.badge > 0 && (
                <span style={{ 
                  minWidth: '18px', 
                  height: '18px', 
                  background: isActive ? 'rgba(255,255,255,0.3)' : '#e04f00', 
                  color: '#fff', 
                  borderRadius: '999px', 
                  fontSize: '0.6rem', 
                  fontWeight: 800, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  padding: '0 4px' 
                }}>
                  {link.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}