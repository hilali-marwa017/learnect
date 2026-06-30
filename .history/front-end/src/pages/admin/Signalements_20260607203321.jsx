function Signalements({ signalements, onRefresh }) {
  const getToken = () => localStorage.getItem('token');

  const handleTraiter = async (id) => {
    await fetch(`http://localhost:8000/api/admin/signalements/${id}/traiter`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    onRefresh();
  };

  const handleSupprimerAvis = async (idAvis, idSignalement) => {
    await fetch(`http://localhost:8000/api/admin/avis/${idAvis}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    await fetch(`http://localhost:8000/api/admin/signalements/${idSignalement}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    onRefresh();
  };

  const pending = signalements.filter(s => s.statut === 'en_attente');

  return (
    <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
      <div style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', paddingBottom: '12px', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ background: 'rgba(220,53,69,0.1)', padding: '12px', borderRadius: '12px' }}>
            <i className="bi bi-flag" style={{ fontSize: '20px', color: '#dc3545' }}></i>
          </div>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>Modération des signalements</h3>
            <p style={{ color: '#6c757d', fontSize: '12px', marginBottom: '0' }}>{pending.length} signalements en attente</p>
          </div>
        </div>

        {pending.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <div style={{ background: 'rgba(25,135,84,0.1)', borderRadius: '50%', width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <i className="bi bi-shield-check" style={{ fontSize: '28px', color: '#198754' }}></i>
            </div>
            <p style={{ color: '#6c757d', marginBottom: '0' }}>Aucun signalement en attente</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {pending.map(s => (
              <div key={s.id_signalement} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', background: 'white' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #e2e8f0' }}>
                  <div style={{ background: 'rgba(255,193,7,0.1)', borderRadius: '50%', padding: '6px' }}>
                    <i className="bi bi-exclamation-triangle" style={{ color: '#ffc107' }}></i>
                  </div>
                  <span style={{ background: 'rgba(220,53,69,0.1)', color: '#dc3545', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' }}>
                    Signalé le {new Date(s.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div style={{ background: '#f8f9fa', borderRadius: '8px', padding: '12px', marginBottom: '12px' }}>
                  <div style={{ fontSize: '11px', color: '#6c757d', marginBottom: '6px' }}>
                    <i className="bi bi-chat-quote" style={{ marginRight: '4px' }}></i> Avis signalé :
                  </div>
                  <p style={{ marginBottom: '0', fontStyle: 'italic' }}>"{s.avis?.commentaire}"</p>
                </div>

                <div style={{ background: 'rgba(255,193,7,0.05)', borderRadius: '8px', padding: '12px', marginBottom: '16px' }}>
                  <div style={{ fontSize: '11px', color: '#6c757d', marginBottom: '6px' }}>
                    <i className="bi bi-info-circle" style={{ marginRight: '4px' }}></i> Motif du signalement :
                  </div>
                  <p style={{ marginBottom: '0', fontSize: '12px', fontWeight: '500' }}>{s.motif}</p>
                </div>

                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button onClick={() => handleTraiter(s.id_signalement)} style={{ background: '#0d6efd', color: 'white', border: 'none', padding: '6px 20px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>
                    <i className="bi bi-check-lg" style={{ marginRight: '4px' }}></i> Rejeter le signalement
                  </button>
                  <button onClick={() => handleSupprimerAvis(s.id_avis, s.id_signalement)} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '6px 20px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>
                    <i className="bi bi-trash" style={{ marginRight: '4px' }}></i> Supprimer l'avis
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Signalements;