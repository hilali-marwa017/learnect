import { useState } from 'react';

function ValidatedTeachers({ pendingTeachers, onRefresh }) {
  const [refuseId, setRefuseId] = useState(null);
  const [refuseRaison, setRefuseRaison] = useState('');

  const getToken = () => localStorage.getItem('token');
  const getHeaders = () => ({ 'Authorization': `Bearer ${getToken()}`, 'Content-Type': 'application/json' });

  const handleValider = async (id) => {
    await fetch(`http://localhost:8000/api/admin/validerEnseignant/${id}`, { method: 'POST', headers: getHeaders() });
    onRefresh();
  };

  const handleRefuser = async () => {
    if (refuseId && refuseRaison) {
      await fetch(`http://localhost:8000/api/admin/refuserEnseignant/${refuseId}`, {
        method: 'POST',
        headers: { ...getHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ raison: refuseRaison })
      });
      setRefuseId(null);
      setRefuseRaison('');
      onRefresh();
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl border">
      <h3 className="text-sm font-black uppercase">VÉRIFICATION ACADÉMIQUE MANUELLE DES DIPLÔMES ({pendingTeachers.length})</h3>
      <p className="text-xs text-slate-500 mt-1">Examinez minutieusement les documents de diplômes téléversés avant d'autoriser la mise en ligne.</p>
      
      {pendingTeachers.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 rounded-2xl mt-4">
          <i className="bi bi-folder2-open fs-1 text-slate-300"></i>
          <p className="text-xs text-slate-400 mt-2">Dossier vide. Aucun professeur en attente.</p>
        </div>
      ) : (
        <div className="space-y-6 mt-4">
          {pendingTeachers.map(t => (
            <div key={t.utilisateur_id} className="p-5 bg-slate-50 rounded-2xl border">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-slate-300 flex items-center justify-center font-bold text-slate-700">{t.user?.prenom?.[0]}</div>
                <div>
                  <h4 className="font-black text-sm">{t.user?.prenom} {t.user?.nom}</h4>
                  <p className="text-[10.5px] text-slate-400"><i className="bi bi-envelope me-1"></i> {t.user?.email} | <i className="bi bi-geo-alt me-1"></i> {t.user?.ville}</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl border mb-4">
                <p className="text-[9px] font-bold text-slate-400 uppercase mb-2"><i className="bi bi-file-text me-1"></i>DIPLÔME ACADÉMIQUE :</p>
                <div className="bg-slate-50 p-2 rounded-lg"><strong>{t.diplome}</strong></div>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div><p className="text-[9px] font-bold uppercase">CIN Recto :</p><div className="bg-slate-50 p-2 rounded-lg text-xs"><i className="bi bi-card-image me-1"></i> {t.cin_recto || 'non-fourni'}</div></div>
                  <div><p className="text-[9px] font-bold uppercase">CIN Verso :</p><div className="bg-slate-50 p-2 rounded-lg text-xs"><i className="bi bi-card-image me-1"></i> {t.cin_verso || 'non-fourni'}</div></div>
                </div>
              </div>
              <p className="text-xs text-slate-500 italic bg-blue-50 p-3 rounded-xl"><i className="bi bi-quote me-1"></i> "{t.description_profil}"</p>
              <div className="flex gap-3 mt-4">
                <button onClick={() => handleValider(t.utilisateur_id)} className="bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-xl"><i className="bi bi-shield-check me-1"></i>Approuver et Valider</button>
                <button onClick={() => setRefuseId(t.utilisateur_id)} className="border border-slate-300 text-rose-600 text-xs font-bold px-4 py-2 rounded-xl"><i className="bi bi-x-circle me-1"></i>Demander correction</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Refus */}
      {refuseId && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-3xl max-w-md w-full">
            <h3 className="text-lg font-black text-rose-700 flex items-center gap-2"><i className="bi bi-exclamation-triangle"></i>Motif du rejet</h3>
            <p className="text-xs text-slate-500 mt-1">Précisez à l'enseignant pourquoi sa validation a été refusée.</p>
            <textarea value={refuseRaison} onChange={e => setRefuseRaison(e.target.value)} rows={3} className="w-full border rounded-xl p-3 text-xs mt-4" placeholder="Le justificatif du diplôme n'est pas lisible..."></textarea>
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setRefuseId(null)} className="px-4 py-2 text-sm">Annuler</button>
              <button onClick={handleRefuser} className="bg-rose-600 text-white px-4 py-2 rounded-xl text-sm">Confirmer le Rejet</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ValidatedTeachers;