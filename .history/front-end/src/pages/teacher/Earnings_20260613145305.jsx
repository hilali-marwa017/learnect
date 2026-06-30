import React, { useState, useEffect } from 'react';
import { TeacherNavigationActive } from './Dashboard';
import api from '../../api/axios';
import { DollarSign, TrendingUp } from 'lucide-react';

export default function TeacherEarnings() {
  const [paiements, setPaiements] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/paiements/enseignant');
        setPaiements(res.data.paiements);
        setTotal(res.data.total_revenu);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div className="pt-24 pb-16 min-h-screen bg-canvas">
      <div className="max-w-7xl mx-auto px-6 space-y-8 animate-in fade-in duration-300">

        <div className="border-b border-hairline-strong pb-6 space-y-1">
          <span className="text-[10px] uppercase font-bold font-mono text-accent-orange tracking-widest block">ESPACE PROFESSEUR</span>
          <h1 className="text-3xl font-black text-ink tracking-tight">Gains & Paiements</h1>
          <p className="text-charcoal text-xs">Suivez l'historique de vos paiements reçus depuis la plateforme.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <TeacherNavigationActive activeTab="earnings" />

          <div className="flex-grow space-y-8">
            
            {/* Total card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-surface-card border border-hairline-strong p-6 rounded-xl flex items-center gap-4">
                <div className="p-3 bg-accent-green-glow border border-accent-green/15 rounded-lg text-accent-green"><DollarSign className="h-5 w-5" /></div>
                <div>
                  <span className="text-[10px] text-mute uppercase font-bold font-mono block">REVENUS TOTAUX</span>
                  <p className="text-2xl font-black text-ink">{total} MAD</p>
                </div>
              </div>
              <div className="bg-surface-card border border-hairline-strong p-6 rounded-xl flex items-center gap-4">
                <div className="p-3 bg-accent-blue-glow border border-accent-blue/15 rounded-lg text-accent-blue"><TrendingUp className="h-5 w-5" /></div>
                <div>
                  <span className="text-[10px] text-mute uppercase font-bold font-mono block">PAIEMENTS REÇUS</span>
                  <p className="text-2xl font-black text-ink">{paiements.length}</p>
                </div>
              </div>
            </div>

            {/* Liste paiements */}
            <div className="bg-surface-card border border-hairline-strong rounded-2xl p-6 md:p-8 space-y-4">
              <h3 className="font-heading-md text-sm font-bold uppercase tracking-wider text-ink font-mono border-b border-divider-soft pb-3">
                Historique des paiements
              </h3>

              {loading ? (
                <p className="text-xs text-mute text-center py-8 animate-pulse font-mono">Chargement...</p>
              ) : paiements.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-ink">
                    <thead>
                      <tr className="border-b border-hairline text-mute uppercase font-mono text-[9px]">
                        <th className="py-3">ID Paiement</th>
                        <th className="py-3">Montant Total</th>
                        <th className="py-3">Votre Part</th>
                        <th className="py-3">Méthode</th>
                        <th className="py-3">Statut</th>
                        <th className="py-3">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-hairline">
                      {paiements.map((p) => (
                        <tr key={p.id_paiement} className="hover:bg-surface-deep/15 transition-colors">
                          <td className="py-3 font-mono text-mute">#{p.id_paiement}</td>
                          <td className="py-3 font-bold">{p.montantTotal} MAD</td>
                          <td className="py-3 font-bold text-accent-green">{p.montantEnseignant} MAD</td>
                          <td className="py-3 capitalize">{p.methode}</td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase font-mono ${p.statut === 'paye' ? 'bg-accent-green/10 text-accent-green' : 'bg-accent-yellow/10 text-accent-yellow'}`}>
                              {p.statut}
                            </span>
                          </td>
                          <td className="py-3 text-mute">{new Date(p.created_at).toLocaleDateString('fr-FR')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-10 bg-surface-deep/20 rounded-xl">
                  <p className="text-xs text-mute font-mono font-bold">Aucun paiement reçu pour l'instant.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}