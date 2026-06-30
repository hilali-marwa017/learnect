import React, { useState, useEffect } from 'react';
import { TeacherNavigationActive } from './Dashboard';
import { Landmark, Download, Clock } from 'lucide-react';
import api from '../../api/axios';

export default function TeacherEarnings() {
  const [paiements, setPaiements] = useState([]);
  const [totalRevenu, setTotalRevenu] = useState(0);
  const [loading, setLoading] = useState(true);
  const [rib, setRib] = useState('');
  const [bank, setBank] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const inputStyle = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#ffffff', borderRadius: '10px', padding: '10px 12px', fontSize: '0.8rem', outline: 'none', boxSizing: 'border-box' };
  const labelStyle = { fontSize: '0.6rem', color: '#6b7280', fontWeight: 700, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' };

  useEffect(() => {
    async function fetchRevenus() {
      try {
        const res = await api.get('/paiements/enseignant/revenus');
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
    <div style={{ background: '#1a1a1c', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.5rem', flex: 1 }}>
      <div style={{ fontSize: '0.6rem', color: '#6b7280', fontWeight: 700, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>{label}</div>
      <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ffffff', marginBottom: '6px' }}>{loading ? '...' : value}</div>
      <div style={{ fontSize: '0.7rem', fontWeight: 700, color: subColor, display: 'flex', alignItems: 'center', gap: '4px' }}>{sub}</div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0c', paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

        <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.65rem', color: '#e04f00', fontWeight: 700, fontFamily: 'monospace', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>LEARNECT PROF PLATFORM</div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#ffffff', margin: '0 0 0.4rem', letterSpacing: '-0.02em' }}>Suivi Financier & Revenus</h1>
          <p style={{ fontSize: '0.8rem', color: '#9ca3af', margin: 0 }}>Consultez en temps réel vos gains scolaires, configurez vos coordonnées bancaires pour le virement automatique de vos heures.</p>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <TeacherNavigationActive activeTab="earnings" />

          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Soldes */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {soldeCard('Solde disponible', `${parseFloat(totalRevenu).toFixed(2)} MAD`, '✓ Prêt pour virement', '#4ade80')}
              {soldeCard('Cumul en cours', `${enAttente.toFixed(2)} MAD`, <><Clock size={12} /> En attente de validation</>, '#fbbf24')}
              {soldeCard('Total paiements', paiements.length, '✓ Depuis l\'origine', '#60a5fa')}
            </div>

            {/* RIB */}
            <div style={{ background: '#1a1a1c', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ffffff', margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                <Landmark size={15} color="#e04f00" />Configuration de virement (RIB Maroc)
              </h3>
              {saveSuccess && <div style={{ padding: '10px 14px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '10px', color: '#4ade80', fontSize: '0.75rem', fontWeight: 700, marginBottom: '1rem', textAlign: 'center' }}>✓ Coordonnées bancaires enregistrées. Les virements hebdomadaires s'effectueront sur ce compte.</div>}
              <form onSubmit={handleSaveRIB} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: '1rem', alignItems: 'end' }}>
                <div>
                  <label style={labelStyle}>Nom de la Banque</label>
                  <input required type="text" value={bank} onChange={e => setBank(e.target.value)} placeholder="Ex: Attijariwafa Bank" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>RIB Maroc (24 chiffres)</label>
                  <input required type="text" value={rib} onChange={e => setRib(e.target.value)} placeholder="0000 0000 0000 0000 0000 0000" style={{ ...inputStyle, fontFamily: 'monospace' }} />
                </div>
                <button type="submit" style={{ padding: '10px 20px', borderRadius: '10px', background: '#ffffff', color: '#0a0a0c', border: 'none', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>ENREGISTRER</button>
              </form>
            </div>

            {/* Historique */}
            <div style={{ background: '#1a1a1c', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '0.7rem', fontWeight: 700, color: '#ffffff', fontFamily: 'monospace', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 1rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                Historique des virements émis
              </h3>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280', fontSize: '0.8rem' }}>Chargement...</div>
              ) : paiements.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280', fontSize: '0.8rem' }}>Aucun paiement enregistré.</div>
              ) : (
                <div>
                  {paiements.map((p, i) => (
                    <div key={p.id_paiement} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', padding: '14px 12px', borderRadius: '12px', borderBottom: i < paiements.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ffffff' }}>Paiement réf : #{p.id_paiement}</div>
                        <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Étudiant : <span style={{ color: '#ffffff', fontWeight: 700 }}>{p.reservation?.etudiant?.prenom} {p.reservation?.etudiant?.nom}</span></div>
                        <div style={{ fontSize: '0.7rem', color: '#6b7280', fontFamily: 'monospace' }}>Méthode : {p.methode} — {p.created_at?.slice(0,10)}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff' }}>{p.montantEnseignant} MAD</div>
                          {p.statut === 'paye'
                            ? <div style={{ fontSize: '0.65rem', color: '#4ade80', fontWeight: 700, fontFamily: 'monospace' }}>✓ VIREMENT COMPLÉTÉ</div>
                            : <div style={{ fontSize: '0.65rem', color: '#fbbf24', fontWeight: 700, fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}><Clock size={10} /> EN COURS</div>
                          }
                        </div>
                        <button onClick={() => alert(`Téléchargement reçu #${p.id_paiement}`)} style={{ width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#6b7280', cursor: 'pointer' }}>
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