import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { TeacherNavigationActive } from './Dashboard';
import { Save, Settings, Mail, Phone, Camera, X, Navigation } from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const getPhotoUrl = (photo) => {
  if (!photo) return null;
  if (photo.startsWith('http://') || photo.startsWith('https://')) return photo;
  return 'http://localhost:8000/storage/' + photo + '?v=' + Date.now();
};

const getInitials = (prenom, nom) => {
  return (prenom?.charAt(0) || '') + (nom?.charAt(0) || '');
};

export default function TeacherProfile() {
  const { user, updateUser } = useAuth();
  const context = useOutletContext();
  const isDark = context?.isDark || false;

  // Couleurs
  const bg = isDark ? '#0a0a0c' : '#ffffff';
  const bgCard = isDark ? '#1a1a1c' : '#f8f9fc';
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const borderSub = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)';
  const text = isDark ? '#ffffff' : '#111827';
  const muted = isDark ? '#9ca3af' : '#6b7280';

  // States
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
  const [userForm, setUserForm] = useState({ nom: '', prenom: '', telephone: '', ville: '' });
  const [villes, setVilles] = useState([]);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Charger les villes
  useEffect(() => {
    api.get('/villes').then(res => setVilles(res.data || [])).catch(e => console.error(e));
  }, []);

  // Charger le profil
  useEffect(() => {
    if (!user?.utilisateur_id) return;
    api.get('/enseignants/' + user.utilisateur_id)
      .then(res => {
        const e = res.data;
        setForm({
          titre: e.titre || '',
          description_cours: e.description_cours || '',
          description_profil: e.description_profil || '',
          tarifHeure: e.tarifHeure || '',
          langues: e.langues || '',
          cours_domicile: !!e.cours_domicile,
          cours_deplacement: !!e.cours_deplacement,
          cours_enligne: !!e.cours_enligne,
          distance_max: e.distance_max || '',
        });
        setUserForm({
          nom: e.user?.nom || '',
          prenom: e.user?.prenom || '',
          telephone: e.user?.telephone || '',
          ville: e.user?.ville || '',
        });
        setPhotoPreview(getPhotoUrl(e.user?.photo));
      })
      .catch(err => console.error(err));
  }, [user]);

  // Handlers
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleUserFormChange = (e) => {
    const { name, value } = e.target;
    setUserForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  // Upload photo
  const uploadPhoto = async () => {
    if (!photoFile) return null;
    const fd = new FormData();
    fd.append('photo', photoFile);
    const res = await api.post('/enseignant/photo', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    return res.data;
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = { ...form, ...userForm };
      const profilRes = await api.put('/enseignant/profil', payload);

      if (profilRes.data?.user) {
        updateUser(profilRes.data.user);
      }

      if (photoFile) {
        const photoRes = await uploadPhoto();
        if (photoRes?.user) {
          updateUser(photoRes.user);
          if (photoRes.photo) setPhotoPreview(getPhotoUrl(photoRes.photo));
        }
        setPhotoFile(null);
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors || 'Erreur lors de la sauvegarde.';
      if (typeof msg === 'object') {
        setError(Object.values(msg).flat()[0] || 'Erreur de validation.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const modalites = [
    { name: 'cours_domicile', label: 'À domicile' },
    { name: 'cours_enligne', label: 'En ligne / Webcam' },
    { name: 'cours_deplacement', label: 'Déplacement' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: bg, paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

        {/* Header */}
        <div style={{ borderBottom: '1px solid ' + border, paddingBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.65rem', color: '#e04f00', fontWeight: 700, fontFamily: 'monospace', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>LEARNECT PROF PLATFORM</div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: text, margin: '0 0 0.4rem', letterSpacing: '-0.02em' }}>Paramètres de Publication</h1>
          <p style={{ fontSize: '0.8rem', color: muted, margin: 0 }}>Ajustez votre fiche publique et vos tarifs horaires.</p>
        </div>

        {/* Contenu */}
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <TeacherNavigationActive activeTab="profile" isDark={isDark} />

          <div style={{ flex: 1, minWidth: 0, background: bgCard, border: '1px solid ' + border, borderRadius: '20px', padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 800, color: text, margin: '0 0 1.5rem', paddingBottom: '1rem', borderBottom: '1px solid ' + borderSub, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Settings size={18} color="#e04f00" /> Dossier Enseignant Public
            </h2>

            {/* Erreurs / Succès */}
            {error && (
              <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', color: '#dc2626', fontSize: '0.75rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <X size={14} /> {error}
              </div>
            )}
            {saveSuccess && (
              <div style={{ padding: '10px 14px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '10px', color: '#16a34a', fontSize: '0.75rem', fontWeight: 700, marginBottom: '1.25rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Save size={14} /> Dossier enregistré avec succès.
              </div>
            )}

            {/* Formulaire */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

              {/* Photo */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: isDark ? '#111113' : '#ffffff', borderRadius: '12px', border: '1px solid ' + borderSub }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(224,79,0,0.1)', border: '2px solid rgba(224,79,0,0.3)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {photoPreview ? (
                      <img src={photoPreview} alt="Photo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none'; }} />
                    ) : (
                      <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#e04f00' }}>{getInitials(userForm.prenom, userForm.nom)}</span>
                    )}
                  </div>
                  <label style={{ position: 'absolute', bottom: '-2px', right: '-2px', width: '24px', height: '24px', borderRadius: '50%', background: '#e04f00', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <Camera size={12} color="#fff" />
                    <input type="file" accept="image/jpg,image/jpeg,image/png" onChange={handlePhotoChange} style={{ display: 'none' }} />
                  </label>
                </div>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: text }}>{userForm.prenom} {userForm.nom}</div>
                  <div style={{ fontSize: '0.75rem', color: muted, marginTop: '2px' }}>Enseignant</div>
                </div>
              </div>

              {/* Champs */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.6rem', color: muted, fontWeight: 700, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' }}>Prénom</label>
                  <input name="prenom" value={userForm.prenom} onChange={handleUserFormChange} required style={{ width: '100%', background: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff', border: '1px solid ' + (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'), color: text, borderRadius: '10px', padding: '10px 12px', fontSize: '0.8rem', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.6rem', color: muted, fontWeight: 700, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' }}>Nom de famille</label>
                  <input name="nom" value={userForm.nom} onChange={handleUserFormChange} required style={{ width: '100%', background: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff', border: '1px solid ' + (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'), color: text, borderRadius: '10px', padding: '10px 12px', fontSize: '0.8rem', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.6rem', color: muted, fontWeight: 700, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' }}>Adresse email</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={14} color={muted} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input disabled value={user?.email || ''} style={{ width: '100%', background: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff', border: '1px solid ' + (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'), color: text, borderRadius: '10px', padding: '10px 12px', fontSize: '0.8rem', outline: 'none', boxSizing: 'border-box', paddingLeft: '36px', opacity: 0.5, cursor: 'not-allowed' }} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '0.6rem', color: muted, fontWeight: 700, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' }}>Téléphone (Maroc)</label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={14} color={muted} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input name="telephone" value={userForm.telephone} onChange={handleUserFormChange} placeholder="06 XX XX XX XX" required style={{ width: '100%', background: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff', border: '1px solid ' + (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'), color: text, borderRadius: '10px', padding: '10px 12px', fontSize: '0.8rem', outline: 'none', boxSizing: 'border-box', paddingLeft: '36px' }} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '0.6rem', color: muted, fontWeight: 700, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' }}>Titre de l'annonce</label>
                  <input name="titre" value={form.titre} onChange={handleFormChange} placeholder="Ex: Professeur agrégé de SVT" required style={{ width: '100%', background: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff', border: '1px solid ' + (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'), color: text, borderRadius: '10px', padding: '10px 12px', fontSize: '0.8rem', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.6rem', color: muted, fontWeight: 700, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' }}>Tarif Horaire (MAD / heure)</label>
                  <input name="tarifHeure" type="number" value={form.tarifHeure} onChange={handleFormChange} placeholder="150" required style={{ width: '100%', background: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff', border: '1px solid ' + (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'), color: text, borderRadius: '10px', padding: '10px 12px', fontSize: '0.8rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'monospace' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.6rem', color: muted, fontWeight: 700, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' }}>Ville principale</label>
                  <select name="ville" value={userForm.ville} onChange={handleUserFormChange} style={{ width: '100%', background: isDark ? '#2a2a2c' : '#ffffff', border: '1px solid ' + (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'), color: text, borderRadius: '10px', padding: '10px 12px', fontSize: '0.8rem', outline: 'none', boxSizing: 'border-box', cursor: 'pointer' }}>
                    <option value="">Sélectionner une ville</option>
                    {villes.map(v => <option key={v.id || v.nom || v} value={v.nom || v} style={{ background: isDark ? '#1a1a1c' : '#ffffff' }}>{v.nom || v}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.6rem', color: muted, fontWeight: 700, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' }}>Langues d'enseignement</label>
                  <input name="langues" value={form.langues} onChange={handleFormChange} placeholder="Ex: Français, Arabe, Anglais" style={{ width: '100%', background: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff', border: '1px solid ' + (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'), color: text, borderRadius: '10px', padding: '10px 12px', fontSize: '0.8rem', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>

              {/* Modes d'enseignement */}
              <div>
                <label style={{ fontSize: '0.6rem', color: muted, fontWeight: 700, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' }}>Modes d'enseignement</label>
                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginTop: '4px' }}>
                  {modalites.map(opt => (
                    <label key={opt.name} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.82rem', color: text, fontWeight: 500 }}>
                      <input type="checkbox" name={opt.name} checked={!!form[opt.name]} onChange={handleFormChange} style={{ accentColor: '#e04f00', width: '16px', height: '16px' }} />
                      {opt.label}
                    </label>
                  ))}
                </div>

                {/* Distance max */}
                {form.cours_domicile && (
                  <div style={{ marginTop: '1rem', maxWidth: '300px' }}>
                    <label style={{ fontSize: '0.6rem', color: muted, fontWeight: 700, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' }}>Distance maximale (km)</label>
                    <div style={{ position: 'relative' }}>
                      <Navigation size={14} color={muted} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                      <input name="distance_max" type="number" min="1" value={form.distance_max || ''} onChange={handleFormChange} placeholder="Ex: 10" required={form.cours_domicile} style={{ width: '100%', background: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff', border: '1px solid ' + (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'), color: text, borderRadius: '10px', padding: '10px 12px 10px 36px', fontSize: '0.8rem', outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                    <p style={{ fontSize: '0.7rem', color: muted, marginTop: '4px', marginBottom: 0 }}>Distance maximale que vous acceptez de parcourir</p>
                  </div>
                )}
              </div>

              {/* Descriptions */}
              <div>
                <label style={{ fontSize: '0.6rem', color: muted, fontWeight: 700, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' }}>Description du cours</label>
                <textarea name="description_cours" value={form.description_cours} onChange={handleFormChange} placeholder="Décrivez votre méthode pédagogique..." rows={3} style={{ width: '100%', background: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff', border: '1px solid ' + (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'), color: text, borderRadius: '10px', padding: '10px 12px', fontSize: '0.8rem', outline: 'none', boxSizing: 'border-box', resize: 'vertical', lineHeight: 1.6 }} />
              </div>
              <div>
                <label style={{ fontSize: '0.6rem', color: muted, fontWeight: 700, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' }}>Description biographique publique</label>
                <textarea name="description_profil" value={form.description_profil} onChange={handleFormChange} placeholder="Expériences, diplômes, parcours académique..." rows={3} style={{ width: '100%', background: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff', border: '1px solid ' + (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'), color: text, borderRadius: '10px', padding: '10px 12px', fontSize: '0.8rem', outline: 'none', boxSizing: 'border-box', resize: 'vertical', lineHeight: 1.6 }} />
              </div>

              {/* Submit */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.5rem', borderTop: '1px solid ' + borderSub }}>
                <button type="submit" disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 28px', borderRadius: '12px', background: loading ? (isDark ? 'rgba(255,255,255,0.05)' : '#e5e7eb') : (isDark ? '#ffffff' : '#111827'), color: loading ? muted : (isDark ? '#111827' : '#ffffff'), border: 'none', fontSize: '0.78rem', fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'monospace', letterSpacing: '0.06em' }}>
                  <Save size={16} /> {loading ? 'SAUVEGARDE...' : 'METTRE À JOUR MA FICHE'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

