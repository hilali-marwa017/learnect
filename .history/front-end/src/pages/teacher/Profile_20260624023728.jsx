import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { TeacherNavigationActive } from './Dashboard';
import { Save, Settings, Mail, Phone, Camera, X, MapPin } from 'lucide-react';
import api from '../../api/axios';

export default function TeacherProfile() {
  const { user } = useAuth();
  const [form, setForm] = useState({ titre:'', description_cours:'', description_profil:'', tarifHeure:'', langues:'', cours_domicile:false, cours_deplacement:false, cours_enligne:false });
  const [userForm, setUserForm] = useState({ nom:'', prenom:'', telephone:'', ville:'' });
  const [villes, setVilles] = useState([]);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const inputStyle = { width: '100%', background: '#f8f9fc', border: '1px solid rgba(0,0,0,0.1)', color: '#111827', borderRadius: '10px', padding: '10px 12px', fontSize: '0.8rem', outline: 'none', boxSizing: 'border-box' };
  const labelStyle = { fontSize: '0.6rem', color: '#9ca3af', fontWeight: 700, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' };

  useEffect(() => {
    // Charger villes depuis backend
    async function fetchVilles() {
      try {
        const res = await api.get('/villes');
        setVilles(res.data || []);
      } catch (e) { console.error(e); }
    }
    fetchVilles();
  }, []);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await api.get(`/enseignants/${user?.utilisateur_id}`);
        const e = res.data;
        setForm({ titre: e.titre||'', description_cours: e.description_cours||'', description_profil: e.description_profil||'', tarifHeure: e.tarifHeure||'', langues: e.langues||'', cours_domicile: e.cours_domicile||false, cours_deplacement: e.cours_deplacement||false, cours_enligne: e.cours_enligne||false });
        setUserForm({ nom: e.user?.nom||'', prenom: e.user?.prenom||'', telephone: e.user?.telephone||'', ville: e.user?.ville||'' });
        if (e.user?.photo) setPhotoPreview(`${import.meta.env.VITE_API_URL}/storage/${e.user.photo}`);
      } catch (err) { console.error(err); }
    }
    if (user?.utilisateur_id) fetchProfile();
  }, [user]);

  function handleFormChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }

  function handlePhotoChange(e) {
    const file = e.target.files[0];
    if (file) { setPhotoFile(file); setPhotoPreview(URL.createObjectURL(file)); }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await api.put('/enseignant/profile', { ...form, ...userForm });
      if (photoFile) {
        const fd = new FormData();
        fd.append('photo', photoFile);
        await api.post('/enseignant/photo', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) { setError(err.response?.data?.message || 'Erreur lors de la sauvegarde.'); }
    finally { setLoading(false); }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#ffffff', paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

        <div style={{ borderBottom: '1px solid rgba(0,0,0,0.08)', paddingBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.65rem', color: '#e04f00', fontWeight: 700, fontFamily: 'monospace', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>LEARNECT PROF PLATFORM</div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#111827', margin: '0 0 0.4rem', letterSpacing: '-0.02em' }}>Parametres de Publication</h1>
          <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: 0 }}>Ajustez votre fiche publique, modifiez vos matieres d'enseignement et vos tarifs horaires.</p>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <TeacherNavigationActive activeTab="profile" />

          <div style={{ flex: 1, minWidth: 0, background: '#f8f9fc', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '20px', padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#111827', margin: '0 0 1.5rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Settings size={18} color="#e04f00" /> Dossier Enseignant Public
            </h2>

            {error && <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', color: '#dc2626', fontSize: '0.75rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}><X size={14} /> {error}</div>}
            {saveSuccess && <div style={{ padding: '10px 14px', background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '10px', color: '#16a34a', fontSize: '0.75rem', fontWeight: 700, marginBottom: '1.25rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}><Save size={14} /> Votre dossier enseignant a ete enregistre avec succes.</div>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

              {/* Photo */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#ffffff', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.06)' }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(224,79,0,0.1)', border: '2px solid rgba(224,79,0,0.3)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {photoPreview
                      ? <img src={photoPreview} alt="Photo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#e04f00' }}>{userForm.prenom?.charAt(0)}{userForm.nom?.charAt(0)}</span>
                    }
                  </div>
                  <label style={{ position: 'absolute', bottom: '-2px', right: '-2px', width: '24px', height: '24px', borderRadius: '50%', background: '#e04f00', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <Camera size={12} color="#fff" />
                    <input type="file" accept="image/jpg,image/jpeg,image/png" onChange={handlePhotoChange} style={{ display: 'none' }} />
                  </label>
                </div>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#111827' }}>{userForm.prenom} {userForm.nom}</div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '2px' }}>{user?.email}</div>
                  <div style={{ fontSize: '0.65rem', color: '#9ca3af', marginTop: '4px' }}>JPG, PNG — max 2MB</div>
                </div>
              </div>

              {/* Grid infos */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div><label style={labelStyle}>Prenom</label><input required type="text" value={userForm.prenom} onChange={e => setUserForm(p => ({...p, prenom: e.target.value}))} style={inputStyle} /></div>
                <div><label style={labelStyle}>Nom de famille</label><input required type="text" value={userForm.nom} onChange={e => setUserForm(p => ({...p, nom: e.target.value}))} style={inputStyle} /></div>
                <div>
                  <label style={labelStyle}>Adresse email</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={14} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input disabled type="email" value={user?.email||''} style={{ ...inputStyle, paddingLeft: '36px', opacity: 0.5, cursor: 'not-allowed' }} />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Telephone (Maroc)</label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={14} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input required type="text" value={userForm.telephone} onChange={e => setUserForm(p => ({...p, telephone: e.target.value}))} placeholder="06 XX XX XX XX" style={{ ...inputStyle, paddingLeft: '36px' }} />
                  </div>
                </div>
                <div><label style={labelStyle}>Titre de l'annonce</label><input required type="text" name="titre" value={form.titre} onChange={handleFormChange} placeholder="Ex: Professeur agree de SVT" style={inputStyle} /></div>
                <div><label style={labelStyle}>Tarif Horaire (MAD / heure)</label><input required type="number" name="tarifHeure" value={form.tarifHeure} onChange={handleFormChange} min={5} placeholder="150" style={{ ...inputStyle, fontFamily: 'monospace' }} /></div>

                {/* Ville depuis backend */}
                <div>
                  <label style={labelStyle}>Ville principale</label>
                  <div style={{ position: 'relative' }}>
                    <MapPin size={14} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <select value={userForm.ville} onChange={e => setUserForm(p => ({...p, ville: e.target.value}))} style={{ ...inputStyle, paddingLeft: '36px', cursor: 'pointer' }}>
                      <option value="">Selectionner une ville</option>
                      {villes.map(v => (
                        <option key={v.id || v.nom || v} value={v.nom || v}>{v.nom || v}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div><label style={labelStyle}>Langues d'enseignement</label><input type="text" name="langues" value={form.langues} onChange={handleFormChange} placeholder="Ex: Francais, Arabe, Anglais" style={inputStyle} /></div>
              </div>

              {/* Modes */}
              <div>
                <label style={labelStyle}>Modes d'enseignement</label>
                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginTop: '4px' }}>
                  {[{name:'cours_domicile',label:'A domicile'},{name:'cours_enligne',label:'En ligne / Webcam'},{name:'cours_deplacement',label:'Deplacement'}].map(opt => (
                    <label key={opt.name} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.82rem', color: '#374151', fontWeight: 500 }}>
                      <input type="checkbox" name={opt.name} checked={form[opt.name]} onChange={handleFormChange} style={{ accentColor: '#e04f00', width: '16px', height: '16px' }} />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Descriptions */}
              <div>
                <label style={labelStyle}>Description du cours</label>
                <textarea required name="description_cours" value={form.description_cours} onChange={handleFormChange} placeholder="Decrivez votre methode pedagogique, vos matieres, niveaux enseignes..." rows={3} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} />
              </div>
              <div>
                <label style={labelStyle}>Description biographique publique</label>
                <textarea required name="description_profil" value={form.description_profil} onChange={handleFormChange} placeholder="Experiences, diplomes, parcours academique..." rows={3} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.5rem', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                <button type="submit" disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 28px', borderRadius: '12px', background: loading ? '#e5e7eb' : '#111827', color: loading ? '#9ca3af' : '#ffffff', border: 'none', fontSize: '0.78rem', fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'monospace', letterSpacing: '0.06em' }}>
                  <Save size={16} />{loading ? 'SAUVEGARDE...' : 'METTRE A JOUR MA FICHE'}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}