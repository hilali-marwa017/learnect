import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, X, Lock, Loader, CheckCircle2 } from 'lucide-react';

export default function PaymentSimulationModal({ open, onClose, onConfirmed, montant, isDark }) {
  const [step, setStep]     = useState('form');
  const [carte, setCarte]   = useState('4242 4242 4242 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvv, setCvv]       = useState('123');
  const navigate = useNavigate();

  if (!open) return null;

  const bg      = isDark ? '#1a1a1c' : '#ffffff';
  const text    = isDark ? '#ffffff' : '#111827';
  const muted   = isDark ? '#9ca3af' : '#6b7280';
  const border  = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const inputBg = isDark ? 'rgba(255,255,255,0.05)' : '#f8f9fc';

  const formatCarte = (v) =>
    v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();

  async function handleConfirm() {
    setStep('processing');
    await new Promise(r => setTimeout(r, 1200));
    setStep('success');
    await new Promise(r => setTimeout(r, 800));
    onConfirmed();
  }

  const overlayStyle = {
    position: 'fixed', inset: 0, zIndex: 1000,
    background: 'rgba(0,0,0,0.55)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '1rem',
  };

  const modalStyle = {
    background: bg, border: `1px solid ${border}`,
    borderRadius: '20px', padding: '2rem',
    width: '100%', maxWidth: '440px',
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

  if (step === 'success') return (
    <div style={overlayStyle}>
      <div style={{ ...modalStyle, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem', padding: '3rem 2rem', textAlign: 'center' }}>
        <CheckCircle2 size={48} color="#16a34a" />
        <div>
          <p style={{ fontSize: '0.95rem', color: text, fontWeight: 800, margin: '0 0 6px' }}>RÉSERVATION & PAIEMENT CONFIRMÉS</p>
          <p style={{ fontSize: '0.78rem', color: muted, margin: 0, lineHeight: 1.6 }}>
            Votre réservation est en attente de confirmation du professeur.<br />
            Le professeur va accepter ou refuser votre demande.<br />
            La messagerie sera activée après confirmation.
          </p>
        </div>
        <button
          onClick={() => { setStep('form'); onClose(); navigate('/student/reservations'); }}
          style={{ width: '100%', background: '#e04f00', color: '#fff', border: 'none', borderRadius: '12px', padding: '14px', fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'monospace', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          MES RÉSERVATIONS
        </button>
      </div>
    </div>
  );

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: muted }}>
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(224,79,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CreditCard size={22} color="#e04f00" />
          </div>
          <div>
            <div style={{ fontWeight: 800, color: text, fontSize: '0.95rem' }}>Paiement sécurisé (simulation)</div>
            <div style={{ fontSize: '0.72rem', color: muted }}>Montant à régler : {parseFloat(montant).toFixed(2)} DH</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', marginBottom: '1.25rem' }}>
          <div>
            <label style={labelStyle}>Numéro de carte</label>
            <input value={carte} onChange={e => setCarte(formatCarte(e.target.value))} maxLength={19} style={inputStyle} />
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

        <button onClick={handleConfirm} style={{ width: '100%', background: '#e04f00', color: '#fff', border: 'none', borderRadius: '12px', padding: '14px', fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'monospace', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Payer {parseFloat(montant).toFixed(2)} DH
        </button>
      </div>
    </div>
  );
}