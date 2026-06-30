import { useState } from 'react';
import api from '../api/axios';

function TutorDetailModal({ tutor, onClose, onNewBooking }) {
  var [selectedDate, setSelectedDate] = useState('');
  var [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  var [bookingConfirmed, setBookingConfirmed] = useState(false);
  var [loading, setLoading] = useState(false);
  var [error, setError] = useState('');

  var user = tutor.user || {};
  var nomComplet = (user.prenom || '') + ' ' + (user.nom || '');
  var tarif = tutor.tarifHeure || 0;
  var matieres = tutor.matieres || [];
  var premiereMatiere = matieres.length > 0 ? matieres[0].nom : 'Professeur';
  var description = tutor.description_profil || 'Aucune description';

  var TIME_SLOTS = ['09:00 - 11:00', '11:00 - 13:00', '15:00 - 17:00', '18:00 - 20:00'];

  async function handleBookingConfirm(e) {
    e.preventDefault();
    if (!selectedDate || !selectedTimeSlot) return;

    setLoading(true);
    setError('');

    try {
      var response = await api.post('/reservations', {
        id_creneau: null,
        date: selectedDate,
        methode: 'simulation'
      });

      setBookingConfirmed(true);
      if (onNewBooking) {
        onNewBooking(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la réservation');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl overflow-hidden shadow-2xl">
        
        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
          <h3 className="text-lg font-bold text-ink">Réserver un cours</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          <div className="flex gap-4">
            <div className="w-20 h-20 rounded-full bg-accent-orange/20 flex items-center justify-center">
              <svg className="h-10 w-10 text-accent-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-ink">{nomComplet}</h2>
              <p className="text-charcoal text-sm">{premiereMatiere}</p>
              <p className="text-ink font-bold mt-1">{tarif} MAD / heure</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <p className="text-charcoal text-sm italic">"{description}"</p>
          </div>

          {!bookingConfirmed ? (
            <form onSubmit={handleBookingConfirm} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-100 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-mute mb-1">DATE SOUHAITÉE</label>
                <input type="date" required value={selectedDate} onChange={function(e) { setSelectedDate(e.target.value); }} className="w-full border rounded-lg p-2 text-sm" />
              </div>

              <div>
                <label className="block text-xs font-bold text-mute mb-1">CRÉNEAU HORAIRE</label>
                <div className="grid grid-cols-2 gap-2">
                  {TIME_SLOTS.map(function(slot, idx) {
                    return (
                      <button key={idx} type="button" onClick={function() { setSelectedTimeSlot(slot); }} className={`p-2 rounded-lg border text-sm text-center ${selectedTimeSlot === slot ? 'bg-accent-orange text-white border-accent-orange' : 'border-gray-300 hover:bg-gray-50'}`}>
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button type="submit" disabled={!selectedDate || !selectedTimeSlot || loading} className="w-full bg-ink text-white py-3 rounded-lg font-bold disabled:opacity-50">
                {loading ? 'Chargement...' : 'RÉSERVER CE COURS'}
              </button>
            </form>
          ) : (
            <div className="text-center py-6">
              <svg className="h-16 w-16 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <h3 className="text-xl font-bold text-ink mb-2">Réservation confirmée !</h3>
              <p className="text-charcoal text-sm mb-4">Votre demande a été envoyée au professeur.</p>
              <button onClick={onClose} className="bg-ink text-white px-6 py-2 rounded-lg">Fermer</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TutorDetailModal;