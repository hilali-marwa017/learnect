import { useState } from 'react';

function ValidatedTeachers({ pendingTeachers, onRefresh }) {
  const [refuseId, setRefuseId] = useState(null);
  const [refuseRaison, setRefuseRaison] = useState('');

  const getToken = () => localStorage.getItem('token');
  const getHeaders = () => ({ 'Authorization': `Bearer ${getToken()}`, 'Content-Type': 'application/json' });

  const handleValider = async (id) => {
    await fetch(`http://localhost:8000/api/admin/validerEnseignant/${id}`, { method: 'POST', headers: getHeaders() });
    onRefresh();
  };

  const handleRefuser = async () => {
    if (refuseId && refuseRaison) {
      await fetch(`http://localhost:8000/api/admin/refuserEnseignant/${refuseId}`, {
        method: 'POST',
        headers: { ...getHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ raison: refuseRaison })
      });
      setRefuseId(null);
      setRefuseRaison('');
      onRefresh();
    }
  };

  return (
    <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
      <div style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', paddingBottom: '12px', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ background: 'rgba(13,110,253,0.1)', padding: '12px', borderRadius: '12px' }}>
            <i className="bi bi-file-text" style={{ fontSize: '20px', color: '#0d6efd' }}></i>
          </div>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>Vérification des enseignants</h3>
            <p style={{ color: '#6c757d', fontSize: '12px', marginBottom: '0' }}>{pendingTeachers.length} dossiers en attente</p>
          </div>
        </div>

        {pendingTeachers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <div style={{ background: 'rgba(25,135,84,0.1)', borderRadius: '50%', width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <i className="bi bi-check-lg" style={{ fontSize: '28px', color: '#198754' }}></i>
            </div>
            <p style={{ color: '#6c757d', marginBottom: '0' }}>Aucun enseignant en attente de vérification</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {pendingTeachers.map(t => (
              <div key={t.utilisateur_id} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', background: 'white' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ background: 'rgba(13,110,253,0.1)', borderRadius: '50%', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontWeight: 'bold', fontSize: '18px', color: '#0d6efd' }}>{t.user?.prenom?.[0]}</span>
                    </div>
                    <div>
                      <h5 style={{ fontWeight: 'bold', marginBottom: '4px', fontSize: '16px' }}>{t.user?.prenom} {t.user?.nom}</h5>
                      <p style={{ color: '#6c757d', fontSize: '12px', marginBottom: '2px' }}>
                        <i className="bi bi-envelope" style={{ marginRight: '4px' }}></i> {t.user?.email}
                      </p>
                      <p style={{ color: '#6c757d', fontSize: '12px', marginBottom: '0' }}>
                        <i className="bi bi-geo-alt" style={{ marginRight: '4px' }}></i> {t.user?.ville}
                      </p>
                    </div>
                  </div>
                  <div style={{ background: '#f8f9fa', borderRadius: '8px', padding: '8px', textAlign: 'center', minWidth: '100px' }}>
                    <div style={{ fontSize: '11px', color: '#6c757d' }}>Tarif horaire</div>
                    <div style={{ fontWeight: 'bold', color: '#0d6efd' }}>{t.tarifHeure} DH/h</div>
                  </div>
                </div>

                <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
                    <div style={{ background: '#f8f9fa', borderRadius: '6px', padding: '8px' }}>
                      <span style={{ fontSize: '11px', color: '#6c757d' }}><i className="bi bi-file-pdf" style={{ marginRight: '4px' }}></i> Diplôme :</span>
                      <span style={{ fontSize: '12px', marginLeft: '8px' }}>{t.diplome}</span>
                    </div>
                    <div style={{ background: '#f8f9fa', borderRadius: '6px', padding: '8px' }}>
                      <span style={{ fontSize: '11px', color: '#6c757d' }}><i className="bi bi-card-image" style={{ marginRight: '4px' }}></i> CIN Recto :</span>
                      <span style={{ fontSize: '12px', marginLeft: '8px' }}>{t.cin_recto || 'non fourni'}</span>
                    </div>
                    <div style={{ background: '#f8f9fa', borderRadius: '6px', padding: '8px' }}>
                      <span style={{ fontSize: '11px', color: '#6c757d' }}><i className="bi bi-card-image" style={{ marginRight: '4px' }}></i> CIN Verso :</span>
                      <span style={{ fontSize: '12px', marginLeft: '8px' }}>{t.cin_verso || 'non fourni'}</span>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '12px', padding: '12px', background: 'rgba(13,110,253,0.05)', borderRadius: '8px' }}>
                  <i className="bi bi-quote" style={{ color: '#0d6efd', marginRight: '4px' }}></i>
                  <span style={{ fontSize: '12px', color: '#6c757d' }}>{t.description_profil?.substring(0, 150)}...</span>
                </div>

                <div style={{ marginTop: '16px', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button onClick={() => handleValider(t.utilisateur_id)} style={{ background: '#198754', color: 'white', border: 'none', padding: '6px 20px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>
                    <i className="bi bi-check-lg" style={{ marginRight: '4px' }}></i> Valider
                  </button>
                  <button onClick={() => setRefuseId(t.utilisateur_id)} style={{ background: 'white', color: '#dc3545', border: '1px solid #dc3545', padding: '6px 20px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>
                    <i className="bi bi-x-lg" style={{ marginRight: '4px' }}></i> Refuser
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {refuseId && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', borderRadius: '16px', maxWidth: '500px', width: '90%', padding: '24px' }}>
            <h5 style={{ fontWeight: 'bold', marginBottom: '16px' }}>
              <i className="bi bi-exclamation-triangle" style={{ color: '#dc3545', marginRight: '8px' }}></i>
              Motif du rejet
            </h5>
            <p style={{ fontSize: '12px', color: '#6c757d', marginBottom: '12px' }}>Précisez à l'enseignant pourquoi sa validation a été refusée.</p>
            <textarea 
              style={{ width: '100%', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', fontSize: '12px', marginBottom: '20px' }}
              rows="3" 
              value={refuseRaison} 
              onChange={e => setRefuseRaison(e.target.value)} 
              placeholder="Le justificatif du diplôme n'est pas lisible..."
            ></textarea>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button onClick={() => setRefuseId(null)} style={{ background: 'white', border: '1px solid #e2e8f0', padding: '6px 20px', borderRadius: '6px' }}>Annuler</button>
              <button onClick={handleRefuser} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '6px 20px', borderRadius: '6px' }}>Confirmer le rejet</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ValidatedTeachers;