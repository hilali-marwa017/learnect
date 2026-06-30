import { useState, useEffect } from 'react';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('stats');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEtudiants: 0,
    totalEnseignants: 0,
    totalReservations: 0,
    totalAvis: 0,
    revenusTotal: 0
  });
  const [pendingTeachers, setPendingTeachers] = useState([]);
  const [users, setUsers] = useState([]);
  const [signalements, setSignalements] = useState([]);

  useEffect(() => {
    loadAllData();
  }, []);

  const getToken = () => localStorage.getItem('token');
  const getHeaders = () => ({
    'Authorization': `Bearer ${getToken()}`,
    'Content-Type': 'application/json'
  });

  const loadAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadStats(),
        loadPendingTeachers(),
        loadUsers(),
        loadSignalements()
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    const res = await fetch('http://localhost:8000/api/admin/stats', { headers: getHeaders() });
    if (res.ok) {
      const data = await res.json();
      setStats({
        totalEtudiants: data.total_etudiants || 0,
        totalEnseignants: data.total_enseignants || 0,
        totalReservations: data.total_reservations || 0,
        totalAvis: data.total_avis || 0,
        revenusTotal: data.revenus_total || 0
      });
    }
  };

  const loadPendingTeachers = async () => {
    const res = await fetch('http://localhost:8000/api/admin/enseignantsEnAttente', { headers: getHeaders() });
    if (res.ok) {
      const data = await res.json();
      setPendingTeachers(data || []);
    }
  };

  const loadUsers = async () => {
    const res = await fetch('http://localhost:8000/api/admin/Users', { headers: getHeaders() });
    if (res.ok) {
      const data = await res.json();
      setUsers(data || []);
    }
  };

  const loadSignalements = async () => {
    const res = await fetch('http://localhost:8000/api/admin/signalements', { headers: getHeaders() });
    if (res.ok) {
      const data = await res.json();
      setSignalements(data || []);
    }
  };

  const handleValider = async (id) => {
    await fetch(`http://localhost:8000/api/admin/validerEnseignant/${id}`, { method: 'POST', headers: getHeaders() });
    loadAllData();
  };

  const handleBloquer = async (id) => {
    await fetch(`http://localhost:8000/api/admin/bloquer/${id}`, { method: 'POST', headers: getHeaders() });
    loadAllData();
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>⏳ Chargement...</div>;
  }

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '30px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ background: '#0f172a', color: 'white', borderRadius: '30px', padding: '30px', marginBottom: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ background: '#1e293b', padding: '12px', borderRadius: '16px' }}>🛡️</div>
            <div>
              <span style={{ fontSize: '10px', background: '#1e293b', padding: '4px 10px', borderRadius: '20px' }}>CONSOLE ADMIN</span>
              <h1 style={{ fontSize: '24px', marginTop: '5px' }}>Learnect Back-office</h1>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', flexWrap: 'wrap' }}>
          <button onClick={() => setActiveTab('stats')} style={{ padding: '10px 20px', borderRadius: '10px', border: 'none', background: activeTab === 'stats' ? '#3b82f6' : '#e2e8f0', color: activeTab === 'stats' ? 'white' : '#334155', cursor: 'pointer' }}>📊 Statistiques</button>
          <button onClick={() => setActiveTab('teachers')} style={{ padding: '10px 20px', borderRadius: '10px', border: 'none', background: activeTab === 'teachers' ? '#3b82f6' : '#e2e8f0', color: activeTab === 'teachers' ? 'white' : '#334155', cursor: 'pointer' }}>📄 Validation ({pendingTeachers.length})</button>
          <button onClick={() => setActiveTab('users')} style={{ padding: '10px 20px', borderRadius: '10px', border: 'none', background: activeTab === 'users' ? '#3b82f6' : '#e2e8f0', color: activeTab === 'users' ? 'white' : '#334155', cursor: 'pointer' }}>👥 Utilisateurs ({users.length})</button>
          <button onClick={() => setActiveTab('reports')} style={{ padding: '10px 20px', borderRadius: '10px', border: 'none', background: activeTab === 'reports' ? '#3b82f6' : '#e2e8f0', color: activeTab === 'reports' ? 'white' : '#334155', cursor: 'pointer' }}>⚠️ Signalements ({signalements.length})</button>
        </div>

        {/* Stats */}
        {activeTab === 'stats' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px' }}>
            <div style={{ background: 'white', padding: '20px', borderRadius: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{stats.totalEtudiants}</div>
              <div style={{ color: '#64748b', fontSize: '12px' }}>Étudiants</div>
            </div>
            <div style={{ background: 'white', padding: '20px', borderRadius: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{stats.totalEnseignants}</div>
              <div style={{ color: '#64748b', fontSize: '12px' }}>Enseignants</div>
            </div>
            <div style={{ background: 'white', padding: '20px', borderRadius: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{stats.totalReservations}</div>
              <div style={{ color: '#64748b', fontSize: '12px' }}>Réservations</div>
            </div>
            <div style={{ background: 'white', padding: '20px', borderRadius: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#2563eb' }}>{stats.revenusTotal} DH</div>
              <div style={{ color: '#64748b', fontSize: '12px' }}>Commissions</div>
            </div>
            <div style={{ background: 'white', padding: '20px', borderRadius: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{stats.totalAvis}</div>
              <div style={{ color: '#64748b', fontSize: '12px' }}>Avis</div>
            </div>
          </div>
        )}

        {/* Teachers */}
        {activeTab === 'teachers' && (
          <div style={{ background: 'white', borderRadius: '16px', padding: '20px' }}>
            <h3>Enseignants en attente ({pendingTeachers.length})</h3>
            {pendingTeachers.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>Aucun enseignant en attente</p>
            ) : (
              pendingTeachers.map(t => (
                <div key={t.utilisateur_id} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '15px', marginBottom: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <h4><strong>{t.user?.prenom} {t.user?.nom}</strong></h4>
                      <p style={{ color: '#64748b', fontSize: '14px' }}>{t.user?.email}</p>
                      <p style={{ fontSize: '14px' }}><strong>Diplôme:</strong> {t.diplome}</p>
                    </div>
                    <button onClick={() => handleValider(t.utilisateur_id)} style={{ background: '#22c55e', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '8px', cursor: 'pointer' }}>✅ Valider</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Users */}
        {activeTab === 'users' && (
          <div style={{ background: 'white', borderRadius: '16px', padding: '20px', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#f1f5f9' }}>
                <tr><th style={{ padding: '10px', textAlign: 'left' }}>Nom</th><th style={{ padding: '10px', textAlign: 'left' }}>Email</th><th style={{ padding: '10px', textAlign: 'left' }}>Rôle</th><th style={{ padding: '10px', textAlign: 'left' }}>Statut</th><th style={{ padding: '10px', textAlign: 'left' }}>Action</th></tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.utilisateur_id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '10px' }}>{u.prenom} {u.nom}</td>
                    <td style={{ padding: '10px' }}>{u.email}</td>
                    <td style={{ padding: '10px', textTransform: 'capitalize' }}>{u.role}</td>
                    <td style={{ padding: '10px' }}><span style={{ background: u.statut === 'actif' ? '#dcfce7' : '#fee2e2', color: u.statut === 'actif' ? '#166534' : '#991b1b', padding: '2px 8px', borderRadius: '20px', fontSize: '12px' }}>{u.statut}</span></td>
                    <td style={{ padding: '10px' }}>
                      {u.statut === 'actif' ? (
                        <button onClick={() => handleBloquer(u.utilisateur_id)} style={{ color: '#ef4444', cursor: 'pointer', background: 'none', border: 'none' }}>🔒 Bloquer</button>
                      ) : (
                        <span style={{ color: '#94a3b8' }}>Bloqué</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Signalements */}
        {activeTab === 'reports' && (
          <div style={{ background: 'white', borderRadius: '16px', padding: '20px' }}>
            <h3>Signalements ({signalements.length})</h3>
            {signalements.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>Aucun signalement</p>
            ) : (
              signalements.map(s => (
                <div key={s.id_signalement} style={{ borderBottom: '1px solid #e2e8f0', padding: '15px 0' }}>
                  <p><strong>Motif:</strong> {s.motif}</p>
                  <p><strong>Statut:</strong> {s.statut}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;