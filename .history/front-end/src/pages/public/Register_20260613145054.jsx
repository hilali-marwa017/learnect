import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ArrowRight, BookOpen, GraduationCap, User, Mail, Lock, Phone, MapPin, Upload, FileText, CheckCircle, X } from 'lucide-react';

const MOROCCAN_CITIES = [
  'Casablanca', 'Rabat', 'Tanger', 'Marrakech', 'Fès', 'Agadir',
  'Oujda', 'Meknès', 'Kénitra', 'Tétouan', 'Salé', 'Mohammedia', 'Nador'
];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState(null);
  const [step, setStep] = useState(1);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Champs communs
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [telephone, setTelephone] = useState('');
  const [ville, setVille] = useState('Casablanca');

  // Champs enseignant
  const [cinRecto, setCinRecto] = useState(null);
  const [cinVerso, setCinVerso] = useState(null);
  const [diplome, setDiplome] = useState(null);

  const handleSelectRole = (role) => {
    setSelectedRole(role);
    setStep(1);
    setErrorMsg('');
  };

  const validateStep1 = () => {
    if (!nom.trim() || !prenom.trim() || !email.trim() || !password || !telephone.trim()) {
      setErrorMsg('Veuillez remplir tous les champs obligatoires.');
      return false;
    }
    if (!email.includes('@')) {
      setErrorMsg('Adresse email invalide.');
      return false;
    }
    if (password.length < 8) {
      setErrorMsg('Le mot de passe doit contenir au moins 8 caractères.');
      return false;
    }
    if (password !== passwordConfirm) {
      setErrorMsg('Les mots de passe ne correspondent pas.');
      return false;
    }
    return true;
  };

  const handleSubmitEtudiant = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!validateStep1()) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('nom', nom);
      formData.append('prenom', prenom);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('password_confirmation', passwordConfirm);
      formData.append('telephone', telephone);
      formData.append('ville', ville);
      formData.append('role', 'etudiant');

      const result = await register(formData);
      setSuccess(true);
      setTimeout(() => navigate('/student'), 1200);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = () => {
    setErrorMsg('');
    if (!validateStep1()) return;
    setStep(2);
  };

  const handleSubmitEnseignant = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!cinRecto || !cinVerso || !diplome) {
      setErrorMsg('Veuillez fournir le CIN recto/verso et le diplôme PDF.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('nom', nom);
      formData.append('prenom', prenom);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('password_confirmation', passwordConfirm);
      formData.append('telephone', telephone);
      formData.append('ville', ville);
      formData.append('role', 'enseignant');
      formData.append('cin_recto', cinRecto);
      formData.append('cin_verso', cinVerso);
      formData.append('diplome', diplome);

      await register(formData);
      setSuccess(true);
      setTimeout(() => navigate('/teacher'), 1200);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!selectedRole) {
    return (
      <div className="min-h-screen py-24 bg-canvas flex flex-col items-center justify-center px-6">
        <div className="max-w-3xl w-full text-center space-y-4 mb-12">
          <span className="text-xs uppercase tracking-[0.2em] font-caption text-accent-orange font-bold animate-pulse block">
            COMMENCEZ DÈS AUJOURD'HUI
          </span>
          <h1 className="font-display-lg text-4xl md:text-5xl text-ink leading-none font-bold">
            Rejoignez Learnect<span className="text-accent-orange font-bold">.ma</span>
          </h1>
          <p className="text-charcoal text-sm max-w-xl mx-auto">
            Sélectionnez votre profil d'inscription ci-dessous pour démarrer instantanément votre parcours pédagogique au Maroc.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
          <div
            onClick={() => handleSelectRole('etudiant')}
            className="bg-surface-card border border-hairline-strong rounded-2xl p-8 hover:border-accent-blue/40 hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-6">
              <div className="p-4 bg-accent-blue-glow rounded-xl w-fit border border-accent-blue/10 text-accent-blue">
                <BookOpen className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h3 className="font-heading-md text-xl text-ink font-extrabold group-hover:text-accent-blue transition-colors">
                  Je suis un Élève / Étudiant
                </h3>
                <p className="text-charcoal text-xs leading-relaxed">
                  Je souhaite trouver un professeur qualifié pour remonter mes notes et réussir mes examens.
                </p>
              </div>
              <ul className="space-y-2 text-mute text-xs font-semibold">
                <li className="flex items-center gap-2">✓ Annuaire d'enseignants accrédités</li>
                <li className="flex items-center gap-2">✓ Première heure de diagnostic offerte</li>
                <li className="flex items-center gap-2">✓ Messagerie privée sécurisée</li>
              </ul>
            </div>
            <button className="mt-8 bg-surface-deep/50 text-ink border border-hairline hover:bg-accent-blue hover:text-white hover:border-accent-blue p-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2">
              <span>M'inscrire comme Étudiant</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div
            onClick={() => handleSelectRole('enseignant')}
            className="bg-surface-card border border-hairline-strong rounded-2xl p-8 hover:border-accent-orange/40 hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-6">
              <div className="p-4 bg-accent-orange-glow rounded-xl w-fit border border-accent-orange/10 text-accent-orange">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h3 className="font-heading-md text-xl text-ink font-extrabold group-hover:text-accent-orange transition-colors">
                  Je suis un Enseignant / Tuteur
                </h3>
                <p className="text-charcoal text-xs leading-relaxed">
                  Je souhaite donner des cours de soutien scolaire, définir mes tarifs et gérer mes réservations.
                </p>
              </div>
              <ul className="space-y-2 text-mute text-xs font-semibold">
                <li className="flex items-center gap-2">✓ Visibilité auprès de milliers de familles</li>
                <li className="flex items-center gap-2">✓ Zéro commission d'engagement</li>
                <li className="flex items-center gap-2">✓ Panel d'administration des gains</li>
              </ul>
            </div>
            <button className="mt-8 bg-surface-deep/50 text-ink border border-hairline hover:bg-accent-orange hover:text-white hover:border-accent-orange p-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2">
              <span>M'inscrire comme Tuteur</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Formulaire d'inscription
  return (
    <div className="min-h-screen py-24 bg-canvas flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-2xl bg-surface-card border border-hairline-strong rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-hairline flex justify-between items-center bg-surface-elevated/40">
          <div>
            <h3 className="font-heading-md text-lg text-ink font-bold">
              {selectedRole === 'enseignant' ? 'Inscription Professeur' : 'Inscription Étudiant'}
            </h3>
            <p className="text-[10px] text-mute font-caption uppercase tracking-wider font-bold">
              {selectedRole === 'enseignant' ? `Étape ${step}/2` : 'Étape 1/1'}
            </p>
          </div>
          <button
            onClick={() => setSelectedRole(null)}
            className="p-1.5 rounded-full hover:bg-surface-elevated text-charcoal hover:text-ink transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="bg-accent-red/10 border-b border-accent-red/25 text-accent-red text-center py-3 text-xs font-semibold px-4">
            ⚠️ {errorMsg}
          </div>
        )}

        {success && (
          <div className="bg-accent-green/10 border-b border-accent-green/25 text-accent-green text-center py-3 text-xs font-semibold px-4">
            ✓ Inscription réussie ! Redirection...
          </div>
        )}

        <div className="p-6 space-y-5">
          
          {/* ÉTAPE 1 : Infos communes */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-mute uppercase font-caption tracking-wider font-bold block">Prénom</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-mute" />
                    <input type="text" required placeholder="Ex: Amine" value={prenom} onChange={(e) => setPrenom(e.target.value)}
                      className="w-full bg-surface-deep/30 border border-hairline-strong text-ink rounded-lg pl-9 p-2.5 text-xs focus:ring-1 focus:ring-accent-orange outline-none" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-mute uppercase font-caption tracking-wider font-bold block">Nom</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-mute" />
                    <input type="text" required placeholder="Ex: Benjelloun" value={nom} onChange={(e) => setNom(e.target.value)}
                      className="w-full bg-surface-deep/30 border border-hairline-strong text-ink rounded-lg pl-9 p-2.5 text-xs focus:ring-1 focus:ring-accent-orange outline-none" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-mute uppercase font-caption tracking-wider font-bold block">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-mute" />
                    <input type="email" required placeholder="votre@email.ma" value={email} onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-surface-deep/30 border border-hairline-strong text-ink rounded-lg pl-9 p-2.5 text-xs focus:ring-1 focus:ring-accent-orange outline-none" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-mute uppercase font-caption tracking-wider font-bold block">Téléphone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-mute" />
                    <input type="tel" required placeholder="+212 6XX XXX XXX" value={telephone} onChange={(e) => setTelephone(e.target.value)}
                      className="w-full bg-surface-deep/30 border border-hairline-strong text-ink rounded-lg pl-9 p-2.5 text-xs focus:ring-1 focus:ring-accent-orange outline-none" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-mute uppercase font-caption tracking-wider font-bold block">Mot de passe</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-mute" />
                    <input type="password" required placeholder="Min. 8 caractères" value={password} onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-surface-deep/30 border border-hairline-strong text-ink rounded-lg pl-9 p-2.5 text-xs focus:ring-1 focus:ring-accent-orange outline-none" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-mute uppercase font-caption tracking-wider font-bold block">Confirmer mot de passe</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-mute" />
                    <input type="password" required placeholder="Répétez le mot de passe" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)}
                      className="w-full bg-surface-deep/30 border border-hairline-strong text-ink rounded-lg pl-9 p-2.5 text-xs focus:ring-1 focus:ring-accent-orange outline-none" />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-mute uppercase font-caption tracking-wider font-bold block">Ville</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-mute" />
                  <select value={ville} onChange={(e) => setVille(e.target.value)}
                    className="w-full bg-surface-deep/30 border border-hairline-strong text-ink rounded-lg pl-9 p-2.5 text-xs focus:ring-1 focus:ring-accent-orange outline-none cursor-pointer">
                    {MOROCCAN_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-hairline flex justify-end">
                {selectedRole === 'etudiant' ? (
                  <button onClick={handleSubmitEtudiant} disabled={loading}
                    className="bg-ink text-canvas hover:bg-accent-blue hover:text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-60">
                    {loading ? 'Inscription...' : "Créer mon compte Étudiant"}
                  </button>
                ) : (
                  <button onClick={handleNextStep}
                    className="bg-ink text-canvas hover:bg-accent-orange hover:text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer">
                    Continuer →
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ÉTAPE 2 : Documents enseignant */}
          {step === 2 && selectedRole === 'enseignant' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <p className="text-xs text-charcoal leading-relaxed">
                Pour valider votre compte enseignant, veuillez fournir votre CIN recto/verso et votre diplôme en PDF.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* CIN Recto */}
                <div className="space-y-2 p-3.5 bg-surface-deep/30 border border-hairline-strong rounded-xl">
                  <span className="text-[11px] uppercase font-caption font-bold text-ink block">CIN (Recto) *</span>
                  <label className="relative border border-dashed border-hairline-strong rounded-lg h-24 flex flex-col items-center justify-center text-center p-3 hover:border-accent-orange/40 transition-colors cursor-pointer">
                    <input type="file" accept="image/*" onChange={(e) => setCinRecto(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" />
                    {cinRecto ? (
                      <span className="text-xs font-semibold text-accent-green flex items-center gap-1"><CheckCircle className="h-4 w-4" />{cinRecto.name}</span>
                    ) : (
                      <><Upload className="h-4 w-4 text-mute mb-1" /><span className="text-[10px] text-ink font-semibold">Télécharger le Recto</span></>
                    )}
                  </label>
                </div>

                {/* CIN Verso */}
                <div className="space-y-2 p-3.5 bg-surface-deep/30 border border-hairline-strong rounded-xl">
                  <span className="text-[11px] uppercase font-caption font-bold text-ink block">CIN (Verso) *</span>
                  <label className="relative border border-dashed border-hairline-strong rounded-lg h-24 flex flex-col items-center justify-center text-center p-3 hover:border-accent-orange/40 transition-colors cursor-pointer">
                    <input type="file" accept="image/*" onChange={(e) => setCinVerso(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" />
                    {cinVerso ? (
                      <span className="text-xs font-semibold text-accent-green flex items-center gap-1"><CheckCircle className="h-4 w-4" />{cinVerso.name}</span>
                    ) : (
                      <><Upload className="h-4 w-4 text-mute mb-1" /><span className="text-[10px] text-ink font-semibold">Télécharger le Verso</span></>
                    )}
                  </label>
                </div>
              </div>

              {/* Diplôme PDF */}
              <div className="space-y-2 p-3.5 bg-surface-deep/30 border border-hairline-strong rounded-xl">
                <span className="text-[11px] uppercase font-caption font-bold text-ink block">Diplôme (PDF uniquement) *</span>
                <label className="relative border border-dashed border-hairline-strong rounded-lg p-5 flex flex-col items-center justify-center text-center hover:border-accent-orange/40 transition-colors cursor-pointer">
                  <input type="file" accept="application/pdf" onChange={(e) => setDiplome(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" />
                  {diplome ? (
                    <span className="text-xs font-semibold text-accent-green flex items-center gap-1"><CheckCircle className="h-4 w-4" />{diplome.name}</span>
                  ) : (
                    <><FileText className="h-6 w-6 text-mute mb-2" /><span className="text-xs font-bold text-ink">Sélectionnez votre diplôme PDF</span></>
                  )}
                </label>
              </div>

              <div className="pt-4 border-t border-hairline flex justify-between">
                <button onClick={() => { setStep(1); setErrorMsg(''); }}
                  className="px-4 py-2.5 rounded-xl border border-hairline text-xs font-bold text-ink hover:bg-surface-elevated transition-colors cursor-pointer">
                  ← Retour
                </button>
                <button onClick={handleSubmitEnseignant} disabled={loading}
                  className="bg-ink text-canvas hover:bg-accent-orange hover:text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-60">
                  {loading ? 'Inscription...' : 'Soumettre ma candidature'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}