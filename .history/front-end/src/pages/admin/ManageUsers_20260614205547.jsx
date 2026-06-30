import { useState } from 'react';
import { CheckCircle, XCircle, Trash2, AlertCircle } from 'lucide-react';
import api from '../../api/axios';

const orange = '#e04f00';
const bg = '#f8f9fc';
const card = '#ffffff';
const border = 'rgba(0,0,0,0.08)';
const text = '#07090d';
const muted = '#718096';

export function UsersTab({ users, setUsers }) {
  async function bloquer(userId, statut) {
    const action = statut === 'actif' ? 'bloquer' : 'debloquer';
    try {
      await api.put(`/admin/users/${userId}/${action}`);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, statut: statut === 'actif' ? 'bloque' : 'actif' } : u));
    } catch(e) { alert('Erreur'); }
  }

  async function supprimerUser(userId) {
    if (!window.confirm('Supprimer cet utilisateur ?')) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers(prev => prev.filter(u => u.id !== userId));
    } catch(e) { alert('Erreur'); }
  }

  return (
    <div style={{ background: card, border: `1px solid ${border}`, borderRadius: '16px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
      <div style={{ fontSize: '0.6rem', color: orange, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '4px' }}>ANNUAIRE</div>
      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: text, marginBottom: '1.25rem' }}>Comptes Utilisateurs ({users.length})</div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Utilisateur', 'Rôle', 'Ville', 'Statut', 'Actions'].map(h => (
                <th key={h} style={{ textAlign: h === 'Actions' ? 'right' : 'left', padding: '10px 12px', fontSize: '0.6rem', color: muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: `1px solid ${border}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: muted }}>Aucun utilisateur</td></tr>
            ) : users.map(u => (
              <tr key={u.id} style={{ borderBottom: `1px solid ${border}` }}>
                <td style={{ padding: '12px', fontSize: '0.78rem', color: text }}>
                  <div style={{ fontWeight: 600 }}>{u.prenom} {u.nom}</div>
                  <div style={{ fontSize: '0.65rem', color: muted }}>{u.email}</div>
                </td>
                <td style={{ padding: '12px' }}>
                  <span style={{ fontSize: '0.65rem', padding: '3px 8px', borderRadius: '20px', fontWeight: 700, background: u.role === 'admin' ? 'rgba(224,79,0,0.1)' : u.role === 'enseignant' ? 'rgba(59,130,246,0.1)' : 'rgba(16,185,129,0.1)', color: u.role === 'admin' ? orange : u.role === 'enseignant' ? '#3b82f6' : '#10b981' }}>
                    {u.role === 'admin' ? 'Admin' : u.role === 'enseignant' ? 'Tuteur' : 'Étudiant'}
                  </span>
                </td>
                <td style={{ padding: '12px', fontSize: '0.78rem', color: muted }}>{u.ville || '—'}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{ fontSize: '0.65rem', padding: '3px 8px', borderRadius: '20px', fontWeight: 700, background: u.statut === 'actif' ? 'rgba(16,185,129,0.1)' : u.statut === 'en_attente' ? 'rgba(245,158,11,0.1)' : 'rgba(220,38,38,0.1)', color: u.statut === 'actif' ? '#10b981' : u.statut === 'en_attente' ? '#f59e0b' : '#dc2626' }}>
                    {u.statut === 'actif' ? 'ACTIF' : u.statut === 'en_attente' ? 'EN ATTENTE' : 'BLOQUÉ'}
                  </span>
                </td>
                <td style={{ padding: '12px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                    {u.role !== 'admin' && (
                      <button onClick={() => bloquer(u.id, u.statut)} style={{ padding: '5px 12px', borderRadius: '7px', border: `1px solid ${u.statut === 'actif' ? 'rgba(220,38,38,0.25)' : 'rgba(16,185,129,0.25)'}`, background: u.statut === 'actif' ? 'rgba(220,38,38,0.06)' : 'rgba(16,185,129,0.06)', color: u.statut === 'actif' ? '#dc2626' : '#10b981', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        {u.statut === 'actif' ? <><XCircle size={13} /> Bloquer</> : <><CheckCircle size={13} /> Débloquer</>}
                      </button>
                    )}
                    <button onClick={() => supprimerUser(u.id)} style={{ padding: '5px 8px', borderRadius: '7px', border: '1px solid rgba(220,38,38,0.2)', background: 'rgba(220,38,38,0.06)', color: '#dc2626', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function VerificationsTab({ enseignantsAttente, setEnseignantsAttente }) {
  const [refusModal, setRefusModal] = useState(null);
  const [refusRaison, setRefusRaison] = useState('');

  async function valider(id) {
    try {
      await api.put(`/admin/enseignants/${id}/valider`);
      setEnseignantsAttente(prev => prev.filter(e => e.utilisateur_id !== id));
    } catch(e) { alert('Erreur'); }
  }

  async function refuser(id) {
    if (!refusRaison.trim()) return;
    try {
      await api.put(`/admin/enseignants/${id}/refuser`, { raison: refusRaison });
      setEnseignantsAttente(prev => prev.filter(e => e.utilisateur_id !== id));
      setRefusModal(null);
      setRefusRaison('');
    } catch(e) { alert('Erreur'); }
  }

  return (
    <>
      <div style={{ background: card, border: `1px solid ${border}`, borderRadius: '16px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
        <div style={{ fontSize: '0.6rem', color: orange, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '4px' }}>VÉRIFICATION ACADÉMIQUE</div>
        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: text, marginBottom: '1.25rem' }}>Diplômes & Dossiers ({enseignantsAttente.length})</div>

        {enseignantsAttente.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: muted, fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <CheckCircle size={18} color="#10b981" /> Aucune candidature en attente
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {enseignantsAttente.map(e => (
              <div key={e.utilisateur_id} style={{ background: bg, border: `1px solid ${border}`, borderRadius: '12px', padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: orange, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: '1rem', flexShrink: 0 }}>
                      {(e.user?.prenom || '?')[0]}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: text, fontSize: '0.9rem' }}>{e.user?.prenom} {e.user?.nom}</div>
                      <div style={{ fontSize: '0.7rem', color: muted }}>{e.user?.email} • {e.user?.ville}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => { setRefusModal(e.utilisateur_id); setRefusRaison(''); }} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid rgba(220,38,38,0.3)', background: 'rgba(220,38,38,0.06)', color: '#dc2626', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <XCircle size={14} /> Demander correction
                    </button>
                    <button onClick={() => valider(e.utilisateur_id)} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: orange, color: '#fff', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle size={14} /> Approuver et Valider
                    </button>
                  </div>
                </div>

                {e.documents && e.documents.length > 0 && (
                  <div style={{ marginTop: '1rem', background: card, borderRadius: '10px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '8px', border: `1px solid ${border}` }}>
                    {e.documents.map((doc, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.6rem', background: doc.type_document === 'diplome' ? 'rgba(59,130,246,0.1)' : 'rgba(16,185,129,0.1)', color: doc.type_document === 'diplome' ? '#3b82f6' : '#10b981', padding: '2px 8px', borderRadius: '4px', fontWeight: 700, textTransform: 'uppercase' }}>{doc.type_document}</span>
                        <a href={`http://localhost:8000/storage/${doc.chemin}`} target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', color: orange, textDecoration: 'none' }}>{doc.chemin?.split('/').pop()}</a>
                      </div>
                    ))}
                  </div>
                )}

                {e.description_profil && (
                  <div style={{ marginTop: '10px', fontSize: '0.72rem', color: muted, fontStyle: 'italic', padding: '10px', background: card, borderRadius: '8px', borderLeft: `3px solid ${orange}`, border: `1px solid ${border}` }}>