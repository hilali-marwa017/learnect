function ManageUsers({ users, onRefresh }) {

  const listeUtilisateurs = Array.isArray(users) ? users : [];

  function obtenirToken() {
    return localStorage.getItem('token');
  }

  async function bloquerUtilisateur(id) {
    await fetch(`http://localhost:8000/api/admin/bloquer/${id}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${obtenirToken()}` }
    });
    onRefresh();
  }

  async function debloquerUtilisateur(id) {
    await fetch(`http://localhost:8000/api/admin/debloquer/${id}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${obtenirToken()}` }
    });
    onRefresh();
  }

  function obtenirStyleRole(role) {
    if (role === 'admin') return { background: 'rgba(0,0,0,0.05)', color: '#000' };
    if (role === 'enseignant') return { background: 'rgba(13,110,253,0.1)', color: '#0d6efd' };
    return { background: 'rgba(25,135,84,0.1)', color: '#198754' };
  }

  function obtenirIconeRole(role) {
    if (role === 'admin') return 'bi-shield';
    if (role === 'enseignant') return 'bi-briefcase';
    return 'bi-mortarboard';
  }

  const styleConteneur = {
    background: 'white',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    overflow: 'hidden'
  };

  const styleBoutonBloquer = {
    background: 'white',
    color: '#dc3545',
    border: '1px solid #dc3545',
    padding: '4px 12px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'none'
  };

  const styleBoutonDebloquer = {
    background: 'white',
    color: '#198754',
    border: '1px solid #198754',
    padding: '4px 12px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'none'
  };

  return (
    <div style={styleConteneur}>
      <div style={{ padding: '24px' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', paddingBottom: '12px', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ background: 'rgba(13,202,240,0.1)', padding: '12px', borderRadius: '12px' }}>
            <i className="bi bi-people" style={{ fontSize: '20px', color: '#0dcaf0' }}></i>
          </div>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>Gestion des utilisateurs</h3>
            <p style={{ color: '#6c757d', fontSize: '12px', marginBottom: '0' }}>{listeUtilisateurs.length} utilisateurs inscrits</p>
          </div>
        </div>

        {listeUtilisateurs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0', color: '#6c757d' }}>
            Aucun utilisateur trouvé.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8f9fa' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '11px', fontWeight: 'bold', color: '#6c757d', borderBottom: '1px solid #e2e8f0' }}>Utilisateur</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '11px', fontWeight: 'bold', color: '#6c757d', borderBottom: '1px solid #e2e8f0' }}>Rôle</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '11px', fontWeight: 'bold', color: '#6c757d', borderBottom: '1px solid #e2e8f0' }}>Ville</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '11px', fontWeight: 'bold', color: '#6c757d', borderBottom: '1px solid #e2e8f0' }}>Statut</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '11px', fontWeight: 'bold', color: '#6c757d', borderBottom: '1px solid #e2e8f0' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {listeUtilisateurs.map(u => (
                  <tr key={u.utilisateur_id || u.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ background: 'rgba(108,117,125,0.1)', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{u.prenom?.[0]}{u.nom?.[0]}</span>
                        </div>
                        <div>
                          <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{u.prenom} {u.nom}</div>
                          <div style={{ fontSize: '11px', color: '#6c757d' }}>{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ ...obtenirStyleRole(u.role), padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <i className={`bi ${obtenirIconeRole(u.role)}`}></i> {u.role}
                      </span>
                    </td>
                    <td style={{ padding: '12px', color: '#6c757d', fontSize: '13px' }}>
                      <i className="bi bi-geo-alt" style={{ marginRight: '4px' }}></i>{u.ville}
                    </td>
                    <td style={{ padding: '12px' }}>
                      {u.statut === 'actif' ? (
                        <span style={{ background: 'rgba(25,135,84,0.1)', color: '#198754', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <i className="bi bi-check-circle"></i> Actif
                        </span>
                      ) : (
                        <span style={{ background: 'rgba(220,53,69,0.1)', color: '#dc3545', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <i className="bi bi-x-circle"></i> Bloqué
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '12px' }}>
                      {u.statut === 'actif' ? (
                        <button onClick={() => bloquerUtilisateur(u.utilisateur_id || u.id)} style={styleBoutonBloquer}>
                          <i className="bi bi-lock" style={{ marginRight: '4px' }}></i> Bloquer
                        </button>
                      ) : (
                        <button onClick={() => debloquerUtilisateur(u.utilisateur_id || u.id)} style={styleBoutonDebloquer}>
                          <i className="bi bi-unlock" style={{ marginRight: '4px' }}></i> Débloquer
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