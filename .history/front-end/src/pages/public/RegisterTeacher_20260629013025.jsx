// ============================================================
// RegisterTeacher.jsx
// Composant : Inscription Tuteur (2 étapes)
// Fonctionnalités : Formulaire inscription avec documents
// Hooks utilisés : useState, useEffect, useNavigate, useOutletContext
// ============================================================

import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useOutletContext } from 'react-router-dom';
import {
  GraduationCap, User, Mail, Lock, Phone, MapPin, BookOpen,
  Wallet, FileText, ArrowRight, CheckCircle, File, Shield,
  Eye, EyeOff, X, Navigation
} from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

// --- Villes du Maroc ---
const MOROCCAN_CITIES = [
  'Casablanca', 'Rabat', 'Tanger', 'Marrakech', 'Fès', 'Agadir',
  'Oujda', 'Meknès', 'Kénitra', 'Tétouan', 'Salé', 'Mohammédia', 'Nador'
];

// ============================================================
// COMPOSANT PRINCIPAL
// ============================================================
export default function RegisterTeacher() {
  // --- Hooks de navigation et contexte ---
  const navigate = useNavigate();
  const context = useOutletContext();
  const isDark = context?.isDark || false;
  const { registerMultipart } = useAuth();

  // ============================================================
  // SECTION 1 : VARIABLES DE STYLE (Thème dynamique)
  // ============================================================
  const orange    = '#e04f00';
  const bgPage    = isDark ? '#0a0a0c' : '#ffffff';
  const text      = isDark ? '#ffffff' : '#07090d';
  const muted     = isDark ? '#a1a4a5' : '#718096';
  const border    = isDark ? 'rgba(255,255,255,0.08)' : '#0000001a';
  const card      = isDark ? '#1a1a1c' : '#f8f9fc';
  const bgInput   = isDark ? '#1a1a1c' : '#ffffff';
  const iconColor = isDark ? '#6b7280' : '#9ca3af';
  const dropBg    = isDark ? '#1a1a1c' : '#ffffff';
  const dropHover = isDark ? '#2a2a2a' : '#f5f5f5';

  // --- Styles réutilisables ---
  const inputStyle = {
    width: '100%',
    padding: '14px 14px 14px 42px',
    background: bgInput,
    border: '1px solid ' + border,
    borderRadius: '10px',
    color: text,
    fontSize: '0.85rem',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit'
  };
  const labelStyle = {
    display: 'block',
    fontSize: '0.7rem',
    fontWeight: 700,
    color: iconColor,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: '6px'
  };
  const iconStyle = {
    position: 'absolute',
    left: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    pointerEvents: 'none',
    color: iconColor
  };

  // ============================================================
  // SECTION 2 : STATES (useState)
  // ============================================================
  // --- Étapes et UI ---
  const [step, setStep]             = useState(1);
  const [error, setError]           = useState('');
  const [loading, setLoading]       = useState(false);
  const [success, setSuccess]       = useState(false);
  const [showCityDrop, setShowCityDrop] = useState(false);
  const [villes, setVilles]         = useState(MOROCCAN_CITIES);
  const [showPass, setShowPass]     = useState(false);
  const [showPass2, setShowPass2]   = useState(false);

  // --- Données du formulaire ---
  const [form, setForm] = useState({
    nom: '', prenom: '', email: '', telephone: '', ville: '',
    password: '', password_confirmation: '',
    titre: '', tarifHeure: '', langues: '',
    description_profil: '', description_cours: '',
    distance_max: ''  // ← NOUVEAU CHAMP
  });

  // --- Checkboxes ---
  const [checkboxes, setCheckboxes] = useState({
    cours_enligne: false,
    cours_domicile: false,
    cours_deplacement: false,
    certifie: false
  });

  // --- Fichiers ---
  const [files, setFiles] = useState({
    photo: null,
    cin_recto: null,
    cin_verso: null,
    diplome: null
  });

  // ============================================================
  // SECTION 3 : EFFETS (useEffect)
  // ============================================================
  useEffect(() => {
    api.get('/villes')
      .then(res => {
        const noms = res.data.map(v => v.nom || v).filter(Boolean);
        if (noms.length > 0) setVilles(noms);
      })
      .catch(() => {});
  }, []);

  // ============================================================
  // SECTION 4 : FONCTIONS UTILITAIRES
  // ============================================================
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleCheckbox(e) {
    setCheckboxes({ ...checkboxes, [e.target.name]: e.target.checked });
  }

  function handleFile(e) {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  }

  function handleCitySelect(city) {
    setForm({ ...form, ville: city });
    setShowCityDrop(false);
  }

  function getFilteredCities() {
    if (!form.ville) return villes.slice(0, 8);
    return villes
      .filter(c => c.toLowerCase().includes(form.ville.toLowerCase()))
      .slice(0, 8);
  }

  // ============================================================
  // SECTION 5 : VALIDATION ÉTAPE 1
  // ============================================================
  function validateStep1() {
    if (!form.prenom.trim())          { setError('Prénom requis.'); return false; }
    if (!form.nom.trim())             { setError('Nom requis.'); return false; }
    if (!form.email.includes('@'))    { setError('Email invalide.'); return false; }
    if (!form.telephone.trim())       { setError('Téléphone requis.'); return false; }
    if (!form.ville.trim())           { setError('Ville requise.'); return false; }
    if (!form.password)               { setError('Mot de passe requis.'); return false; }
    if (form.password !== form.password_confirmation) {
      setError('Les mots de passe ne correspondent pas.');
      return false;
    }
    if (form.password.length < 8)     { setError('Mot de passe minimum 8 caractères.'); return false; }
    if (!form.titre.trim())           { setError('Titre requis.'); return false; }
    if (!form.tarifHeure || form.tarifHeure < 50) {
      setError('Tarif minimum 50 DH/h.');
      return false;
    }

    // ← VALIDATION DISTANCE : si cours_domicile coché, distance_max requise
    if (checkboxes.cours_domicile) {
      if (!form.distance_max || Number(form.distance_max) <= 0) {
        setError('Distance maximale requise pour les cours à domicile.');
        return false;
      }
    }

    setError('');
    return true;
  }

  function handleNext() {
    if (validateStep1()) {
      setStep(2);
      window.scrollTo(0, 0);
    }
  }

  function handleBack() {
    setStep(1);
    window.scrollTo(0, 0);
  }

  // ============================================================
  // SECTION 6 : SOUMISSION FINALE
  // ============================================================
  async function handleSubmit(e) {
    e.preventDefault();

    if (step === 1) {
      handleNext();
      return;
    }

    // Validation étape 2
    if (!files.cin_recto)     { setError('CIN recto requis.'); return; }
    if (!files.cin_verso)     { setError('CIN verso requis.'); return; }
    if (!files.diplome)       { setError('Diplôme requis.'); return; }
    if (!checkboxes.certifie) { setError('Vous devez certifier les informations.'); return; }

    setLoading(true);
    setError('');

    // Construction FormData
    const formData = new FormData();

    // --- Champs texte ---
    Object.keys(form).forEach(key => {
      if (form[key]) formData.append(key, form[key]);
    });

    // --- Rôle ---
    formData.append('role', 'enseignant');

    // --- Checkboxes (boolean → '1'/'0') ---
    formData.append('cours_enligne',     checkboxes.cours_enligne     ? '1' : '0');
    formData.append('cours_domicile',    checkboxes.cours_domicile    ? '1' : '0');
    formData.append('cours_deplacement', checkboxes.cours_deplacement ? '1' : '0');

    // --- Fichiers ---
    if (files.photo)      formData.append('photo', files.photo);
    formData.append('cin_recto', files.cin_recto);
    formData.append('cin_verso', files.cin_verso);
    formData.append('diplome',   files.diplome);

    try {
      const result = await registerMultipart(formData);
      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.message || "Erreur lors de l'inscription");
      }
    } catch (err) {
      setError("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  }

  // ============================================================
  // SECTION 7 : RENDU SUCCÈS
  // ============================================================
  if (success) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: bgPage,
        padding: '2rem'
      }}>
        <div style={{
          background: bgPage,
          border: '1px solid ' + border,
          borderRadius: '24px',
          padding: '2.5rem',
          textAlign: 'center',
          maxWidth: '460px',
          width: '100%'
        }}>
          <div style={{
            width: '72px',
            height: '72px',
            background: 'rgba(245,158,11,0.1)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            border: '2px solid rgba(245,158,11,0.3)'
          }}>
            <CheckCircle size={36} color="#d97706" />
          </div>
          <div style={{
            fontSize: '0.65rem',
            color: '#d97706',
            fontWeight: 700,
            fontFamily: 'monospace',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: '0.75rem'
          }}>
            DOSSIER SOUMIS AVEC SUCCÈS
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '0.75rem', color: text }}>
            Candidature en cours de vérification
          </h2>
          <p style={{ color: muted, marginBottom: '0.75rem', fontSize: '0.85rem', lineHeight: 1.6 }}>
            Notre équipe va examiner votre dossier (CIN + diplôme) sous{' '}
            <strong style={{ color: text }}>24h ouvrables</strong>.
          </p>
          <p style={{ color: muted, marginBottom: '2rem', fontSize: '0.82rem', lineHeight: 1.6 }}>
            Une fois validé par l'administrateur, vous pourrez vous connecter et accéder à votre espace enseignant.
          </p>
          <div style={{
            background: isDark ? 'rgba(245,158,11,0.06)' : 'rgba(245,158,11,0.04)',
            border: '1px solid rgba(245,158,11,0.2)',
            borderRadius: '12px',
            padding: '1rem',
            marginBottom: '1.5rem'
          }}>
            <p style={{ fontSize: '0.75rem', color: muted, margin: 0, lineHeight: 1.6 }}>
              En attendant la validation, la connexion à votre compte sera bloquée. Vous recevrez une notification une fois le dossier traité.
            </p>
          </div>
          <Link to="/login" style={{
            display: 'inline-block',
            background: orange,
            color: '#fff',
            padding: '12px 28px',
            borderRadius: '40px',
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: '0.85rem',
            fontFamily: 'monospace'
          }}>
            Retour à la connexion
          </Link>
        </div>
      </div>
    );
  }

  // ============================================================
  // SECTION 8 : RENDU FORMULAIRE
  // ============================================================
  return (
    <div style={{
      minHeight: '100vh',
      background: bgPage,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '560px',
        background: bgPage,
        borderRadius: '24px',
        overflow: 'hidden',
        border: '1px solid ' + border
      }}>

        {/* --- Header : bouton fermer --- */}
        <div style={{
          padding: '1.5rem 2rem 0.5rem 2rem',
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '8px',
              color: iconColor
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* --- Contenu --- */}
        <div style={{ padding: '0 2rem 2rem 2rem' }}>
          {/* Titre + progression */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '0.5rem'
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                background: orange + '15',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <BookOpen size={18} color={orange} />
              </div>
              <div>
                <h1 style={{
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  color: text,
                  margin: 0
                }}>
                  Inscription Tuteur
                </h1>
                <p style={{ fontSize: '0.72rem', color: muted, margin: 0 }}>
                  Étape {step} sur 2 — {step === 1 ? 'Identité et Pédagogie' : 'Documents et Vérification'}
                </p>
              </div>
            </div>
            {/* Barre de progression */}
            <div style={{ display: 'flex', gap: '6px', marginTop: '1rem' }}>
              {[1, 2].map(s => (
                <div
                  key={s}
                  style={{
                    flex: 1,
                    height: '3px',
                    borderRadius: '99px',
                    background: step >= s ? orange : (isDark ? '#333' : '#e2e8f0'),
                    transition: 'background 0.3s'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Message d'erreur */}
          {error && (
            <div style={{
              background: 'rgba(220,38,38,0.08)',
              border: '1px solid rgba(220,38,38,0.2)',
              borderRadius: '10px',
              color: '#dc2626',
              fontSize: '0.82rem',
              padding: '10px 16px',
              marginBottom: '1rem'
            }}>
              <Shield size={14} style={{
                display: 'inline',
                marginRight: '8px',
                verticalAlign: 'middle'
              }} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* ================================================= */}
            {/* ÉTAPE 1 : Identité et Pédagogie */}
            {/* ================================================= */}
            {step === 1 && (
              <>

                {/* --- Prénom + Nom --- */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem',
                  marginBottom: '1rem'
                }}>
                  <div>
                    <label style={labelStyle}>PRÉNOM</label>
                    <div style={{ position: 'relative' }}>
                      <User size={16} style={iconStyle} />
                      <input
                        style={inputStyle}
                        type="text"
                        name="prenom"
                        value={form.prenom}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>NOM</label>
                    <div style={{ position: 'relative' }}>
                      <User size={16} style={iconStyle} />
                      <input
                        style={inputStyle}
                        type="text"
                        name="nom"
                        value={form.nom}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* --- Email --- */}
                <div style={{ marginBottom: '1rem' }}>
                  <label style={labelStyle}>ADRESSE EMAIL</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={iconStyle} />
                    <input
                      style={inputStyle}
                      type="email"
                      name="email"
                      placeholder="votre.email@domain.ma"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* --- Téléphone + Ville --- */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem',
                  marginBottom: '1rem'
                }}>
                  <div>
                    <label style={labelStyle}>TÉLÉPHONE</label>
                    <div style={{ position: 'relative' }}>
                      <Phone size={16} style={iconStyle} />
                      <input
                        style={inputStyle}
                        type="tel"
                        name="telephone"
                        value={form.telephone}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>VILLE PRINCIPALE</label>
                    <div style={{ position: 'relative' }}>
                      <MapPin size={16} style={iconStyle} />
                      <input
                        value={form.ville}
                        onChange={e => setForm({ ...form, ville: e.target.value })}
                        onFocus={() => setShowCityDrop(true)}
                        onBlur={() => setTimeout(() => setShowCityDrop(false), 200)}
                        placeholder="Sélectionnez votre ville"
                        style={{ ...inputStyle, cursor: 'text' }}
                      />
                      {showCityDrop && getFilteredCities().length > 0 && (
                        <div style={{
                          position: 'absolute',
                          top: '100%',
                          left: 0,
                          right: 0,
                          marginTop: '8px',
                          background: dropBg,
                          border: '1px solid ' + border,
                          borderRadius: '12px',
                          zIndex: 200,
                          maxHeight: '250px',
                          overflowY: 'auto',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}>
                          {getFilteredCities().map((city, i) => (
                            <div
                              key={i}
                              onMouseDown={() => handleCitySelect(city)}
                              style={{
                                padding: '10px 16px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                color: text,
                                fontSize: '0.85rem'
                              }}
                              onMouseEnter={e => e.currentTarget.style.background = dropHover}
                              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            >
                              <MapPin size={14} color={orange} /> {city}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* --- Mot de passe + Confirmation --- */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem',
                  marginBottom: '1rem'
                }}>
                  <div>
                    <label style={labelStyle}>MOT DE PASSE</label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={16} style={iconStyle} />
                      <input
                        style={inputStyle}
                        type={showPass ? 'text' : 'password'}
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        style={{
                          position: 'absolute',
                          right: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: iconColor
                        }}
                      >
                        {showPass ? <Eye size={14} /> : <EyeOff size={14} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>CONFIRMER</label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={16} style={iconStyle} />
                      <input
                        style={inputStyle}
                        type={showPass2 ? 'text' : 'password'}
                        name="password_confirmation"
                        value={form.password_confirmation}
                        onChange={handleChange}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass2(!showPass2)}
                        style={{
                          position: 'absolute',
                          right: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: iconColor
                        }}
                      >
                        {showPass2 ? <Eye size={14} /> : <EyeOff size={14} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* --- Titre --- */}
                <div style={{ marginBottom: '1rem' }}>
                  <label style={labelStyle}>TITRE DE VOTRE ANNONCE</label>
                  <div style={{ position: 'relative' }}>
                    <FileText size={16} style={iconStyle} />
                    <input
                      style={inputStyle}
                      type="text"
                      name="titre"
                      placeholder="Ex: Professeur de Mathématiques CPGE"
                      value={form.titre}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* --- Tarif + Langues --- */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem',
                  marginBottom: '1rem'
                }}>
                  <div>
                    <label style={labelStyle}>TARIF / HEURE (MAD)</label>
                    <div style={{ position: 'relative' }}>
                      <Wallet size={16} style={iconStyle} />
                      <input
                        style={inputStyle}
                        type="number"
                        name="tarifHeure"
                        min="50"
                        placeholder="150"
                        value={form.tarifHeure}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>LANGUES</label>
                    <div style={{ position: 'relative' }}>
                      <FileText size={16} style={iconStyle} />
                      <input
                        style={inputStyle}
                        type="text"
                        name="langues"
                        placeholder="Français, Arabe"
                        value={form.langues}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                {/* ================================================= */}
                {/* MODALITÉS DE COURS + DISTANCE MAX (NOUVEAU) */}
                {/* ================================================= */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={labelStyle}>MODALITÉS DE COURS</label>
                  <div style={{
                    display: 'flex',
                    gap: '0.75rem',
                    flexWrap: 'wrap'
                  }}>
                    {[
                      { name: 'cours_enligne',     label: 'En ligne' },
                      { name: 'cours_domicile',    label: 'À domicile' },
                      { name: 'cours_deplacement', label: 'Déplacement' }
                    ].map(opt => (
                      <label
                        key={opt.name}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '8px 14px',
                          background: card,
                          border: '1px solid ' + border,
                          borderRadius: '10px',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          color: text
                        }}
                      >
                        <input
                          type="checkbox"
                          name={opt.name}
                          checked={checkboxes[opt.name]}
                          onChange={handleCheckbox}
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>

                  {/* --- Champ Distance Max (affiché si cours_domicile coché) --- */}
                  {checkboxes.cours_domicile && (
                    <div style={{ marginTop: '1rem' }}>
                      <label style={labelStyle}>DISTANCE MAXIMALE (KM)</label>
                      <div style={{ position: 'relative' }}>
                        <Navigation size={16} style={iconStyle} />
                        <input
                          style={inputStyle}
                          type="number"
                          name="distance_max"
                          min="1"
                          placeholder="Ex: 10"
                          value={form.distance_max}
                          onChange={handleChange}
                          required={checkboxes.cours_domicile}
                        />
                      </div>
                      <p style={{
                        fontSize: '0.7rem',
                        color: muted,
                        marginTop: '4px',
                        marginBottom: 0
                      }}>
                        Distance maximale que vous acceptez de parcourir pour un cours à domicile
                      </p>
                    </div>
                  )}
                </div>

                {/* --- Description profil --- */}
                <div style={{ marginBottom: '1rem' }}>
                  <label style={labelStyle}>DESCRIPTION DE VOTRE PROFIL</label>
                  <textarea
                    name="description_profil"
                    rows="3"
                    placeholder="Présentez votre parcours, votre expérience..."
                    value={form.description_profil}
                    onChange={handleChange}
                    style={{ ...inputStyle, padding: '12px', resize: 'none', color: text }}
                    required
                  />
                </div>

                {/* --- Description cours --- */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={labelStyle}>DESCRIPTION DE VOTRE COURS</label>
                  <textarea
                    name="description_cours"
                    rows="3"
                    placeholder="Décrivez votre méthode pédagogique..."
                    value={form.description_cours}
                    onChange={handleChange}
                    style={{ ...inputStyle, padding: '12px', resize: 'none', color: text }}
                  />
                </div>

                {/* --- Bouton continuer --- */}
                <button
                  type="submit"
                  style={{
                    width: '100%',
                    background: orange,
                    color: '#fff',
                    border: 'none',
                    borderRadius: '40px',
                    padding: '14px',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  Continuer <ArrowRight size={16} />
                </button>
              </>
            )}

            {/* ================================================= */}
            {/* ÉTAPE 2 : Documents et Vérification */}
            {/* ================================================= */}
            {step === 2 && (
              <>

                {/* --- Bloc documents --- */}
                <div style={{
                  background: card,
                  border: '1px solid ' + border,
                  borderRadius: '16px',
                  padding: '1.5rem',
                  marginBottom: '1.5rem'
                }}>
                  <p style={{
                    fontWeight: 700,
                    marginBottom: '1rem',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: text
                  }}>
                    <File size={16} color={orange} /> DOCUMENTS REQUIS
                  </p>

                  {/* Photo */}
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={labelStyle}>PHOTO DE PROFIL (optionnelle)</label>
                    <input
                      type="file"
                      name="photo"
                      onChange={handleFile}
                      accept="image/*"
                      style={{
                        ...inputStyle,
                        paddingLeft: '14px',
                        paddingTop: '10px',
                        paddingBottom: '10px'
                      }}
                    />
                  </div>

                  {/* CIN Recto */}
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={labelStyle}>CIN RECTO (image)</label>
                    <input
                      type="file"
                      name="cin_recto"
                      onChange={handleFile}
                      accept="image/*"
                      required
                      style={{
                        ...inputStyle,
                        paddingLeft: '14px',
                        paddingTop: '10px',
                        paddingBottom: '10px'
                      }}
                    />
                  </div>

                  {/* CIN Verso */}
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={labelStyle}>CIN VERSO (image)</label>
                    <input
                      type="file"
                      name="cin_verso"
                      onChange={handleFile}
                      accept="image/*"
                      required
                      style={{
                        ...inputStyle,
                        paddingLeft: '14px',
                        paddingTop: '10px',
                        paddingBottom: '10px'
                      }}
                    />
                  </div>

                  {/* Diplôme */}
                  <div>
                    <label style={labelStyle}>DIPLÔME (PDF)</label>
                    <input
                      type="file"
                      name="diplome"
                      onChange={handleFile}
                      accept=".pdf"
                      required
                      style={{
                        ...inputStyle,
                        paddingLeft: '14px',
                        paddingTop: '10px',
                        paddingBottom: '10px'
                      }}
                    />
                  </div>
                </div>

                {/* --- Certification --- */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                    color: text
                  }}>
                    <input
                      type="checkbox"
                      name="certifie"
                      checked={checkboxes.certifie}
                      onChange={handleCheckbox}
                      required
                    />
                    <span style={{ fontSize: '0.85rem' }}>
                      Je certifie que les informations fournies sont exactes et vérifiables
                    </span>
                  </label>
                </div>

                {/* --- Boutons navigation --- */}
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    type="button"
                    onClick={handleBack}
                    style={{
                      flex: 1,
                      background: 'transparent',
                      border: '1px solid ' + border,
                      borderRadius: '40px',
                      padding: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      color: text
                    }}
                  >
                    Retour
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      flex: 2,
                      background: orange,
                      color: '#fff',
                      border: 'none',
                      borderRadius: '40px',
                      padding: '12px',
                      fontWeight: 700,
                      cursor: loading ? 'not-allowed' : 'pointer',
                      opacity: loading ? 0.7 : 1
                    }}
                  >
                    {loading ? 'Envoi en cours...' : 'Soumettre mon dossier'}
                  </button>
                </div>
              </>
            )}
          </form>

          {/* --- Lien connexion --- */}
          <hr style={{ margin: '1.5rem 0 1rem', borderColor: border }} />
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: muted }}>Déjà un compte ?</span>
            <Link to="/login" style={{
              color: orange,
              fontSize: '0.8rem',
              fontWeight: 600,
              textDecoration: 'none',
              marginLeft: '4px'
            }}>
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}