import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { TeacherNavigationActive } from './Dashboard';
import { Save, Settings, Mail, Phone, Camera } from 'lucide-react';
import api from '../../api/axios';

const CITIES_LIST = [
  'Casablanca','Rabat','Marrakech','Tanger','Agadir','Fès','Meknès',
  'Oujda','Kénitra','Tétouan','Salé','Mohammedia','Nador'
];

export default function TeacherProfile() {
  const { user, login } = useAuth();
  const [form, setForm] = useState({
    titre: '', description_cours: '', description_profil: '',
    tarifHeure: '', langues: '', cours_domicile: false,
    cours_deplacement: false, cours_enligne: false, distance_max: '',
  });
  const [userForm, setUserForm] = useState({
    nom: '', prenom: '', telephone: '', ville: 'Casablanca',
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await api.get(`/enseignants/${user?.utilisateur_id}`);
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
        setUserForm({
          nom: e.user?.nom || '',
          prenom: e.user?.prenom || '',
          telephone: e.user?.telephone || '',
          ville: e.user?.ville || 'Casablanca',
        });
        if (e.user?.photo) {
          setPhotoPreview(`${import.meta.env.VITE_API_URL}/storage/${e.user.photo}`);
        }
      } catch (err) {
        console.error(err);
      }
    }
    if (user?.utilisateur_id) fetchProfile();
  }, [user]);

  function handleFormChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }

  function handleUserChange(e) {
    const { name, value } = e.target;
    setUserForm(prev => ({ ...prev, [name]: value }));
  }

  function handlePhotoChange(e) {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      // Mise à jour profil enseignant
      await api.put('/enseignant/profil', { ...form, ...userForm });

      // Upload photo si modifiée
      if (photoFile) {
        const fd = new FormData();
        fd.append('photo', photoFile);
        await api.post('/enseignant/photo', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la sauvegarde.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-canvas">
      <div className="max-w-7xl mx-auto px-6 space-y-8 animate-in fade-in duration-300">

        <div className="border-b border-hairline-strong pb-6 space-y-1">
          <span className="text-[10px] uppercase font-bold font-mono text-accent-orange tracking-widest block">LEARNECT PROF PLATFORM</span>
          <h1 className="text-3xl font-black text-ink tracking-tight">Paramètres de Publication</h1>
          <p className="text-charcoal text-xs">Ajustez votre fiche publique, modifiez vos matières d'enseignement, vos diplômes et vos tarifs horaires.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <TeacherNavigationActive activeTab="profile" />

          <div className="flex-grow bg-surface-card border border-hairline-strong rounded-2xl p-6 md:p-8 space-y-6">
            <h2 className="text-lg font-black text-ink border-b border-divider-soft pb-3 flex items-center gap-2">
              <Settings className="h-5 w-5 text-accent-orange" />
              <span>Dossier Enseignant Public</span>
            </h2>

            {error && <div className="p-3 bg-accent-red/10 border border-accent-red/20 rounded-lg text-accent-red text-xs font-bold font-mono">✕ {error}</div>}
            {saveSuccess && <div className="p-3 bg-accent-green/10 border border-accent-green/20 rounded-lg text-accent-green text-xs font-bold text-center font-mono">✓ Votre dossier enseignant a été enregistré avec succès.</div>}

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Photo */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-surface-deep/40 border border-hairline-strong overflow-hidden flex items-center justify-center">
                    {photoPreview
                      ? <img src={photoPreview} alt="Photo" className="w-full h-full object-cover" />
                      : <span className="text-2xl font-black text-accent-orange">{userForm.prenom?.charAt(0)}{userForm.nom?.charAt(0)}</span>
                    }
                  </div>
                  <label className="absolute -bottom-1 -right-1 p-1.5 bg-accent-orange rounded-full cursor-pointer hover:bg-accent-orange/80 transition-colors">
                    <Camera className="h-3 w-3 text-white" />
                    <input type="file" accept="image/jpg,image/jpeg,image/png" onChange={handlePhotoChange} className="hidden" />
                  </label>
                </div>
                <div>
                  <p className="text-xs font-bold text-ink">{userForm.prenom} {userForm.nom}</p>
                  <p className="text-[10px] text-mute font-mono">{user?.email}</p>
                  <p className="text-[10px] text-mute mt-0.5">JPG, PNG — max 2MB</p>
                </div>
              </div>

              {/* Infos personnelles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-mute uppercase font-bold block">Prénom</label>
                  <input required type="text" name="prenom" value={userForm.prenom} onChange={handleUserChange} className="w-full bg-surface-deep/30 border border-hairline-strong text-ink rounded-lg p-2.5 text-xs outline-none focus:ring-1 focus:ring-accent-orange" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-mute uppercase font-bold block">Nom de famille</label>
                  <input required type="text" name="nom" value={userForm.nom} onChange={handleUserChange} className="w-full bg-surface-deep/30 border border-hairline-strong text-ink rounded-lg p-2.5 text-xs outline-none focus:ring-1 focus:ring-accent-orange" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-mute uppercase font-bold block">Adresse email de connexion</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-mute" />
                    <input disabled type="email" value={user?.email || ''} className="w-full bg-surface-deep/20 border border-hairline text-mute rounded-lg pl-9 p-2.5 text-xs cursor-not-allowed" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-mute uppercase font-bold block">Téléphone mobile (Maroc)</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-mute" />
                    <input required type="text" name="telephone" value={userForm.telephone} onChange={handleUserChange} placeholder="06 XX XX XX XX" className="w-full bg-surface-deep/30 border border-hairline-strong text-ink rounded-lg pl-9 p-2.5 text-xs outline-none focus:ring-1 focus:ring-accent-orange" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-mute uppercase font-bold block">Titre de l'annonce (Matière principale)</label>
                  <input required type="text" name="titre" value={form.titre} onChange={handleFormChange} placeholder="Ex: Professeur agrégé de SVT" className="w-full bg-surface-deep/30 border border-hairline-strong text-ink rounded-lg p-2.5 text-xs outline-none focus:ring-1 focus:ring-accent-orange" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-mute uppercase font-bold block">Tarif Horaire (MAD / heure)</label>
                  <input required type="number" name="tarifHeure" value={form.tarifHeure} onChange={handleFormChange} min={5} placeholder="150" className="w-full bg-surface-deep/30 border border-hairline-strong text-ink rounded-lg p-2.5 text-xs outline-none focus:ring-1 focus:ring-accent-orange font-mono" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-mute uppercase font-bold block">Ville principale d'enseignement</label>
                  <select name="ville" value={userForm.ville} onChange={handleUserChange} className="w-full bg-surface-deep/30 border border-hairline-strong text-ink rounded-lg p-2.5 text-xs outline-none focus:ring-1 focus:ring-accent-orange cursor-pointer">
                    {CITIES_LIST.map(c => <option key={c} value={c} className="bg-surface-card">{c}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-mute uppercase font-bold block">Langues d'enseignement (séparateur virgule)</label>
                  <input type="text" name="langues" value={form.langues} onChange={handleFormChange} placeholder="Ex: Français, Arabe, Anglais" className="w-full bg-surface-deep/30 border border-hairline-strong text-ink rounded-lg p-2.5 text-xs outline-none focus:ring-1 focus:ring-accent-orange" />
                </div>
              </div>

              {/* Modes de cours */}
              <div className="space-y-2">
                <label className="text-[10px] text-mute uppercase font-bold block">Modes d'enseignement</label>
                <div className="flex flex-wrap gap-4">
                  {[
                    { name: 'cours_domicile', label: 'À domicile' },
                    { name: 'cours_enligne', label: 'En ligne / Webcam' },
                    { name: 'cours_deplacement', label: 'Déplacement' },
                  ].map(opt => (
                    <label key={opt.name} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" name={opt.name} checked={form[opt.name]} onChange={handleFormChange} className="accent-accent-orange w-4 h-4 rounded" />
                      <span className="text-xs text-charcoal font-semibold">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Descriptions */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-mute uppercase font-bold block">Description du cours</label>
                <textarea required name="description_cours" value={form.description_cours} onChange={handleFormChange} placeholder="Décrivez votre méthode pédagogique, vos matières, niveaux enseignés..." rows={3} className="w-full bg-surface-deep/30 border border-hairline-strong text-ink rounded-lg p-3 text-xs outline-none focus:ring-1 focus:ring-accent-orange leading-relaxed" />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-mute uppercase font-bold block">Description biographique publique</label>
                <textarea required name="description_profil" value={form.description_profil} onChange={handleFormChange} placeholder="Expériences, diplômes, parcours académique..." rows={3} className="w-full bg-surface-deep/30 border border-hairline-strong text-ink rounded-lg p-3 text-xs outline-none focus:ring-1 focus:ring-accent-orange leading-relaxed" />
              </div>

              <div className="pt-4 border-t border-hairline flex justify-end">
                <button type="submit" disabled={loading} className="bg-ink text-canvas hover:bg-accent-orange hover:text-white px-8 py-3 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer font-mono disabled:opacity-50">
                  <Save className="h-4 w-4" />
                  <span>{loading ? 'SAUVEGARDE...' : 'METTRE À JOUR MA FICHE'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}