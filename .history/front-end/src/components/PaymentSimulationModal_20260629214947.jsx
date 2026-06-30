import React, { useState } from 'react';
import { CreditCard, CheckCircle, AlertCircle, Loader2, X } from 'lucide-react';

export default function PaymentSimulationModal({ 
  open, 
  onClose, 
  onConfirmed, 
  montant = 0, 
  methode = 'simulation',
  isDark = false 
}) {
  // ✅ Convertir montant en nombre
  const montantNum = parseFloat(montant || 0);
  
  const [step, setStep] = useState('form');
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvv, setCvv] = useState('123');
  const [error, setError] = useState('');

  const bg = isDark ? '#1a1a1c' : '#ffffff';
  const bgOverlay = isDark ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.5)';
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const text = isDark ? '#ffffff' : '#111827';
  const muted = isDark ? '#9ca3af' : '#6b7280';
  const inputBg = isDark ? 'rgba(255,255,255,0.05)' : '#f8f9fc';
  const inputBorder = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

  const handleSubmit = (e) => {
    e.preventDefault();
    setStep('processing');
    setError('');

    setTimeout(() => {
      if (Math.random() < 0.9) {
        setStep('success');
      } else {
        setStep('error');
        setError('Le paiement a échoué. Veuillez réessayer.');
      }
    }, 1500);
  };

  // ✅ CORRIGÉ : un seul appel
  const handleOk = () => {
    setStep('form');
    // ✅ SEULEMENT onConfirmed (qui fait setPaymentTarget(null) dans le parent)
    onConfirmed();
    // ❌ SUPPRIMER onClose() pour éviter double appel
  };

  const handleRetry = () => {
    setStep('form');
    setError('');
  };

  const handleClose = () => {
    setStep('form');
    setError('');
    onClose();
  };

  if (!open) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: bgOverlay,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '1rem',
      backdropFilter: 'blur(4px)',
      animation: 'fadeIn 0.2s ease-out'
    }} onClick={handleClose}>
      <div style={{
        background: bg,
        borderRadius: '24px',
        maxWidth: '480px',
        width: '100%',
        padding: '2rem',
        border: '1px solid ' + border,
        position: 'relative',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
        maxHeight: '90vh',
        overflowY: 'auto'
      }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'rgba(224,79,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <CreditCard size={22} color="#e04f00" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: text, margin: 0 }}>
              Paiement sécurisé (simulation)
            </h2>
            <p style={{ fontSize: '0.85rem', color: muted, margin: '2px 0 0' }}>
              Montant à régler : <strong style={{ color: text }}>{montantNum > 0 ? montantNum.toFixed(2) + ' DH' : 'Gratuit'}</strong>
            </p>
          </div>
        </div>

        {/* ===== FORMULAIRE ===== */}
        {step === 'form' && (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.65rem', color: muted, fontWeight: 700, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' }}>
                Numéro de carte
              </label>
              <input
                type="text"
                value={cardNumber}
                onChange={e => setCardNumber(e.target.value)}
                placeholder="4242 4242 4242 4242"
                required
                style={{
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
                  letterSpacing: '0.06em'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ fontSize: '0.65rem', color: muted, fontWeight: 700, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' }}>
                  Expiration
                </label>
                <input
                  type="text"
                  value={expiry}
                  onChange={e => setExpiry(e.target.value)}
                  placeholder="MM/AA"
                  required
                  style={{
                    width: '100%',
                    background: inputBg,
                    border: '1px solid ' + inputBorder,
                    color: text,
                    borderRadius: '10px',
                    padding: '12px 14px',
                    fontSize: '0.85rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                    fontFamily: 'monospace'
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.65rem', color: muted, fontWeight: 700, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' }}>
                  CVV
                </label>
                <input
                  type="text"
                  value={cvv}
                  onChange={e => setCvv(e.target.value)}
                  placeholder="123"
                  required
                  style={{
                    width: '100%',
                    background: inputBg,
                    border: '1px solid ' + inputBorder,
                    color: text,
                    borderRadius: '10px',
                    padding: '12px 14px',
                    fontSize: '0.85rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                    fontFamily: 'monospace'
                  }}
                />
              </div>
            </div>

            {error && (
              <div style={{
                padding: '10px 14px',
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.2)',
                borderRadius: '10px',
                color: '#dc2626',
                fontSize: '0.75rem',
                fontWeight: 700,
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <AlertCircle size={14} /> {error}
              </div>
            )}

            {/* Boutons côte à côte */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={handleClose}
                style={{
                  flex: 1,
                  padding: '14px',
                  borderRadius: '12px',
                  background: 'transparent',
                  color: muted,
                  border: '1px solid ' + border,
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'monospace',
                  letterSpacing: '0.06em',
                  transition: 'all 0.15s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <X size={16} /> ANNULER
              </button>
              <button
                type="submit"
                style={{
                  flex: 2,
                  padding: '14px',
                  borderRadius: '12px',
                  background: '#e04f00',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  fontFamily: 'monospace',
                  letterSpacing: '0.06em',
                  transition: 'all 0.15s'
                }}
              >
                PAYER {montantNum > 0 ? montantNum.toFixed(2) + ' DH' : 'GRATUIT'}
              </button>
            </div>

            <p style={{
              fontSize: '0.65rem',
              color: muted,
              textAlign: 'center',
              marginTop: '1rem',
              fontStyle: 'italic'
            }}>
              Simulation — Aucune carte réelle n'est débitée
            </p>
          </form>
        )}

        {/* ===== PROCESSING ===== */}
        {step === 'processing' && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem 0',
            gap: '1.5rem'
          }}>
            <Loader2 size={48} color="#e04f00" style={{ animation: 'spin 1s linear infinite' }} />
            <p style={{ fontSize: '0.95rem', fontWeight: 700, color: text, margin: 0 }}>
              Traitement du paiement...
            </p>
            <p style={{ fontSize: '0.78rem', color: muted, margin: 0, textAlign: 'center' }}>
              Veuillez patienter pendant que nous sécurisons votre transaction.
            </p>
          </div>
        )}

        {/* ===== SUCCESS ===== */}
        {step === 'success' && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem 0',
            gap: '1rem'
          }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'rgba(34,197,94,0.1)',
              border: '2px solid rgba(34,197,94,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CheckCircle size={36} color="#16a34a" />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#16a34a', margin: 0 }}>
              Paiement Confirmé !
            </h3>
            <p style={{ fontSize: '0.85rem', color: muted, textAlign: 'center', margin: 0, lineHeight: 1.6 }}>
              Votre paiement de <strong style={{ color: text }}>{montantNum.toFixed(2)} DH</strong> a été effectué avec succès.
              <br />
              En attente de confirmation du professeur.
            </p>
            <button
              onClick={handleOk}
              style={{
                marginTop: '0.5rem',
                padding: '12px 36px',
                borderRadius: '12px',
                background: '#e04f00',
                color: '#ffffff',
                border: 'none',
                fontSize: '0.78rem',
                fontWeight: 800,
                cursor: 'pointer',
                fontFamily: 'monospace',
                letterSpacing: '0.06em'
              }}
            >
              OK
            </button>
          </div>
        )}

        {/* ===== ERROR ===== */}
        {step === 'error' && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem 0',
            gap: '1rem'
          }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'rgba(239,68,68,0.1)',
              border: '2px solid rgba(239,68,68,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <AlertCircle size={36} color="#dc2626" />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#dc2626', margin: 0 }}>
              Paiement Échoué
            </h3>
            <p style={{ fontSize: '0.85rem', color: muted, textAlign: 'center', margin: 0, lineHeight: 1.6 }}>
              {error || 'Une erreur est survenue lors du traitement de votre paiement.'}
            </p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <button
                onClick={handleRetry}
                style={{
                  padding: '10px 24px',
                  borderRadius: '10px',
                  background: '#e04f00',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'monospace'
                }}
              >
                RÉESSAYER
              </button>
              <button
                onClick={handleClose}
                style={{
                  padding: '10px 24px',
                  borderRadius: '10px',
                  background: 'transparent',
                  color: muted,
                  border: '1px solid ' + border,
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'monospace'
                }}
              >
                ANNULER
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}