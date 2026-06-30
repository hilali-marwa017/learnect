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

          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {soldeCard('Solde disponible', `${parseFloat(totalRevenu).toFixed(2)} MAD`, <><Check size={12} /> Prêt pour virement</>, '#16a34a')}
              {soldeCard('Cumul en cours', `${enAttente.toFixed(2)} MAD`, <><Clock size={12} /> En attente de validation</>, '#d97706')}
              {soldeCard('Total paiements', paiements.length, <><Download size={12} /> Depuis l'origine</>, '#2563eb')}
            </div>

            <div style={{ background: bgSurf, border: `1px solid ${border}`, borderRadius: '20px', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '0.8rem', fontWeight: 700, color: text, margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                <Landmark size={15} color="#e04f00" /> Configuration de virement (RIB Maroc)
              </h3>
              {saveSuccess && (
                <div style={{ padding: '10px 14px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '10px', color: '#16a34a', fontSize: '0.75rem', fontWeight: 700, marginBottom: '1rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <Save size={14} /> Coordonnées bancaires enregistrées.
                </div>
              )}
              <form onSubmit={handleSaveRIB} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: '1rem', alignItems: 'end' }}>
                <div>
                  <label style={labelStyle}>Nom de la Banque</label>
                  <input required type="text" value={bank} onChange={e => setBank(e.target.value)} placeholder="Ex: Attijariwafa Bank" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>RIB Maroc (24 chiffres)</label>
                  <input required type="text" value={rib} onChange={e => setRib(e.target.value)} placeholder="0000 0000 0000 0000 0000 0000" style={{ ...inputStyle, fontFamily: 'monospace' }} />
                </div>
                <button type="submit" style={{ padding: '10px 20px', borderRadius: '10px', background: isDark ? '#ffffff' : '#111827', color: isDark ? '#111827' : '#ffffff', border: 'none', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>ENREGISTRER</button>
              </form>
            </div>

            <div style={{ background: bgCard, border: `1px solid ${border}`, borderRadius: '20px', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '0.7rem', fontWeight: 700, color: text, fontFamily: 'monospace', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 1rem', paddingBottom: '1rem', borderBottom: `1px solid ${borderSub}` }}>
                Historique des virements émis
              </h3>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: muted, fontSize: '0.8rem' }}>Chargement...</div>
              ) : paiements.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: muted, fontSize: '0.8rem' }}>Aucun paiement enregistré.</div>
              ) : (
                <div>
                  {paiements.map((p, i) => (
                    <div key={p.id_paiement} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', padding: '14px 12px', borderRadius: '12px', borderBottom: i < paiements.length - 1 ? `1px solid ${borderSub}` : 'none', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: text }}>Paiement ref : #{p.id_paiement}</div>
                        <div style={{ fontSize: '0.75rem', color: muted }}>Etudiant : <span style={{ color: text, fontWeight: 700 }}>{p.reservation?.etudiant?.prenom} {p.reservation?.etudiant?.nom}</span></div>
                        <div style={{ fontSize: '0.7rem', color: muted, fontFamily: 'monospace' }}>Methode : {p.methode} — {p.created_at?.slice(0,10)}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '1rem', fontWeight: 800, color: text }}>{p.montantEnseignant} MAD</div>
                          {p.statut === 'paye'
                            ? <div style={{ fontSize: '0.65rem', color: '#16a34a', fontWeight: 700, fontFamily: 'monospace' }}>VIREMENT COMPLETE</div>
                            : <div style={{ fontSize: '0.65rem', color: '#d97706', fontWeight: 700, fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}><Clock size={10} /> EN COURS</div>
                          }
                        </div>
                        <button onClick={() => alert(`Telechargement recu #${p.id_paiement}`)} style={{ width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isDark ? 'rgba(255,255,255,0.04)' : '#f8f9fc', border: `1px solid ${border}`, borderRadius: '8px', color: muted, cursor: 'pointer' }}>
                          <Download size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}