import React, { useState } from 'react';
import { CreditCard, Banknote, X, Lock, Loader, CheckCircle2 } from 'lucide-react';

export default function PaymentSimulationModal({ open, onClose, onConfirmed, montant, methode, isDark }) {
  const [step, setStep] = useState('form');
  const [carte, setCarte] = useState('4242 4242 4242 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvv, setCvv] = useState('123');

  if (!open) return null;

  const isCash = methode === 'cash';

  const bg    = isDark ? '#1a1a1c' : '#ffffff';
  const text  = isDark ? '#ffffff' : '#111827';
  const muted = isDark ? '#9ca3af' : '#6b7280';
  const border   = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const inputBg  = isDark ? 'rgba(255,255,255,0.05)' : '#f8f9fc';

  const formatCarte = (v) =>
    v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();

  async function handleConfirm() {
    setStep('processing');
    await new Promise(r => setTimeout(r, 1000));
    setStep('success');
    await new Promise(r => setTimeout(r, 700));
    onConfirmed();
    setStep('form'); // reset pour la prochaine ouverture
  }

  if (step === 'processing') return (
    <div style={overlay}>
      <div style={{ ...modal(bg, border), alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column', gap: '1rem', padding: '3rem 2rem' }}>
        <Loader size={32} color="#e04f00" style={{ animation: 'spin 0.8s linear infinite' }} />
        <p style={{ fontSize: '0.85rem', color: text, fontWeight: 700, margin: 0 }}>Traitement en cours...</p>
        <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  );

  if (step === 'success') return (
    <div style={overlay}>
      <div style={{ ...modal(bg, border), alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column', gap: '1rem', padding: '3rem 2rem' }}>
        <CheckCircle2 size={40} color="#16a34a" />
        <p style={{ fontSize: '0.9rem', color: text, fontWeight: 800, margin: 0 }}>
          {isCash ? 'Réservation confirmée !' : 'Paiement confirmé !'}
        </p>
      </div>
    </div>
  );

  return (
    <div style={overlay}>
      <div style={modal(bg, border)}>

        {/* Bouton fermer */}
        <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: muted, display: 'flex' }}>
          <X size={18} />
        </button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: isCash ? 'rgba(34,197,94,0.1)' : 'rgba(224,79,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {isCash ? <Banknote size={22} color="#16a34a" /> : <CreditCard size={22} color="#e04f00" />}
          </div>
          <div>
            <div style={{ fontWeight: 800, color: text, fontSize: '0.95rem' }}>
              {isCash ? 'Paiement en espèces' : 'Paiement sécurisé (simulation)'}
            </div>
            <div style={{ fontSize: '0.72rem', color: muted }}>
              Montant à régler : {montant} DH
            </div>
          </div>
        </div>

        {/* CASH */}
        {isCash && (
          <>
            <p style={{ fontSize: '0.82rem', color: text, lineHeight: 1.7, marginBottom: '1.5rem' }}>
              Vous confirmez vouloir réserver ce cours et payer directement{' '}
              <strong>{montant} DH</strong> en espèces à votre professeur lors de la séance.
            </p>
            <button
              onClick={handleConfirm}
              style={{ width: '100%', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '12px', padding: '14px', fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'monospace', letterSpacing: '0.06em', textTransform: 'uppercase' }}
            >
              Confirmer la réservation
            </button>
          </>
        )}

        {/* CARTE */}
        {!isCash && (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={labelStyle}>Numéro de carte</label>
                <input
                  value={carte}
                  onChange={e => setCarte(formatCarte(e.target.value))}
                  maxLength={19}
                  style={inputStyle(inputBg, border, text)}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={labelStyle}>Expiration</label>
                  <input value={expiry} onChange={e => setExpiry(e.target.value)} style={inputStyle(inputBg, border, text)} />
                </div>
                <div>
                  <label style={labelStyle}>CVV</label>
                  <input value={cvv} onChange={e => setCvv(e.target.value)} maxLength={3} style={inputStyle(inputBg, border, text)} />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '1.25rem', fontSize: '0.68rem', color: muted }}>
              <Lock size={12} /> Transaction simulée à des fins de démonstration
            </div>

            <button
              onClick={handleConfirm}
              style={{ width: '100%', background: '#e04f00', color: '#fff', border: 'none', borderRadius: '12px', padding: '14px', fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'monospace', letterSpacing: '0.06em', textTransform: 'uppercase' }}
            >
              Payer {montant} DH
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ── Styles helpers ──────────────────────────────────────────────────
const overlay = {
  position: 'fixed', inset: 0, zIndex: 1000,
  background: 'rgba(0,0,0,0.55)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  padding: '1rem',
};

const modal = (bg, border) => ({
  background: bg,
  border: `1px solid ${border}`,
  borderRadius: '20px',
  padding: '2rem',
  width: '100%',
  maxWidth: '440px',
  position: 'relative',
  boxShadow: '0 24px 60px rgba(0,0,0,0.2)',
});

const labelStyle = {
  display: 'block',
  fontSize: '0.6rem',
  fontWeight: 700,
  fontFamily: 'monospace',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  color: '#6b7280',
  marginBottom: '6px',
};

const inputStyle = (bg, border, color) => ({
  width: '100%',
  background: bg,
  border: `1px solid ${border}`,
  color,
  borderRadius: '10px',
  padding: '11px 14px',
  fontSize: '0.88rem',
  fontFamily: 'monospace',
  outline: 'none',
  boxSizing: 'border-box',
});