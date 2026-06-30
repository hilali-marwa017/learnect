function ManageUsers({ users, onRefresh }) {
  const getToken = () => localStorage.getItem('token');

  const handleBloquer = async (id) => {
    await fetch(`http://localhost:8000/api/admin/bloquer/${id}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    onRefresh();
  };

  const handleDebloquer = async (id) => {
    await fetch(`http://localhost:8000/api/admin/debloquer/${id}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    onRefresh();
  };

  const getRoleBadgeClass = (role) => {
    if (role === 'admin') return 'bg-dark bg-opacity-10 text-dark';
    if (role === 'enseignant') return 'bg-primary bg-opacity-10 text-primary';
    return 'bg-success bg-opacity-10 text-success';
  };

  const getRoleIcon = (role) => {
    if (role === 'admin') return 'bi-shield';
    if (role === 'enseignant') return 'bi-briefcase';
    return 'bi-mortarboard';
  };

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

        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="bg-light">
              <tr>
                <th className="border-0 py-3 px-3 small fw-bold text-muted">Utilisateur</th>
                <th className="border-0 py-3 px-3 small fw-bold text-muted">Rôle</th>
                <th className="border-0 py-3 px-3 small fw-bold text-muted">Ville</th>
                <th className="border-0 py-3 px-3 small fw-bold text-muted">Statut</th>
                <th className="border-0 py-3 px-3 small fw-bold text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.utilisateur_id} className="border-bottom">
                  <td className="py-3 px-3">
                    <div className="d-flex align-items-center gap-3">
                      <div className="bg-secondary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                        <span className="fw-bold">{u.prenom?.[0]}{u.nom?.[0]}</span>
                      </div>
                      <div>
                        <div className="fw-bold">{u.prenom} {u.nom}</div>
                        <div className="small text-muted">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`badge ${getRoleBadgeClass(u.role)} px-3 py-2`}>
                      <i className={`${getRoleIcon(u.role)} me-1`}></i> {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <i className="bi bi-geo-alt text-muted me-1"></i> {u.ville}
                  </td>
                  <td className="py-3 px-3">
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
                  <td className="py-3 px-3">
                    {u.statut === 'actif' ? (
                      <button onClick={() => handleBloquer(u.utilisateur_id)} className="btn btn-outline-danger btn-sm px-3">
                        <i className="bi bi-lock me-1"></i> Bloquer
                      </button>
                    ) : (
                      <button onClick={() => handleDebloquer(u.utilisateur_id)} className="btn btn-outline-success btn-sm px-3">
                        <i className="bi bi-unlock me-1"></i> Débloquer
                      </button>
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