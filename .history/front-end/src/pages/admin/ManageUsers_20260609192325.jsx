import { useState } from 'react';
import api from '../../api/axios';

function ManageUsers({ users = [], onRefresh }) {
  const [erreur, setErreur] = useState('');
  const [loadingId, setLoadingId] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  async function executerAction() {
    const id = confirmAction.id;
    const action = confirmAction.action;
    setLoadingId(id);
    setConfirmAction(null);
    setErreur('');
    try {
      if (action === 'supprimer') {
        await api.delete(`/admin/users/${id}`);
      } else {
        await api.put(`/admin/users/${id}/${action}`);
      }
      if (onRefresh) onRefresh();
    } catch (err) {
      setErreur("Erreur lors de l'action");
    } finally {
      setLoadingId(null);
    }
  }

  function obtenirStyleRole(role) {
    if (role === 'admin') return { bg: '#f3e8ff', color: '#7e22ce', icone: 'bi-shield', label: 'Admin' };
    if (role === 'enseignant') return { bg: '#dbeafe', color: '#1d4ed8', icone: 'bi-briefcase', label: 'Enseignant' };
    return { bg: '#dcfce7', color: '#166534', icone: 'bi-mortarboard', label: 'Étudiant' };
  }

  function handleAnnuler() {
    setConfirmAction(null);
  }

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
        <h3 className="h5 fw-bold mb-1">ANNUAIRE DES UTILISATEURS ({users.length})</h3>
        <p className="text-muted small mb-0">Gérez l'ensemble des comptes inscrits sur Learnect.</p>
      </div>

      {erreur && <div className="alert alert-danger py-2 mb-3">{erreur}</div>}

      <div className="table-responsive">
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
            {users.map(function(u) {
              const roleStyle = obtenirStyleRole(u.role);
              const estActif = u.statut === 'actif';
              const enChargement = loadingId === u.utilisateur_id;

              return (
                <tr key={u.utilisateur_id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td className="py-3">
                    <div className="fw-bold" style={{ fontSize: '14px' }}>{u.prenom} {u.nom}</div>
                    <div className="small text-muted">{u.email}</div>
                  </td>
                  <td className="py-3">
                    <span className="badge px-3 py-2 rounded-pill" style={{ background: roleStyle.bg, color: roleStyle.color, fontSize: '11px', fontWeight: 'bold' }}>
                      <i className={`bi ${roleStyle.icone} me-1`}></i>{roleStyle.label}
                    </span>
                  </td>
                  <td className="py-3" style={{ fontSize: '13px' }}>
                    <i className="bi bi-geo-alt me-1 text-muted"></i>{u.ville}
                  </td>
                  <td className="py-3">
                    {estActif ? (
                      <span className="badge px-3 py-2 rounded-pill" style={{ background: '#dcfce7', color: '#166534', fontSize: '11px', fontWeight: 'bold' }}>
                        <i className="bi bi-check-circle me-1"></i>ACTIF
                      </span>
                    ) : u.statut === 'en_attente' ? (
                      <span className="badge px-3 py-2 rounded-pill" style={{ background: '#fef3c7', color: '#92400e', fontSize: '11px', fontWeight: 'bold' }}>
                        <i className="bi bi-clock me-1"></i>EN ATTENTE
                      </span>
                    ) : (
                      <span className="badge px-3 py-2 rounded-pill" style={{ background: '#fee2e2', color: '#991b1b', fontSize: '11px', fontWeight: 'bold' }}>
                        <i className="bi bi-x-circle me-1"></i>BLOQUÉ
                      </span>
                    )}
                  </td>
                  <td className="py-3">
                    <div className="d-flex gap-2">
                      {enChargement ? (
                        <span className="spinner-border spinner-border-sm text-primary"></span>
                      ) : (
                        <>
                          {estActif ? (
                            <button
                              onClick={function() { setConfirmAction({ id: u.utilisateur_id, action: 'bloquer', nom: u.prenom + ' ' + u.nom }); }}
                              className="btn btn-sm px-3 py-1 rounded-pill"
                              style={{ background: '#fee2e2', color: '#dc2626', border: 'none', fontSize: '11px', fontWeight: 'bold', transition: 'none' }}
                            >
                              <i className="bi bi-lock me-1"></i>Bloquer
                            </button>
                          ) : (
                            <button
                              onClick={function() { setConfirmAction({ id: u.utilisateur_id, action: 'debloquer', nom: u.prenom + ' ' + u.nom }); }}
                              className="btn btn-sm px-3 py-1 rounded-pill"
                              style={{ background: '#dcfce7', color: '#16a34a', border: 'none', fontSize: '11px', fontWeight: 'bold', transition: 'none' }}
                            >
                              <i className="bi bi-unlock me-1"></i>Débloquer
                            </button>
                          )}
                          <button
                            onClick={function() { setConfirmAction({ id: u.utilisateur_id, action: 'supprimer', nom: u.prenom + ' ' + u.nom }); }}
                            className="btn btn-sm px-3 py-1 rounded-pill"
                            style={{ background: '#f1f5f9', color: '#64748b', border: 'none', fontSize: '11px', fontWeight: 'bold', transition: 'none' }}
                          >
                            <i className="bi bi-trash me-1"></i>Supprimer
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal confirmation */}
      {confirmAction && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="bg-white rounded-3 p-4" style={{ width: '400px' }}>
            <div className="d-flex align-items-center gap-2 mb-3">
              <i className={`bi ${confirmAction.action === 'supprimer' ? 'bi-trash text-danger' : confirmAction.action === 'bloquer' ? 'bi-lock text-warning' : 'bi-unlock text-success'} fs-4`}></i>
              <h5 className="mb-0 fw-bold">Confirmation</h5>
            </div>
            <p className="text-muted mb-4">
              Voulez-vous vraiment <strong>{confirmAction.action}</strong> l'utilisateur <strong>{confirmAction.nom}</strong> ?
              {confirmAction.action === 'supprimer' && ' Cette action est irréversible.'}
            </p>
            <div className="d-flex gap-2 justify-content-end">
              <button className="btn btn-light px-4" onClick={handleAnnuler} style={{ transition: 'none' }}>
                Annuler
              </button>
              <button
                className={`btn px-4 ${confirmAction.action === 'supprimer' ? 'btn-danger' : confirmAction.action === 'bloquer' ? 'btn-warning' : 'btn-success'}`}
                onClick={executerAction}
                style={{ transition: 'none' }}
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageUsers;