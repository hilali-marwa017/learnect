function Signalements({ signalements, onRefresh }) {
  const getToken = () => localStorage.getItem('token');

  const handleTraiter = async (id) => {
    await fetch(`http://localhost:8000/api/admin/signalements/${id}/traiter`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    onRefresh();
  };

  const handleSupprimerAvis = async (idAvis, idSignalement) => {
    await fetch(`http://localhost:8000/api/admin/avis/${idAvis}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    await fetch(`http://localhost:8000/api/admin/signalements/${idSignalement}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    onRefresh();
  };

  const pending = signalements.filter(s => s.statut === 'en_attente');

  return (
    <div className="bg-white p-6 rounded-3xl border">
      <h3 className="text-sm font-black uppercase">MODÉRATION DES COMMENTAIRES / AVIS SIGNALÉS ({pending.length})</h3>
      <p className="text-xs text-slate-500 mt-1">Consultez les plaintes d'étudiants ou d'enseignants.</p>
      
      {pending.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 rounded-2xl mt-4">
          <i className="bi bi-check-circle fs-1 text-green-400"></i>
          <p className="text-xs text-slate-400 mt-2">Aucun signalement en attente</p>
        </div>
      ) : (
        <div className="space-y-4 mt-4">
          {pending.map(s => (
            <div key={s.id_signalement} className="p-5 bg-slate-50 rounded-2xl border">
              <span className="inline-flex items-center gap-1.5 text-[10px] bg-rose-50 text-rose-700 px-2.5 py-1 rounded-full"><i className="bi bi-exclamation-triangle"></i>Signalé</span>
              <p className="text-xs text-slate-700 mt-2 italic">"{s.avis?.commentaire}"</p>
              <p className="text-[10px] text-slate-400 mt-1"><strong>Motif:</strong> {s.motif}</p>
              <div className="flex gap-3 mt-4">
                <button onClick={() => handleTraiter(s.id_signalement)} className="bg-blue-600 text-white text-xs px-3 py-2 rounded-xl"><i className="bi bi-check-lg me-1"></i>Rejeter Signalement</button>
                <button onClick={() => handleSupprimerAvis(s.id_avis, s.id_signalement)} className="bg-rose-50 text-rose-600 text-xs px-3 py-2 rounded-xl"><i className="bi bi-trash me-1"></i>Supprimer l'avis</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Signalements;cd front-end
npm install chart.js react-chartjs-2