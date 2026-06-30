import { useState } from 'react';

function ValidatedTeachers({ pendingTeachers, onRefresh }) {
  const [refuseId, setRefuseId] = useState(null);
  const [refuseRaison, setRefuseRaison] = useState('');
  const getToken = () => localStorage.getItem('token');

  const handleValider = async (id) => {
    await fetch(`http://localhost:8000/api/admin/validerEnseignant/${id}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    if (onRefresh) onRefresh();
  };

  const handleRefuser = async () => {
    if (refuseId && refuseRaison) {
      await fetch(`http://localhost:8000/api/admin/refuserEnseignant/${refuseId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${getToken()}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ raison: refuseRaison })
      });
      setRefuseId(null);
      setRefuseRaison('');
      if (onRefresh) onRefresh();
    }
  };

  if (!pendingTeachers || pendingTeachers.length === 0) {
    return <div className="card p-4 text-center">Aucun enseignant en attente</div>;
  }

  return (
    <div className="card border-0 shadow-sm rounded-4">
      <div className="card-body p-4">
        <h5 className="mb-3">Enseignants à valider ({pendingTeachers.length})</h5>
        {pendingTeachers.map(t => (
          <div key={t.utilisateur_id} className="border rounded-3 p-3 mb-3">
            <h6>{t.user?.prenom} {t.user?.nom}</h6>
            <p className="text-muted small">{t.user?.email}</p>
            <p><strong>Diplôme:</strong> {t.diplome}</p>
            <div className="d-flex gap-2">
              <button onClick={() => handleValider(t.utilisateur_id)} className="btn btn-success btn-sm">Valider</button>
              <button onClick={() => setRefuseId(t.utilisateur_id)} className="btn btn-danger btn-sm">Refuser</button>
            </div>
          </div>
        ))}
      </div>
      {refuseId && (
        <div className="modal show d-block" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="bg-white rounded-3 p-4" style={{ width: '400px' }}>
            <h5>Motif du rejet</h5>
            <textarea className="form-control my-3" rows="3" value={refuseRaison} onChange={e => setRefuseRaison(e.target.value)} placeholder="Raison..."></textarea>
            <div className="d-flex gap-2 justify-content-end">
              <button className="btn btn-secondary" onClick={() => setRefuseId(null)}>Annuler</button>
              <button className="btn btn-danger" onClick={handleRefuser}>Confirmer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ValidatedTeachers;