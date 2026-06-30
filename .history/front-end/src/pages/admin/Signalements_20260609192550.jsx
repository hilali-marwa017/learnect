import { useState } from 'react';
import api from '../../api/axios';

function Signalements({ signalements, onRefresh }) {
  const [erreur, setErreur] = useState('');
  const [loadingId, setLoadingId] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  async function executerAction() {
    const type = confirmAction.type;
    const idSignalement = confirmAction.idSignalement;
    const idAvis = confirmAction.idAvis;
    setLoadingId(idSignalement);
    setConfirmAction(null);
    setErreur('');
    try {
      if (type === 'traiter') {
        await api.put(`/admin/signalements/${idSignalement}/traiter`);
      } else {
        await Promise.all([
          api.delete(`/admin/avis/${idAvis}`),
          api.delete(`/admin/signalements/${idSignalement}`)
        ]);
      }
      if (onRefresh) onRefresh();
    } catch (err) {
      setErreur("Erreur lors de l'action");
    } finally {
      setLoadingId(null);
    }
  }

  function handleAnnuler() {
    setConfirmAction(null);
  }

  const signalementsEnAttente = (signalements || []).filter(function(s) {
    return s.statut === 'en_attente';
  });

  if (signalementsEnAttente.length === 0) {
    return (
      <div className="card border-0 shadow-sm p-4 text-center" style={{ transition: 'none', transform: 'none' }}>
        <i className="bi bi-shield-check fs-1 text-success"></i>
        <p className="mt-2 text-muted">Aucun signalement en attente</p>
      </div>
    );
  }

  return (
    <div className="card border-0 shadow-sm" style={{ transition: 'none', transform: 'none' }}>
      <div className="card-body p-4">
        <div className="d-flex align-items-center gap-3 mb-4 pb-2 border-bottom">
          <div className="bg-danger bg-opacity-10 p-3 rounded-3">
            <i className="bi bi-flag fs-4 text-danger"></i>
          </div>
          <div>
            <h3 className="h5 fw-bold mb-0">Modération des signalements</h3>
            <p className="text-muted small mb-0">{signalementsEnAttente.length} signalement(s) en attente</p>
          </div>
        </div>

        {erreur && <div className="alert alert-danger py-2 mb-3">{erreur}</div>}

        {signalementsEnAttente.map(function(s) {
          return (
            <div key={s.id_signalement} className="border rounded-3 p-3 mb-3" style={{ transition: 'none', transform: 'none' }}>
              <div className="d-flex align-items-center gap-2 mb-2">
                <i className="bi bi-exclamation-triangle text-warning"></i>
                <span className="badge bg-danger bg-opacity-10 text-danger">
                  Signalé le {new Date(s.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="bg-light rounded-3 p-3 mb-2">
                <div className="small text-muted mb-1">Avis signalé :</div>
                <p className="mb-0 fst-italic">"{s.avis?.commentaire}"</p>
              </div>
              <div className="bg-warning bg-opacity-10 rounded-3 p-3 mb-3">
                <div className="small text-muted mb-1">Motif :</div>
                <p className="mb-0 small fw-medium">{s.motif}</p>
              </div>
              <div className="d-flex gap-2 justify-content-end">
                {loadingId === s.id_signalement ? (
                  <span className="spinner-border spinner-border-sm text-primary"></span>
                ) : (
                  <>
                    <button
                      onClick={function() { setConfirmAction({ type: 'traiter', idSignalement: s.id_signalement }); }}
                      className="btn btn-outline-primary btn-sm px-4"
                      style={{ transition: 'none' }}
                    >
                      <i className="bi bi-check-lg me-1"></i>Rejeter le signalement
                    </button>
                    <button
                      onClick={function() { setConfirmAction({ type: 'supprimer', idSignalement: s.id_signalement, idAvis: s.id_avis }); }}
                      className="btn btn-danger btn-sm px-4"
                      style={{ transition: 'none' }}
                    >
                      <i className="bi bi-trash me-1"></i>Supprimer l'avis
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal confirmation */}
      {confirmAction && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="bg-white rounded-3 p-4" style={{ width: '400px' }}>
            <div className="d-flex align-items-center gap-2 mb-3">
              <i className={`bi ${confirmAction.type === 'supprimer' ? 'bi-trash text-danger' : 'bi-check-circle text-primary'} fs-4`}></i>
              <h5 className="mb-0 fw-bold">Confirmation</h5>
            </div>
            <p className="text-muted mb-4">
              {confirmAction.type === 'supprimer'
                ? 'Voulez-vous vraiment supprimer cet avis ? Cette action est irréversible.'
                : 'Voulez-vous vraiment rejeter ce signalement ?'
              }
            </p>
            <div className="d-flex gap-2 justify-content-end">
              <button className="btn btn-light px-4" onClick={handleAnnuler} style={{ transition: 'none' }}>
                Annuler
              </button>
              <button
                className={`btn px-4 ${confirmAction.type === 'supprimer' ? 'btn-danger' : 'btn-primary'}`}
                onClick={executerAction}
                style={{ transition: 'none' }}>
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Signalements;