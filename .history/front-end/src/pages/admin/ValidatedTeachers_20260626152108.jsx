import { Clock, CheckCircle } from 'lucide-react';

// onglet reservations dans le dashboard admin
export function ReservationsTab({ reservations }) {
  return (
    <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '16px', padding: '1.5rem' }}>
      <div style={{ fontSize: '0.6rem', color: '#e04f00', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '4px' }}>SUIVI</div>
      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '1.25rem' }}>
        Reservations ({reservations.length})
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Etudiant', 'Enseignant', 'Montant', 'Statut', 'Date'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '10px 12px', fontSize: '0.6rem', color: 'var(--color-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: '1px solid var(--color-border)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reservations.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-muted)' }}>Aucune reservation</td>
              </tr>
            ) : reservations.map((r, i) => (
              <tr key={r.id_reservation ?? i} style={{ borderBottom: '1px solid var(--color-border)' }}>
                {/* nom etudiant */}
                <td style={{ padding: '12px', fontSize: '0.78rem', color: 'var(--color-text)' }}>
                  <div style={{ fontWeight: 600 }}>{r.etudiant?.prenom} {r.etudiant?.nom}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--color-muted)' }}>{r.etudiant?.email}</div>
                </td>
                {/* nom enseignant via creneau */}
                <td style={{ padding: '12px', fontSize: '0.78rem', color: 'var(--color-muted)' }}>
                  {r.creneau?.enseignant?.user?.prenom} {r.creneau?.enseignant?.user?.nom}
                </td>
                {/* montant */}
                <td style={{ padding: '12px', fontSize: '0.78rem', color: '#10b981', fontWeight: 700 }}>
                  {r.montant} DH
                </td>
                {/* badge statut */}
                <td style={{ padding: '12px' }}>
                  <span style={{ fontSize: '0.62rem', padding: '3px 8px', borderRadius: '20px', fontWeight: 700, background: r.statut === 'confirmee' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', color: r.statut === 'confirmee' ? '#10b981' : '#f59e0b' }}>
                    {r.statut}
                  </span>
                </td>
                {/* date creation */}
                <td style={{ padding: '12px', fontSize: '0.78rem', color: 'var(--color-muted)' }}>
                  {new Date(r.created_at).toLocaleDateString('fr-FR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// onglet paiements dans le dashboard admin
export function PaiementsTab({ paiements }) {
  return (
    <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '16px', padding: '1.5rem' }}>
      <div style={{ fontSize: '0.6rem', color: '#e04f00', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '4px' }}>FINANCES</div>
      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '1.25rem' }}>
        Paiements ({paiements.length})
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Montant', 'Commission (10%)', 'Statut', 'Date'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '10px 12px', fontSize: '0.6rem', color: 'var(--color-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: '1px solid var(--color-border)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paiements.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-muted)' }}>Aucun paiement</td>
              </tr>
            ) : paiements.map((p, i) => (
              <tr key={p.id_paiement ?? i} style={{ borderBottom: '1px solid var(--color-border)' }}>
                {/* montant total */}
                <td style={{ padding: '12px', fontSize: '0.78rem', color: '#10b981', fontWeight: 700 }}>
                  {p.montantTotal} DH
                </td>
                {/* commission learnect 10% */}
                <td style={{ padding: '12px', fontSize: '0.78rem', color: '#e04f00', fontWeight: 600 }}>
                  {p.comission || 0} DH
                </td>
                {/* badge statut paiement */}
                <td style={{ padding: '12px' }}>
                  <span style={{ fontSize: '0.62rem', padding: '3px 8px', borderRadius: '20px', fontWeight: 700, background: p.statut === 'paye' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', color: p.statut === 'paye' ? '#10b981' : '#f59e0b' }}>
                    {p.statut === 'paye' ? 'Paye' : 'En attente'}
                  </span>
                </td>
                {/* date */}
                <td style={{ padding: '12px', fontSize: '0.78rem', color: 'var(--color-muted)' }}>
                  {new Date(p.created_at).toLocaleDateString('fr-FR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// onglet demandes dans le dashboard admin — correction id_demande
export function DemandesTab({ demandes }) {
  return (
    <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '16px', padding: '1.5rem' }}>
      <div style={{ fontSize: '0.6rem', color: '#e04f00', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '4px' }}>DEMANDES ETUDIANTS</div>
      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '1.25rem' }}>
        Demandes ({demandes.length})
      </div>

      {demandes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-muted)' }}>Aucune demande</div>
      ) : demandes.map((d, i) => (
        // correction : utiliser id_demande pas id
        <div key={d.id_demande ?? i} style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '10px', padding: '1rem', marginBottom: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              {/* nom etudiant */}
              <div style={{ fontWeight: 600, color: 'var(--color-text)', fontSize: '0.82rem' }}>
                {d.etudiant?.prenom} {d.etudiant?.nom}
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--color-muted)' }}>{d.etudiant?.email}</div>
              {/* matiere demandee */}
              <div style={{ fontSize: '0.73rem', color: '#e04f00', fontWeight: 600, marginTop: '4px' }}>
                {d.matiere}
              </div>
              {/* message ou description — peut etre null si pas de champ message */}
              {d.message && (
                <div style={{ fontSize: '0.73rem', color: 'var(--color-muted)', marginTop: '4px', maxWidth: '500px' }}>
                  {d.message.substring(0, 100)}...
                </div>
              )}
              {/* budget max */}
              <div style={{ fontSize: '0.7rem', color: 'var(--color-muted)', marginTop: '4px' }}>
                Budget max : <strong style={{ color: 'var(--color-text)' }}>{d.budgetMax} MAD/h</strong>
              </div>
            </div>

            {/* statut + date */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.62rem', padding: '3px 8px', borderRadius: '20px', fontWeight: 700, background: d.statut === 'active' ? 'rgba(59,130,246,0.1)' : 'rgba(16,185,129,0.1)', color: d.statut === 'active' ? '#3b82f6' : '#10b981', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                {d.statut === 'active' ? <Clock size={10} /> : <CheckCircle size={10} />}
                {d.statut === 'active' ? 'Active' : 'Acceptee'}
              </span>
              <span style={{ fontSize: '0.65rem', color: 'var(--color-muted)' }}>
                {new Date(d.created_at).toLocaleDateString('fr-FR')}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}