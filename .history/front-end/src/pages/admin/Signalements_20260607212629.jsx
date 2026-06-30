import api from '../../services/api';

function Signalements({ signalements, onRefresh }) {
  const handleTraiter = async (id) => {
    await api.put(`/admin/signalements/${id}/traiter`);
    onRefresh();
  };

  const handleSupprimerAvis = async (idAvis, idSignalement) => {
    await api.delete(`/admin/avis/${idAvis}`);
    await api.delete(`/admin/signalements/${idSignalement}`);
    onRefresh();
  };

  const pending = signalements.filter(s => s.statut === 'en_attente');

  return (
    <div className="card border-0 shadow-sm rounded-4">
      <div className="card-body p-4">
        <div className="d-flex align-items-center gap-3 mb-4 pb-2 border-bottom">
          <div className="bg-danger bg-opacity-10 p-3 rounded-3"><i className="bi bi-flag fs-4 text-danger"></i></div>
          <div><h3 className="h5 fw-bold mb-0">Modération des signalements</h3><p className="text-muted small mb-0">{pending.length} signalements en attente</p></div>
        </div>
        {pending.length === 0 ? (
          <div className="text-center py-5"><div className="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '64px', height: '64px' }}><i className="bi bi-shield-check fs-2 text-success"></i></div><p className="text-muted mb-0">Aucun signalement en attente</p></div>
        ) : (
          <div className="row g-3">
            {pending.map(s => (
              <div key={s.id_signalement} className="col-12">
                <div className="border rounded-3 p-3 bg-white">
                  <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom">
                    <div className="bg-warning bg-opacity-10 rounded-circle p-2"><i className="bi bi-exclamation-triangle text-warning"></i></div>
                    <span className="badge bg-danger bg-opacity-10 text-danger">Signalé le {new Date(s.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="bg-light rounded-3 p-3 mb-3"><div className="small text-muted mb-2"><i className="bi bi-chat-quote me-1"></i> Avis signalé :</div><p className="mb-0 fst-italic">"{s.avis?.commentaire}"</p></div>
                  <div className="bg-warning bg-opacity-10 rounded-3 p-3 mb-3"><div className="small text-muted mb-2"><i className="bi bi-info-circle me-1"></i> Motif du signalement :</div><p className="mb-0 small fw-medium">{s.motif}</p></div>
                  <div className="d-flex gap-2 justify-content-end">
                    <button onClick={() => handleTraiter(s.id_signalement)} className="btn btn-primary btn-sm px-4"><i className="bi bi-check-lg me-1"></i> Rejeter</button>
                    <button onClick={() => handleSupprimerAvis(s.id_avis, s.id_signalement)} className="btn btn-danger btn-sm px-4"><i className="bi bi-trash me-1"></i> Supprimer</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Signalements;