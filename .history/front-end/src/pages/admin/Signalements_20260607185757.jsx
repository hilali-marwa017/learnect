import { useState, useEffect } from 'react';
import api from '../../api/axios';

function Signalements() {
  const [signalements, setSignalements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSignalements();
  }, []);

  const loadSignalements = async () => {
    try {
      const res = await api.get('/admin/signalements');
      setSignalements(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const traiter = async (id) => {
    await api.post(`/admin/signalements/${id}/traiter`);
    loadSignalements();
  };

  const supprimerAvis = async (idAvis, idSignalement) => {
    if (window.confirm('Supprimer cet avis ?')) {
      await api.delete(`/admin/avis/${idAvis}`);
      await api.delete(`/admin/signalements/${idSignalement}`);
      loadSignalements();
    }
  };

  if (loading) return <div className="text-center"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="card p-3">
      <h5 className="mb-3">Avis signalés ({signalements.length})</h5>
      {signalements.length === 0 ? (
        <div className="alert alert-success">Aucun signalement en attente</div>
      ) : (
        signalements.map(s => (
          <div key={s.id_signalement} className="border rounded p-3 mb-3">
            <div className="d-flex justify-content-between">
              <div>
                <p className="mb-1"><strong>Motif:</strong> {s.motif}</p>
                <p className="mb-1"><strong>Avis:</strong> "{s.avis?.commentaire}"</p>
                <p className="mb-0 text-muted small">Signalé par: ID {s.id_signaleur}</p>
              </div>
              <div>
                <button className="btn btn-sm btn-warning me-2" onClick={() => traiter(s.id_signalement)}>Marquer traité</button>
                <button className="btn btn-sm btn-danger" onClick={() => supprimerAvis(s.id_avis, s.id_signalement)}>Supprimer l'avis</button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Signalements;