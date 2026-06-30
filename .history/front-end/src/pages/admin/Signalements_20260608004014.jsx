import { useState } from 'react';
import api from '../../api/axios';
function Signalements({ signalements, onRefresh }) {
  const [isLoading, setIsLoading] = useState(false);
  const [erreur, setErreur] = useState('');

  // PLUS BESOIN de getToken() et getHeaders()

  const handleTraiter = async (id) => {
    setIsLoading(true);
    setErreur('');
    try {
      await api.put(`/admin/signalements/${id}/traiter`);
      if (onRefresh) onRefresh();
    } catch(err) {
      setErreur('Erreur lors du traitement');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSupprimerAvis = async (idAvis, idSignalement) => {
    if (!window.confirm('Supprimer cet avis ?')) return;
    setIsLoading(true);
    setErreur('');
    try {
      await Promise.all([
        api.delete(`/admin/avis/${idAvis}`),
        api.delete(`/admin/signalements/${idSignalement}`)
      ]);
      if (onRefresh) onRefresh();
    } catch(err) {
      setErreur('Erreur lors de la suppression');
    } finally {
      setIsLoading(false);
    }
  };

  const pending = (signalements || []).filter(s => s.statut === 'en_attente');

  if (pending.length === 0) {
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
          <div className="bg-danger bg-opacity-10 p-3 rounded-3" style={{ transition: 'none', transform: 'none' }}>
            <i className="bi bi-flag fs-4 text-danger"></i>
          </div>
          <div>
            <h3 className="h5 fw-bold mb-0">Modération des signalements</h3>
            <p className="text-muted small mb-0">{pending.length} signalement(s) en attente</p>
          </div>
        </div>

        {erreur && <div className="alert alert-danger py-2 mb-3">{erreur}</div>}

        {pending.map(s => (
          <div key={s.id_signalement} className="border rounded-3 p-3 mb-3" style={{ transition: 'none', transform: 'none' }}>
            <div className="d-flex align-items-center gap-2 mb-2">
              <i className="bi bi-exclamation-triangle text-warning"></i>
              <span className="badge bg-danger bg-opacity-10 text-danger">
                Signalé le {new Date(s.created_at).toLocaleDateString()}
              </span>
            </div>

            <div className="bg-light rounded-3 p-3 mb-2" style={{ transition: 'none', transform: 'none' }}>
              <div className="small text-muted mb-1">Avis signalé :</div>
              <p className="mb-0 fst-italic">"{s.avis?.commentaire}"</p>
            </div>

            <div className="bg-warning bg-opacity-10 rounded-3 p-3 mb-3" style={{ transition: 'none', transform: 'none' }}>
              <div className="small text-muted mb-1">Motif :</div>
              <p className="mb-0 small fw-medium">{s.motif}</p>
            </div>

            <div className="d-flex gap-2 justify-content-end">
              <button onClick={() => handleTraiter(s.id_signalement)} disabled={isLoading} className="btn btn-outline-primary btn-sm px-4" style={{ transition: 'none' }}>
                <i className="bi bi-check-lg me-1"></i> Rejeter
              </button>
              <button onClick={() => handleSupprimerAvis(s.id_avis, s.id_signalement)} disabled={isLoading} className="btn btn-danger btn-sm px-4" style={{ transition: 'none' }}>
                <i className="bi bi-trash me-1"></i> Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Signalements;