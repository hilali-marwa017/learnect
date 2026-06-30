import { useState } from 'react';

function ManageUsers({ users, onRefresh }) {
  const [isLoading, setIsLoading] = useState(false);
  const [erreur, setErreur] = useState('');
  const getToken = () => localStorage.getItem('token');

  const handleBloquer = async (id) => {
    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/admin/users/${id}/bloquer`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      if (!res.ok) throw new Error('Erreur');
      if (onRefresh) onRefresh();
    } catch(err) { setErreur('Erreur blocage'); }
    finally { setIsLoading(false); }
  };

  const handleDebloquer = async (id) => {
    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/admin/users/${id}/debloquer`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      if (!res.ok) throw new Error('Erreur');
      if (onRefresh) onRefresh();
    } catch(err) { setErreur('Erreur déblocage'); }
    finally { setIsLoading(false); }
  };

  if (!users || users.length === 0) {
    return <div className="card border-0 shadow-sm rounded-4 p-4 text-center"><i className="bi bi-people fs-1 text-muted"></i><p className="mt-2 text-muted">Aucun utilisateur</p></div>;
  }

  return (
    <div className="card border-0 shadow-sm rounded-4">
      <div className="card-body p-4">
        <div className="d-flex align-items-center gap-3 mb-4 pb-2 border-bottom">
          <div className="bg-info bg-opacity-10 p-3 rounded-3"><i className="bi bi-people fs-4 text-info"></i></div>
          <div><h3 className="h5 fw-bold mb-0">Gestion des utilisateurs</h3><p className="text-muted small mb-0">{users.length} utilisateurs inscrits</p></div>
        </div>
        {erreur && <div className="alert alert-danger py-2 mb-3">{erreur}</div>}
        <div className="overflow-x-auto">
          <table className="table table-bordered align-middle">
            <thead className="bg-light">
              <tr><th className="p-3">Utilisateur</th><th className="p-3">Rôle</th><th className="p-3">Ville</th><th className="p-3">Statut</th><th className="p-3">Actions</th></tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.utilisateur_id}>
                  <td className="p-3"><div className="fw-bold">{u.prenom} {u.nom}</div><div className="small text-muted">{u.email}</div></td>
                  <td className="p-3"><span className="badge bg-secondary bg-opacity-10 text-dark px-3 py-2"><i className="bi bi-person me-1"></i> {u.role}</span></td>
                  <td className="p-3"><i className="bi bi-geo-alt me-1"></i> {u.ville}</td>
                  <td className="p-3">{u.statut === 'actif' ? <span className="badge bg-success bg-opacity-10 text-success"><i className="bi bi-check-circle me-1"></i> Actif</span> : <span className="badge bg-danger bg-opacity-10 text-danger"><i className="bi bi-x-circle me-1"></i> Bloqué</span>} </td>
                  <td className="p-3">
                    {u.statut === 'actif' ? (
                      <button onClick={() => handleBloquer(u.utilisateur_id)} disabled={isLoading} className="btn btn-outline-danger btn-sm px-3"><i className="bi bi-lock me-1"></i> Bloquer</button>
                    ) : (
                      <button onClick={() => handleDebloquer(u.utilisateur_id)} disabled={isLoading} className="btn btn-outline-success btn-sm px-3"><i className="bi bi-unlock me-1"></i> Débloquer</button>
                    )}
                   </td>
                 </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ManageUsers;