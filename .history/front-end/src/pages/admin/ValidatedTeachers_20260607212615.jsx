import { useState } from 'react';
import api from '../../services/api';

function ValidatedTeachers({ pendingTeachers, onRefresh }) {
  const [refuseId, setRefuseId] = useState(null);
  const [refuseRaison, setRefuseRaison] = useState('');

  const handleValider = async (id) => {
    await api.post(`/admin/validerEnseignant/${id}`);
    onRefresh();
  };

  const handleRefuser = async () => {
    if (refuseId && refuseRaison) {
      await api.post(`/admin/refuserEnseignant/${refuseId}`, { raison: refuseRaison });
      setRefuseId(null);
      setRefuseRaison('');
      onRefresh();
    }
  };

  return (
    <div className="card border-0 shadow-sm rounded-4">
      <div className="card-body p-4">
        <div className="d-flex align-items-center gap-3 mb-4 pb-2 border-bottom">
          <div className="bg-primary bg-opacity-10 p-3 rounded-3"><i className="bi bi-file-text fs-4 text-primary"></i></div>
          <div><h3 className="h5 fw-bold mb-0">Vérification des enseignants</h3><p className="text-muted small mb-0">{pendingTeachers.length} dossiers en attente</p></div>
        </div>
        {pendingTeachers.length === 0 ? (
          <div className="text-center py-5">
            <div className="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '64px', height: '64px' }}><i className="bi bi-check-lg fs-2 text-success"></i></div>
            <p className="text-muted mb-0">Aucun enseignant en attente</p>
          </div>
        ) : (
          <div className="row g-3">
            {pendingTeachers.map(t => (
              <div key={t.utilisateur_id} className="col-12">
                <div className="border rounded-3 p-3 bg-white">
                  <div className="d-flex flex-wrap justify-content-between align-items-start gap-3">
                    <div className="d-flex gap-3">
                      <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}><span className="fw-bold fs-5 text-primary">{t.user?.prenom?.[0]}</span></div>
                      <div><h5 className="fw-bold mb-1">{t.user?.prenom} {t.user?.nom}</h5><p className="text-muted small mb-1"><i className="bi bi-envelope me-1"></i> {t.user?.email}</p><p className="text-muted small mb-0"><i className="bi bi-geo-alt me-1"></i> {t.user?.ville}</p></div>
                    </div>
                    <div className="bg-light rounded-3 p-2 text-center" style={{ minWidth: '100px' }}><div className="small text-muted">Tarif horaire</div><div className="fw-bold text-primary">{t.tarifHeure} DH/h</div></div>
                  </div>
                  <div className="mt-3 pt-2 border-top">
                    <div className="row g-2">
                      <div className="col-md-12"><div className="bg-light rounded-2 p-2"><span className="small text-muted"><i className="bi bi-file-pdf me-1"></i> Diplôme :</span><span className="small fw-medium ms-2">{t.diplome}</span></div></div>
                      <div className="col-md-6"><div className="bg-light rounded-2 p-2"><span className="small text-muted"><i className="bi bi-card-image me-1"></i> CIN Recto :</span><span className="small ms-2">{t.cin_recto || 'non fourni'}</span></div></div>
                      <div className="col-md-6"><div className="bg-light rounded-2 p-2"><span className="small text-muted"><i className="bi bi-card-image me-1"></i> CIN Verso :</span><span className="small ms-2">{t.cin_verso || 'non fourni'}</span></div></div>
                    </div>
                  </div>
                  <div className="mt-3 p-2 bg-primary bg-opacity-5 rounded-2"><i className="bi bi-quote text-primary me-1"></i><span className="small text-secondary">{t.description_profil?.substring(0, 150)}...</span></div>
                  <div className="mt-3 d-flex gap-2 justify-content-end">
                    <button onClick={() => handleValider(t.utilisateur_id)} className="btn btn-success btn-sm px-4"><i className="bi bi-check-lg me-1"></i> Valider</button>
                    <button onClick={() => setRefuseId(t.utilisateur_id)} className="btn btn-outline-danger btn-sm px-4"><i className="bi bi-x-lg me-1"></i> Refuser</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {refuseId && (
        <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow">
              <div className="modal-header border-0 pb-0"><h5 className="modal-title fw-bold"><i className="bi bi-exclamation-triangle text-danger me-2"></i>Motif du rejet</h5><button type="button" className="btn-close" onClick={() => setRefuseId(null)}></button></div>
              <div className="modal-body"><p className="small text-muted mb-3">Précisez à l'enseignant pourquoi sa validation a été refusée.</p><textarea className="form-control rounded-3" rows="3" value={refuseRaison} onChange={e => setRefuseRaison(e.target.value)} placeholder="Le justificatif du diplôme n'est pas lisible..."></textarea></div>
              <div className="modal-footer border-0 pt-0"><button className="btn btn-light px-4" onClick={() => setRefuseId(null)}>Annuler</button><button className="btn btn-danger px-4" onClick={handleRefuser}>Confirmer le rejet</button></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ValidatedTeachers;