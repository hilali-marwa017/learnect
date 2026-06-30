  import { Clock, CheckCircle } from 'lucide-react';

  const orange = '#e04f00';
  const bg = 'var(--color-bg)';
  const card = 'var(--color-card)';
  const border = 'var(--color-border)';
  const text = 'var(--color-text)';
  const muted = 'var(--color-muted)';

  const tableHeader = { textAlign: 'left', padding: '10px 12px', fontSize: '0.6rem', color: muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: `1px solid ${border}` };
  const tableRow = { borderBottom: `1px solid ${border}` };
  const tableCell = { padding: '12px', fontSize: '0.78rem', color: text };

  export function ReservationsTab({ reservations }) {
    return (
      <div style={{ background: card, border: `1px solid ${border}`, borderRadius: '16px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
        <div style={{ fontSize: '0.6rem', color: orange, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '4px' }}>SUIVI</div>
        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: text, marginBottom: '1.25rem' }}>Réservations ({reservations.length})</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>{['Étudiant', 'Enseignant', 'Montant', 'Statut', 'Date'].map(h => <th key={h} style={tableHeader}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {reservations.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: muted }}>Aucune réservation</td></tr>
              ) : reservations.map(r => (
                <tr key={r.id_reservation} style={tableRow}>
                  <td style={tableCell}>
                    <div style={{ fontWeight: 600 }}>{r.etudiant?.prenom} {r.etudiant?.nom}</div>
                    <div style={{ fontSize: '0.65rem', color: muted }}>{r.etudiant?.email}</div>
                  </td>
                  <td style={{ ...tableCell, color: muted }}>{r.creneau?.enseignant?.user?.prenom} {r.creneau?.enseignant?.user?.nom}</td>
                  <td style={{ ...tableCell, color: '#10b981', fontWeight: 700 }}>{r.montant} DH</td>
                  <td style={tableCell}>
                    <span style={{ fontSize: '0.62rem', padding: '3px 8px', borderRadius: '20px', fontWeight: 700, background: r.statut === 'confirmee' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', color: r.statut === 'confirmee' ? '#10b981' : '#f59e0b' }}>{r.statut}</span>
                  </td>
                  <td style={{ ...tableCell, color: muted }}>{new Date(r.created_at).toLocaleDateString('fr-FR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  export function PaiementsTab({ paiements }) {
    return (
      <div style={{ background: card, border: `1px solid ${border}`, borderRadius: '16px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
        <div style={{ fontSize: '0.6rem', color: orange, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '4px' }}>FINANCES</div>
        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: text, marginBottom: '1.25rem' }}>Paiements ({paiements.length})</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>{['Montant', 'Commission (10%)', 'Statut', 'Date'].map(h => <th key={h} style={tableHeader}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {paiements.length === 0 ? (
                <tr><td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: muted }}>Aucun paiement</td></tr>
              ) : paiements.map(p => (
                <tr key={p.id} style={tableRow}>
                  <td style={{ ...tableCell, color: '#10b981', fontWeight: 700 }}>{p.montant} DH</td>
                  <td style={{ ...tableCell, color: orange, fontWeight: 600 }}>{p.comission || 0} DH</td>
                  <td style={tableCell}>
                    <span style={{ fontSize: '0.62rem', padding: '3px 8px', borderRadius: '20px', fontWeight: 700, background: p.statut === 'paye' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', color: p.statut === 'paye' ? '#10b981' : '#f59e0b' }}>
                      {p.statut === 'paye' ? 'Payé' : 'En attente'}
                    </span>
                  </td>
                  <td style={{ ...tableCell, color: muted }}>{new Date(p.created_at).toLocaleDateString('fr-FR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  export function DemandesTab({ demandes }) {
    return (
      <div style={{ background: card, border: `1px solid ${border}`, borderRadius: '16px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
        <div style={{ fontSize: '0.6rem', color: orange, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '4px' }}>DEMANDES ÉTUDIANTS</div>
        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: text, marginBottom: '1.25rem' }}>Demandes ({demandes.length})</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {demandes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: muted }}>Aucune demande</div>
          ) : demandes.map(d => (
            <div key={d.id} style={{ background: bg, border: `1px solid ${border}`, borderRadius: '10px', padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <div style={{ fontWeight: 600, color: text, fontSize: '0.82rem' }}>{d.etudiant?.prenom} {d.etudiant?.nom}</div>
                  <div style={{ fontSize: '0.68rem', color: muted }}>{d.etudiant?.email}</div>
                  <div style={{ fontSize: '0.73rem', color: muted, marginTop: '6px', maxWidth: '500px' }}>{d.message?.substring(0, 100)}...</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.62rem', padding: '3px 8px', borderRadius: '20px', fontWeight: 700, background: d.statut === 'traite' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', color: d.statut === 'traite' ? '#10b981' : '#f59e0b', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    {d.statut === 'traite' ? <CheckCircle size={10} /> : <Clock size={10} />}
                    {d.statut === 'traite' ? 'Traité' : 'En attente'}
                  </span>
                  <span style={{ fontSize: '0.65rem', color: muted }}>{new Date(d.created_at).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  export default function AdminValidatedTeachers() { return null; }