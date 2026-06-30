import { useState } from 'react';
import api from '../../services/api';

function ValidatedTeachers({ pendingTeachers, onRefresh }) {
  const [refuseId, setRefuseId] = useState(null);
  const [refuseRaison, setRefuseRaison] = useState('Le justificatif du diplôme n\'est pas lisible ou non agréé au Maroc.');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleValider = async (id) => {
    setIsLoading(true);
    setError('');
    try {
      await api.put(`/admin/enseignants/${id}/valider`);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error("Erreur lors de la validation", err);
      setError("Erreur lors de la validation. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefuser = async () => {
    if (refuseId && refuseRaison) {
      setIsLoading(true);
      setError('');
      try {
        await api.put(`/admin/enseignants/${refuseId}/refuser`, { raison: refuseRaison });
        setRefuseId(null);
        setRefuseRaison('Le justificatif du diplôme n\'est pas lisible ou non agréé au Maroc.');
        if (onRefresh) onRefresh();
      } catch (err) {
        console.error("Erreur lors du refus", err);
        setError("Erreur lors du refus. Veuillez réessayer.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (!pendingTeachers || pendingTeachers.length === 0) {
    return (
      <div className="card border-0 shadow-sm rounded-4 p-4 text-center">
        <i className="bi bi-check-circle fs-1 text-success"></i>
        <p className="mt-2 text-muted">Aucun enseignant en attente de vérification</p>
      </div>
    );
  }

  return (
    <div className="card border-0 shadow-sm rounded-4">
      <div className="card-body p-4">
        <div className="d-flex align-items-center gap-3 mb-4 pb-2 border-bottom">
          <div className="bg-primary bg-opacity-10 p-3 rounded-3">
            <i className="bi bi-file-text fs-4 text-primary"></i>
          </div>
          <div>
            <h3 className="h5 fw-bold mb-0">VÉRIFICATION ACADÉMIQUE MANUELLE DES DIPLÔMES ({pendingTeachers.length})</h3>
            <p className="text-muted small mb-0">Examinez minutieusement les documents de diplômes téléversés avant d'autoriser la mise en ligne.</p>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger alert-dismissible fade show py-2 mb-3" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
            <button type="button" className="btn-close btn-sm" onClick={() => setError('')}></button>
          </div>
        )}

        <div className="row g-3">
          {pendingTeachers.map(t => (
            <div key={t.utilisateur_id} className="col-12">
              <div className="border rounded-3 p-3 bg-white">
                <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-3">
                  <div>
                    <h5 className="fw-bold mb-1">{t.user?.prenom} {t.user?.nom}</h5>
                    <p className="text-muted small mb-0">
                      <i className="bi bi-envelope me-1"></i> {t.user?.email} | 
                      <i className="bi bi-geo-alt me-1"></i> {t.user?.ville}
                    </p>
                  </div>
                  <div className="bg-light rounded-3 p-2 text-center" style={{ minWidth: '100px' }}>
                    <div className="small text-muted">Tarif horaire</div>
                    <div className="fw-bold text-primary">{t.tarifHeure} DH/h</div>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-2 border mb-3">
                  <p className="fw-bold mb-2 small"><i className="bi bi-file-text me-1"></i> DIPLÔME ACADÉMIQUE :</p>
                  <div className="bg-light p-2 rounded-2 mb-2">
                    <i className="bi bi-file-pdf me-1 text-danger"></i> {t.diplome}
                  </div>
                  <div className="row g-2">
                    <div className="col-md-6">
                      <p className="fw-bold mb-1 small"><i className="bi bi-card-image me-1"></i> CIN (RECTO) :</p>
                      <div className="bg-light p-2 rounded-2">{t.cin_recto || 'non fourni'}</div>
                    </div>
                    <div className="col-md-6">
                      <p className="fw-bold mb-1 small"><i className="bi bi-card-image me-1"></i> CIN (VERSO) :</p>
                      <div className="bg-light p-2 rounded-2">{t.cin_verso || 'non fourni'}</div>
                    </div>
                  </div>
                </div>

                <div className="mt-2 p-2 bg-light rounded-2">
                  <i className="bi bi-quote me-1"></i>
                  <span className="small text-secondary">{t.description_profil || 'Aucune description'}</span>
                </div>

                <div className="mt-3 d-flex gap-2 justify-content-end">
                  <button 
                    onClick={() => handleValider(t.utilisateur_id)} 
                    disabled={isLoading}
                    className="btn btn-success btn-sm px-4"
                  >
                    {isLoading ? (
                      <><span className="spinner-border spinner-border-sm me-1"></span> Chargement...</>
                    ) : (
                      <><i className="bi bi-shield-check me-1"></i> Approuver et Valider</>
                    )}
                  </button>
                  <button 
                    onClick={() => setRefuseId(t.utilisateur_id)} 
                    disabled={isLoading}
                    className="btn btn-outline-danger btn-sm px-4"
                  >
                    <i className="bi bi-x-lg me-1"></i> Demander correction (Refuser)
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL DE REFUS */}
      {refuseId && (
        <div className="modal show d-block" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="bg-white rounded-3 p-4" style={{ width: '450px' }}>
            <div className="d-flex align-items-center gap-2 mb-3">
              <i className="bi bi-exclamation-triangle fs-4 text-danger"></i>
              <h5 className="mb-0 fw-bold">Motif du rejet du document</h5>
            </div>
            <p className="text-muted small mb-3">Précisez à l'enseignant pourquoi sa validation a été refusée.</p>
            <textarea 
              className="form-control mb-3" 
              rows="4" 
              value={refuseRaison} 
              onChange={e => setRefuseRaison(e.target.value)}
              disabled={isLoading}
              style={{ background: '#f8f9fa', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px' }}
            ></textarea>
            {error && <div className="alert alert-danger py-1 small mb-2">{error}</div>}
            <div className="d-flex gap-2 justify-content-end">
              <button className="btn btn-light px-4" onClick={() => setRefuseId(null)} disabled={isLoading}>
                Annuler
              </button>
              <button className="btn btn-danger px-4" onClick={handleRefuser} disabled={isLoading}>
                {isLoading ? 'Envoi...' : 'Confirmer le Rejet'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ValidatedTeachers;