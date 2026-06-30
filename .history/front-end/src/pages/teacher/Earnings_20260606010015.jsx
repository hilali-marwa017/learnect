import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function TeacherEarnings() {
  const { user } = useAuth();
  const location = useLocation();
  const [transactions] = useState([
    { id: 1, date: '2026-06-01', eleve: 'Marwa Hilali', montant: 180, commission: 18, net: 162 },
    { id: 2, date: '2026-05-28', eleve: 'Yassine Amrani', montant: 150, commission: 15, net: 135 },
    { id: 3, date: '2026-05-25', eleve: 'Sofia Benjelloun', montant: 200, commission: 20, net: 180 }
  ]);

  const navItems = [
    { path: '/enseignant/dashboard', label: 'Synthèse & Élèves', icon: 'bi-graph-up' },
    { path: '/enseignant/disponibilites', label: 'Créneaux libres', icon: 'bi-calendar-week' },
    { path: '/enseignant/revenus', label: 'Portefeuille & Revenus', icon: 'bi-wallet2' },
    { path: '/enseignant/profil', label: 'Mon Profil', icon: 'bi-person-gear' }
  ];

  const totalBrut = transactions.reduce((sum, t) => sum + t.montant, 0);
  const totalCommission = transactions.reduce((sum, t) => sum + t.commission, 0);
  const totalNet = transactions.reduce((sum, t) => sum + t.net, 0);

  return (
    <div className="container py-4">
      
      {/* En-tête */}
      <div className="d-flex align-items-center gap-3 mb-4 pb-2 border-bottom">
        <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '56px', height: '56px' }}>
          <i className="bi bi-person fs-2"></i>
        </div>
        <div>
          <h4 className="fw-bold mb-0">{user?.prenom} {user?.nom}</h4>
          <p className="text-muted mb-0">
            <i className="bi bi-briefcase me-1"></i>Enseignant · {user?.ville || 'Casablanca'}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="row g-3 mb-4">
        {navItems.map((item) => (
          <div key={item.path} className="col-md-3 col-6">
            <Link to={item.path} className="text-decoration-none">
              <div className={`card border-0 shadow-sm p-3 text-center ${location.pathname === item.path ? 'active-card' : ''}`}>
                <i className={`${item.icon} fs-2 ${location.pathname === item.path ? 'text-primary' : 'text-secondary'}`}></i>
                <div className="fw-semibold mt-2">{item.label}</div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Cartes revenus */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-3 text-center">
            <div className="text-muted small">Total brut</div>
            <div className="fs-2 fw-bold text-primary">{totalBrut} DH</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-3 text-center">
            <div className="text-muted small">Commission (10%)</div>
            <div className="fs-2 fw-bold text-warning">{totalCommission} DH</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-3 text-center">
            <div className="text-muted small">Net perçu</div>
            <div className="fs-2 fw-bold text-success">{totalNet} DH</div>
          </div>
        </div>
      </div>

      {/* Historique */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-transparent border-0 pt-3">
          <h5 className="fw-bold mb-0"><i className="bi bi-clock-history me-2"></i>Historique des paiements</h5>
        </div>
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>Date</th>
                <th>Élève</th>
                <th>Brut</th>
                <th>Commission</th>
                <th>Net</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(t => (
                <tr key={t.id}>
                  <td>{t.date}</td>
                  <td className="fw-semibold">{t.eleve}</td>
                  <td>{t.montant} DH</td>
                  <td className="text-warning">-{t.commission} DH</td>
                  <td className="fw-bold text-success">{t.net} DH</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .active-card {
          border-color: #0d6efd !important;
          background: rgba(13, 110, 253, 0.05);
        }
      `}</style>
    </div>
  );
}

export default TeacherEarnings;