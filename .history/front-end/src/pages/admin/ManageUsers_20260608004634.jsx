import { useState } from 'react';
import api from '../../api/axios';

function ManageUsers({ users = [], onRefresh }) {
  const [isLoading, setIsLoading] = useState(false);
  const [erreur, setErreur] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatut, setFilterStatut] = useState('');

  const handleBloquer = async (id) => {
    if (!window.confirm('Bloquer cet utilisateur ?')) return;
    setIsLoading(true);
    setErreur('');
    try {
      await api.put(`/admin/users/${id}/bloquer`);
      if (onRefresh) onRefresh();
    } catch(err) {
      setErreur('Erreur lors du blocage');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDebloquer = async (id) => {
    if (!window.confirm('Débloquer cet utilisateur ?')) return;
    setIsLoading(true);
    setErreur('');
    try {
      await api.put(`/admin/users/${id}/debloquer`);
      if (onRefresh) onRefresh();
    } catch(err) {
      setErreur('Erreur lors du déblocage');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSupprimer = async (id) => {
    if (!window.confirm('Supprimer définitivement cet utilisateur ?')) return;
    setIsLoading(true);
    setErreur('');
    try {
      await api.delete(`/admin/users/${id}`);
      if (onRefresh) onRefresh();
    } catch(err) {
      setErreur('Erreur lors de la suppression');
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrer les utilisateurs
  const filteredUsers = (users || []).filter(user => {
    if (filterRole && user.role !== filterRole) return false;
    if (filterStatut && user.statut !== filterStatut) return false;
    return true;
  });

  // Extraire les rôles uniques pour le filtre
  const roles = [...new Set((users || []).map(u => u.role).filter(Boolean))];
  const statuts = [...new Set((users || []).map(u => u.statut).filter(Boolean))];

  // Message si aucun utilisateur
  if (!users || users.length === 0) {
    return (
      <div className="card border-0 shadow-sm p-4 text-center" style={{ transition: 'none', transform: 'none' }}>
        <i className="bi bi-people fs-1 text-muted"></i>
        <p className="mt-2 text-muted">Aucun utilisateur trouvé</p>
        <p className="small text-muted">Vérifie ta connexion à l'API</p>
      </div>
    );
  }

  return (
    <div className="card border-0 shadow-sm" style={{ transition: 'none', transform: 'none' }}>
      <div className="card-body p-4">
        {/* En-tête avec filtres */}
        <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom flex-wrap gap-3">
          <div>
            <h3 className="h5 fw-bold mb-0">Gestion des utilisateurs</h3>
            <p className="text-muted small mb-0">
              {filteredUsers.length} utilisateur(s) sur {users.length} total
            </p>
          </div>
          
          <div className="d-flex gap-2">
            <select 
              className="form-select form-select-sm" 
              value={filterRole} 
              onChange={e => setFilterRole(e.target.value)} 
              style={{ width: '130px' }}
            >
              <option value="">Tous les rôles</option>
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
            
            <select 
              className="form-select form-select-sm" 
              value={filterStatut} 
              onChange={e => setFilterStatut(e.target.value)} 
              style={{ width: '130px' }}
            >
              <option value="">Tous les statuts</option>
              {statuts.map(statut => (
                <option key={statut} value={statut}>{statut}</option>
              ))}
            </select>
            
            {(filterRole || filterStatut) && (
              <button 
                className="btn btn-sm btn-outline-secondary"
                onClick={() => {
                  setFilterRole('');
                  setFilterStatut('');
                }}
                style={{ transition: 'none' }}
              >
                Effacer
              </button>
            )}
          </div>
        </div>

        {/* Message d'erreur */}
        {erreur && <div className="alert alert-danger py-2 mb-3">{erreur}</div>}

        {/* Message si aucun résultat après filtrage */}
        {filteredUsers.length === 0 && (
          <div className="alert alert-info py-3 text-center">
            Aucun utilisateur ne correspond aux filtres sélectionnés.
          </div>
        )}

        {/* Tableau des utilisateurs */}
        {filteredUsers.length > 0 && (
          <div className="table-responsive">
            <table className="table table-bordered mb-0" style={{ borderColor: '#dee2e6' }}>
              <thead style={{ backgroundColor: '#f8f9fa' }}>
                <tr>
                  <th className="px-3 py-2" style={{ width: '60px' }}>ID</th>
                  <th className="px-3 py-2">Nom complet</th>
                  <th className="px-3 py-2">Email</th>
                  <th className="px-3 py-2" style={{ width: '100px' }}>Rôle</th>
                  <th className="px-3 py-2" style={{ width: '100px' }}>Statut</th>
                  <th className="px-3 py-2" style={{ width: '180px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td className="px-3 py-2 align-middle">#{user.id}</td>
                    <td className="px-3 py-2 align-middle">
                      <strong>{user.nom} {user.prenom}</strong>
                    </td>
                    <td className="px-3 py-2 align-middle">{user.email}</td>
                    <td className="px-3 py-2 align-middle">
                      <span className={`badge ${user.role === 'enseignant' ? 'bg-success' : user.role === 'etudiant' ? 'bg-primary' : 'bg-secondary'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-3 py-2 align-middle">
                      <span className={`badge ${user.statut === 'actif' ? 'bg-success' : user.statut === 'bloque' ? 'bg-danger' : 'bg-warning'}`}>
                        {user.statut || 'actif'}
                      </span>
                    </td>
                    <td className="px-3 py-2 align-middle">
                      <div className="d-flex gap-2">
                        {user.statut === 'bloque' ? (
                          <button 
                            className="btn btn-sm btn-success"
                            onClick={() => handleDebloquer(user.id)} 
                            disabled={isLoading}
                            style={{ transition: 'none' }}
                          >
                            <i className="bi bi-unlock me-1"></i> Débloquer
                          </button>
                        ) : (
                          <button 
                            className="btn btn-sm btn-warning"
                            onClick={() => handleBloquer(user.id)} 
                            disabled={isLoading}
                            style={{ transition: 'none' }}
                          >
                            <i className="bi bi-lock me-1"></i> Bloquer
                          </button>
                        )}
                        <button 
                          className="btn btn-sm btn-danger"
                          onClick={() => handleSupprimer(user.id)} 
                          disabled={isLoading}
                          style={{ transition: 'none' }}
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
        )}
      </div>
    </div>
  );
}

export default ManageUsers;