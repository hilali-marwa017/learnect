function ManageUsers({ users, onBloquer }) {
  return (
    <div className="bg-white p-6 rounded-3xl border">
      <h3 className="text-sm font-black uppercase">Annuaire des utilisateurs enregistrés ({users.length})</h3>
      <p className="text-xs text-slate-500 mt-1">Gérez les comptes de tuteurs et élèves.</p>
      
      <div className="overflow-x-auto mt-4">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-3 text-left">Utilisateur</th>
              <th className="p-3 text-left">Rôle</th>
              <th className="p-3 text-left">Ville</th>
              <th className="p-3 text-left">Statut</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.utilisateur_id} className="border-b">
                <td className="p-3">
                  <div>
                    <span className="font-bold">{u.prenom} {u.nom}</span>
                    <br />
                    <span className="text-xs text-slate-400">{u.email}</span>
                  </div>
                </td>
                <td className="p-3 capitalize">{u.role}</td>
                <td className="p-3">{u.ville}</td>
                <td className="p-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${u.statut === 'actif' ? 'bg-blue-50 text-blue-800' : 'bg-rose-50 text-rose-600'}`}>
                    {u.statut}
                  </span>
                </td>
                <td className="p-3">
                  <button onClick={() => onBloquer(u.utilisateur_id)} className="text-rose-600 text-xs font-bold">
                    Bloquer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageUsers;