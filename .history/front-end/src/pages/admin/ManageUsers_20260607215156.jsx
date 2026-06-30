import { useState } from 'react';

function ManageUsers({ users, onRefresh }) {
  const [isLoading, setIsLoading] = useState(false);
  const [erreur, setErreur] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const getToken = () => localStorage.getItem('token');

  const handleBloquer = async (id) => {
    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/admin/users/${id}/bloquer`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      if (!res.ok) throw new Error('Erreur blocage');
      if (onRefresh) onRefresh();
    } catch(err) { setErreur('Erreur lors du blocage'); }
    finally { setIsLoading(false); }
  };

  const handleDebloquer = async (id) => {
    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/admin/users/${id}/debloquer`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      if (!res.ok) throw new Error('Erreur déblocage');
      if (onRefresh) onRefresh();
    } catch(err) { setErreur('Erreur lors du déblocage'); }
    finally { setIsLoading(false); }
  };

  const handleSupprimer = async (id) => {
    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      if (!res.ok) throw new Error('Erreur suppression');
      setDeleteId(null);
      if (onRefresh) onRefresh();
    } catch(err) { setErreur('Erreur lors de la suppression'); }
    finally { setIsLoading(false); }
  };

  if (!users || users.length === 0) {
    return (
      <div className="card border-0 shadow-sm rounded-4 p-4 text-center">
        <i className="bi bi-people fs-1 text-muted"></i>
        <p className="mt-2 text-muted">Aucun utilisateur</p>
      </div>
    );
  }

  return (
    <div className="card border-0 shadow-sm rounded-4">
      <div className="card-body p-4">
        <div className="d-flex align-items-center gap-3 mb-4 pb-2 border-bottom">
          <div className="bg-info bg-opacity-10 p-3 rounded-3">
            <i className="bi bi-people fs-4 text-info"></i>
          </div>
          <div>
            <h3 className="h5 fw-bold mb-0">Gestion des utilisateurs</h3>
            <p className="text-muted small mb-0">{users.length} utilisateurs inscrits</p>
          </div>
        </div>

        {erreur && <div className="alert alert-danger py-2 mb-3">{erreur}</div>}

        <div className="overflow-x-auto">
          <table className="table table-bordered align-middle">
            <thead className="bg-light">
              <tr>
                <th className="p-3">Utilisateur</th>
                <th className="p-3">Rôle</th>
                <th className="p-3">Ville</th>
                <th className="p-3">Statut</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.utilisateur_id}>
                  <td className="p-3">
                    <div className="fw-bold">{u.prenom} {u.nom}</div>
                    <div className="small text-muted">{u.email}</div>
                  </td>
                  <td className="p-3">
                    <span className="badge bg-secondary bg-opacity-10 text-dark px-3 py-2">
                      <i className="bi bi-person me-1"></i> {u.role}
                    </span>
                  </td>
                  <td className="p-3">
                    <i className="bi bi-geo-alt me-1"></i> {u.ville}
                  </td>
                  <td className="p-3">
                    {u.statut === 'actif' ? (
                      <span className="badge bg-success bg-opacity-10 text-success px-3 py-2">
                        <i className="bi bi-check-circle me-1"></i> Actif
                      </span>
                    ) : (
                      <span className="badge bg-danger bg-opacity-10 text-danger px-3 py-2">
                        <i className="bi bi-x-circle me-1"></i> Bloqué
                      </span>
                    )}
                  </td>
                  <td className="p-3">
                    <div className="d-flex gap-2">
                      {u.statut === 'actif' ? (
                        <button 
                          onClick={() => handleBloquer(u.utilisateur_id)} 
                          disabled={isLoading} 
                          className="btn btn-outline-warning btn-sm px-2"
                          title="Bloquer l'utilisateur"
                        >
                          <i className="bi bi-lock me-1"></i> Bloquer
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleDebloquer(u.utilisateur_id)} 
                          disabled={isLoading} 
                          className="btn btn-outline-success btn-sm px-2"
                          title="Débloquer l'utilisateur"
                        >
                          <i className="bi bi-unlock me-1"></i> Débloquer
                        </button>
                      )}
                      <button 
                        onClick={() => setDeleteId(u.utilisateur_id)} 
                        disabled={isLoading} 
                        className="btn btn-outline-danger btn-sm px-2"
                        title="Supprimer définitivement"
                      >
                        <i className="bi bi-trash me-1"></i> Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de confirmation suppression */}
      {deleteId && (
        <div className="modal show d-block" style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', 
          justifyContent: 'center', zIndex: 1000 
        }}>
          <div className="bg-white rounded-3 p-4" style={{ width: '400px' }}>
            <div className="d-flex align-items-center gap-2 mb-3">
              <i className="bi bi-exclamation-triangle fs-4 text-danger"></i>
              <h5 className="mb-0 fw-bold">Confirmation de suppression</h5>
            </div>
            <p className="text-muted mb-3">
              Êtes-vous sûr de vouloir supprimer définitivement cet utilisateur ? 
              Cette action est irréversible.
            </p>
            <div className="d-flex gap-2 justify-content-end">
              <button className="btn btn-light px-4" onClick={() => setDeleteId(null)} disabled={isLoading}>
                Annuler
              </button>
              <button className="btn btn-danger px-4" onClick={() => handleSupprimer(deleteId)} disabled={isLoading}>
                {isLoading ? 'Suppression...' : 'Confirmer la suppression'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageUsers;