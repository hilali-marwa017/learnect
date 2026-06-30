import { useState } from 'react';
import api from '../../api/axios';

function ManageUsers({ users, onRefresh }) {
  const [isLoading, setIsLoading] = useState(false);
  const [erreur, setErreur] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatut, setFilterStatut] = useState('');

  const handleBloquer = async (id) => {
    if (!window.confirm('Bloquer cet utilisateur ?')) return;
    setIsLoading(true);
    try {
      await api.put(`/admin/users/${id}/bloquer`);
      if (onRefresh) onRefresh();
    } catch(err) {
      setErreur('Erreur');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDebloquer = async (id) => {
    setIsLoading(true);
    try {
      await api.put(`/admin/users/${id}/debloquer`);
      if (onRefresh) onRefresh();
    } catch(err) {
      setErreur('Erreur');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSupprimer = async (id) => {
    if (!window.confirm('Supprimer cet utilisateur ?')) return;
    setIsLoading(true);
    try {
      await api.delete(`/admin/users/${id}`);
      if (onRefresh) onRefresh();
    } catch(err) {
      setErreur('Erreur');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = (users || []).filter(user => {
    if (filterRole && user.role !== filterRole) return false;
    if (filterStatut && user.statut !== filterStatut) return false;
    return true;
  });

  const roles = [...new Set((users || []).map(u => u.role).filter(Boolean))];
  const statuts = [...new Set((users || []).map(u => u.statut).filter(Boolean))];

  return (
    <div className="card border-0 shadow-sm" style={{ transition: 'none', transform: 'none' }}>
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom flex-wrap gap-3">
          <div>
            <h3 className="h5 fw-bold mb-0">Gestion des utilisateurs</h3>
            <p className="text-muted small mb-0">{filteredUsers.length} utilisateur(s)</p>
          </div>
          <div className="d-flex gap-2">
            <select className="form-select form-select-sm" value={filterRole} onChange={e => setFilterRole(e.target.value)} style={{ width: '130px' }}>
              <option value="">Tous les rôles</option>
              {roles.map(role => <option key={role} value={role}>{role}</option>)}
            </select>
            <select className="form-select form-select-sm" value={filterStatut} onChange={e => setFilterStatut(e.target.value)} style={{ width: '130px' }}>
              <option value="">Tous les statuts</option>
              {statuts.map(statut => <option key={statut} value={statut}>{statut}</option>)}
            </select>
          </div>
        </div>

        {erreur && <div className="alert alert-danger py-2 mb-3">{erreur}</div>}

        <div className="table-responsive">
          <table className="table mb-0">
            <thead className="table-light">
              <tr>
                <th className="px-3 py-2">ID</th>
                <th className="px-3 py-2">Nom</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Rôle</th>
                <th className="px-3 py-2">Statut</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td className="px-3 py-2">#{user.id}</td>
                  <td className="px-3 py-2">{user.nom} {user.prenom}</td>
                  <td className="px-3 py-2">{user.email}</td>
                  <td className="px-3 py-2"><span className="badge bg-primary">{user.role}</span></td>
                  <td className="px-3 py-2">
                    <span className={`badge ${user.statut === 'actif' ? 'bg-success' : 'bg-danger'}`}>
                      {user.statut || 'actif'}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <div className="d-flex gap-1">
                      {user.statut === 'bloque' ? (
                        <button className="btn btn-sm btn-success" onClick={() => handleDebloquer(user.id)} disabled={isLoading} style={{ transition: 'none' }}>
                          Débloquer
                        </button>
                      ) : (
                        <button className="btn btn-sm btn-warning" onClick={() => handleBloquer(user.id)} disabled={isLoading} style={{ transition: 'none' }}>
                          Bloquer
                        </button>
                      )}
                      <button className="btn btn-sm btn-danger" onClick={() => handleSupprimer(user.id)} disabled={isLoading} style={{ transition: 'none' }}>
                        Supprimer
                      </button>
                    </div>
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