import { useState } from 'react';
import { Link } from 'react-router-dom';

function TeacherEarnings() {
  const [transactions, setTransactions] = useState([
    { id: 1, date: '2026-06-01', eleve: 'Marwa Hilali', montant: 180, commission: 18, net: 162 },
    { id: 2, date: '2026-05-28', eleve: 'Yassine Amrani', montant: 150, commission: 15, net: 135 },
    { id: 3, date: '2026-05-25', eleve: 'Sofia Benjelloun', montant: 200, commission: 20, net: 180 }
  ]);

  const totalBrut = transactions.reduce((sum, t) => sum + t.montant, 0);
  const totalCommission = transactions.reduce((sum, t) => sum + t.commission, 0);
  const totalNet = transactions.reduce((sum, t) => sum + t.net, 0);

  return (
    <div className="container py-4">
      {/* Navigation entre pages */}
      <div className="d-flex gap-2 mb-4">
        <Link to="/enseignant/dashboard" className="btn btn-outline-secondary btn-sm">
          <i className="bi bi-speedometer2 me-1"></i>Dashboard
        </Link>
        <Link to="/enseignant/disponibilites" className="btn btn-outline-secondary btn-sm">
          <i className="bi bi-calendar-week me-1"></i>Disponibilités
        </Link>
        <Link to="/enseignant/revenus" className="btn btn-primary btn-sm">
          <i className="bi bi-wallet2 me-1"></i>Revenus
        </Link>
        <Link to="/enseignant/profil" className="btn btn-outline-secondary btn-sm">
          <i className="bi bi-person-gear me-1"></i>Profil
        </Link>
      </div>

      <h2 className="fw-bold mb-4"><i className="bi bi-graph-up me-2"></i>Mes revenus</h2>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="text-muted small">Total brut</div>
                <div className="fs-2 fw-bold text-primary">{totalBrut} DH</div>
              </div>
              <i className="bi bi-calculator fs-1 text-primary opacity-50"></i>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="text-muted small">Commission (10%)</div>
                <div className="fs-2 fw-bold text-warning">{totalCommission} DH</div>
              </div>
              <i className="bi bi-percent fs-1 text-warning opacity-50"></i>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="text-muted small">Net perçu</div>
                <div className="fs-2 fw-bold text-success">{totalNet} DH</div>
              </div>
              <i className="bi bi-cash-coin fs-1 text-success opacity-50"></i>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-transparent border-0 pt-3">
          <h5 className="fw-bold mb-0"><i className="bi bi-clock-history me-2"></i>Historique des paiements</h5>
        </div>
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th><i className="bi bi-calendar me-2"></i>Date</th>
                <th><i className="bi bi-person me-2"></i>Élève</th>
                <th><i className="bi bi-cash-stack me-2"></i>Montant brut</th>
                <th><i className="bi bi-percent me-2"></i>Commission</th>
                <th><i className="bi bi-wallet2 me-2"></i>Net</th>
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

      <div className="mt-3">
        <Link to="/enseignant/dashboard" className="text-primary text-decoration-none">
          <i className="bi bi-arrow-left me-1"></i> Retour au tableau de bord
        </Link>
      </div>
    </div>
  );
}

export default TeacherEarnings;