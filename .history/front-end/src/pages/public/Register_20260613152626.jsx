import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../api/axios';

function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || 'etudiant';
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    nom: '', prenom: '', email: '', telephone: '', password: '', password_confirmation: '', ville: '', niveau: '', budget: '', matiere: '', tarifHeure: ''
  });
  
  const [files, setFiles] = useState({
    photo: null, cin_recto: null, cin_verso: null, diplome: null
  });
  
  const [checkboxes, setCheckboxes] = useState({
    cours_enligne: false, cours_domicile: false, cours_deplacement: false
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleFile(e) {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData();
    Object.keys(form).forEach(key => {
      if (form[key] !== '') formData.append(key, form[key]);
    });
    formData.append('role', role);
    formData.append('cours_enligne', checkboxes.cours_enligne);
    formData.append('cours_domicile', checkboxes.cours_domicile);
    formData.append('cours_deplacement', checkboxes.cours_deplacement);
    if (files.photo) formData.append('photo', files.photo);
    if (role === 'enseignant') {
      if (!files.cin_recto) { setError('CIN recto requis'); setLoading(false); return; }
      if (!files.cin_verso) { setError('CIN verso requis'); setLoading(false); return; }
      if (!files.diplome) { setError('Diplôme requis'); setLoading(false); return; }
      formData.append('cin_recto', files.cin_recto);
      formData.append('cin_verso', files.cin_verso);
      formData.append('diplome', files.diplome);
    }

    try {
      const response = await api.post('/register', formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      if (role === 'enseignant') {
        setSuccess(true);
      } else {
        navigate('/etudiant/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-canvas">
        <div className="bg-surface-card p-8 rounded-2xl text-center max-w-md">
          <i className="bi bi-check-circle-fill text-5xl text-accent-green mb-4 block"></i>
          <h2 className="text-xl font-bold text-ink mb-2">Dossier envoyé !</h2>
          <p className="text-charcoal text-sm mb-4">Votre dossier est en cours de vérification par notre équipe.</p>
          <Link to="/login" className="bg-ink text-canvas px-6 py-2 rounded-lg text-sm font-bold">Se connecter</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-24 bg-canvas flex items-center justify-center px-6">
      <div className="max-w-2xl w-full bg-surface-card border border-hairline-strong rounded-2xl p-8">
        
        <div className="flex justify-between items-center mb-6">
          <Link to="/" className="text-mute hover:text-ink"><i className="bi bi-x-lg text-xl"></i></Link>
          {role === 'enseignant' && <span className="text-xs text-mute">Étape {step}/2</span>}
        </div>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-accent-orange/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <i className={`bi ${role === 'enseignant' ? 'bi-briefcase' : 'bi-mortarboard'} text-2xl text-accent-orange`}></i>
          </div>
          <h1 className="text-2xl font-bold text-ink">{role === 'enseignant' ? 'Devenir Enseignant' : 'Créer un compte'}</h1>
          <p className="text-charcoal text-sm">{role === 'enseignant' ? 'Partagez votre savoir' : 'Trouvez votre professeur'}</p>
        </div>

        {error && <div className="bg-accent-red/10 border border-accent-red/20 text-accent-red text-sm p-3 rounded-lg mb-4">{error}</div>}

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <>
              <div className="mb-4">
                <label className="text-xs font-bold text-mute uppercase block mb-1">Photo de profil</label>
                <input type="file" name="photo" onChange={handleFile} className="w-full bg-surface-deep/30 border border-hairline rounded-lg p-2 text-sm" accept="image/*" />
                <small className="text-mute text-xs">Optionnel - JPG/PNG</small>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div><label className="text-xs font-bold text-mute uppercase block mb-1">Nom</label><input type="text" name="nom" className="w-full bg-surface-deep/30 border border-hairline rounded-lg p-2 text-sm" value={form.nom} onChange={handleChange} required /></div>
                <div><label className="text-xs font-bold text-mute uppercase block mb-1">Prénom</label><input type="text" name="prenom" className="w-full bg-surface-deep/30 border border-hairline rounded-lg p-2 text-sm" value={form.prenom} onChange={handleChange} required /></div>
              </div>

              <div className="mb-4"><label className="text-xs font-bold text-mute uppercase block mb-1">Email</label><input type="email" name="email" className="w-full bg-surface-deep/30 border border-hairline rounded-lg p-2 text-sm" value={form.email} onChange={handleChange} required /></div>
              <div className="mb-4"><label className="text-xs font-bold text-mute uppercase block mb-1">Téléphone</label><input type="tel" name="telephone" className="w-full bg-surface-deep/30 border border-hairline rounded-lg p-2 text-sm" value={form.telephone} onChange={handleChange} required /></div>
              <div className="mb-4"><label className="text-xs font-bold text-mute uppercase block mb-1">Ville</label><input type="text" name="ville" className="w-full bg-surface-deep/30 border border-hairline rounded-lg p-2 text-sm" value={form.ville} onChange={handleChange} required /></div>

              {role === 'enseignant' && (
                <>
                  <div className="mb-4"><label className="text-xs font-bold text-mute uppercase block mb-1">Matière</label><input type="text" name="matiere" className="w-full bg-surface-deep/30 border border-hairline rounded-lg p-2 text-sm" value={form.matiere} onChange={handleChange} required /></div>
                  <div className="mb-4"><label className="text-xs font-bold text-mute uppercase block mb-1">Tarif (DH/h)</label><input type="number" name="tarifHeure" className="w-full bg-surface-deep/30 border border-hairline rounded-lg p-2 text-sm" min="50" value={form.tarifHeure} onChange={handleChange} required /></div>
                  <div className="mb-4">
                    <label className="text-xs font-bold text-mute uppercase block mb-1">Modalités</label>
                    <div className="flex gap-4"><label className="flex items-center gap-2"><input type="checkbox" name="cours_enligne" checked={checkboxes.cours_enligne} onChange={(e) => setCheckboxes({...checkboxes, cours_enligne: e.target.checked})} /> En ligne</label>
                    <label className="flex items-center gap-2"><input type="checkbox" name="cours_domicile" checked={checkboxes.cours_domicile} onChange={(e) => setCheckboxes({...checkboxes, cours_domicile: e.target.checked})} /> À domicile</label>
                    <label className="flex items-center gap-2"><input type="checkbox" name="cours_deplacement" checked={checkboxes.cours_deplacement} onChange={(e) => setCheckboxes({...checkboxes, cours_deplacement: e.target.checked})} /> Déplacement</label></div>
                  </div>
                </>
              )}

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div><label className="text-xs font-bold text-mute uppercase block mb-1">Mot de passe</label><input type="password" name="password" className="w-full bg-surface-deep/30 border border-hairline rounded-lg p-2 text-sm" value={form.password} onChange={handleChange} required /></div>
                <div><label className="text-xs font-bold text-mute uppercase block mb-1">Confirmer</label><input type="password" name="password_confirmation" className="w-full bg-surface-deep/30 border border-hairline rounded-lg p-2 text-sm" value={form.password_confirmation} onChange={handleChange} required /></div>
              </div>

              <button type="submit" className="w-full bg-ink text-canvas py-3 rounded-lg font-bold text-sm hover:bg-ash transition-all">
                {role === 'enseignant' ? 'Étape suivante' : (loading ? 'Envoi...' : 'Créer mon compte')}
              </button>
            </>
          )}

          {role === 'enseignant' && step === 2 && (
            <>
              <div className="border border-hairline rounded-xl p-4 mb-4 bg-surface-deep/20">
                <p className="font-bold text-xs mb-3">DOCUMENTS REQUIS</p>
                <div className="mb-3"><label className="text-xs font-bold block mb-1">CIN Recto</label><input type="file" name="cin_recto" onChange={handleFile} accept="image/*" required /></div>
                <div className="mb-3"><label className="text-xs font-bold block mb-1">CIN Verso</label><input type="file" name="cin_verso" onChange={handleFile} accept="image/*" required /></div>
                <div><label className="text-xs font-bold block mb-1">Diplôme (PDF)</label><input type="file" name="diplome" onChange={handleFile} accept=".pdf" required /></div>
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(1)} className="flex-1 border border-hairline py-2 rounded-lg text-sm font-semibold">Retour</button>
                <button type="submit" className="flex-2 bg-ink text-canvas py-2 rounded-lg text-sm font-bold" disabled={loading}>{loading ? 'Envoi...' : 'Soumettre'}</button>
              </div>
            </>
          )}
        </form>

        <hr className="my-6 border-hairline" />
        <div className="text-center"><span className="text-xs text-mute">Déjà un compte ?</span> <Link to="/login" className="text-accent-orange text-xs font-bold">Se connecter</Link></div>
      </div>
    </div>
  );
}

export default Register;