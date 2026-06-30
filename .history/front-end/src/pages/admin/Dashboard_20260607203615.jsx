import { useState, useEffect } from 'react';
import ManageUsers from './ManageUsers';
import Signalements from './Signalements';
import ValidatedTeachers from './ValidatedTeachers';

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
  const [signalements, setSignalements] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadAllData();
  }, []);

  const getToken = () => localStorage.getItem('token');
  const getHeaders = () => ({ 'Authorization': `Bearer ${getToken()}`, 'Content-Type': 'application/json' });

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [statsRes, teachersRes, signalementsRes, usersRes] = await Promise.all([
        fetch('http://localhost:8000/api/admin/stats', { headers: getHeaders() }),
        fetch('http://localhost:8000/api/admin/enseignantsEnAttente', { headers: getHeaders() }),
        fetch('http://localhost:8000/api/admin/signalements', { headers: getHeaders() }),
        fetch('http://localhost:8000/api/admin/Users', { headers: getHeaders() })
      ]);
      
      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats({
          totalEtudiants: data.total_etudiants || 0,
          totalEnseignants: data.total_enseignants || 0,
          totalReservations: data.total_reservations || 0,
          totalAvis: data.total_avis || 0,
          revenusTotal: data.revenus_total || 0
        });
      }
      if (teachersRes.ok) setPendingTeachers(await teachersRes.json());
      if (signalementsRes.ok) setSignalements(await signalementsRes.json());
      if (usersRes.ok) setUsers(await usersRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}><div className="spinner-border text-primary"></div><p>Chargement...</p></div>;
  }

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '30px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        <div style={{ background: '#0f172a', color: 'white', borderRadius: '30px', padding: '30px', marginBottom: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ background: '#1e293b', padding: '12px', borderRadius: '16px' }}><i className="bi bi-shield-check fs-4 text-blue-400"></i></div>
            <div>
              <span style={{ fontSize: '10px', background: '#1e293b', padding: '4px 10px', borderRadius: '20px' }}>CONSOLE ADMIN</span>
              <h1 style={{ fontSize: '24px', marginTop: '5px' }}>Learnect Back-office</h1>
              <p style={{ color: '#94a3b8', fontSize: '12px' }}>Validation des diplômes, modération des avis signalés</p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '30px' }}>
          <button onClick={() => setActiveTab('stats')} style={{ 
            background: activeTab === 'stats' ? '#0d6efd' : 'transparent', 
            color: activeTab === 'stats' ? 'white' : '#000000', 
            border: 'none', 
            padding: '8px 24px', 
            borderRadius: '8px', 
            fontSize: '14px', 
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>Statistiques</button>
          <button onClick={() => setActiveTab('teachers')} style={{ 
            background: activeTab === 'teachers' ? '#0d6efd' : 'transparent', 
            color: activeTab === 'teachers' ? 'white' : '#000000', 
            border: 'none', 
            padding: '8px 24px', 
            borderRadius: '8px', 
            fontSize: '14px', 
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>Vérification ({pendingTeachers.length})</button>
          <button onClick={() => setActiveTab('reports')} style={{ 
            background: activeTab === 'reports' ? '#0d6efd' : 'transparent', 
            color: activeTab === 'reports' ? 'white' : '#000000', 
            border: 'none', 
            padding: '8px 24px', 
            borderRadius: '8px', 
            fontSize: '14px', 
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>Signalements ({signalements.length})</button>
          <button onClick={() => setActiveTab('users')} style={{ 
            background: activeTab === 'users' ? '#0d6efd' : 'transparent', 
            color: activeTab === 'users' ? 'white' : '#000000', 
            border: 'none', 
            padding: '8px 24px', 
            borderRadius: '8px', 
            fontSize: '14px', 
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>Utilisateurs ({users.length})</button>
        </div>

        {activeTab === 'stats' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
              <div style={{ background: 'white', padding: '20px', borderRadius: '16px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '12px', color: '#6c757d' }}>Total Élèves</div>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#000000' }}>{stats.totalEtudiants}</div>
              </div>
              <div style={{ background: 'white', padding: '20px', borderRadius: '16px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '12px', color: '#6c757d' }}>Total Tuteurs</div>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#000000' }}>{stats.totalEnseignants}</div>
              </div>
              <div style={{ background: 'white', padding: '20px', borderRadius: '16px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '12px', color: '#6c757d' }}>Réservations</div>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#000000' }}>{stats.totalReservations}</div>
              </div>
              <div style={{ background: 'white', padding: '20px', borderRadius: '16px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '12px', color: '#6c757d' }}>Commissions</div>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#000000' }}>{stats.revenusTotal} DH</div>
              </div>
            </div>

            <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <h6 style={{ fontWeight: 'bold', marginBottom: '16px', color: '#000000' }}>SUIVI DES FLUX FINANCIERS TRANSPARENTS</h6>
              <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: '12px' }}>
                <p style={{ marginBottom: '8px', fontSize: '13px', color: '#000000' }}><i className="bi bi-check-circle-fill text-primary me-2"></i> 10% de commission, 90% pour l'enseignant.</p>
                <p style={{ marginBottom: '0', fontSize: '13px', color: '#000000' }}><i className="bi bi-check-circle-fill text-primary me-2"></i> Modération instantanée visible globalement.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'teachers' && <ValidatedTeachers pendingTeachers={pendingTeachers} onRefresh={loadAllData} />}
        {activeTab === 'reports' && <Signalements signalements={signalements} onRefresh={loadAllData} />}
        {activeTab === 'users' && <ManageUsers users={users} onRefresh={loadAllData} />}
      </div>
    </div>
  );
}

export default AdminDashboard;