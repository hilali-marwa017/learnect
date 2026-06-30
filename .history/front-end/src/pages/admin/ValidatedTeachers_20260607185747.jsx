import { useState, useEffect } from 'react';
import api from '../../api/axios';

function ValidatedTeachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refuseId, setRefuseId] = useState(null);
  const [refuseRaison, setRefuseRaison] = useState('');

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    try {
      const res = await api.get('/admin/enseignants/en-attente');
      setTeachers(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const valider = async (id) => {
    await api.post(`/admin/enseignants/${id}/valider`);
    loadTeachers();
  };

  const refuser = async () => {
    if (refuseId && refuseRaison) {
      await api.post(`/admin/enseignants/${refuseId}/refuser`, { raison: refuseRaison });
      setRefuseId(null);
      setRefuseRaison('');
      loadTeachers();
    }
  };

  if (loading) return <div className="text-center"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="card p-3">
      <h5 className="mb-3">Enseignants en attente de validation ({teachers.length})</h5>
      {teachers.length === 0 ? (
        <div className="alert alert-success">Aucun enseignant en attente</div>
      ) : (
        teachers.map(t => {
          const user = t.user;
          return (
            <div key={t.utilisateur_id} className="border rounded p-3 mb-3">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h5>{user?.prenom} {user?.nom}</h5>
                  <p className="mb-1 text-muted">{user?.email} | {user?.ville}</p>
                  <p className="mb-1"><strong>Diplôme:</strong> {t.diplome}</p>
                  <p className="mb-1"><strong>Description:</strong> {t.description_profil?.substring(0, 100)}...</p>
                  <p><strong>Tarif:</strong> {t.tarifHeure} DH/h</p>
                </div>
                <div>
                  <button className="btn btn-success btn-sm me-2" onClick={() => valider(t.utilisateur_id)}>Valider</button>
                  <button className="btn btn-danger btn-sm" onClick={() => setRefuseId(t.utilisateur_id)}>Refuser</button>
                </div>
              </div>
            </div>
          );
        })
      )}

      {refuseId && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header"><h5>Motif de refus</h5><button className="btn-close" onClick={() => setRefuseId(null)}></button></div>
              <div className="modal-body"><textarea className="form-control" rows="3" value={refuseRaison} onChange={e => setRefuseRaison(e.target.value)} placeholder="Raison du refus..."></textarea></div>
              <div className="modal-footer"><button className="btn btn-secondary" onClick={() => setRefuseId(null)}>Annuler</button><button className="btn btn-danger" onClick={refuser}>Confirmer refus</button></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ValidatedTeachers;