import React, { useState, useEffect } from 'react';
import { TeacherNavigationActive } from './Dashboard';
import { Calendar, Plus, Trash2 } from 'lucide-react';
import api from '../../api/axios';

const JOURS = ['lundi','mardi','mercredi','jeudi','vendredi','samedi','dimanche'];
const JOURS_LABELS = { lundi:'Lundi', mardi:'Mardi', mercredi:'Mercredi', jeudi:'Jeudi', vendredi:'Vendredi', samedi:'Samedi', dimanche:'Dimanche' };
const TIME_SLOTS = ['08:00','10:00','12:00','14:00','16:00','18:00','20:00'];

export default function TeacherAvailability() {
  const [creneaux, setCreneaux] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState('');
  const [newJour, setNewJour] = useState('lundi');
  const [newDebut, setNewDebut] = useState('08:00');
  const [newFin, setNewFin] = useState('10:00');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    async function fetchCreneaux() {
      try {
        const res = await api.get('/enseignant/dashboard');
        setCreneaux(res.data.enseignant?.creneaux || []);
      } catch (e) {
        setError('Impossible de charger les créneaux.');
      } finally {
        setLoading(false);
      }
    }
    fetchCreneaux();
  }, []);

  async function handleAdd(e) {
    e.preventDefault();
    if (newDebut >= newFin) { setError("L'heure de fin doit être après l'heure de début."); return; }
    setAdding(true); setError('');
    try {
      const res = await api.post('/creneaux', { jour: newJour, heureDebut: newDebut, heureFin: newFin });
      setCreneaux(prev => [...prev, res.data.creneau]);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (e) {
      setError(e.response?.data?.message || 'Erreur lors de l\'ajout.');
    } finally {
      setAdding(false);
    }
  }

  async function handleToggle(creneau) {
    try {
      const res = await api.put(`/creneaux/${creneau.id_creneau}`, { estDisponible: !creneau.estDisponible });
      setCreneaux(prev => prev.map(c => c.id_creneau === creneau.id_creneau ? res.data.creneau : c));
    } catch (e) { setError('Erreur mise à jour.'); }
  }

  async function handleDelete(id) {
    if (!window.confirm('Supprimer ce créneau ?')) return;
    try {
      await api.delete(`/creneaux/${id}`);
      setCreneaux(prev => prev.filter(c => c.id_creneau !== id));
    } catch (e) { setError(e.response?.data?.message || 'Erreur suppression.'); }
  }

  const creneauxParJour = JOURS.reduce((acc, jour) => {
    acc[jour] = creneaux.filter(c => c.jour === jour);
    return acc;
  }, {});

  return (
    <div className="pt-24 pb-16 min-h-screen bg-canvas">
      <div className="max-w-7xl mx-auto px-6 space-y-8 animate-in fade-in duration-300">

        <div className="border-b border-hairline-strong pb-6 space-y-1">
          <span className="text-[10px] uppercase font-bold font-mono text-accent-orange tracking-widest block">LEARNECT PROF PLATFORM</span>
          <h1 className="text-3xl font-black text-ink tracking-tight">Disponibilités & Calendrier</h1>
          <p className="text-charcoal text-xs">Configurez vos créneaux réguliers de soutien scolaire à domicile ou à distance pour que les familles marocaines puissent réserver d'un simple clic.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <TeacherNavigationActive activeTab="availability" />

          <div className="flex-grow space-y-6">

            {/* Formulaire ajout */}
            <div className="bg-surface-card border border-hairline-strong rounded-2xl p-6 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-ink font-mono flex items-center gap-2">
                <Plus className="h-4 w-4 text-accent-orange" />Ajouter un créneau
              </h2>
              {error && <div className="p-3 bg-accent-red/10 border border-accent-red/20 rounded-lg text-accent-red text-xs font-bold font-mono">✕ {error}</div>}
              {saveSuccess && <div className="p-3 bg-accent-green/10 border border-accent-green/20 rounded-lg text-accent-green text-xs font-bold font-mono">✓ Créneau ajouté avec succès.</div>}

              <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
                <div className="space-y-1">
                  <label className="text-[10px] text-mute uppercase font-bold block">Jour</label>
                  <select value={newJour} onChange={e => setNewJour(e.target.value)} className="w-full bg-surface-deep/40 border border-hairline-strong text-ink rounded-lg p-2.5 text-xs outline-none focus:ring-1 focus:ring-accent-orange cursor-pointer">
                    {JOURS.map(j => <option key={j} value={j} className="bg-surface-card">{JOURS_LABELS[j]}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-mute uppercase font-bold block">Heure début</label>
                  <select value={newDebut} onChange={e => setNewDebut(e.target.value)} className="w-full bg-surface-deep/40 border border-hairline-strong text-ink rounded-lg p-2.5 text-xs outline-none focus:ring-1 focus:ring-accent-orange cursor-pointer">
                    {TIME_SLOTS.map(t => <option key={t} value={t} className="bg-surface-card">{t}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-mute uppercase font-bold block">Heure fin</label>
                  <select value={newFin} onChange={e => setNewFin(e.target.value)} className="w-full bg-surface-deep/40 border border-hairline-strong text-ink rounded-lg p-2.5 text-xs outline-none focus:ring-1 focus:ring-accent-orange cursor-pointer">
                    {TIME_SLOTS.map(t => <option key={t} value={t} className="bg-surface-card">{t}</option>)}
                  </select>
                </div>
                <button type="submit" disabled={adding} className="bg-ink text-canvas hover:bg-accent-orange hover:text-white px-6 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer font-mono disabled:opacity-50">
                  <Plus className="h-4 w-4" />{adding ? 'Ajout...' : 'AJOUTER'}
                </button>
              </form>
            </div>

            {/* Grille */}
            <div className="bg-surface-card border border-hairline-strong rounded-2xl p-6 md:p-8 space-y-6">
              <h2 className="text-lg font-black text-ink border-b border-divider-soft pb-3 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-accent-orange" />
                <span>Grille des Horaires Hebdomadaires</span>
              </h2>

              {loading ? (
                <div className="text-center py-10 text-mute text-xs font-mono">Chargement des créneaux...</div>
              ) : (
                <div className="divide-y divide-hairline">
                  {JOURS.map((jour) => {
                    const slots = creneauxParJour[jour];
                    return (
                      <div key={jour} className="py-4 flex flex-col lg:flex-row lg:items-center gap-4">
                        <div className="w-32 shrink-0">
                          <span className="text-sm font-black text-ink">{JOURS_LABELS[jour]}</span>
                          <p className="text-[10px] text-mute font-medium">{slots.length} créneau{slots.length !== 1 ? 'x' : ''}</p>
                        </div>
                        <div className="flex-grow flex flex-wrap gap-2">
                          {slots.length === 0 ? (
                            <span className="text-[10px] text-mute/40 italic font-mono">Aucun créneau</span>
                          ) : (
                            slots.map((c) => (
                              <div key={c.id_creneau} className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleToggle(c)}
                                  className={`px-3.5 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                                    c.estDisponible
                                      ? 'bg-accent-orange border-accent-orange text-canvas font-bold'
                                      : 'bg-surface-deep/20 border-hairline text-charcoal hover:border-hairline-strong line-through opacity-50'
                                  }`}
                                >
                                  {c.heureDebut?.slice(0,5)} - {c.heureFin?.slice(0,5)}
                                </button>
                                <button onClick={() => handleDelete(c.id_creneau)} className="p-1 text-accent-red/40 hover:text-accent-red transition-colors cursor-pointer" title="Supprimer">
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="pt-4 border-t border-hairline">
                <p className="text-[10px] text-mute font-mono">💡 Cliquez sur un créneau pour le rendre disponible / indisponible. Les créneaux <span className="text-accent-orange font-bold">orange</span> sont actifs et réservables.</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}