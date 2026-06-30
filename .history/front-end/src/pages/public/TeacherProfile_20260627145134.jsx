import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { MapPin, Star, Phone, MessageCircle, Calendar, Check, X, Clock } from 'lucide-react';

export default function TeacherProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const context = useOutletContext?.() || {};
  const isDark = context?.isDark || false;

  const bg      = isDark ? '#0a0a0c' : '#f8f9fc';
  const bgCard  = isDark ? '#1a1a1c' : '#ffffff';
  const border  = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const borderS = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  const text    = isDark ? '#ffffff' : '#111827';
  const muted   = isDark ? '#9ca3af' : '#6b7280';
  const inputBg = isDark ? 'rgba(255,255,255,0.05)' : '#ffffff';

  const [enseignant, setEnseignant]   = useState(null);
  const [creneaux, setCreneaux]       = useState([]);
  const [avis, setAvis]               = useState([]);
  const [loading, setLoading]         = useState(true);
  const [selectedCreneau, setSelectedCreneau] = useState(null);
  const [selectedDate, setSelectedDate]       = useState('');
  const [methode, setMethode]         = useState('simulation');
  const [reserving, setReserving]     = useState(false);
  const [reservedInfo, setReservedInfo] = useState(null);
  const [error, setError]             = useState('');

  useEffect(() => {
    async function fetchAll() {
      try {
        const [profRes, creneauxRes, avisRes] = await Promise.all([
          api.get('/enseignants/' + id),
          api.get('/enseignants/' + id + '/creneaux'),
          api.get('/enseignants/' + id + '/avis'),
        ]);
        setEnseignant(profRes.data);
        setCreneaux(creneauxRes.data || []);
        setAvis(avisRes.data || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    fetchAll();
  }, [id]);

  async function handleReserver() {
    if (!user) { navigate('/login'); return; }
    if (!selectedCreneau) { setError('Veuillez choisir un creneau.'); return; }
    if (!selectedDate) { setError('Veuillez choisir une date.'); return; }
    setReserving(true); setError('');
    try {
      const res = await api.post('/reservations', { id_creneau: selectedCreneau, date: selectedDate, methode: methode });
      setReservedInfo({ methode: methode, reservation: res.data.reservation });
    } catch (e) { setError(e.response?.data?.message || 'Erreur lors de la reservation.'); }
    finally { setReserving(false); }
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '36px', height: '36px', border: '4px solid #e04f00', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (!enseignant) return (
    <div style={{ minHeight: '100vh', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: muted }}>Professeur introuvable.</p>
    </div>
  );

  let photoSrc = 'https://ui-avatars.com/api/?background=e04f00&color=fff&name=' + (enseignant.user?.prenom || 'P');
  if (enseignant.user?.photo) {
    if (enseignant.user.photo.startsWith('http://') || enseignant.user.photo.startsWith('https://')) {
      photoSrc = enseignant.user.photo;
    } else {
      photoSrc = 'http://localhost:8000/storage/' + enseignant.user.photo;
    }
  }

  const disponibles = creneaux.filter(c => c.estDisponible);

  return (
    <div style={{ minHeight: '100vh', background: bg, paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

        <div style={{ background: bgCard, border: '1px solid ' + border, borderRadius: '20px', padding: '2rem', display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <div style={{ width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden',