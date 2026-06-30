import React, { useState, useEffect } from 'react';
import { TeacherNavigationActive } from './Dashboard';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { Plus, Trash2, CheckCircle } from 'lucide-react';

const JOURS = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];

export default function TeacherAvailability() {
  const { user } = useAuth();
  const [creneaux, setCreneaux] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [jour, setJour] = useState('lundi');
  const [heureDebut, setHeureDebut] = useState('09:00');
  const [heureFin, setHeureFin] = useState('11:00');

  const fetchCreneaux = async () => {
    if (!user?.utilisateur_id) return;
    try {
      const res = await api.get(`/creneaux/${user.utilisateur_id}`);
      setCreneaux(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCreneaux(); }, [user]);

  const handleAdd = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await api.post('/creneaux', { jour, heureDebut, heureFin });
      setSuccessMsg('Créneau ajouté avec succès !');
      fetchCreneaux();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Erreur lors de l\'ajout.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/creneaux/${id}`);
      setCreneaux(creneaux.filter((c) => c.id_creneau !== id));
    } catch (e) {
      alert('Impossible de supprimer ce créneau.');
    }
  };

  const handleToggle = async (creneau) => {
    try {
      await api.put(`/creneaux/${creneau.id_creneau}`, { estDisponible: !creneau.estDisponible });
      setCreneaux(creneaux.map((c) => c.id_creneau === creneau.id_creneau ? { ...c, estDisponible: !c.estDisponible } : c));
    } catch (e) {
      alert('Erreur lors de la mise à jour.');
    }
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-canvas">
      <div className="max-w-7xl mx-auto px-6 space-y-8 animate-in fade-in duration-300">

        <div className="border-b border-hairline-strong pb-6 space-y-1">
          <span className="text-[10px] uppercase font-bold font-mono text-accent-orange tracking-widest block">ESPACE PROFESSEUR</span>
          <h1 className="text-3xl font-black text-ink tracking-tight">Mes Disponibilités</h1>
          <p className="text-charcoal text-xs">Gérez vos créneaux horaires disponibles pour les réservations des étudiants.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <TeacherNavigationActive activeTab="availability" />

          <div className="flex-grow space-y-8">
            
            {/* Formulaire ajout créneau */}
            <div className="bg-surface-card border border-hairline-strong rounded-2xl p-6 md:p-8 space-y-4">
              <h3 className="font-heading-md text-sm font-bold uppercase tracking-wider text-ink font-mono border-b border-divider-soft pb-3">
                Ajouter un créneau
              </h3>

              {errorMsg && <div className="p-3 bg-accent-red/10 border border-accent-red/20 rounded-lg text-accent-red text-xs font-bold">{errorMsg}</div>}
              {successMsg && <div className="p-3 bg-accent-green/10 border border-accent-green/20 rounded-lg text-accent-green text-xs font-bold flex items-center gap-2"><CheckCircle className="h-4 w-4" />{successMsg}</div>}

              <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-mute uppercase font-caption tracking-wider font-bold block">Jour</label>
                  <select value={jour} onChange={(e) => setJour(e.target.value)}
                    className="w-full bg-surface-deep/30 border border-hairline-strong text-ink rounded-lg p-2.5 text-xs outline-none focus:ring-1 focus:ring-accent-orange cursor-pointer capitalize">
                    {JOURS.map((j) => <option key={j} value={j} className="capitalize">{j}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-mute uppercase font-caption tracking-wider font-bold block">Heure début</label>
                  <input type="time" value={heureDebut} onChange={(e) => setHeureDebut(e.target.value)}
                    className="w-full bg-surface-deep/30 border border-hairline-strong text-ink rounded-lg p-2.5 text-xs outline-none focus:ring-1 focus:ring-accent-orange" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-mute uppercase font-caption tracking-wider font-bold block">Heure fin</label>
                  <input type="time" value={heureFin} onChange={(e) => setHeureFin(e.target.value)}
                    className="w-full bg-surface-deep/30 border border-hairline-strong text-ink rounded-lg p-2.5 text-xs outline-none focus:ring-1 focus:ring-accent-orange" />
                </div>
                <button type="submit"
                  className="bg-ink text-canvas hover:bg-accent-orange hover:text-white px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 font-mono">
                  <Plus className="h-4 w-4" />
                  <span>AJOUTER</span>
                </button>
              </form>
            </div>

            {/* Liste des créneaux */}
            <div className="bg-surface-card border border-hairline-strong rounded-2xl p-6 md:p-8 space-y-4">
              <h3 className="font-heading-md text-sm font-bold uppercase tracking-wider text-ink font-mono border-b border-divider-soft pb-3">
                Mes créneaux ({creneaux.length})
              </h3>

              {loading ? (
                <p className="text-xs text-mute text-center py-8 animate-pulse font-mono">Chargement...</p>
              ) : creneaux.length > 0 ? (
                <div className="space-y-3">
                  {creneaux.map((c) => (
                    <div key={c.id_creneau}
                      className="p-4 bg-surface-deep/40 border border-hairline rounded-xl flex items-center justify-between gap-4 flex-col sm:flex-row">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-xs text-ink capitalize">{c.jour}</span>
                        <span className="text-xs text-charcoal font-mono">{c.heureDebut} → {c.heureFin}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button onClick={() => handleToggle(c)}
                          className={`px-3 py-1 rounded text-[10px] font-bold font-mono transition-all cursor-pointer ${c.estDisponible ? 'bg-accent-green/10 border border-accent-green/20 text-accent-green' : 'bg-accent-red/10 border border-accent-red/20 text-accent-red'}`}>
                          {c.estDisponible ? 'DISPONIBLE' : 'INDISPONIBLE'}
                        </button>
                        <button onClick={() => handleDelete(c.id_creneau)}
                          className="p-1.5 rounded-lg text-mute hover:text-accent-red hover:bg-accent-red/10 cursor-pointer transition-all">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-surface-deep/20 rounded-xl">
                  <p className="text-xs text-mute font-mono font-bold">Aucun créneau ajouté pour l'instant.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}