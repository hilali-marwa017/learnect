import { useState, useEffect } from 'react';
import ManageUsers from './ManageUsers';
import Signalements from './Signalements';
import ValidatedTeachers from './ValidatedTeachers';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('stats');
  const [loading, setLoading] = useState(false);
  
  // Données mockées pour l'affichage
  const [stats, setStats] = useState({
    totalEtudiants: 45,
    totalEnseignants: 12,
    totalReservations: 128,
    totalCommissions: 8450,
    totalAvis: 24
  });
  
  const [pendingTeachers, setPendingTeachers] = useState([]);
  const [signalements, setSignalements] = useState([]);
  const [users, setUsers] = useState([
    { utilisateur_id: 1, prenom: 'Admin', nom: 'Super', email: 'admin@learnect.ma', role: 'admin', ville: 'Casablanca', statut: 'actif' },
    { utilisateur_id: 2, prenom: 'Sofia', nom: 'Benani', email: 'sofia@learnect.ma', role: 'enseignant', ville: 'Casablanca', statut: 'actif' },
    { utilisateur_id: 3, prenom: 'Amine', nom: 'Chraibi', email: 'amine@learnect.ma', role: 'enseignant', ville: 'Marrakech', statut: 'actif' },
    { utilisateur_id: 4, prenom: 'Leila', nom: 'Moukrim', email: 'leila@learnect.ma', role: 'enseignant', ville: 'Rabat', statut: 'actif' }
  ]);

  // Tentative de chargement des données réelles
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
      
      // Essayer de charger les données réelles, mais ne pas planter si ça échoue
      const statsRes = await fetch('http://localhost:8000/api/admin/stats', { headers }).catch(() => null);
      if (statsRes && statsRes.ok) {
        const statsData = await statsRes.json();
        setStats({
          totalEtudiants: statsData.total_etudiants || 45,
          totalEnseignants: statsData.total_enseignants || 12,
          totalReservations: statsData.total_reservations || 128,
          totalCommissions: statsData.revenus_total || 8450,
          totalAvis: statsData.total_avis || 24
        });
      }
      
      const teachersRes = await fetch('http://localhost:8000/api/admin/enseignants/en-attente', { headers }).catch(() => null);
      if (teachersRes && teachersRes.ok) {
        const teachersData = await teachersRes.json();
        setPendingTeachers(teachersData || []);
      }
      
      const signalementsRes = await fetch('http://localhost:8000/api/admin/signalements', { headers }).catch(() => null);
      if (signalementsRes && signalementsRes.ok) {
        const signalementsData = await signalementsRes.json();
        setSignalements(signalementsData || []);
      }
      
      const usersRes = await fetch('http://localhost:8000/api/admin/users', { headers }).catch(() => null);
      if (usersRes && usersRes.ok) {
        const usersData = await usersRes.json();
        if (usersData && usersData.length > 0) {
          setUsers(usersData);
        }
      }
    } catch (err) {
      console.error('Erreur chargement, utilisation des données mockées');
    } finally {
      setLoading(false);
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
            <i className="bi bi-exclamation-triangle"></i> Signalements ({signalements.filter(s => s.statut === 'en_attente').length})
          </button>
          <button onClick={() => setActiveTab('users')} className={`py-3 px-6 flex items-center gap-2 ${activeTab === 'users' ? 'border-b-2 border-blue-600 text-blue-700' : 'text-slate-500'}`}>
            <i className="bi bi-people"></i> Utilisateurs ({users.length})
          </button>
        </div>

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
              <div className="bg-white p-5 rounded-3xl border text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Total Élèves</span>
                <span className="text-3xl font-black text-slate-900 block mt-2">{stats.totalEtudiants}</span>
              </div>
              <div className="bg-white p-5 rounded-3xl border text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Total Tuteurs</span>
                <span className="text-3xl font-black text-slate-900 block mt-2">{stats.totalEnseignants}</span>
              </div>
              <div className="bg-white p-5 rounded-3xl border text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Réservations</span>
                <span className="text-3xl font-black text-slate-900 block mt-2">{stats.totalReservations}</span>
              </div>
              <div className="bg-white p-5 rounded-3xl border text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Commissions</span>
                <span className="text-3xl font-black text-blue-700 block mt-2">{stats.totalCommissions.toFixed(1)} DH</span>
              </div>
              <div className="bg-white p-5 rounded-3xl border text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Avis rédigés</span>
                <span className="text-3xl font-black text-slate-900 block mt-2">{stats.totalAvis}</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border">
              <h4 className="text-xs font-black uppercase">Suivi des flux financiers</h4>
              <div className="mt-4 p-4 bg-slate-50 rounded-2xl text-xs space-y-2 text-slate-600">
                <p>✓ 10% de commission, 90% pour l'enseignant.</p>
                <p>✓ Modération instantanée visible globalement.</p>
              </div>
            </div>
          </div>
        )}

        {/* Teachers Validation Tab */}
        {activeTab === 'teachers' && (
          <ValidatedTeachers 
            pendingTeachers={pendingTeachers} 
            onValidate={async (id) => {
              await fetch(`http://localhost:8000/api/admin/enseignants/${id}/valider`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
              });
              loadData();
            }}
            onRefresh={loadData}
          />
        )}

        {/* Signalements Tab */}
        {activeTab === 'reports' && (
          <Signalements 
            signalements={signalements} 
            onTraiter={async (id) => {
              await fetch(`http://localhost:8000/api/admin/signalements/${id}/traiter`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
              });
              loadData();
            }}
            onSupprimerAvis={async (idAvis, idSignalement) => {
              await fetch(`http://localhost:8000/api/admin/avis/${idAvis}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
              });
              await fetch(`http://localhost:8000/api/admin/signalements/${idSignalement}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
              });
              loadData();
            }}
          />
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <ManageUsers 
            users={users} 
            onBloquer={async (id) => {
              await fetch(`http://localhost:8000/api/admin/users/${id}/bloquer`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
              });
              loadData();
            }}
          />
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;