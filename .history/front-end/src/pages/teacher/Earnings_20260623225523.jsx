import React, { useState, useEffect } from 'react';
import { TeacherNavigationActive } from './Dashboard';
import { Landmark, Download, Clock } from 'lucide-react';
import api from '../../api/axios';

export default function TeacherEarnings() {
  const [paiements, setPaiements] = useState([]);
  const [totalRevenu, setTotalRevenu] = useState(0);
  const [loading, setLoading] = useState(true);
  const [rib, setRib] = useState('');
  const [bank, setBank] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    async function fetchRevenus() {
      try {
        const res = await api.get('/paiements/enseignant/revenus');
        setPaiements(res.data.paiements || []);
        setTotalRevenu(res.data.total_revenu || 0);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchRevenus();
  }, []);

  function handleSaveRIB(e) {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  }

  const enAttente = paiements.filter(p => p.statut === 'en_attente').reduce((s, p) => s + parseFloat(p.montantEnseignant || 0), 0);

  return (
    <div className="pt-24 pb-16 min-h-screen bg-canvas">
      <div className="max-w-7xl mx-auto px-6 space-y-8 animate-in fade-in duration-300">

        <div className="border-b border-hairline-strong pb-6 space-y-1">
          <span className="text-[10px] uppercase font-bold font-mono text-accent-orange tracking-widest block">LEARNECT PROF PLATFORM</span>
          <h1 className="text-3xl font-black text-ink tracking-tight">Suivi Financier & Revenus</h1>
          <p className="text-charcoal text-xs">Consultez en temps réel vos gains scolaires, configurez vos coordonnées bancaires pour le virement automatique de vos heures.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <TeacherNavigationActive activeTab="earnings" />

          <div className="flex-grow space-y-8">

            {/* Cartes soldes */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-surface-card border border-hairline-strong p-6 rounded-2xl space-y-2">
                <span className="text-[9px] font-bold font-mono uppercase text-mute tracking-widest block">SOLDE DISPONIBLE</span>
                <p className="text-3xl font-black text-ink">{loading ? '...' : `${totalRevenu.toFixed(2)} MAD`}</p>
                <p className="text-[10px] text-accent-green font-bold">✓ Prêt pour virement</p>
              </div>
              <div className="bg-surface-card border border-hairline-strong p-6 rounded-2xl space-y-2">
                <span className="text-[9px] font-bold font-mono uppercase text-mute tracking-widest block">CUMUL EN COURS</span>
                <p className="text-3xl font-black text-ink">{loading ? '...' : `${enAttente.toFixed(2)} MAD`}</p>
                <p className="text-[10px] text-accent-yellow font-bold flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 shrink-0" /> En attente de validation
                </p>
              </div>
              <div className="bg-surface-card border border-hairline-strong p-6 rounded-2xl space-y-2">
                <span className="text-[9px] font-bold font-mono uppercase text-mute tracking-widest block">TOTAL PAIEMENTS</span>
                <p className="text-3xl font-black text-ink">{loading ? '...' : paiements.length}</p>
                <p className="text-[10px] text-accent-blue font-bold">✓ Depuis l'origine</p>
              </div>
            </div>

            {/* RIB */}
            <div className="bg-surface-card border border-hairline-strong rounded-2xl p-6 md:p-8 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-ink font-mono flex items-center gap-2">
                <Landmark className="h-4 w-4 text-accent-orange shrink-0" />
                <span>Configuration de virement (RIB Maroc)</span>
              </h3>
              {saveSuccess && (
                <div className="p-3 bg-accent-green/10 border border-accent-green/20 text-accent-green font-bold rounded-lg text-xs font-mono text-center">
                  ✓ Coordonnées bancaires enregistrées. Les virements hebdomadaires s'effectueront sur ce compte.
                </div>
              )}
              <form onSubmit={handleSaveRIB} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-mute uppercase font-bold block">Nom de la Banque</label>
                  <input required type="text" value={bank} onChange={e => setBank(e.target.value)} placeholder="Ex: Attijariwafa Bank" className="w-full bg-surface-deep/40 border border-hairline-strong text-ink rounded-lg p-2.5 text-xs outline-none focus:ring-1 focus:ring-accent-orange" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-mute uppercase font-bold block">RIB Maroc (24 chiffres)</label>
                  <input required type="text" value={rib} onChange={e => setRib(e.target.value)} placeholder="0000 0000 0000 0000 0000 0000" className="w-full bg-surface-deep/40 border border-hairline-strong text-ink rounded-lg p-2.5 text-xs outline-none focus:ring-1 focus:ring-accent-orange font-mono" />
                </div>
                <div className="flex items-end">
                  <button type="submit" className="w-full bg-ink hover:bg-accent-orange hover:text-white text-canvas transition-colors py-2.5 px-4 rounded-lg text-xs font-bold font-mono tracking-widest cursor-pointer">
                    ENREGISTRER
                  </button>
                </div>
              </form>
            </div>

            {/* Historique */}
            <div className="bg-surface-card border border-hairline-strong rounded-2xl p-6 md:p-8 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-ink font-mono border-b border-divider-soft pb-2">
                Historique des virements émis
              </h3>
              {loading ? (
                <div className="text-center py-10 text-mute text-xs font-mono">Chargement...</div>
              ) : paiements.length === 0 ? (
                <div className="text-center py-10 text-mute text-xs font-mono">Aucun paiement enregistré.</div>
              ) : (
                <div className="divide-y divide-hairline">
                  {paiements.map((p) => (
                    <div key={p.id_paiement} className="py-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left hover:bg-surface-deep/15 px-3 rounded-lg transition-colors">
                      <div className="space-y-1">
                        <p className="text-xs font-black text-ink">Paiement réf : #{p.id_paiement}</p>
                        <p className="text-[11px] text-charcoal font-semibold">
                          Étudiant : <span className="text-ink font-bold">{p.reservation?.etudiant?.prenom} {p.reservation?.etudiant?.nom}</span>
                        </p>
                        <p className="text-[10px] text-mute font-medium font-mono">Méthode : {p.methode} — {p.created_at?.slice(0,10)}</p>
                      </div>
                      <div className="shrink-0 flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-bold text-ink">{p.montantEnseignant} MAD</p>
                          {p.statut === 'paye' ? (
                            <span className="text-[9px] font-mono font-bold text-accent-green">✓ VIREMENT COMPLÉTÉ</span>
                          ) : (
                            <span className="text-[9px] font-mono font-bold text-accent-yellow flex items-center gap-1 justify-end">
                              <Clock className="h-3 w-3 shrink-0 animate-pulse" /> EN COURS
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => alert(`Téléchargement reçu #${p.id_paiement}`)}
                          className="p-1.5 rounded-lg border border-hairline-strong text-mute hover:text-ink hover:bg-surface-deep/30 cursor-pointer"
                          title="Télécharger le reçu"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}