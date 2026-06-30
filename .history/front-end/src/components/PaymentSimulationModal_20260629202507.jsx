import React, { useState } from 'react';
import { CreditCard, CheckCircle2, Loader2, X } from 'lucide-react';

export default function PaymentSimulationModal({ open, onClose, onConfirmed, montant, isDark }) {
  const montantNum = parseFloat(montant || 0);

  const [step, setStep] = useState('form');
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvv, setCvv] = useState('123');

  const bg = isDark ? '#1a1a1c' : '#ffffff';
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const text = isDark ? '#ffffff' : '#111827';
  const muted = isDark ? '#9ca3af' : '#6b7280';
  const inputBg = isDark ? 'rgba(255,255,255,0.05)' : '#f8f9fc';
  const inputBorder = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

  function handleSubmit(e) {
    e.preventDefault();
    setStep('processing');
    setTimeout(function() {
      setStep('success');
    }, 1500);
  }

  function handleOk() {
    setStep('form');
    onConfirmed();
  }

  function handleClose() {
    setStep('form');
    onClose();
  }

  if (!open) return null;

  const overlayStyle = {
    position: 'fixed',
    inset: 0,
    zIndex: 9999,
    background: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
  };

  const modalStyle = {
    background: bg,
    borderRadius: '20px',
    maxWidth: '440px',
    width: '100%',
    padding: '2rem',
    border: '1px solid ' + border,
    boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
    position: 'relative',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.6rem',
    fontWeight: 700,
    fontFamily: 'monospace',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: muted,
    marginBottom: '6px',
  };

  const inputStyle = {
    width: '100%',
    background: inputBg,
    border: '1px solid ' + inputBorder,
    color: text,
    borderRadius: '10px',
    padding: '12px 14px',
    fontSize: '0.85rem',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'monospace',
  };

  if (step === 'processing') {
    return (
      <div style={overlayStyle}>
        <div style={{ ...modalStyle, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem', padding: '3rem 2rem' }}>
          <Loader2 size={40} color="#e04f00" style={{ animation: 'spin 1s linear infinite' }} />
          <p style={{ fontSize: '0.9rem', fontWeight: 700, color: text, margin: 0 }}>Traitement du paiement...</p>
          <p style={{ fontSize: '0.75rem', color: muted, margin: 0 }}>Merci de ne pas fermer cette fenetre</p>
          <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div style={overlayStyle}>
        <div style={{ ...modalStyle, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem', padding: '2.5rem 2rem', textAlign: 'center' }}>
          <CheckCircle2 size={52} color="#16a34a" />
          <div>
            <p style={{ fontSize: '0.95rem', fontWeight: 800, color: text, margin: '0 0 10px' }}>
              RESERVATION ET PAIEMENT CONFIRMES
            </p>
            <p style={{ fontSize: '0.78rem', color: muted, margin: 0, lineHeight: 1.7 }}>
              Votre reservation est en attente de confirmation du professeur.<br />
              Le professeur va accepter ou refuser votre demande.<br />
              La messagerie sera activee apres confirmation.
            </p>
          </div>
          <button
            onClick={handleOk}
            style={{ width: '100%', padding: '13px', borderRadius: '12px', background: '#e04f00', color: '#ffffff', border: 'none', fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer', fontFamily: 'monospace', letterSpacing: '0.06em' }}>
            OK
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>

        <button
          onClick={handleClose}
          style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: muted }}>
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(224,79,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <CreditCard size={22} color="#e04f00" />
          </div>
          <div>
            <div style={{ fontWeight: 800, color: text, fontSize: '0.95rem' }}>Paiement securise (simulation)</div>
            <div style={{ fontSize: '0.72rem', color: muted }}>
              Montant a regler : {montantNum > 0 ? montantNum.toFixed(2) + ' DH' : 'Gratuit'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <label style={labelStyle}>Numero de carte</label>
            <input
              type="text"
              value={cardNumber}
              onChange={function(e) { setCardNumber(e.target.value); }}
              style={inputStyle}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Expiration</label>
              <input
                type="text"
                value={expiry}
                onChange={function(e) { setExpiry(e.target.value); }}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>CVV</label>
              <input
                type="text"
                value={cvv}
                onChange={function(e) { setCvv(e.target.value); }}
                maxLength={3}
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        <div style={{ fontSize: '0.65rem', color: muted, marginBottom: '1.25rem' }}>
          Transaction simulee - Aucune carte reelle n'est debitee
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleClose}
            style={{ flex: 1, padding: '13px', borderRadius: '12px', background: 'transparent', color: muted, border: '1px solid ' + border, fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'monospace' }}>
            ANNULER
          </button>
          <button
            onClick={handleSubmit}
            style={{ flex: 2, padding: '13px', borderRadius: '12px', background: '#e04f00', color: '#ffffff', border: 'none', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', fontFamily: 'monospace', letterSpacing: '0.04em' }}>
            PAYER {montantNum > 0 ? montantNum.toFixed(2) + ' DH' : ''}
          </button>
        </div>

        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}