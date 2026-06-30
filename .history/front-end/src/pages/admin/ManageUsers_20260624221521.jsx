import { useState } from 'react';
import { CheckCircle, XCircle, Trash2, Loader } from 'lucide-react';
import api from '../../api/axios';

export function UsersTab({ users, setUsers }) {
  const [loadingId, setLoadingId] = useState(null);

  async function bloquer(userId, statut) {
    const isActif = statut === 'actif';
    if (!window.confirm(isActif ? 'Voulez-vous vraiment bloquer cet utilisateur ?' : 'Voulez-vous vraiment débloquer cet utilisateur ?')) return;
    setLoadingId(userId);
    try {
      await api.put(`/admin/users/${userId}/${isActif ? 'bloquer' : 'debloquer'}`);
      setUsers(prev => prev.map(u => u.utilisateur_id === userId ? { ...u, statut: isActif ? 'bloque' : 'actif' } : u));
    } catch(e) { alert('Erreur'); }
    finally { setLoadingId(null); }
  }

  async function supprimerUser(userId) {
    if (!window.confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) return;
    setLoadingId(userId);
    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers(prev => prev.filter(u => u.utilisateur_id !== userId));
    } catch(e) { alert('Erreur'); }
    finally { setLoadingId(null); }
  }

  return (
    <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '16px', padding: '1.5rem' }}>
      <div style={{ fontSize: '0.6rem', color: '#e04f00', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '4px' }}>ANNUAIRE</div>
      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '1.25rem' }}>Comptes Utilisateurs ({users.length})</div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Utilisateur', 'Rôle', 'Ville', 'Statut', 'Actions'].map(h => (
                <th key={h} style={{ textAlign: h === 'Actions' ? 'right' : 'left', padding: '10px 12px', fontSize: '0.6rem', color: 'var(--color-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: '1px solid var(--color-border)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-muted)' }}>Aucun utilisateur</td></tr>
            ) : users.map((u, i) => (
              <tr key={u.utilisateur_id ?? i} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '12px', fontSize: '0.78rem', color: 'var(--color-text)' }}>
                  <div style={{ fontWeight: 600 }}>{u.prenom} {u.nom}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--color-muted)' }}>{u.email}</div>
                </td>
                <td style={{ padding: '12px' }}>
                  <span style={{ fontSize: '0.65rem', padding: '3px 8px', borderRadius: '20px', fontWeight: 700, background: u.role === 'admin' ? 'rgba(224,79,0,0.1)' : u.role === 'enseignant' ? 'rgba(59,130,246,0.1)' : 'rgba(16,185,129,0.1)', color: u.role === 'admin' ? '#e04f00' : u.role === 'enseignant' ? '#3b82f6' : '#10b981' }}>
                    {u.role === 'admin' ? 'Admin' : u.role === 'enseignant' ? 'Tuteur' : 'Étudiant'}
                  </span>
                </td>
                <td style={{ padding: '12px', fontSize: '0.78rem', color: 'var(--color-muted)' }}>{u.ville || '—'}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{ fontSize: '0.65rem', padding: '3px 8px', borderRadius: '20px', fontWeight: 700, background: u.statut === 'actif' ? 'rgba(16,185,129,0.1)' : u.statut === 'en_attente' ? 'rgba(245,158,11,0.1)' : 'rgba(220,38,38,0.1)', color: u.statut === 'actif' ? '#10b981' : u.statut === 'en_attente' ? '#f59e0b' : '#dc2626' }}>
                    {u.statut === 'actif' ? 'ACTIF' : u.statut === 'en_attente' ? 'EN ATTENTE' : 'BLOQUÉ'}
                  </span>
                </td>
                <td style={{ padding: '12px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                    {u.role !== 'admin' && (
                      <button onClick={() => bloquer(u.utilisateur_id, u.statut)} disabled={loadingId === u.utilisateur_id}
                        style={{ padding: '5px 12px', borderRadius: '7px', border: `1px solid ${u.statut === 'actif' ? 'rgba(220,38,38,0.25)' : 'rgba(16,185,129,0.25)'}`, background: u.statut === 'actif' ? 'rgba(220,38,38,0.06)' : 'rgba(16,185,129,0.06)', color: u.statut === 'actif' ? '#dc2626' : '#10b981', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', opacity: loadingId === u.utilisateur_id ? 0.6 : 1 }}>
                        {loadingId === u.utilisateur_id ? <Loader size={13} style={{ animation: 'spin 1s linear infinite' }} /> : u.statut === 'actif' ? <><XCircle size={13} /> Bloquer</> : <><CheckCircle size={13} /> Débloquer</>}
                      </button>
                    )}
                    <button onClick={() => supprimerUser(u.utilisateur_id)} disabled={loadingId === u.utilisateur_id}
                      style={{ padding: '5px 8px', borderRadius: '7px', border: '1px solid rgba(220,38,38,0.2)', background: 'rgba(220,38,38,0.06)', color: '#dc2626', cursor: 'pointer', display: 'flex', alignItems: 'center', opacity: loadingId === u.utilisateur_id ? 0.6 : 1 }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

export function VerificationsTab({ enseignantsAttente, setEnseignantsAttente }) {
  const [refusModal, setRefusModal] = useState(null);
  const [refusRaison, setRefusRaison] = useState('');
  const [loadingId, setLoadingId] = useState(null);

  async function valider(id) {
    setLoadingId(id);
    try {
      await api.put(`/admin/enseignants/${id}/valider`);
      setEnseignantsAttente(prev => prev.filter(e => e.utilisateur_id !== id));
    } catch(e) { alert('Erreur'); }
    finally { setLoadingId(null); }
  }

  async function refuser(id) {
    if (!refusRaison.trim()) return;
    setLoadingId(id);
    try {
      await api.put(`/admin/enseignants/${id}/refuser`, { raison: refusRaison });
      setEnseignantsAttente(prev => prev.filter(e => e.utilisateur_id !== id));
      setRefusModal(null);
      setRefusRaison('');
    } catch(e) { alert('Erreur'); }
    finally { setLoadingId(null); }
  }

  return (
    <>
      <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '16px', padding: '1.5rem' }}>
        <div style={{ fontSize: '0.6rem', color: '#e04f00', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '4px' }}>VÉRIFICATION ACADÉMIQUE</div>
        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '1.25rem' }}>Diplômes & Dossiers ({enseignantsAttente.length})</div>

        {enseignantsAttente.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <CheckCircle size={18} color="#10b981" /> Aucune candidature en attente
          </div>
        ) : enseignantsAttente.map(e => (
          <div key={e.utilisateur_id} style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '1.25rem', marginBottom: '1rem' }}>

            {/* Header enseignant */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#e04f00', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: '1rem' }}>
                  {(e.user?.prenom || '?')[0]}
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: '0.9rem' }}>{e.user?.prenom} {e.user?.nom}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--color-muted)' }}>{e.user?.email} • {e.user?.ville}</div>
                  {e.titre && <div style={{ fontSize: '0.68rem', color: '#e04f00', fontWeight: 600, marginTop: '2px' }}>{e.titre}</div>}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => { setRefusModal(e.utilisateur_id); setRefusRaison(''); }}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid rgba(220,38,38,0.3)', background: 'rgba(220,38,38,0.06)', color: '#dc2626', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <XCircle size={14} /> Demander correction
                </button>
                <button onClick={() => valider(e.utilisateur_id)} disabled={loadingId === e.utilisateur_id}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#e04f00', color: '#fff', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', opacity: loadingId === e.utilisateur_id ? 0.6 : 1 }}>
                  {loadingId === e.utilisateur_id ? <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <CheckCircle size={14} />} Approuver
                </button>
              </div>
            </div>

            {/* Documents */}
            {e.documents?.length > 0 && (
              <div style={{ marginTop: '1rem', background: 'var(--color-card)', borderRadius: '10px', padding: '1rem', border: '1px solid var(--color-border)' }}>
                <div style={{ fontSize: '0.6rem', color: 'var(--color-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>
                  Documents soumis
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {e.documents.map((doc, i) => {
                    const isPdf = doc.chemin?.toLowerCase().endsWith('.pdf');
                    const url = `http://localhost:8000/storage/${doc.chemin}`;
                    return (
                      
                        key={i}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-bg)', textDecoration: 'none', color: '#e04f00', fontSize: '0.72rem', fontWeight: 600 }}
                        onMouseEnter={ev => ev.currentTarget.style.background = 'rgba(224,79,0,0.06)'}
                        onMouseLeave={ev => ev.currentTarget.style.background = 'var(--color-bg)'}
                      >
                        <span style={{ fontSize: '1rem' }}>{isPdf ? '📄' : '🖼️'}</span>
                        <span>{doc.type_document}</span>
                        <span style={{ fontSize: '0.55rem', background: isPdf ? 'rgba(59,130,246,0.1)' : 'rgba(16,185,129,0.1)', color: isPdf ? '#3b82f6' : '#10b981', padding: '1px 5px', borderRadius: '4px', fontWeight: 700, textTransform: 'uppercase' }}>
                          {isPdf ? 'PDF' : 'IMG'}
                        </span>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Description profil */}
            {e.description_profil && (
              <div style={{ marginTop: '10px', fontSize: '0.72rem', color: 'var(--color-muted)', fontStyle: 'italic', padding: '10px', background: 'var(--color-card)', borderRadius: '8px', borderLeft: '3px solid #e04f00', border: '1px solid var(--color-border)' }}>
                "{e.description_profil}"
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal refus */}
      {refusModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: '1rem' }}>
          <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '16px', padding: '1.5rem', width: '100%', maxWidth: '460px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <XCircle size={20} color="#dc2626" />
              <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-text)' }}>Motif du rejet</div>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--color-muted)', marginBottom: '1rem' }}>Précisez pourquoi la validation a été refusée.</div>
            <textarea
              value={refusRaison}
              onChange={e => setRefusRaison(e.target.value)}
              placeholder="Le justificatif du diplôme n'est pas lisible."
              rows={4}
              style={{ width: '100%', background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '10px', padding: '12px', color: 'var(--color-text)', fontSize: '0.8rem', outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }}
            />
            <div style={{ display: 'flex', gap: '8px', marginTop: '1rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setRefusModal(null)} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'transparent', color: 'var(--color-muted)', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600 }}>Annuler</button>
              <button onClick={() => refuser(refusModal)} disabled={!!loadingId}
                style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#dc2626', color: '#fff', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', opacity: loadingId ? 0.6 : 1 }}>
                {loadingId ? <Loader size={13} style={{ animation: 'spin 1s linear infinite' }} /> : null} Confirmer le Rejet
              </button>
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </>
  );
}