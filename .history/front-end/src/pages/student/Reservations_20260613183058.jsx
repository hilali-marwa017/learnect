import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { Calendar, Trash2 } from 'lucide-react';

export default function StudentReservations() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(function() {
    api.get('/reservations')
      .then(function(response) {
        setReservations(response.data);
        setLoading(false);
      })
      .catch(function(err) {
        console.error(err);
        setLoading(false);
      });
  }, []);

  async function handleCancelReservation(id) {
    if (window.confirm('Voulez-vous vraiment annuler cette réservation ?')) {
      try {
        await api.delete(`/reservations/${id}`);
        setReservations(reservations.filter(function(r) { return r.id_reservation !== id; }));
      } catch (err) {
        console.error(err);
        alert('Erreur lors de l\'annulation');
      }
    }
  }

  if (loading) {
    return (
      <div className="pt-24 pb-16 min-h-screen bg-canvas flex items-center justify-center">
        <div className="spinner-border text-accent-orange"></div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-canvas">
      <div className="max-w-7xl mx-auto px-6 space-y-8">
        
        <div className="border-b border-hairline-strong pb-6">
          <h1 className="text-3xl font-black text-ink tracking-tight">Mes Réservations</h1>
          <p className="text-charcoal text-xs mt-1">Suivez l'historique complet de vos cours réservés.</p>
        </div>

        {reservations.length > 0 ? (
          <div className="space-y-4">
            {reservations.map(function(r) {
              return (
                <div key={r.id_reservation} className="bg-surface-card border border-hairline-strong rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4 flex-col sm:flex-row text-center sm:text-left">
                    <div className="h-14 w-14 rounded-xl bg-accent-orange/20 flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-accent-orange" />
                    </div>
                    <div>
                      <h3 className="font-bold text-ink">Cours du {r.date}</h3>
                      <p className="text-charcoal text-sm">{r.creneau?.heure_debut} • {r.montant} DH</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${r.statut === 'confirmee' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {r.statut === 'confirmee' ? 'Confirmé' : 'En attente'}
                    </span>
                    {r.statut !== 'confirmee' && (
                      <button onClick={function() { handleCancelReservation(r.id_reservation); }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-surface-card border border-hairline rounded-xl">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h3 className="font-bold text-lg text-ink mb-1">Aucune réservation</h3>
            <p className="text-charcoal text-sm">Vous n'avez pas encore réservé de cours.</p>
            <Link to="/teachers" className="inline-block mt-4 bg-ink text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-gray-700">
              Découvrir les professeurs
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}