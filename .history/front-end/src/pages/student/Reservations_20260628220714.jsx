function AvisForm({ id_reservation, id_enseignant, isDark, text, muted, border, forceShow = false }) {
  const [note, setNote]               = useState(0);
  const [hover, setHover]             = useState(0);
  const [commentaire, setCommentaire] = useState('');
  const [sending, setSending]         = useState(false);
  const [done, setDone]               = useState(false);
  const [err, setErr]                 = useState('');
  const [dejaNote, setDejaNote]       = useState(false);
  const [avisExistant, setAvisExistant] = useState(null);
  const [checking, setChecking]       = useState(!forceShow); // Si forceShow, pas besoin de verifier
  const [deleting, setDeleting]       = useState(false);

  useEffect(() => {
    // Si forceShow (vient de terminer le cours), on skip la verification
    if (forceShow) {
      setChecking(false);
      return;
    }
    async function checkAvis() {
      try {
        const res = await api.get('/enseignants/' + id_enseignant + '/peut-noter');
        const peutNoter  = !!res.data?.peut_noter;
        const idResNoter = res.data?.id_reservation;

        if (!peutNoter) {
          setDejaNote(true);
          try {
            const avisRes = await api.get('/enseignants/' + id_enseignant + '/avis');
            const avis = (avisRes.data || []).find(a => a.id_reservation === id_reservation);
            if (avis) setAvisExistant(avis);
          } catch (e) {}
        } else if (idResNoter !== id_reservation) {
          setDejaNote(true);
          try {
            const avisRes = await api.get('/enseignants/' + id_enseignant + '/avis');
            const avis = (avisRes.data || []).find(a => a.id_reservation === id_reservation);
            if (avis) setAvisExistant(avis);
          } catch (e) {}
        }
      } catch (e) {}
      finally { setChecking(false); }
    }
    checkAvis();
  }, [id_reservation, id_enseignant, forceShow]);

  async function handleDelete() {
    if (!avisExistant) return;
    if (!window.confirm('Supprimer votre avis ?')) return;
    setDeleting(true);
    try {
      await api.delete('/avis/' + avisExistant.id_avis);
      setDejaNote(false);
      setAvisExistant(null);
      setDone(false);
      setNote(0);
      setCommentaire('');
    } catch (e) {
      setErr(e.response?.data?.message || 'Erreur lors de la suppression.');
    } finally { setDeleting(false); }
  }

  async function handleSubmit() {
    if (note === 0) { setErr('Veuillez choisir une note.'); return; }
    if (commentaire.length < 10) { setErr('Commentaire trop court (min 10 caracteres).'); return; }
    setSending(true); setErr('');
    try {
      const res = await api.post('/avis', { note, commentaire, id_enseignant, id_reservation });
      setDone(true);
      setAvisExistant(res.data.avis || null);
      setDejaNote(true);
    } catch (e) {
      const msg = e.response?.data?.message || 'Erreur lors de la publication.';
      if (msg.toLowerCase().includes('deja')) {
        setDejaNote(true);
      } else {
        setErr(msg);
      }
    } finally { setSending(false); }
  }

  if (checking) return (
    <div style={{ marginTop: '12px', padding: '10px 14px', fontSize: '0.72rem', color: muted }}>
      Verification...
    </div>
  );

  if (dejaNote && !done) return (
    <div style={{ marginTop: '12px', padding: '12px 14px', background: isDark ? 'rgba(34,197,94,0.06)' : 'rgba(34,197,94,0.04)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Star size={13} fill="#16a34a" color="#16a34a" />
            <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 700 }}>
              Vous avez deja laisse un avis pour ce cours.
            </span>
          </div>
          {avisExistant && (
            <>
              <div style={{ display: 'flex', gap: '2px', marginTop: '4px' }}>
                {[1,2,3,4,5].map(i => (
                  <Star key={i} size={14} fill={i <= avisExistant.note ? '#f59e0b' : 'transparent'} color={i <= avisExistant.note ? '#f59e0b' : '#d1d5db'} />
                ))}
              </div>
              <p style={{ fontSize: '0.75rem', color: muted, margin: '4px 0 0', lineHeight: 1.5, fontStyle: 'italic' }}>
                "{avisExistant.commentaire}"
              </p>
            </>
          )}
        </div>
        {avisExistant && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '4px', padding: '5px 10px', borderRadius: '7px', border: '1px solid rgba(220,38,38,0.3)', background: 'rgba(220,38,38,0.06)', color: '#dc2626', fontSize: '0.65rem', fontWeight: 700, cursor: deleting ? 'not-allowed' : 'pointer', fontFamily: 'monospace' }}
          >
            <Trash2 size={11} /> {deleting ? 'Suppression...' : 'Supprimer'}
          </button>
        )}
      </div>
      {err && <p style={{ fontSize: '0.7rem', color: '#dc2626', margin: '8px 0 0', fontWeight: 700 }}>{err}</p>}
    </div>
  );

  if (done) return (
    <div style={{ marginTop: '12px', padding: '12px 14px', background: isDark ? 'rgba(34,197,94,0.06)' : 'rgba(34,197,94,0.04)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Star size={13} fill="#16a34a" color="#16a34a" />
            <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 700 }}>
              Avis publie avec succes !
            </span>
          </div>
          <div style={{ display: 'flex', gap: '2px', marginTop: '4px' }}>
            {[1,2,3,4,5].map(i => (
              <Star key={i} size={14} fill={i <= note ? '#f59e0b' : 'transparent'} color={i <= note ? '#f59e0b' : '#d1d5db'} />
            ))}
          </div>
          <p style={{ fontSize: '0.75rem', color: muted, margin: '4px 0 0', lineHeight: 1.5, fontStyle: 'italic' }}>
            "{commentaire}"
          </p>
        </div>
        {avisExistant && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '4px', padding: '5px 10px', borderRadius: '7px', border: '1px solid rgba(220,38,38,0.3)', background: 'rgba(220,38,38,0.06)', color: '#dc2626', fontSize: '0.65rem', fontWeight: 700, cursor: deleting ? 'not-allowed' : 'pointer', fontFamily: 'monospace' }}
          >
            <Trash2 size={11} /> {deleting ? 'Suppression...' : 'Supprimer'}
          </button>
        )}
      </div>
    </div>
  );

  // Formulaire pour noter
  return (
    <div style={{ marginTop: '12px', padding: '12px 14px', background: isDark ? 'rgba(255,255,255,0.03)' : '#f9fafb', border: '1px solid ' + border, borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ fontSize: '0.6rem', color: muted, fontFamily: 'monospace', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        Laisser un avis
      </div>
      <div style={{ display: 'flex', gap: '2px' }}>
        {[1,2,3,4,5].map(i => (
          <button key={i} onClick={() => setNote(i)} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(0)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}>
            <Star size={20} fill={(hover || note) >= i ? '#f59e0b' : 'transparent'} color={(hover || note) >= i ? '#f59e0b' : '#d1d5db'} />
          </button>
        ))}
      </div>
      <textarea
        value={commentaire}
        onChange={e => setCommentaire(e.target.value)}
        placeholder="Decrivez votre experience avec ce professeur..."
        rows={2}
        style={{ width: '100%', background: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff', border: '1px solid ' + border, color: text, borderRadius: '8px', padding: '8px 12px', fontSize: '0.78rem', outline: 'none', resize: 'none', boxSizing: 'border-box', lineHeight: 1.5 }}
      />
      {err && <p style={{ fontSize: '0.7rem', color: '#dc2626', margin: 0, fontWeight: 700 }}>{err}</p>}
      <button
        onClick={handleSubmit}
        disabled={sending}
        style={{ alignSelf: 'flex-end', padding: '7px 16px', borderRadius: '8px', background: sending ? (isDark ? 'rgba(255,255,255,0.06)' : '#e5e7eb') : '#e04f00', color: sending ? muted : '#fff', border: 'none', fontSize: '0.72rem', fontWeight: 800, cursor: sending ? 'not-allowed' : 'pointer', fontFamily: 'monospace' }}
      >
        {sending ? 'Envoi...' : 'Publier'}
      </button>
    </div>
  );
}