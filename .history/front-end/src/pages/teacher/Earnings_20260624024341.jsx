import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { TeacherNavigationActive } from './Dashboard';
import { Landmark, Download, Clock, Save, X, Check } from 'lucide-react';
import api from '../../api/axios';

export default function TeacherEarnings() {
  const context = useOutletContext();
  const isDark = context?.isDark || false;

  const bg = isDark ? '#0a0a0c' : '#ffffff';
  const bgCard = isDark ? '#1a1a1c' : '#ffffff';
  const bgSurf = isDark ? '#1a1a1c' : '#f8f9fc';
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const borderSub = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  const text = isDark ? '#ffffff' : '#111827';
  const muted = isDark ? '#9ca3af' : '#6b7280';
  const inputBg = isDark ? 'rgba(255,255,255,0.05)' : '#f8f9fc';
  const inputBorder = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

  const inputStyle = { width: '100%', background: inputBg, border: `1px solid ${inputBorder}`, color: text, borderRadius: '10px', padding: '10px 12px', fontSize: '0.8rem', outline: 'none', boxSizing: 'border-box' };
  const labelStyle = { fontSize: '0.6rem', color: muted, fontWeight: 700, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' };

  const [paiements, setPaiements] = useState([]);
  const [totalRevenu, setTotalRevenu] = useState(0);
  const [loading, setLoading] = useState(true);
  const [rib, setRib] = useState('');
  const [bank, setBank] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    async function fetchRevenus() {
      try {
        const res = await api.get('/teacher/revenus');
        setPaiements(res.data.paiements || []);
        setTotalRevenu(res.data.total_revenu || 0);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    fetchRevenus();
  }, []);

  function handleSaveRIB(e) {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  }

  const enAttente = paiements.filter(p => p.statut === 'en_attente').reduce((s, p) => s + parseFloat(p.montantEnseignant || 0), 0);

  const soldeCard = (label, value, sub, subColor) => (
    <div style={{ background: bgCard, border: `1px solid ${border}`, borderRadius: '16px', padding: '1.5rem', flex: 1 }}>
      <div style={{ fontSize: '0.6rem', color: muted, fontWeight: 700, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>{label}</div>
      <div style={{ fontSize: '1.8rem', fontWeight: 900, color: text, marginBottom: '6px' }}>{loading ? '...' : value}</div>
      <div style={{ fontSize: '0.7rem', fontWeight: 700, color: subColor, display: 'flex', alignItems: 'center', gap: '4px' }}>{sub}</div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: bg, paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

        <div style={{ borderBottom: `1px solid ${border}`, paddingBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.65rem', color: '#e04f00', fontWeight: 700, fontFamily: 'monospace', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>LEARNECT PROF PLATFORM</div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: text, margin: '0 0 0.4rem', letterSpacing: '-0.02em' }}>Suivi Financier & Revenus</h1>
          <p style={{ fontSize: '0.8rem', color: muted, margin: 0 }}>Consultez vos gains et configurez vos coordonnées bancaires.</p>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <TeacherNavigationActive activeTab="earnings" isDark={isDark} />

          <div style={{ flex: 1,