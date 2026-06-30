import React, { useState } from 'react';
import { CreditCard, Lock, CheckCircle2, X, Banknote, Loader } from 'lucide-react';

export default function PaymentSimulationModal({ open, onClose, onConfirmed, montant, methode, isDark }) {
  const [step, setStep] = useState('form');
  const [carte, setCarte] = useState('4242 4242 4242 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvv, setCvv] = useState('123');

  if (!open) return null;

  const bg = isDark ? '#1a1a1c' : '#ffffff';
  const text = isDark ? '#ffffff' : '#111827';
  const muted = isDark ? '#9ca3af' : '#6b7280';
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const inputBg = isDark ? 'rgba(255,255,255,0.05)' : '#f8f9fc';

  const formatCarte = (v) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();

  const handlePayer = async () => {
    setStep('processing');
    await new Promise(r => setTimeout(r, 1800));
    setStep('success');
    await new Promise(r => setTimeout(r, 900));
    onConfirmed();
  };

  const handleEspeces = () => {
    setStep('processing');
    setTimeout(async () => {
      setStep('success');
      await new Promise(r => setTimeout(r, 700));
      onConfirmed();
    }, 600);
  };

  const renderForm = () => (
    <>
      <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: muted }}>
        <X size={18} />
      </button>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: methode === 'simulation' ? 'rgba(224,79,0,0.1)' : 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {methode === 'simulation' ? <CreditCard size={20} color="#e04f00" /> : <Banknote size={20} color="#16a34a" />}
        </div>
        <div>
          <div style={{ fontWeight: 800, color: text, fontSize: '0.95rem' }}>{methode === 'simulation' ? 'Paiement sécurisé (simulation)' : 'Paiement en espèces'}</div>
          <div style={{ fontSize: '0.7rem', color: muted }}>Montant à régler : {montant} DH</div>
        </div>
      </div>
      {methode === 'simulation' ? (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ fontSize: '0.6rem', color: muted, fontWeight: 700, fontFamily: 'monospace', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Numéro de carte</label>
              <input value={carte} onChange={e => setCarte(formatCarte(e.target.value))} maxLength={19} style={{ width: '100%', background: inputBg, border: `1px solid ${border}`, color: text, borderRadius: '10px', padding: '10px 12px', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'monospace' }} />
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '0.6rem', color: muted, fontWeight: 700, fontFamily: 'monospace', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Expiration</label>
                <input value={expiry} onChange={e => setExpiry(e.target.value)} style={{ width: '100%', background: inputBg, border: `1px solid ${border}`, color: text, borderRadius: '10px', padding: '10px 12px', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'monospace' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '0.6rem', color: muted, fontWeight: 700, fontFamily: 'monospace', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>CVV</label>
                <input value={cvv} onChange={e => setCvv(e.target.value)} maxLength={3} style={{ width: '100%', background: inputBg, border: `1px solid ${border}`, color: text, borderRadius: '10px', padding: '10px 12px', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'monospace' }} />
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '1.25rem', fontSize: '0.68rem', color: muted }}>
            <Lock size={12} /> Transaction chiffrée et simulée à des fins de démonstration
          </div>
          <button onClick={handlePayer} style={{ width: '100%', background: '#e04f00', color: '#fff', border: 'none', borderRadius: '12px', padding: '13px', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'monospace', letterSpacing: '0.05em' }}>
            PAYER {montant} DH
          </button>
        </>
      ) : (
        <>
          <p style={{ fontSize: '0.8rem', color: muted, lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Vous confirmez vouloir réserver ce cours et payer directement {montant} DH en espèces à votre professeur lors de la séance.
          </p>
          <button onClick={handleEspeces} style={{ width: '100%', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '12px', padding: '13px', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'monospace', letterSpacing: '0.05em' }}>
            CONFIRMER LA RÉSERVATION
          </button>
        </>
      )}
    </>
  );

  const renderProcessing = () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '2rem 0' }}>
      <Loader size={32} color="#e04f00" style={{ animation: 'spin 0.8s linear infinite' }} />
      <p style={{ fontSize: '0.85rem', color: text, fontWeight: 700, margin: 0 }}>Traitement du paiement...</p>
      <p style={{ fontSize: '0.72rem', color: muted, margin: 0 }}>Merci de ne pas fermer cette fenêtre</p>
    </div>
  );

  const renderSuccess = () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '2rem 0' }}>
      <CheckCircle2 size={40} color="#16a34a" />
      <p style={{ fontSize: '0.9rem', color: text, fontWeight: 800, margin: 0 }}>Paiement confirmé !</p>
    </div>
  );

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: '20px', padding: '2rem', width: '100%', maxWidth: '420px', position: 'relative' }}>
        {step === 'form' && renderForm()}
        {step === 'processing' && renderProcessing()}
        {step === 'success' && renderSuccess()}
        <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  );
}