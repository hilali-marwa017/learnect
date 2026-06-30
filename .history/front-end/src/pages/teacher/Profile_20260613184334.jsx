import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { Save, CheckCircle } from 'lucide-react';

export default function TeacherProfileSettings() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    titre: '',
    description_cours: '',
    description_profil: '',
    tarifHeure: '',
    langues: '',
    cours_domicile: false,
    cours_deplacement: false,
    cours_enligne: false,
    distance_max: '',
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.utilisateur_id) return;
      try {
        const res = await api.get(`/enseignants/${user.utilisateur_id}`);
        const e = res.data;
        setForm({
          titre: e.titre || '',
          description_cours: e.description_cours || '',
          description_profil: e.description_profil || '',
          tarifHeure: e.tarifHeure || '',
          langues: e.langues || '',
          cours_domicile: e.cours_domicile || false,
          cours_deplacement: e.cours_deplacement || false,
          cours_enligne: e.cours_enligne || false,
          distance_max: e.distance_max || '',
        });
      } catch (e) {
        console.error(e);
      } finally {
        setFetchLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      // Si le profil n'est pas encore complété, utiliser completeProfile
      await api.put('/enseignant/profile', form);
      setSuccessMsg('Profil mis à jour avec succès !');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Erreur lors de la mise à jour.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-canvas">
      <div className="max-w-7xl mx-auto px-6 space-y-8 animate-in fade-in duration-300">

        <div className="border-b border-hairline-strong pb-6 space-y-1">
          <span className="text-[10px] uppercase font-bold font-mono text-accent-orange tracking-widest block">ESPACE PROFESSEUR</span>
          <h1 className="text-3xl font-black text-ink tracking-tight">Mon Profil Public</h1>
          <p className="text-charcoal text-xs">Complétez votre profil pour apparaître dans les résultats de recherche des étudiants.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <TeacherNavigationActive activeTab="profile" />

          <div className="flex-grow bg-surface-card border border-hairline-strong rounded-2xl p-6 md:p-8 space-y-6">

            {successMsg && <div className="p-3.5 bg-accent-green/10 border border-accent-green/20 rounded-xl text-accent-green text-xs font-bold flex items-center gap-2"><CheckCircle className="h-4 w-4" />{successMsg}</div>}
            {errorMsg && <div className="p-3 bg-accent-red/10 border border-accent-red/20 rounded-lg text-accent-red text-xs font-bold">{errorMsg}</div>}

            {fetchLoading ? (
              <p className="text-xs text-mute text-center py-8 animate-pulse font-mono">Chargement de votre profil...</p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">

                <div className="space-y-1.5">
                  <label className="text-[10px] text-mute uppercase font-caption font-bold block">Titre de l'annonce</label>
                  <input type="text" value={form.titre} onChange={(e) => handleChange('titre', e.target.value)}
                    placeholder="Ex: Professeur de Mathématiques - Classes Préparatoires"
                    className="w-full bg-surface-deep/30 border border-hairline-strong text-ink rounded-lg p-2.5 text-xs outline-none focus:ring-1 focus:ring-accent-orange" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-mute uppercase font-caption font-bold block">Tarif horaire (MAD/h)</label>
                    <input type="number" value={form.tarifHeure} onChange={(e) => handleChange('tarifHeure', e.target.value)}
                      placeholder="Ex: 200"
                      className="w-full bg-surface-deep/30 border border-hairline-strong text-ink rounded-lg p-2.5 text-xs outline-none focus:ring-1 focus:ring-accent-orange" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-mute uppercase font-caption font-bold block">Langues</label>
                    <input type="text" value={form.langues} onChange={(e) => handleChange('langues', e.target.value)}
                      placeholder="Ex: Français, Arabe, Anglais"
                      className="w-full bg-surface-deep/30 border border-hairline-strong text-ink rounded-lg p-2.5 text-xs outline-none focus:ring-1 focus:ring-accent-orange" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-mute uppercase font-caption font-bold block">Description du profil</label>
                  <textarea rows={3} value={form.description_profil} onChange={(e) => handleChange('description_profil', e.target.value)}
                    placeholder="Présentez-vous brièvement..."
                    className="w-full bg-surface-deep/30 border border-hairline-strong text-ink rounded-lg p-2.5 text-xs outline-none focus:ring-1 focus:ring-accent-orange" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-mute uppercase font-caption font-bold block">Description des cours</label>
                  <textarea rows={3} value={form.description_cours} onChange={(e) => handleChange('description_cours', e.target.value)}
                    placeholder="Décrivez votre méthode pédagogique..."
                    className="w-full bg-surface-deep/30 border border-hairline-strong text-ink rounded-lg p-2.5 text-xs outline-none focus:ring-1 focus:ring-accent-orange" />
                </div>

                <div className="space-y-3 pt-2 border-t border-hairline">
                  <label className="text-[10px] text-mute uppercase font-caption font-bold block">Modalités de cours</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[['cours_domicile', 'À mon domicile'], ['cours_deplacement', 'Je me déplace'], ['cours_enligne', 'En ligne']].map(([key, label]) => (
                      <label key={key} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${form[key] ? 'bg-accent-orange/5 border-accent-orange' : 'border-hairline bg-surface-deep/10'}`}>
                        <input type="checkbox" checked={form[key]} onChange={(e) => handleChange(key, e.target.checked)}
                          className="accent-accent-orange h-4 w-4" />
                        <span className="text-xs font-semibold text-ink">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {form.cours_deplacement && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-mute uppercase font-caption font-bold block">Distance max de déplacement (km)</label>
                    <input type="number" value={form.distance_max} onChange={(e) => handleChange('distance_max', e.target.value)}
                      min={1} max={80}
                      className="w-24 bg-surface-deep/30 border border-hairline-strong text-ink rounded-lg p-2.5 text-xs outline-none focus:ring-1 focus:ring-accent-orange" />
                  </div>
                )}

                <div className="pt-4 border-t border-hairline flex justify-end">
                  <button type="submit" disabled={loading}
                    className="bg-ink text-canvas hover:bg-accent-orange hover:text-white px-8 py-3 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer font-mono disabled:opacity-60">
                    <Save className="h-4 w-4" />
                    <span>{loading ? 'SAUVEGARDE...' : 'SAUVEGARDER MON PROFIL'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}