// Dans TeacherProfile.jsx, modifie la section "Réserver un cours"

{/* Colonne droite - Réserver un cours */}
<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

  {reservedInfo ? (
    <div style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: '16px', padding: '1.5rem' }}>
      <div style={{ fontSize: '0.6rem', color: '#16a34a', fontFamily: 'monospace', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.1em' }}>
        ✓ RÉSERVATION CRÉÉE
      </div>
      <p style={{ fontSize: '0.85rem', color: text, fontWeight: 700, margin: '0 0 6px' }}>
        Votre réservation est en attente de confirmation de paiement.
      </p>
      <p style={{ fontSize: '0.78rem', color: muted, margin: '0 0 1.25rem', lineHeight: 1.5 }}>
        Confirmez le paiement depuis "Mes Réservations" pour activer la messagerie.
      </p>
      <button
        onClick={() => navigate('/student/reservations')}
        style={{ width: '100%', padding: '11px', borderRadius: '10px', background: '#e04f00', color: '#fff', border: 'none', fontWeight: 800, fontSize: '0.78rem', cursor: 'pointer', marginBottom: '8px', fontFamily: 'monospace', letterSpacing: '0.06em' }}
      >
        CONFIRMER LE PAIEMENT
      </button>
      <button
        onClick={() => navigate('/student/messages', { state: { reservationId: reservedInfo.id_reservation } })}
        style={{ width: '100%', padding: '11px', borderRadius: '10px', background: 'transparent', color: text, border: '1px solid ' + border, fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', fontFamily: 'monospace', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
      >
        <MessageSquare size={15} /> MESSAGERIE
      </button>
    </div>
  ) : (
    <div style={{ background: bgCard, border: '1px solid ' + border, borderRadius: '16px', padding: '1.5rem' }}>
      <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: text, margin: '0 0 1rem', paddingBottom: '0.75rem', borderBottom: '1px solid ' + borderS }}>
        Réserver un cours
      </h3>
      
      {error && (
        <div style={{ padding: '8px 12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', color: '#dc2626', fontSize: '0.75rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <X size={13} /> {error}
        </div>
      )}

      {/* ✅ Si l'utilisateur n'est pas connecté */}
      {!user ? (
        <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
          <p style={{ fontSize: '0.85rem', color: muted, marginBottom: '1rem' }}>
            🔒 Connectez-vous pour réserver ce cours.
          </p>
          <button
            onClick={() => navigate('/login')}
            style={{ width: '100%', padding: '12px', borderRadius: '12px', background: '#e04f00', color: '#fff', border: 'none', fontWeight: 800, fontSize: '0.78rem', cursor: 'pointer', fontFamily: 'monospace', letterSpacing: '0.06em' }}
          >
            SE CONNECTER
          </button>
        </div>
      ) : user?.role !== 'etudiant' ? (
        <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
          <p style={{ fontSize: '0.85rem', color: muted, marginBottom: '0.5rem' }}>
            🎓 Seuls les étudiants peuvent réserver un cours.
          </p>
          <p style={{ fontSize: '0.7rem', color: muted }}>
            Vous êtes connecté en tant que {user?.role === 'enseignant' ? 'professeur' : 'administrateur'}.
          </p>
        </div>
      ) : (
        // ✅ Si l'utilisateur est un étudiant connecté
        <>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.6rem', color: muted, fontWeight: 700, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' }}>
              Choisir un créneau
            </label>
            {disponibles.length === 0 ? (
              <p style={{ fontSize: '0.78rem', color: muted, fontStyle: 'italic' }}>Aucun créneau disponible.</p>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {disponibles.map(c => (
                  <button
                    key={c.id_creneau}
                    onClick={() => setSelectedCreneau(c.id_creneau)}
                    style={{ 
                      padding: '6px 12px', 
                      borderRadius: '8px', 
                      border: '1px solid ' + (selectedCreneau === c.id_creneau ? '#e04f00' : border), 
                      background: selectedCreneau === c.id_creneau ? '#e04f00' : inputBg, 
                      color: selectedCreneau === c.id_creneau ? '#fff' : text, 
                      fontSize: '0.72rem', 
                      fontWeight: 600, 
                      cursor: 'pointer', 
                      fontFamily: 'monospace' 
                    }}
                  >
                    {c.jour} {c.heureDebut?.slice(0,5)}-{c.heureFin?.slice(0,5)}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.6rem', color: muted, fontWeight: 700, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' }}>
              Date du cours
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
              style={{ width: '100%', background: inputBg, border: '1px solid ' + border, color: text, borderRadius: '10px', padding: '10px 12px', fontSize: '0.8rem', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.6rem', color: muted, fontWeight: 700, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' }}>
              Mode de paiement
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setMethode('simulation')}
                style={{ 
                  flex: 1, 
                  padding: '8px', 
                  borderRadius: '8px', 
                  border: '1px solid ' + (methode === 'simulation' ? '#e04f00' : border), 
                  background: methode === 'simulation' ? 'rgba(224,79,0,0.08)' : inputBg, 
                  color: methode === 'simulation' ? '#e04f00' : text, 
                  fontSize: '0.72rem', 
                  fontWeight: 700, 
                  cursor: 'pointer' 
                }}
              >
                Carte bancaire
              </button>
              <button
                onClick={() => setMethode('cash')}
                style={{ 
                  flex: 1, 
                  padding: '8px', 
                  borderRadius: '8px', 
                  border: '1px solid ' + (methode === 'cash' ? '#e04f00' : border), 
                  background: methode === 'cash' ? 'rgba(224,79,0,0.08)' : inputBg, 
                  color: methode === 'cash' ? '#e04f00' : text, 
                  fontSize: '0.72rem', 
                  fontWeight: 700, 
                  cursor: 'pointer' 
                }}
              >
                Espèces
              </button>
            </div>
          </div>

          <button
            onClick={handleReserverClick}
            disabled={reserving}
            style={{ 
              width: '100%', 
              padding: '12px', 
              borderRadius: '12px', 
              background: reserving ? '#e5e7eb' : '#e04f00', 
              color: reserving ? muted : '#fff', 
              border: 'none', 
              fontWeight: 800, 
              fontSize: '0.78rem', 
              cursor: reserving ? 'not-allowed' : 'pointer', 
              fontFamily: 'monospace', 
              letterSpacing: '0.06em', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '8px' 
            }}
          >
            <Calendar size={16} /> {reserving ? 'RÉSERVATION...' : 'RÉSERVER CE COURS'}
          </button>
        </>
      )}
    </div>
  )}
</div>