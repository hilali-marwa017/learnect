import { useState } from 'react';
import api from '../../api/axios';

function ValidatedTeachers({ pendingTeachers, onRefresh }) {
  const [refuseId, setRefuseId] = useState(null);
  const [refuseRaison, setRefuseRaison] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [erreur, setErreur] = useState('');

  const handleValider = async (id) => {
    setIsLoading(true);
    setErreur('');
    try {
      await api.put(`/admin/enseignants/${id}/valider`);
      if (onRefresh) onRefresh();
    } catch(err) {
      setErreur('Erreur lors de la validation');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefuser = async () => {
    if (!refuseId || !refuseRaison.trim()) return;
    setIsLoading(true);
    setErreur('');
    try {
      await api.put(`/admin/enseignants/${refuseId}/refuser`, { raison: refuseRaison });
      setRefuseId(null);
      setRefuseRaison('');
      if (onRefresh) onRefresh();
    } catch(err) {
      setErreur('Erreur lors du refus');
    } finally {
      setIsLoading(false);
    }
  };

  if (!pendingTeachers || pendingTeachers.length === 0) {
    return (
      <div className="card border-0 shadow-sm p-4 text-center" style={{ transition: 'none', transform: 'none' }}>
        <i className="bi bi-check-circle fs-1 text-success"></i>
        <p className="mt-2 text-muted">Aucun enseignant en attente</p>
      </div>
    );
  }

  return (
    <div className="card border-0 shadow-sm" style={{ transition: 'none', transform: 'none' }}>
      <div className="card-body p-4">
        <div className="d-flex align-items-center gap-3 mb-4 pb-2 border-bottom">
          <div className="bg-primary bg-opacity-10 p-3 rounded-3" style={{ transition: 'none', transform: 'none' }}>
            <i className="bi bi-file-text fs-4 text-primary"></i>
          </div>
          <div>
            <h3 className="h5 fw-bold mb-0">Vérification des enseignants</h3>
            <p className="text-muted small mb-0">{pendingTeachers.length} enseignant(s) en attente</p>
          </div>
        </div>

        {erreur && <div className="alert alert-danger py-2 mb-3">{erreur}</div>}

        {pendingTeachers.map(teacher => (
          <div key={teacher.utilisateur_id} className="border rounded-3 p-3 mb-3" style={{ transition: 'none', transform: 'none' }}>
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <h5 className="fw-bold mb-1">{teacher.user?.prenom} {teacher.user?.nom}</h5>
                <p className="text-muted small mb-0">{teacher.user?.email}</p>
              </div>
              <div className="bg-light rounded-3 p-2 text-center" style={{ transition: 'none', transform: 'none' }}>
                <div className="small text-muted">Tarif</div>
                <div className="fw-bold text-primary">{teacher.tarifHeure} DH/h</div>
              </div>
            </div>

            <div className="bg-light rounded-3 p-3 mb-3" style={{ transition: 'none', transform: 'none' }}>
              <p className="fw-bold mb-2 small">Documents fournis :</p>
              <p className="mb-1 small">Diplôme : {teacher.diplome || 'Non fourni'}</p>
              <p className="mb-0 small">CIN Recto : {teacher.cin_recto || 'Non fourni'}</p>
            </div>

            <div className="d-flex gap-2 justify-content-end">
              <button onClick={() => handleValider(teacher.utilisateur_id)} disabled={isLoading} className="btn btn-success btn-sm px-4" style={{ transition: 'none' }}>
                <i className="bi bi-check-lg me-1"></i> Valider
              </button>
              <button onClick={() => setRefuseId(teacher.utilisateur_id)} disabled={isLoading} className="btn btn-danger btn-sm px-4" style={{ transition: 'none' }}>
                <i className="bi bi-x-lg me-1"></i> Refuser
              </button>
            </div>
          </div>
        ))}
      </div>

      {refuseId && (
        <div className="modal show d-block" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="bg-white rounded-3 p-4" style={{ width: '450px', transition: 'none', transform: 'none' }}>
            <h5 className="fw-bold mb-3">Motif du refus</h5>
            <textarea
              className="form-control mb-3"
              rows="4"
              value={refuseRaison}
              onChange={e => setRefuseRaison(e.target.value)}
              disabled={isLoading}
            />
            <div className="d-flex gap-2 justify-content-end">
              <button className="btn btn-light" onClick={() => setRefuseId(null)} disabled={isLoading} style={{ transition: 'none' }}>Annuler</button>
              <button className="btn btn-danger" onClick={handleRefuser} disabled={isLoading} style={{ transition: 'none' }}>Confirmer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ValidatedTeachers;