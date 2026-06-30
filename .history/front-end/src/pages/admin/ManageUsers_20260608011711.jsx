import { useState } from 'react';
import api from '../../api/axios';

function ManageUsers({ users = [], onRefresh }) {
  const [isLoading, setIsLoading] = useState(false);
  const [erreur, setErreur] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [loadingUserId, setLoadingUserId] = useState(null);

  const handleToggleStatus = async (id, action) => {
    setIsLoading(true);
    setLoadingUserId(id);
    setErreur('');
    try {
      await api.put(`/admin/users/${id}/${action}`);
      if (onRefresh) onRefresh();
    } catch(err) {
      setErreur(`Erreur lors du ${action === 'bloquer' ? 'blocage' : 'déblocage'}`);
    } finally {
      setIsLoading(false);
      setLoadingUserId(null);
    }
  };

  const handleSupprimer = async (id) => {
    setIsLoading(true);
    setLoadingUserId(id);
    setErreur('');
    try {
      await api.delete(`/admin/users/${id}`);
      setDeleteId(null);
      if (onRefresh) onRefresh();
    } catch(err) {
      setErreur('Erreur lors de la suppression');
    } finally {
      setIsLoading(false);
      setLoadingUserId(null);
    }
  };

  const getRoleBadge = (role) => {
    if (role === 'admin') return { bg: '#f3e8ff', color: '#7e22ce', icon: 'bi-shield', label: 'Admin' };
    if (role === 'enseignant') return { bg: '#dbeafe', color: '#1d4ed8', icon: 'bi-briefcase', label: 'Enseignant' };
    return { bg: '#dcfce7', color: '#166534', icon: 'bi-mortarboard', label: 'Étudiant' };
  };

  const isLoadingForUser = (id) => loadingUserId === id;

  if (!users || users.length === 0) {
    return (
      <div className="bg-white rounded-4 border p-4 text-center">
        <i className="bi bi-people fs-1 text-muted"></i>
        <p className="mt-2 text-muted">Aucun utilisateur</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-4 border p-4">
      <div className="mb-4">
        <h3 className="h5 fw-bold mb-1">ANNUAIRE DES UTILISATEURS ENREGISTRÉS ({users.length})</h3>
        <p className="text-muted small mb-0">Gérez l'ensemble des comptes de tuteurs et élèves inscrits sur Learnect Maroc.</p>
      </div>

      {erreur && <div className="alert alert-danger py-2 mb-3">{erreur}</div>}

      <div className="overflow-x-auto">
        <table className="w-100" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
              <th className="pb-3 text-start" style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b' }}>UTILISATEUR</th>
              <th className="pb-3 text-start" style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b' }}>RÔLE</th>
              <th className="pb-3 text-start" style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b' }}>VILLE</th>
              <th className="pb-3 text-start" style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b' }}>STATUT</th>
              <th className="pb-3 text-start" style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => {
              const roleStyle = getRoleBadge(u.role);
              const isActif = u.statut === 'actif';
              const isLoadingThis = isLoadingForUser(u.utilisateur_id);
              return (
                <tr key={u.utilisateur_id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td className="py-3">
                    <div className="fw-bold" style={{ fontSize: '14px' }}>{u.prenom} {u.nom}</div>
                    <div className="small" style={{ color: '#64748b' }}>{u.email}</div>
                  </td>
                  <td className="py-3">
                    <span className="badge px-3 py-2 rounded-pill" style={{ background: roleStyle.bg, color: roleStyle.color, fontSize: '11px', fontWeight: 'bold' }}>
                      <i className={`bi ${roleStyle.icon} me-1`}></i> {roleStyle.label}
                    </span>
                  </td>
                  <td className="py-3" style={{ fontSize: '13px' }}>
                    <i className="bi bi-geo-alt me-1" style={{ color: '#94a3b8' }}></i> {u.ville}
                  </td>
                  <td className="py-3">
                    {isActif ? (
                      <span className="badge px-3 py-2 rounded-pill" style={{ background: '#dcfce7', color: '#166534', fontSize: '11px', fontWeight: 'bold' }}>
                        <i className="bi bi-check-circle me-1"></i> ACTIF
                      </span>
                    ) : u.statut === 'en_attente' ? (
                      <span className="badge px-3 py-2 rounded-pill" style={{ background: '#fef3c7', color: '#92400e', fontSize: '11px', fontWeight: 'bold' }}>
                        <i className="bi bi-clock me-1"></i> EN_ATTENTE
                      </span>
                    ) : (
                      <span className="badge px-3 py-2 rounded-pill" style={{ background: '#fee2e2', color: '#991b1b', fontSize: '11px', fontWeight: 'bold' }}>
                        <i className="bi bi-x-circle me-1"></i> BLOQUÉ
                      </span>
                    )}
                  </td>
                  <td className="py-3">
                    <div className="d-flex gap-2">
                      {isActif ? (
                        <button
                          onClick={() => handleToggleStatus(u.utilisateur_id, 'bloquer')}
                          disabled={isLoadingThis}
                          className="btn btn-sm px-3 py-1 rounded-pill"
                          style={{ background: '#fee2e2', color: '#dc2626', border: 'none', fontSize: '11px', fontWeight: 'bold', transition: 'none' }}
                        >
                          {isLoadingThis ? <span className="spinner-border spinner-border-sm"></span> : <><i className="bi bi-lock me-1"></i> Bloquer</>}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleToggleStatus(u.utilisateur_id, 'debloquer')}
                          disabled={isLoadingThis}
                          className="btn btn-sm px-3 py-1 rounded-pill"
                          style={{ background: '#dcfce7', color: '#16a34a', border: 'none', fontSize: '11px', fontWeight: 'bold', transition: 'none' }}
                        >
                          {isLoadingThis ? <span className="spinner-border spinner-border-sm"></span> : <><i className="bi bi-unlock me-1"></i> Débloquer</>}
                        </button>
                      )}
                      <button
                        onClick={() => setDeleteId(u.utilisateur_id)}
                        className="btn btn-sm px-3 py-1 rounded-pill"
                        style={{ background: '#f1f5f9', color: '#64748b', border: 'none', fontSize: '11px', fontWeight: 'bold', transition: 'none' }}
                      >
                        <i className="bi bi-trash me-1"></i> Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {deleteId && (
        <div className="modal show d-block" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 1000
        }}>
          <div className="bg-white rounded-3 p-4" style={{ width: '400px', transition: 'none', transform: 'none' }}>
            <div className="d-flex align-items-center gap-2 mb-3">
              <i className="bi bi-exclamation-triangle fs-4 text-danger"></i>
              <h5 className="mb-0 fw-bold">Confirmation de suppression</h5>
            </div>
            <p className="text-muted mb-3">
              Êtes-vous sûr de vouloir supprimer définitivement cet utilisateur ?
              Cette action est irréversible.
            </p>
            <div className="d-flex gap-2 justify-content-end">
              <button className="btn btn-light px-4" onClick={() => setDeleteId(null)} style={{ transition: 'none' }}>Annuler</button>
              <button className="btn btn-danger px-4" onClick={() => handleSupprimer(deleteId)} style={{ transition: 'none' }}>Confirmer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageUsers;