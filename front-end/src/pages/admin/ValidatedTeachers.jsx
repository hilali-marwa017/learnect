import { Clock, CheckCircle } from 'lucide-react';

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
            ) : reservations.map((r, i) => {
              var statutBg = 'rgba(245,158,11,0.1)';
              var statutColor = '#f59e0b';
              var statutLabel = r.statut;
              if (r.statut === 'confirmee') { statutBg = 'rgba(16,185,129,0.1)'; statutColor = '#10b981'; statutLabel = 'confirmee'; }
              if (r.statut === 'annulee') { statutBg = 'rgba(220,38,38,0.08)'; statutColor = '#dc2626'; statutLabel = 'annulee'; }
              if (r.statut === 'terminee') { statutBg = 'rgba(59,130,246,0.08)'; statutColor = '#3b82f6'; statutLabel = 'terminee'; }

              return (
                <tr key={r.id_reservation ?? i} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '12px', fontSize: '0.78rem', color: 'var(--color-text)' }}>
                    <div style={{ fontWeight: 600 }}>{r.etudiant?.prenom} {r.etudiant?.nom}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--color-muted)' }}>{r.etudiant?.email}</div>
                  </td>
                  <td style={{ padding: '12px', fontSize: '0.78rem', color: 'var(--color-muted)' }}>
                    {r.creneau?.enseignant?.user?.prenom} {r.creneau?.enseignant?.user?.nom}
                  </td>
                  <td style={{ padding: '12px', fontSize: '0.78rem', color: '#10b981', fontWeight: 700 }}>
                    {r.montant} DH
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ fontSize: '0.62rem', padding: '3px 8px', borderRadius: '20px', fontWeight: 700, background: statutBg, color: statutColor }}>
                      {statutLabel}
                    </span>
                  </td>
                  <td style={{ padding: '12px', fontSize: '0.78rem', color: 'var(--color-muted)' }}>
                    {new Date(r.created_at).toLocaleDateString('fr-FR')}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

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
            ) : paiements.map((p, i) => {
              var statutBg = 'rgba(245,158,11,0.1)';
              var statutColor = '#f59e0b';
              var statutLabel = 'En attente';
              if (p.statut === 'paye') { statutBg = 'rgba(16,185,129,0.1)'; statutColor = '#10b981'; statutLabel = 'Paye'; }
              if (p.statut === 'rembourse') { statutBg = 'rgba(59,130,246,0.08)'; statutColor = '#3b82f6'; statutLabel = 'Rembourse'; }

              return (
                <tr key={p.id_paiement ?? i} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '12px', fontSize: '0.78rem', color: '#10b981', fontWeight: 700 }}>
                    {p.montantTotal} DH
                  </td>
                  <td style={{ padding: '12px', fontSize: '0.78rem', color: '#e04f00', fontWeight: 600 }}>
                    {p.comission || 0} DH
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ fontSize: '0.62px', padding: '3px 8px', borderRadius: '20px', fontWeight: 700, background: statutBg, color: statutColor, fontSize: '0.62rem' }}>
                      {statutLabel}
                    </span>
                  </td>
                  <td style={{ padding: '12px', fontSize: '0.78rem', color: 'var(--color-muted)' }}>
                    {new Date(p.created_at).toLocaleDateString('fr-FR')}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function DemandesTab({ demandes }) {
  return (
    <div style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '16px', padding: '1.5rem' }}>
      <div style={{ fontSize: '0.6rem', color: '#e04f00', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '4px' }}>DEMANDES ETUDIANTS</div>
      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '1.25rem' }}>
        Demandes ({demandes.length})
      </div>

      {demandes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-muted)' }}>Aucune demande</div>
      ) : demandes.map((d, i) => {
        var statutBg = 'rgba(59,130,246,0.1)';
        var statutColor = '#3b82f6';
        var statutLabel = 'Active';
        var StatutIcon = Clock;
        if (d.statut === 'acceptee') { statutBg = 'rgba(16,185,129,0.1)'; statutColor = '#10b981'; statutLabel = 'Acceptee'; StatutIcon = CheckCircle; }
        if (d.statut === 'expiree') { statutBg = 'rgba(107,114,128,0.1)'; statutColor = '#6b7280'; statutLabel = 'Expiree'; StatutIcon = Clock; }

        return (
          <div key={d.id_demande ?? i} style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '10px', padding: '1rem', marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--color-text)', fontSize: '0.82rem' }}>
                  {d.etudiant?.prenom} {d.etudiant?.nom}
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--color-muted)' }}>{d.etudiant?.email}</div>
                <div style={{ fontSize: '0.73rem', color: '#e04f00', fontWeight: 600, marginTop: '4px' }}>
                  {d.matiere}
                </div>
                {d.message && (
                  <div style={{ fontSize: '0.73rem', color: 'var(--color-muted)', marginTop: '4px', maxWidth: '500px' }}>
                    {d.message.substring(0, 100)}...
                  </div>
                )}
                <div style={{ fontSize: '0.7rem', color: 'var(--color-muted)', marginTop: '4px' }}>
                  Budget max : <strong style={{ color: 'var(--color-text)' }}>{d.budgetMax} MAD/h</strong>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.62rem', padding: '3px 8px', borderRadius: '20px', fontWeight: 700, background: statutBg, color: statutColor, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <StatutIcon size={10} /> {statutLabel}
                </span>
                <span style={{ fontSize: '0.65rem', color: 'var(--color-muted)' }}>
                  {new Date(d.created_at).toLocaleDateString('fr-FR')}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}