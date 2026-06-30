import { useState } from 'react';
import { CheckCircle, AlertCircle, Trash2, Loader } from 'lucide-react';
import api from '../../api/axios';

export function SignalementsTab({ signalements, setSignalements }) {
  const [loadingId, setLoadingId] = useState(null);

  async function traiterSignalement(id) {
    setLoadingId(id);
    try {
      await api.put(`/admin/signalements/${id}/traiter`);
      setSignalements(prev => prev.map(s => s.id === id ? { ...s, statut: 'traite' } : s));
    } catch(e) { alert('Erreur'); }
    finally { setLoadingId(null); }
  }

  async function supprimerSignalement(id) {
    if (!window.confirm('Voulez-vous vraiment supprimer ce signalement ?')) return;
    setLoadingId(id);
    try {
      await api.delete(`/admin/signalements/${id}`);
      setSignalements(prev => prev.filter(s => s.id !== id));
    } catch(e) { alert('Erreur'); }
    finally { setLoadingId(null); }
  }

  return (
    <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '16px', padding: '1.5rem' }}>
      <div style={{ fontSize: '0.6rem', color: '#e04f00', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '4px' }}>MODÉRATION</div>
      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '1.25rem' }}>Avis Signalés ({signalements.length})</div>
      {signalements.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <CheckCircle size={18} color="#10b981" /> Aucun signalement
        </div>
      ) : signalements.map((s, i) => (
        <div key={s.id ?? i} style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '1rem', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.62rem', background: s.statut === 'traite' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', color: s.statut === 'traite' ? '#10b981' : '#f59e0b', padding: '2px 8px', borderRadius: '4px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                {s.statut === 'traite' ? <CheckCircle size={10} /> : <AlertCircle size={10} />}
                {s.statut === 'traite' ? 'Traité' : 'En attente'}
              </span>
              <div style={{ fontSize: '0.82rem', color: 'var(--color-text)', fontWeight: 600, marginTop: '4px' }}>{s.raison}</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--color-muted)', marginTop: '4px' }}>
                Par: {s.signaleur?.prenom} {s.signaleur?.nom} • {new Date(s.created_at).toLocaleDateString('fr-FR')}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {s.statut !== 'traite' && (
                <button onClick={() => traiterSignalement(s.id)} disabled={loadingId === s.id}
                  style={{ padding: '6px 14px', borderRadius: '8px', border: 'none', background: '#e04f00', color: '#fff', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', opacity: loadingId === s.id ? 0.6 : 1 }}>
                  {loadingId === s.id ? <Loader size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <CheckCircle size={13} />} Marquer traité
                </button>
              )}
              <button onClick={() => supprimerSignalement(s.id)} disabled={loadingId === s.id}
                style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid rgba(220,38,38,0.25)', background: 'rgba(220,38,38,0.06)', color: '#dc2626', cursor: 'pointer', display: 'flex', alignItems: 'center', opacity: loadingId === s.id ? 0.6 : 1 }}>
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </div>
      ))}
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

export default function AdminSignalements() { return null; }