import React, { useState, useEffect } from 'react';
import { Search, UserCheck, UserX, Mail, MapPin } from 'lucide-react';
import api from '../../api/axios';

export default function AdminManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const isDark = false;
  const bgColor = isDark ? '#0a0a0c' : '#f8f9fc';
  const cardBg = isDark ? '#1a1a1c' : '#ffffff';
  const textColor = isDark ? '#ffffff' : '#07090d';
  const textMuted = isDark ? '#a1a4a5' : '#718096';
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const orange = '#e04f00';

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    const action = currentStatus === 'actif' ? 'bloquer' : 'debloquer';
    try {
      await api.put(`/admin/users/${userId}/${action}`);
      loadUsers();
      alert(`Utilisateur ${action === 'bloquer' ? 'bloqué' : 'débloqué'} avec succès`);
    } catch (err) {
      alert('Erreur');
    }
  };

  const filteredUsers = users.filter(u => 
    u.nom?.toLowerCase().includes(search.toLowerCase()) ||
    u.prenom?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Chargement...</div>;
  }

  return (
    <div style={{ paddingTop: '6rem', paddingBottom: '4rem', minHeight: '100vh', background: bgColor }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
        
        <div style={{ borderBottom: `1px solid ${borderColor}`, paddingBottom: '1rem', marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: textColor }}>Gestion des Utilisateurs</h1>
          <p style={{ color: textMuted }}>Gérez les comptes étudiants, enseignants et administrateurs</p>
        </div>

        {/* Search */}
        <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: '12px', padding: '0.75rem 1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Search size={18} color={textMuted} />
          <input
            type="text"
            placeholder="Rechercher par nom, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: textColor }}
          />
        </div>

        {/* Users list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filteredUsers.map(user => (
            <div key={user.id} style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: '12px', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ fontWeight: 700, color: textColor }}>{user.prenom} {user.nom}</div>
                <div style={{ fontSize: '0.7rem', color: textMuted, display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                  <Mail size={12} /> {user.email}
                  <MapPin size={12} style={{ marginLeft: '0.5rem' }} /> {user.ville}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ padding: '2px 8px', borderRadius: '20px', fontSize: '0.65rem', background: user.role === 'admin' ? orange : (user.role === 'enseignant' ? '#3b82f6' : '#10b981'), color: '#fff' }}>
                  {user.role === 'admin' ? 'Admin' : (user.role === 'enseignant' ? 'Tuteur' : 'Étudiant')}
                </span>
                <button
                  onClick={() => toggleUserStatus(user.id, user.statut)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: `1px solid ${user.statut === 'actif' ? '#dc2626' : '#10b981'}`,
                    background: 'transparent',
                    color: user.statut === 'actif' ? '#dc2626' : '#10b981',
                    cursor: 'pointer',
                    fontSize: '0.7rem'
                  }}
                >
                  {user.statut === 'actif' ? <UserX size={14} /> : <UserCheck size={14} />}
                  {user.statut === 'actif' ? 'Bloquer' : 'Débloquer'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}