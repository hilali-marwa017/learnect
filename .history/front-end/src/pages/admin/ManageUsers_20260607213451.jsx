function ManageUsers({ users, onRefresh }) {
  const getToken = () => localStorage.getItem('token');

  const handleBloquer = async (id) => {
    await fetch(`http://localhost:8000/api/admin/bloquer/${id}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    if (onRefresh) onRefresh();
  };

  const handleDebloquer = async (id) => {
    await fetch(`http://localhost:8000/api/admin/debloquer/${id}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    if (onRefresh) onRefresh();
  };

  return (
    <div className="card border-0 shadow-sm rounded-4">
      <div className="card-body p-4">
        <h5 className="mb-3">Utilisateurs ({users.length})</h5>
        <div className="table-responsive">
          <table className="table">
            <thead><tr><th>Nom</th><th>Email</th><th>Rôle</th><th>Statut</th><th>Actions</th></tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u.utilisateur_id}>
                  <td>{u.prenom} {u.nom}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>{u.statut}</td>
                  <td>
                    {u.statut === 'actif' ? (
                      <button onClick={() => handleBloquer(u.utilisateur_id)} className="btn btn-danger btn-sm">Bloquer</button>
                    ) : (
                      <button onClick={() => handleDebloquer(u.utilisateur_id)} className="btn btn-success btn-sm">Débloquer</button>
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