// ✅ Fonction signalement corrigée - BUG 4
async function handleEnvoyerSignalement() {
  if (motifSignal.trim().length < 10) {
    setSignalError('Motif trop court (minimum 10 caractères).');
    return;
  }
  if (avis.length === 0) {
    setSignalError("Ce professeur n'a pas encore d'avis à signaler. Vous pouvez signaler son profil après avoir laissé un avis.");
    return;
  }
  setSendingSignal(true); setSignalError('');
  try {
    await api.post('/signalements', { motif: motifSignal, id_avis: avis[0].id_avis });
    setSignalSuccess(true);
    setMotifSignal('');
    setTimeout(() => { setShowSignalModal(false); setSignalSuccess(false); }, 2000);
  } catch (err) {
    setSignalError(err.response?.data?.message || 'Erreur lors du signalement.');
  } finally {
    setSendingSignal(false);
  }
}

// ✅ Section des boutons avis + signaler - BUG 3 et 5
<div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>

  {/* BUG 3 : bouton avis toujours visible avec message si pas eligible */}
  {user?.role === 'etudiant' && (
    peutNoter ? (
      <button onClick={() => setShowAvisForm(s => !s)}
        style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '10px', border: '1px solid #f59e0b', background: showAvisForm ? '#f59e0b' : 'rgba(245,158,11,0.08)', color: showAvisForm ? '#fff' : '#d97706', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>
        <Star size={14} fill={showAvisForm ? '#fff' : 'none'} /> {showAvisForm ? 'Fermer' : 'Laisser un avis'}
      </button>
    ) : (
      <div style={{ fontSize: '0.7rem', color: muted, padding: '8px 12px', background: isDark ? 'rgba(255,255,255,0.04)' : '#f8f9fc', border: '1px solid ' + border, borderRadius: '10px', maxWidth: '180px', textAlign: 'center', lineHeight: 1.5 }}>
        Terminez un cours pour laisser un avis
      </div>
    )
  )}

  {/* BUG 5 : garder le bouton signaler — feature utile */}
  {user && (
    <button onClick={() => { setShowSignalModal(true); setSignalError(''); setSignalSuccess(false); }}
      style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '10px', border: '1px solid rgba(220,38,38,0.3)', background: 'rgba(220,38,38,0.06)', color: '#dc2626', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>
      <Flag size={14} /> Signaler
    </button>
  )}
</div>