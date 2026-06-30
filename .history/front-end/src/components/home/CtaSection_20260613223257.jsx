import React, { useState } from 'react';
import { Send, FileText, User, MapPin, BookOpen, Mail, Phone } from 'lucide-react';
import api from '../../api/axios';

export default function CtaSection({ isDark }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    matiere: '',
    niveau: '',
    ville: '',
    budget: '',
    description: '',
    nom: '',
    email: '',
    telephone: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const bg = isDark ? '#06060a' : '#f7f8fa';
  const bgCard = isDark ? '#1a1a1a' : '#ffffff';
  const textColor = isDark ? '#ffffff' : '#07090d';
  const textMuted = isDark ? '#a1a4a5' : '#718096';
  const border = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const orange = '#e04f00';
  const blue = '#1c64f2';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Envoyer la demande à l'API
      await api.post('/demandes', formData);
      setSubmitted(true);
      setTimeout(() => {
        setShowForm(false);
        setSubmitted(false);
        setFormData({
          matiere: '', niveau: '', ville: '', budget: '', description: '', nom: '', email: '', telephone: ''
        });
      }, 3000);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    }
  };

  const niveaux = ['Primaire', 'Collège', 'Lycée', 'Baccalauréat', 'Université', 'Autre'];

  return (
    <section style={{ background: bg, padding: '4rem 2rem', borderTop: `1px solid ${border}`, borderBottom: `1px solid ${border}` }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
        {/* Bannière principale */}
        <div style={{
          background: `linear-gradient(135deg, ${orange}15 0%, ${blue}15 100%)`,
          borderRadius: 24,
          padding: '3rem 2rem',
          border: `1px solid ${border}`
        }}>
          <FileText size={48} color={orange} style={{ marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: textColor, marginBottom: '1rem' }}>
            Vous cherchez un professeur ?
          </h2>
          <p style={{ color: textMuted, maxWidth: 500, margin: '0 auto 1.5rem' }}>
            Publiez votre demande gratuitement et recevez des propositions de tuteurs qualifiés près de chez vous.
          </p>
          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              background: orange,
              color: '#fff',
              border: 'none',
              borderRadius: 50,
              padding: '0.8rem 2rem',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <Send size={18} />
            Publier une demande
          </button>
        </div>

        {/* Formulaire de demande */}
        {showForm && !submitted && (
          <div style={{
            background: bgCard,
            border: `1px solid ${border}`,
            borderRadius: 20,
            padding: '2rem',
            marginTop: '2rem',
            textAlign: 'left'
          }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: textColor, marginBottom: '1.5rem', textAlign: 'center' }}>
              Détails de votre demande
            </h3>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: textMuted, display: 'block', marginBottom: '0.3rem' }}>
                  <BookOpen size={14} style={{ display: 'inline', marginRight: 4 }} /> Matière *
                </label>
                <input
                  type="text"
                  name="matiere"
                  value={formData.matiere}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: '0.7rem', background: isDark ? '#2a2a2a' : '#f1f3f5', border: `1px solid ${border}`, borderRadius: 8, color: textColor }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: textMuted, display: 'block', marginBottom: '0.3rem' }}>Niveau *</label>
                <select
                  name="niveau"
                  value={formData.niveau}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: '0.7rem', background: isDark ? '#2a2a2a' : '#f1f3f5', border: `1px solid ${border}`, borderRadius: 8, color: textColor }}
                >
                  <option value="">Sélectionner</option>
                  {niveaux.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: textMuted, display: 'block', marginBottom: '0.3rem' }}>
                  <MapPin size={14} style={{ display: 'inline', marginRight: 4 }} /> Ville *
                </label>
                <input
                  type="text"
                  name="ville"
                  value={formData.ville}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: '0.7rem', background: isDark ? '#2a2a2a' : '#f1f3f5', border: `1px solid ${border}`, borderRadius: 8, color: textColor }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: textMuted, display: 'block', marginBottom: '0.3rem' }}>Budget max (MAD/h)</label>
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '0.7rem', background: isDark ? '#2a2a2a' : '#f1f3f5', border: `1px solid ${border}`, borderRadius: 8, color: textColor }}
                />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: '0.8rem', color: textMuted, display: 'block', marginBottom: '0.3rem' }}>Description de votre besoin</label>
                <textarea
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '0.7rem', background: isDark ? '#2a2a2a' : '#f1f3f5', border: `1px solid ${border}`, borderRadius: 8, color: textColor }}
                  placeholder="Décrivez votre niveau, vos objectifs, vos disponibilités..."
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: textMuted, display: 'block', marginBottom: '0.3rem' }}>
                  <User size={14} style={{ display: 'inline', marginRight: 4 }} /> Votre nom *
                </label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: '0.7rem', background: isDark ? '#2a2a2a' : '#f1f3f5', border: `1px solid ${border}`, borderRadius: 8, color: textColor }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: textMuted, display: 'block', marginBottom: '0.3rem' }}>
                  <Mail size={14} style={{ display: 'inline', marginRight: 4 }} /> Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: '0.7rem', background: isDark ? '#2a2a2a' : '#f1f3f5', border: `1px solid ${border}`, borderRadius: 8, color: textColor }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: textMuted, display: 'block', marginBottom: '0.3rem' }}>
                  <Phone size={14} style={{ display: 'inline', marginRight: 4 }} /> Téléphone
                </label>
                <input
                  type="tel"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '0.7rem', background: isDark ? '#2a2a2a' : '#f1f3f5', border: `1px solid ${border}`, borderRadius: 8, color: textColor }}
                />
              </div>
              <div style={{ gridColumn: 'span 2', display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  style={{ padding: '0.7rem 2rem', background: 'transparent', border: `1px solid ${border}`, borderRadius: 50, cursor: 'pointer', color: textMuted }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  style={{ padding: '0.7rem 2rem', background: orange, border: 'none', borderRadius: 50, cursor: 'pointer', color: '#fff', fontWeight: 'bold' }}
                >
                  Envoyer ma demande
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Message de succès */}
        {submitted && (
          <div style={{
            background: bgCard,
            border: `2px solid ${green}`,
            borderRadius: 16,
            padding: '1.5rem',
            marginTop: '2rem',
            textAlign: 'center'
          }}>
            <CheckCircle size={48} color={green} style={{ marginBottom: '1rem' }} />
            <h3 style={{ color: textColor, marginBottom: '0.5rem' }}>Demande envoyée avec succès !</h3>
            <p style={{ color: textMuted }}>Nos tuteurs vont recevoir votre demande et vous contacteront bientôt.</p>
          </div>
        )}
      </div>
    </section>
  );
}