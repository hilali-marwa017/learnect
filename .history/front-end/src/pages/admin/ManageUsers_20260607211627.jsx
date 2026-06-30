import { bloquerUtilisateur, debloquerUtilisateur } from '../../services/api';

function ManageUsers({ users, onRefresh }) {

  const listeUtilisateurs = Array.isArray(users) ? users : [];

  async function gererBloquer(id) {
    await bloquerUtilisateur(id);
    onRefresh();
  }

  async function gererDebloquer(id) {
    await debloquerUtilisateur(id);
    onRefresh();
  }

  function obtenirClasseRole(role) {
    if (role === 'admin') return 'badge bg-dark';
    if (role === 'enseignant') return 'badge bg-primary';
    return 'badge bg-success';
  }

  function obtenirIconeRole(role) {
    if (role === 'admin') return 'bi-shield';
    if (role === 'enseignant') return 'bi-briefcase';
    return 'bi-mortarboard';
  }

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body p-4">

        <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom">
          <div className="p-2 rounded-3 bg-info bg-opacity-10">
            <i className="bi bi-people fs-5 text-info"></i>
          </div>
          <div>
            <h5 className="fw-bold mb-0">Gestion des utilisateurs</h5>
            <p className="text-muted small mb-0">{listeUtilisateurs.length} utilisateurs inscrits</p>
          </div>
        </div>

        {listeUtilisateurs.length === 0 ? (
          <div className="text-center py-5 text-muted">
            Aucun utilisateur trouvé.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-borderless align-middle">
              <thead className="table-light">
                <tr>
                  <th className="text-muted small fw-bold">Utilisateur</th>
                  <th className="text-muted small fw-bold">Rôle</th>
                  <th className="text-muted small fw-bold">Ville</th>
                  <th className="text-muted small fw-bold">Statut</th>
                  <th className="text-muted small fw-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {listeUtilisateurs.map(u => (
                  <tr key={u.utilisateur_id || u.id} className="border-bottom">
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div className="bg-secondary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
                          <span className="fw-bold small">{u.prenom?.[0]}{u.nom?.[0]}</span>
                        </div>
                        <div>
                          <div className="fw-bold small">{u.prenom} {u.nom}</div>
                          <div className="text-muted" style={{ fontSize: '11px' }}>{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={obtenirClasseRole(u.role)}>
                        <i className={`bi ${obtenirIconeRole(u.role)} me-1`}></i>{u.role}
                      </span>
                    </td>
                    <td className="text-muted small">
                      <i className="bi bi-geo-alt me-1"></i>{u.ville}
                    </td>
                    <td>
                      {u.statut === 'actif' ? (
                        <span className="badge bg-success bg-opacity-10 text-success">
                          <i className="bi bi-check-circle me-1"></i>Actif
                        </span>
                      ) : (
                        <span className="badge bg-danger bg-opacity-10 text-danger">
                          <i className="bi bi-x-circle me-1"></i>Bloqué
                        </span>
                      )}
                    </td>
                    <td>
                      {u.statut === 'actif' ? (
                        <button className="btn btn-outline-danger btn-sm" onClick={() => gererBloquer(u.utilisateur_id || u.id)}>
                          <i className="bi bi-lock me-1"></i>Bloquer
                        </button>
                      ) : (
                        <button className="btn btn-outline-success btn-sm" onClick={() => gererDebloquer(u.utilisateur_id || u.id)}>
                          <i className="bi bi-unlock me-1"></i>Débloquer
                        </button>
                      )}
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