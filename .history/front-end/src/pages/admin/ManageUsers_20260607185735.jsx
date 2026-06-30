import { useState, useEffect } from 'react';
import api from '../../api/axios';

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

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

  const bloquerUser = async (id) => {
    if (window.confirm('Bloquer cet utilisateur ?')) {
      await api.post(`/admin/users/${id}/bloquer`);
      loadUsers();
    }
  };

  const debloquerUser = async (id) => {
    await api.post(`/admin/users/${id}/debloquer`);
    loadUsers();
  };

  const supprimerUser = async (id) => {
    if (window.confirm('Supprimer définitivement cet utilisateur ?')) {
      await api.delete(`/admin/users/${id}`);
      loadUsers();
    }
  };

  const filteredUsers = users.filter(u => 
    u.nom?.toLowerCase().includes(search.toLowerCase()) || 
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="text-center"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="card p-3">
      <div className="d-flex justify-content-between mb-3">
        <h5>Gestion des utilisateurs ({filteredUsers.length})</h5>
        <input type="text" className="form-control w-25" placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="table-light"><tr><th>ID</th><th>Nom complet</th><th>Email</th><th>Rôle</th><th>Ville</th><th>Statut</th><th>Actions</th></tr></thead>
          <tbody>
            {filteredUsers.map(u => (
              <tr key={u.utilisateur_id}>
                <td>{u.utilisateur_id}</td>
                <td>{u.prenom} {u.nom}</td>
                <td>{u.email}</td>
                <td><span className="badge bg-secondary">{u.role}</span></td>
                <td>{u.ville}</td>
                <td><span className={`badge ${u.statut === 'actif' ? 'bg-success' : 'bg-danger'}`}>{u.statut}</span></td>
                <td>
                  {u.statut === 'actif' ? (
                    <button className="btn btn-sm btn-warning me-1" onClick={() => bloquerUser(u.utilisateur_id)}>Bloquer</button>
                  ) : (
                    <button className="btn btn-sm btn-success me-1" onClick={() => debloquerUser(u.utilisateur_id)}>Débloquer</button>
                  )}
                  <button className="btn btn-sm btn-danger" onClick={() => supprimerUser(u.utilisateur_id)}>Supprimer</button>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && <tr><td colSpan="7" className="text-center">Aucun utilisateur</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageUsers;