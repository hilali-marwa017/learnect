import { useState, useEffect } from 'react';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('stats');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalEtudiants: 0,
    totalEnseignants: 0,
    totalReservations: 0,
    totalAvis: 0,
    revenusTotal: 0
  });
  const [pendingTeachers, setPendingTeachers] = useState([]);
  const [signalements, setSignalements] = useState([]);
  const [users, setUsers] = useState([]);
  const [refuseId, setRefuseId] = useState(null);
  const [refuseRaison, setRefuseRaison] = useState('');

  useEffect(() => {
    loadAllData();
  }, []);

  const getToken = () => localStorage.getItem('token');
  const getHeaders = () => ({
    'Authorization': `Bearer ${getToken()}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  });

  const loadAllData = async () => {
    setLoading(true);
    setError('');
    try {
      await Promise.all([
        loadStats(),
        loadPendingTeachers(),
        loadUsers(),
        loadSignalements()
      ]);
    } catch (err) {
      console.error('Erreur:', err);
      setError('Erreur de chargement des données');
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
    try {
      const res = await fetch('http://localhost:8000/api/admin/signalements', { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        setSignalements(data || []);
      }
    } catch (err) {
      console.log('Signalements non implémentés');
    }
  };

  const handleValiderEnseignant = async (id) => {
    const res = await fetch(`http://localhost:8000/api/admin/validerEnseignant/${id}`, {
      method: 'POST',
      headers: getHeaders()
    });
    if (res.ok) {
      await loadPendingTeachers();
      await loadStats();
    }
  };

  const handleRefuserEnseignant = async () => {
    if (refuseId && refuseRaison) {
      await fetch(`http://localhost:8000/api/admin/refuserEnseignant/${refuseId}`, {
        method: 'POST',
        headers: { ...getHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ raison: refuseRaison })
      });
      setRefuseId(null);
      setRefuseRaison('');
      await loadPendingTeachers();
    }
  };

  const handleBloquerUser = async (id) => {
    await fetch(`http://localhost:8000/api/admin/bloquer/${id}`, {
      method: 'POST',
      headers: getHeaders()
    });
    await loadUsers();
  };

  const handleDebloquerUser = async (id) => {
    await fetch(`http://localhost:8000/api/admin/debloquer/${id}`, {
      method: 'POST',
      headers: getHeaders()
    });
    await loadUsers();
  };

  if (loading) {
    return <div className="text-center py-5"><div className="spinner-border text-primary"></div><p className="mt-2">Chargement...</p></div>;
  }

  if (error) {
    return <div className="text-center py-5 text-danger">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-800 rounded-2xl">
              <i className="bi bi-shield-check fs-4 text-blue-400"></i>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold bg-slate-800 px-2.5 py-0.5 rounded text-blue-400">Console Admin</span>
              <h1 className="text-2xl font-black mt-1">Learnect Back-office</h1>
              <p className="text-slate-300 text-xs">Validation des diplômes, modération des avis</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b mb-8 flex-wrap gap-2">
          <button onClick={() => setActiveTab('stats')} className={`py-2 px-5 rounded-t-lg ${activeTab === 'stats' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
            <i className="bi bi-graph-up me-1"></i> Stats
          </button>
          <button onClick={() => setActiveTab('teachers')} className={`py-2 px-5 rounded-t-lg ${activeTab === 'teachers' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
            <i className="bi bi-files me-1"></i> Validation ({pendingTeachers.length})
          </button>
          <button onClick={() => setActiveTab('users')} className={`py-2 px-5 rounded-t-lg ${activeTab === 'users' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
            <i className="bi bi-people me-1"></i> Utilisateurs ({users.length})
          </button>
          <button onClick={() => setActiveTab('reports')} className={`py-2 px-5 rounded-t-lg ${activeTab === 'reports' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
            <i className="bi bi-exclamation-triangle me-1"></i> Signalements ({signalements.length})
          </button>
        </div>

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-white p-4 rounded-xl border text-center"><span className="text-xs text-slate-400">Étudiants</span><div className="text-2xl font-bold">{stats.totalEtudiants}</div></div>
            <div className="bg-white p-4 rounded-xl border text-center"><span className="text-xs text-slate-400">Enseignants</span><div className="text-2xl font-bold">{stats.totalEnseignants}</div></div>
            <div className="bg-white p-4 rounded-xl border text-center"><span className="text-xs text-slate-400">Réservations</span><div className="text-2xl font-bold">{stats.totalReservations}</div></div>
            <div className="bg-white p-4 rounded-xl border text-center"><span className="text-xs text-slate-400">Avis</span><div className="text-2xl font-bold">{stats.totalAvis}</div></div>
            <div className="bg-white p-4 rounded-xl border text-center"><span className="text-xs text-slate-400">Commissions</span><div className="text-2xl font-bold text-blue-600">{stats.revenusTotal} DH</div></div>
          </div>
        )}

        {/* Teachers Tab */}
        {activeTab === 'teachers' && (
          <div className="bg-white rounded-xl border p-4">
            <h3 className="font-bold mb-3">Enseignants en attente ({pendingTeachers.length})</h3>
            {pendingTeachers.length === 0 ? (
              <p className="text-center py-8 text-slate-400">Aucun enseignant en attente</p>
            ) : (
              pendingTeachers.map(t => (
                <div key={t.utilisateur_id} className="border rounded-lg p-3 mb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold">{t.user?.prenom} {t.user?.nom}</h4>
                      <p className="text-sm text-slate-500">{t.user?.email}</p>
                      <p className="text-sm mt-1"><strong>Diplôme:</strong> {t.diplome}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleValiderEnseignant(t.utilisateur_id)} className="bg-green-600 text-white px-3 py-1 rounded text-sm">Valider</button>
                      <button onClick={() => setRefuseId(t.utilisateur_id)} className="bg-red-600 text-white px-3 py-1 rounded text-sm">Refuser</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-xl border p-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-100">
                <tr><th className="p-2 text-left">Nom</th><th className="p-2 text-left">Email</th><th className="p-2 text-left">Ville</th><th className="p-2 text-left">Rôle</th><th className="p-2 text-left">Statut</th><th className="p-2 text-left">Action</th></tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.utilisateur_id} className="border-b">
                    <td className="p-2">{u.prenom} {u.nom}</td>
                    <td className="p-2">{u.email}</td>
                    <td className="p-2">{u.ville}</td>
                    <td className="p-2 capitalize">{u.role}</td>
                    <td className="p-2"><span className={`px-2 py-0.5 rounded-full text-xs ${u.statut === 'actif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{u.statut}</span></td>
                    <td className="p-2">
                      {u.statut === 'actif' ? (
                        <button onClick={() => handleBloquerUser(u.utilisateur_id)} className="text-red-600 text-sm">Bloquer</button>
                      ) : (
                        <button onClick={() => handleDebloquerUser(u.utilisateur_id)} className="text-green-600 text-sm">Débloquer</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Signalements Tab */}
        {activeTab === 'reports' && (
          <div className="bg-white rounded-xl border p-4">
            <h3 className="font-bold mb-3">Signalements ({signalements.length})</h3>
            {signalements.length === 0 ? (
              <p className="text-center py-8 text-slate-400">Aucun signalement</p>
            ) : (
              signalements.map(s => (
                <div key={s.id_signalement} className="border rounded-lg p-3 mb-3">
                  <p className="text-sm"><strong>Motif:</strong> {s.motif}</p>
                  <p className="text-sm text-slate-600"><strong>Statut:</strong> {s.statut}</p>
                </div>
              ))
            )}
          </div>
        )}

        {/* Refus Modal */}
        {refuseId && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-5 max-w-md w-full">
              <h3 className="font-bold text-lg mb-2">Motif du rejet</h3>
              <textarea rows="3" className="w-full border rounded-lg p-2 mb-3" placeholder="Raison du refus..." value={refuseRaison} onChange={e => setRefuseRaison(e.target.value)}></textarea>
              <div className="flex justify-end gap-2">
                <button onClick={() => setRefuseId(null)} className="px-4 py-1 border rounded">Annuler</button>
                <button onClick={handleRefuserEnseignant} className="px-4 py-1 bg-red-600 text-white rounded">Confirmer</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;