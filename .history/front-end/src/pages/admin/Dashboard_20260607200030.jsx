import { useState, useEffect } from 'react';
import ManageUsers from './ManageUsers';
import Signalements from './Signalements';
import ValidatedTeachers from './ValidatedTeachers';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('stats');
  const [loading, setLoading] = useState(false);
  
  // Données mockées (fonctionnent immédiatement)
  const [stats, setStats] = useState({
    totalEtudiants: 45,
    totalEnseignants: 12,
    totalReservations: 128,
    totalCommissions: 8450,
    totalAvis: 24
  });
  
  const [pendingTeachers, setPendingTeachers] = useState([
    {
      utilisateur_id: 1,
      diplome: "Master en Mathématiques",
      cin_recto: "cin_recto_1.jpg",
      cin_verso: "cin_verso_1.jpg",
      description_profil: "Professeur agrégé avec 10 ans d'expérience",
      user: {
        prenom: "Sofia",
        nom: "Benani",
        email: "sofia@learnect.ma",
        ville: "Casablanca"
      }
    },
    {
      utilisateur_id: 2,
      diplome: "Doctorat en Physique",
      cin_recto: "cin_recto_2.jpg",
      cin_verso: "cin_verso_2.jpg",
      description_profil: "Spécialiste en physique quantique",
      user: {
        prenom: "Amine",
        nom: "Chraibi",
        email: "amine@learnect.ma",
        ville: "Marrakech"
      }
    }
  ]);
  
  const [signalements, setSignalements] = useState([
    {
      id_signalement: 1,
      statut: "en_attente",
      motif: "Commentaire inapproprié",
      avis: {
        commentaire: "Ce professeur n'est pas sérieux"
      }
    }
  ]);
  
  const [users, setUsers] = useState([
    { utilisateur_id: 1, prenom: 'Admin', nom: 'Super', email: 'admin@learnect.ma', role: 'admin', ville: 'Casablanca', statut: 'actif' },
    { utilisateur_id: 2, prenom: 'Sofia', nom: 'Benani', email: 'sofia@learnect.ma', role: 'enseignant', ville: 'Casablanca', statut: 'actif' },
    { utilisateur_id: 3, prenom: 'Amine', nom: 'Chraibi', email: 'amine@learnect.ma', role: 'enseignant', ville: 'Marrakech', statut: 'actif' }
  ]);

  // Tentative de chargement réel (optionnel)
  useEffect(() => {
    loadRealData();
  }, []);

  const loadRealData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };
      
      const res = await fetch('http://localhost:8000/api/admin/stats', { headers });
      if (res.ok) {
        const data = await res.json();
        setStats({
          totalEtudiants: data.total_etudiants || 45,
          totalEnseignants: data.total_enseignants || 12,
          totalReservations: data.total_reservations || 128,
          totalCommissions: data.revenus_total || 8450,
          totalAvis: data.total_avis || 24
        });
      }
    } catch (err) {
      console.log('Utilisation des données mockées');
    }
  };

  const handleValiderEnseignant = (id) => {
    setPendingTeachers(pendingTeachers.filter(t => t.utilisateur_id !== id));
  };

  const handleBloquerUser = (id) => {
    setUsers(users.map(u => 
      u.utilisateur_id === id ? { ...u, statut: u.statut === 'actif' ? 'bloque' : 'actif' } : u
    ));
  };

  const handleTraiterSignalement = (id) => {
    setSignalements(signalements.map(s => 
      s.id_signalement === id ? { ...s, statut: 'traite' } : s
    ));
  };

  const handleSupprimerAvis = (idAvis, idSignalement) => {
    setSignalements(signalements.filter(s => s.id_signalement !== idSignalement));
  };

  if (loading) {
    return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;
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
                <span className="text-3xl font-black text-blue-700 block mt-2">{stats.totalCommissions} DH</span>
              </div>
              <div className="bg-white p-5 rounded-3xl border text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Avis rédigés</span>
                <span className="text-3xl font-black text-slate-900 block mt-2">{stats.totalAvis}</span>
              </div>
            </div>
          </div>
        )}

        {/* Teachers Tab */}
        {activeTab === 'teachers' && (
          <ValidatedTeachers 
            pendingTeachers={pendingTeachers} 
            onValidate={handleValiderEnseignant}
            onRefresh={() => {}}
          />
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <Signalements 
            signalements={signalements}
            onTraiter={handleTraiterSignalement}
            onSupprimerAvis={handleSupprimerAvis}
          />
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <ManageUsers 
            users={users} 
            onBloquer={handleBloquerUser}
          />
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;