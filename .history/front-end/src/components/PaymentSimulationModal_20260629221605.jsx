import React, { useState } from 'react';
import { CreditCard, X, Lock, Loader } from 'lucide-react';

export default function PaymentSimulationModal({ open, onClose, onConfirmed, montant, isDark }) {
  const [step, setStep]     = useState('form');
  const [carte, setCarte]   = useState('4242 4242 4242 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvv, setCvv]       = useState('123');
  const [done, setDone]     = useState(false);

  if (!open) return null;

  const bg      = isDark ? '#1a1a1c' : '#ffffff';
  const text    = isDark ? '#ffffff' : '#111827';
  const muted   = isDark ? '#9ca3af' : '#6b7280';
  const border  = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const inputBg = isDark ? 'rgba(255,255,255,0.05)' : '#f8f9fc';

  const formatCarte = (v) =>
    v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();

  async function handlePayer() {
    if (done) return;
    setStep('processing');
    await new Promise(r => setTimeout(r, 1500));
    setStep('success');
  }

  function handleOk() {
    if (done) return;
    setDone(true);
    // ✅ Reset pour la prochaine fois
    setTimeout(() => {
      setStep('form');
      setDone(false);
    }, 300);
    onConfirmed();
  }

  function handleClose() {
    setStep('form');
    setDone(false);
    onClose();
  }

  const overlayStyle = {
    position: 'fixed', inset: 0, zIndex: 1000,
    background: 'rgba(0,0,0,0.55)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '1rem',
  };

  const modalStyle = {
    background: bg,
    border: `1px solid ${border}`,
    borderRadius: '20px',
    padding: '2rem',
    width: '100%',
    maxWidth: '440px',
    position: 'relative',
    boxShadow: '0 24px 60px rgba(0,0,0,0.2)',
  };

  const labelStyle = {
    display: 'block', fontSize: '0.6rem', fontWeight: 700,
    fontFamily: 'monospace', textTransform: 'uppercase',
    letterSpacing: '0.1em', color: muted, marginBottom: '6px',
  };

  const inputStyle = {
    width: '100%', background: inputBg, border: `1px solid ${border}`,
    color: text, borderRadius: '10px', padding: '11px 14px',
    fontSize: '0.88rem', fontFamily: 'monospace',
    outline: 'none', boxSizing: 'border-box',
  };

  // ✅ PROCESSING
  if (step === 'processing') return (
    <div style={overlayStyle}>
      <div style={{ ...modalStyle, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '3rem 2rem' }}>
        <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
        <Loader size={32} color="#e04f00" style={{ animation: 'spin 0.8s linear infinite' }} />
        <p style={{ fontSize: '0.85rem', color: text, fontWeight: 700, margin: 0 }}>Traitement du paiement...</p>
        <p style={{ fontSize: '0.72rem', color: muted, margin: 0 }}>Merci de ne pas fermer cette fenêtre</p>
      </div>
    </div>
  );

  // ✅ SUCCESS — bouton OK appelle onConfirmed UNE SEULE FOIS
  if (step === 'success') return (
    <div style={overlayStyle}>
      <div style={{ ...modalStyle, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', padding: '3rem 2rem', textAlign: 'center' }}>
        {/* Icone succès */}
        <div style={{
          width: '80px', height: '80px', borderRadius: '50%',
          background: 'rgba(34,197,94,0.1)',
          border: '3px solid rgba(34,197,94,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#16a34a" strokeWidth="2"/>
            <path d="M7 12l3 3 7-7" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div>
          <p style={{ fontSize: '1.1rem', color: '#16a34a', fontWeight: 800, margin: '0 0 8px' }}>
            Paiement Confirmé !
          </p>
          <p style={{ fontSize: '0.82rem', color: text, fontWeight: 600, margin: '0 0 6px' }}>
            Votre paiement de <strong>{montant} DH</strong> a été effectué avec succès.
          </p>
          <p style={{ fontSize: '0.75rem', color: muted, margin: 0, lineHeight: 1.5 }}>
            En attente de confirmation du professeur.
          </p>
        </div>

        {/* ✅ UN SEUL BOUTON OK — appelle handleOk une seule fois */}
        <button
          onClick={handleOk}
          disabled={done}
          style={{
            width: '100%',
            background: done ? '#e5e7eb' : '#e04f00',
            color: done ? muted : '#fff',
            border: 'none',
            borderRadius: '12px',
            padding: '14px',
            fontWeight: 800,
            fontSize: '0.9rem',
            cursor: done ? 'not-allowed' : 'pointer',
            fontFamily: 'monospace',
            letterSpacing: '0.06em'
          }}
        >
          OK
        </button>
      </div>
    </div>
  );

  // ✅ FORMULAIRE
  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(224,79,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CreditCard size={22} color="#e04f00" />
          </div>
          <div>
            <div style={{ fontWeight: 800, color: text, fontSize: '0.95rem' }}>Paiement sécurisé (simulation)</div>
            <div style={{ fontSize: '0.72rem', color: muted }}>Montant à régler : <strong>{montant} DH</strong></div>
          </div>
        </div>

        {/* Champs carte */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', marginBottom: '1.25rem' }}>
          <div>
            <label style={labelStyle}>Numéro de carte</label>
            <input
              value={carte}
              onChange={e => setCarte(formatCarte(e.target.value))}
              maxLength={19}
              style={inputStyle}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={labelStyle}>Expiration</label>
              <input value={expiry} onChange={e => setExpiry(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>CVV</label>
              <input value={cvv} onChange={e => setCvv(e.target.value)} maxLength={3} style={inputStyle} />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '1.25rem', fontSize: '0.68rem', color: muted }}>
          <Lock size={12} /> Transaction simulée — en attente de validation du professeur après paiement
        </div>

        {/* Boutons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleClose}
            style={{
              flex: 1,
              background: 'transparent',
              color: muted,
              border: `1px solid ${border}`,
              borderRadius: '12px',
              padding: '13px',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <X size={14} /> ANNULER
          </button>
          <button
            onClick={handlePayer}
            style={{
              flex: 2,
              background: '#e04f00',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              padding: '13px',
              fontWeight: 800,
              fontSize: '0.82rem',
              cursor: 'pointer',
              fontFamily: 'monospace',
              letterSpacing: '0.06em',
              textTransform: 'uppercase'
            }}
          >
            PAYER {montant} DH
          </button>
        </div>
      </div>
    </div>
  );
}