import { useState, useEffect } from 'react';

function Signalements({ signalements, onRefresh }) {
  const getToken = () => localStorage.getItem('token');

  const handleTraiter = async (id) => {
    try {
      await fetch(`http://localhost:8000/api/admin/signalements/${id}/traiter`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      if (onRefresh) onRefresh();
    } catch(err) { console.error(err); }
  };

  const handleSupprimerAvis = async (idAvis, idSignalement) => {
    try {
      await fetch(`http://localhost:8000/api/admin/avis/${idAvis}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      await fetch(`http://localhost:8000/api/admin/signalements/${idSignalement}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      if (onRefresh) onRefresh();
    } catch(err) { console.error(err); }
  };

  const pending = (signalements || []).filter(s => s.statut === 'en_attente');

  if (pending.length === 0) {
    return <div className="text-center py-5 text-muted">Aucun signalement</div>;
  }

  return (
    <div className="card border-0 shadow-sm rounded-4">
      <div className="card-body p-4">
        <h5 className="mb-3">Signalements ({pending.length})</h5>
        {pending.map(s => (
          <div key={s.id_signalement} className="border rounded-3 p-3 mb-3">
            <p><strong>Motif:</strong> {s.motif}</p>
            <p><strong>Avis:</strong> {s.avis?.commentaire}</p>
            <div className="d-flex gap-2">
              <button onClick={() => handleTraiter(s.id_signalement)} className="btn btn-primary btn-sm">Rejeter</button>
              <button onClick={() => handleSupprimerAvis(s.id_avis, s.id_signalement)} className="btn btn-danger btn-sm">Supprimer</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Signalements;