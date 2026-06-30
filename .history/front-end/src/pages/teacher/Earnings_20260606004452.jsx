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
      <h2 className="fw-bold mb-4">Mes revenus</h2>

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

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-transparent border-0 pt-3">
          <h5 className="fw-bold mb-0">Historique des paiements</h5>
        </div>
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>Date</th>
                <th>Élève</th>
                <th>Montant brut</th>
                <th>Commission</th>
                <th>Net</th>
               </tr>
            </thead>
            <tbody>
              {transactions.map(t => (
                <tr key={t.id}>
                  <td>{t.date}</td>
                  <td>{t.eleve}</td>
                  <td>{t.montant} DH</td>
                  <td>-{t.commission} DH</td>
                  <td className="fw-bold text-success">{t.net} DH</td>
                 </tr>
              ))}
            </tbody>
           </table>
        </div>
      </div>

      <div className="mt-3">
        <Link to="/enseignant/dashboard" className="text-muted text-decoration-none">
          <i className="bi bi-arrow-left me-1"></i> Retour au tableau de bord
        </Link>
      </div>
    </div>
  );
}

export default TeacherEarnings;