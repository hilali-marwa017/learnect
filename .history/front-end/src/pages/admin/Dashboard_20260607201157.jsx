import { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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
  const [refuseId, setRefuseId] = useState(null);
  const [refuseRaison, setRefuseRaison] = useState('');

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

  const handleRefuser = async () => {
    if (refuseId && refuseRaison) {
      await fetch(`http://localhost:8000/api/admin/refuserEnseignant/${refuseId}`, {
        method: 'POST',
        headers: { ...getHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ raison: refuseRaison })
      });
      setRefuseId(null);
      setRefuseRaison('');
      loadAllData();
    }
  };

  const handleBloquer = async (id) => {
    await fetch(`http://localhost:8000/api/admin/bloquer/${id}`, { method: 'POST', headers: getHeaders() });
    loadAllData();
  };

  // Données pour le graphique
  const chartData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
    datasets: [
      {
        label: 'Volume (DH)',
        data: [8900, 12500, 15300, 19800, 24300, 28700],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderRadius: 8,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { font: { size: 11 } } },
      tooltip: { callbacks: { label: (ctx) => `${ctx.raw.toLocaleString()} DH` } }
    }
  };

  if (loading) {
    return <div className="text-center py-5"><div className="spinner-border text-primary"></div><p>Chargement...</p></div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-800 rounded-2xl">
              <i className="bi bi-shield-check fs-4 text-blue-400"></i>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest bg-slate-800 px-2.5 py-0.5 rounded text-blue-400">Console Administration</span>
              <h1 className="text-xl sm:text-2xl font-black mt-1">Learnect Back-office</h1>
              <p className="text-slate-300 text-xs mt-0.5">Validation des diplômes, modération des avis signalés et gestion des comptes utilisateurs.</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 mb-8 flex-wrap">
          <button onClick={() => setActiveTab('stats')} className={`py-3 px-6 flex items-center gap-2 ${activeTab === 'stats' ? 'border-b-2 border-blue-600 text-blue-700' : 'text-slate-500'}`}>
            <i className="bi bi-graph-up"></i> Statistiques
          </button>
          <button onClick={() => setActiveTab('teachers')} className={`py-3 px-6 flex items-center gap-2 ${activeTab === 'teachers' ? 'border-b-2 border-blue-600 text-blue-700' : 'text-slate-500'}`}>
            <i className="bi bi-files"></i> Vérification ({pendingTeachers.length})
          </button>
          <button onClick={() => setActiveTab('reports')} className={`py-3 px-6 flex items-center gap-2 ${activeTab === 'reports' ? 'border-b-2 border-blue-600 text-blue-700' : 'text-slate-500'}`}>
            <i className="bi bi-exclamation-triangle"></i> Signalements ({signalements.length})
          </button>
          <button onClick={() => setActiveTab('users')} className={`py-3 px-6 flex items-center gap-2 ${activeTab === 'users' ? 'border-b-2 border-blue-600 text-blue-700' : 'text-slate-500'}`}>
            <i className="bi bi-people"></i> Utilisateurs ({users.length})
          </button>
        </div>

        {/* ==================== STATS TAB ==================== */}
        {activeTab === 'stats' && (
          <div>
            {/* 5 cartes stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
              <div className="bg-white p-5 rounded-3xl border">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Total Élèves</span>
                <span className="text-3xl font-black text-slate-900 block mt-2">{stats.totalEtudiants}</span>
              </div>
              <div className="bg-white p-5 rounded-3xl border">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Total Tuteurs</span>
                <span className="text-3xl font-black text-slate-900 block mt-2">{stats.totalEnseignants}</span>
              </div>
              <div className="bg-white p-5 rounded-3xl border">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Réservations</span>
                <span className="text-3xl font-black text-slate-900 block mt-2">{stats.totalReservations}</span>
              </div>
              <div className="bg-white p-5 rounded-3xl border">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Commissions brutes</span>
                <span className="text-3xl font-black text-blue-700 block mt-2">{stats.revenusTotal.toFixed(1)} DH</span>
              </div>
              <div className="bg-white p-5 rounded-3xl border">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Avis rédigés</span>
                <span className="text-3xl font-black text-slate-900 block mt-2">{stats.totalAvis}</span>
              </div>
            </div>

            {/* Graphique Chart.js */}
            <div className="bg-white p-6 rounded-3xl border mb-8">
              <div className="flex justify-between items-start pb-4 border-b">
                <div>
                  <span className="text-[10px] uppercase font-bold text-indigo-600">Volume des transactions</span>
                  <h4 className="text-sm font-black mt-1">Évolution des encaissements & commissions (10%)</h4>
                </div>
                <div className="bg-indigo-50 px-3 py-1.5 rounded-xl text-[11px] font-bold text-indigo-700">
                  <i className="bi bi-graph-up me-1"></i> Croissance mensuelle : +22%
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
                <div className="md:col-span-2" style={{ height: '280px' }}>
                  <Bar data={chartData} options={chartOptions} />
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border">
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Performance Administrative</span>
                  <div className="mt-3 space-y-2 text-xs">
                    <div className="flex justify-between"><span className="text-slate-500">Volume de pointe :</span><strong>Juin (28 700 DH)</strong></div>
                    <div className="flex justify-between"><span className="text-slate-500">Total Commissions :</span><strong className="text-indigo-800">10 863 DH</strong></div>
                    <div className="flex justify-between"><span className="text-slate-500">Tuteurs actifs :</span><strong>Sofia, Amine, Laila</strong></div>
                  </div>
                  <p className="text-[10.5px] text-slate-400 italic mt-3 pt-2 border-t">🛡️ Les commissions fixes servent au financement des serveurs.</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border">
              <h4 className="text-xs font-black uppercase">Suivi des flux financiers transparents</h4>
              <div className="mt-4 p-4 bg-slate-50 rounded-2xl text-xs space-y-2 text-slate-600">
                <p>✓ Tous les profils d'enseignants ont 10% de taxes perçues d'utilisation, et 90% restent pour l'enseignant.</p>
                <p>✓ Les modifications faites par l'ordinateur de modération sont instantanément visibles globalement.</p>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TEACHERS VALIDATION TAB ==================== */}
        {activeTab === 'teachers' && (
          <div className="bg-white p-6 rounded-3xl border">
            <h3 className="text-sm font-black uppercase">VÉRIFICATION ACADÉMIQUE MANUELLE DES DIPLÔMES ({pendingTeachers.length})</h3>
            <p className="text-xs text-slate-500 mt-1">Examinez minutieusement les documents de diplômes téléversés avant d'autoriser la mise en ligne.</p>
            
            {pendingTeachers.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl mt-4">
                <i className="bi bi-folder2-open fs-1 text-slate-300"></i>
                <p className="text-xs text-slate-400 mt-2">Dossier vide. Aucun professeur en attente.</p>
              </div>
            ) : (
              <div className="space-y-6 mt-4">
                {pendingTeachers.map(t => (
                  <div key={t.utilisateur_id} className="p-5 bg-slate-50 rounded-2xl border">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-slate-300 flex items-center justify-center font-bold">{t.user?.prenom?.[0]}</div>
                      <div>
                        <h4 className="font-black text-sm">{t.user?.prenom} {t.user?.nom}</h4>
                        <p className="text-[10.5px] text-slate-400">{t.user?.email} | Ville: {t.user?.ville}</p>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border mb-4">
                      <p className="text-[9px] font-bold text-slate-400 uppercase mb-2"><i className="bi bi-file-text me-1"></i>DIPLÔME ACADÉMIQUE :</p>
                      <div className="bg-slate-50 p-2 rounded-lg"><strong>{t.diplome}</strong></div>
                      <div className="grid grid-cols-2 gap-3 mt-3">
                        <div><p className="text-[9px] font-bold uppercase">CIN Recto :</p><div className="bg-slate-50 p-2 rounded-lg text-xs">{t.cin_recto || 'non-fourni'}</div></div>
                        <div><p className="text-[9px] font-bold uppercase">CIN Verso :</p><div className="bg-slate-50 p-2 rounded-lg text-xs">{t.cin_verso || 'non-fourni'}</div></div>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 italic bg-blue-50 p-3 rounded-xl">"{t.description_profil}"</p>
                    <div className="flex gap-3 mt-4">
                      <button onClick={() => handleValider(t.utilisateur_id)} className="bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-xl"><i className="bi bi-shield-check me-1"></i>Approuver et Valider</button>
                      <button onClick={() => setRefuseId(t.utilisateur_id)} className="border border-slate-300 text-rose-600 text-xs font-bold px-4 py-2 rounded-xl">Demander correction</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================== SIGNALEMENTS TAB ==================== */}
        {activeTab === 'reports' && (
          <div className="bg-white p-6 rounded-3xl border">
            <h3 className="text-sm font-black uppercase">MODÉRATION DES COMMENTAIRES / AVIS SIGNALÉS ({signalements.length})</h3>
            <p className="text-xs text-slate-500 mt-1">Consultez les plaintes d'étudiants ou d'enseignants.</p>
            
            {signalements.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl mt-4">Aucun signalement en attente</div>
            ) : (
              <div className="space-y-4 mt-4">
                {signalements.map(s => (
                  <div key={s.id_signalement} className="p-5 bg-slate-50 rounded-2xl border">
                    <span className="inline-flex items-center gap-1.5 text-[10px] bg-rose-50 text-rose-700 px-2.5 py-1 rounded-full"><i className="bi bi-exclamation-triangle"></i>Signalé</span>
                    <p className="text-xs text-slate-700 mt-2 italic">"{s.avis?.commentaire}"</p>
                    <p className="text-[10px] text-slate-400 mt-1">Motif: {s.motif}</p>
                    <div className="flex gap-3 mt-4">
                      <button className="bg-blue-600 text-white text-xs px-3 py-2 rounded-xl">Rejeter Signalement</button>
                      <button className="bg-rose-50 text-rose-600 text-xs px-3 py-2 rounded-xl">Supprimer l'avis</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================== USERS TAB ==================== */}
        {activeTab === 'users' && (
          <div className="bg-white p-6 rounded-3xl border">
            <h3 className="text-sm font-black uppercase">ANNUAIRE DES UTILISATEURS ENREGISTRÉS ({users.length})</h3>
            <p className="text-xs text-slate-500 mt-1">Gérez les comptes de tuteurs et élèves.</p>
            
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="p-3 text-left">Utilisateur</th>
                    <th className="p-3 text-left">Rôle</th>
                    <th className="p-3 text-left">Ville</th>
                    <th className="p-3 text-left">Statut</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.utilisateur_id} className="border-b">
                      <td className="p-3">
                        <div><span className="font-bold">{u.prenom} {u.nom}</span><br /><span className="text-xs text-slate-400">{u.email}</span></div>
                      </td>
                      <td className="p-3 capitalize">{u.role}</td>
                      <td className="p-3">{u.ville}</td>
                      <td className="p-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${u.statut === 'actif' ? 'bg-blue-50 text-blue-800' : 'bg-rose-50 text-rose-600'}`}>
                          {u.statut === 'actif' ? 'ACTIF' : 'BLOQUÉ'}
                        </span>
                      </td>
                      <td className="p-3">
                        <button onClick={() => handleBloquer(u.utilisateur_id)} className="text-rose-600 text-xs font-bold">
                          <i className="bi bi-lock me-1"></i>Bloquer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal Refus */}
        {refuseId && (
          <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center p-4 z-50">
            <div className="bg-white p-6 rounded-3xl max-w-md w-full">
              <h3 className="text-lg font-black text-rose-700 flex items-center gap-2"><i className="bi bi-exclamation-triangle"></i>Motif du rejet</h3>
              <p className="text-xs text-slate-500 mt-1">Précisez à l'enseignant pourquoi sa validation a été refusée.</p>
              <textarea value={refuseRaison} onChange={e => setRefuseRaison(e.target.value)} rows={3} className="w-full border rounded-xl p-3 text-xs mt-4" placeholder="Le justificatif du diplôme n'est pas lisible..."></textarea>
              <div className="flex justify-end gap-3 mt-4">
                <button onClick={() => setRefuseId(null)} className="px-4 py-2 text-sm">Annuler</button>
                <button onClick={handleRefuser} className="bg-rose-600 text-white px-4 py-2 rounded-xl text-sm">Confirmer le Rejet</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;