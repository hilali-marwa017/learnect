import { useState, useEffect } from 'react';
import api from '../../api/axios';

export default function TutorDetailModal({ tutor, onClose, onNewBooking }) {
  const [activeTab, setActiveTab] = useState('book');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  var user = tutor.user || {};
  var matieres = tutor.matieres || [];
  var premiereMatiere = matieres.length > 0 ? matieres[0].nom : 'Professeur';
  var note = tutor.noteMoyenne || 0;
  var nbAvis = tutor.avis ? tutor.avis.length : 0;
  var tarif = tutor.tarifHeure || 0;
  var ville = user.ville || 'Maroc';
  var nomComplet = (user.prenom || '') + ' ' + (user.nom || '');
  var isFirstFree = true;

  var TIME_SLOTS = ['09:00 - 11:00', '11:00 - 13:00', '15:00 - 17:00', '18:00 - 20:00'];

  function renderStars() {
    var stars = [];
    var roundedNote = Math.round(note);
    for (var i = 1; i <= 5; i++) {
      if (i <= roundedNote) {
        stars.push(<svg key={i} className="h-3.5 w-3.5 fill-accent-yellow text-accent-yellow" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>);
      } else {
        stars.push(<svg key={i} className="h-3.5 w-3.5 text-mute" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>);
      }
    }
    return stars;
  }

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

      var newBookingRecord = {
        id: response.data.reservation.id_reservation,
        tutorId: tutor.utilisateur_id,
        subject: premiereMatiere,
        date: selectedDate,
        time: selectedTimeSlot,
        status: response.data.reservation.statut,
        montant: response.data.reservation.montant
      };

      setBookingData(newBookingRecord);
      setBookingConfirmed(true);
      if (onNewBooking) {
        onNewBooking(newBookingRecord);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la réservation');
    } finally {
      setLoading(false);
    }
  }

  function resetBooking() {
    setBookingConfirmed(false);
    setSelectedDate('');
    setSelectedTimeSlot('');
    setError('');
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-canvas/80 backdrop-blur-sm p-0 md:p-4">
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

      <div className="relative w-full max-w-4xl h-full md:h-[90vh] bg-surface-card border-l md:border border-hairline-strong shadow-2xl flex flex-col md:rounded-xl overflow-hidden z-10">
        
        <div className="p-6 border-b border-hairline flex justify-between items-center bg-surface-elevated/40">
          <div className="flex items-center gap-3">
            <div className="h-2.5 w-2.5 rounded-full bg-accent-green" />
            <span className="text-xs text-ash tracking-widest font-caption uppercase">PRÉCONFIRMATION</span>
          </div>
          <button onClick={onClose} className="p-1 px-2 rounded-md hover:bg-surface-elevated text-charcoal cursor-pointer">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 min-h-0 bg-canvas">
          
          {/* Left Column: Tutor Profile */}
          <div className="col-span-1 md:col-span-6 p-6 border-b md:border-b-0 md:border-r border-hairline flex flex-col gap-6 overflow-y-auto">
            
            <div className="flex gap-4 items-start">
              <div className="h-24 w-24 rounded-lg overflow-hidden border border-hairline-strong shadow-md shrink-0 bg-gradient-to-br from-accent-orange/20 to-accent-blue/20 flex items-center justify-center">
                <svg className="h-12 w-12 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="font-display-xl text-2xl text-ink font-semibold">{nomComplet}</h2>
                  <div className="flex items-center gap-0.5 bg-accent-yellow/10 border border-accent-yellow/20 px-1.5 py-0.5 rounded text-accent-yellow text-xs font-bold">
                    {renderStars()}
                    <span>{note.toFixed(1)}</span>
                  </div>
                </div>
                <p className="text-xs text-accent-blue font-bold tracking-wide uppercase flex items-center gap-1">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <span>{ville}, Maroc</span>
                </p>
                <p className="text-xs text-ash line-clamp-2 leading-relaxed mt-1">{tutor.titre || 'Professeur particulier'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-surface-deep/40 p-3 rounded-lg border border-hairline">
              <div className="p-2 space-y-1">
                <span className="text-[10px] text-ash block uppercase tracking-wider font-caption">TARIF HORAIRE</span>
                <span className="text-sm font-bold text-ink">{tarif} MAD / heure</span>
              </div>
              <div className="p-2 space-y-1">
                <span className="text-[10px] text-ash block uppercase tracking-wider font-caption">RÉPONSE MOYENNE</span>
                <span className="text-sm font-bold text-accent-green">&lt; 24 heures</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs uppercase tracking-widest text-ash font-bold font-caption">Présentation</h4>
              <p className="text-charcoal text-sm leading-relaxed bg-surface-card p-4 rounded-lg border border-divider-soft italic font-light">"{tutor.description_profil || 'Aucune description'}"</p>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs uppercase tracking-widest text-ash font-bold font-caption">Diplômes & Certifications</h4>
              <ul className="space-y-3">
                <li className="flex gap-3 text-xs text-body leading-relaxed items-start">
                  <div className="p-1 rounded-full bg-accent-blue/10 border border-accent-blue/20 shrink-0 mt-0.5">
                    <svg className="h-3.5 w-3.5 text-accent-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  </div>
                  <div>
                    <p className="font-medium text-ink">{tutor.diplome || 'Diplôme non spécifié'}</p>
                    <p className="text-[10px] text-ash uppercase font-caption tracking-wide">STATUT : VÉRIFIÉ</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Booking */}
          <div className="col-span-1 md:col-span-6 flex flex-col h-full overflow-hidden bg-surface-deep/30">
            
            <div className="flex border-b border-hairline bg-surface-card">
              <button onClick={function() { setActiveTab('book'); }} className={`flex-1 py-4 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 border-b-2 transition-all ${activeTab === 'book' ? 'border-accent-orange text-ink bg-canvas/30' : 'border-transparent text-charcoal'}`}>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <span>Cours Particulier</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 min-h-0">
              {activeTab === 'book' && (
                <div className="space-y-6">
                  {!bookingConfirmed ? (
                    <form onSubmit={handleBookingConfirm} className="space-y-5">
                      {error && <div className="p-3 bg-accent-red/10 border border-accent-red/20 rounded-lg text-accent-red text-xs">{error}</div>}

                      <div className="space-y-2">
                        <label className="text-xs text-ash uppercase font-caption tracking-wider block">Matière de la leçon</label>
                        <input type="text" value={premiereMatiere} disabled className="w-full bg-surface-deep/30 border border-hairline-strong text-ink rounded-lg p-3 text-sm" />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs text-ash uppercase font-caption tracking-wider block">Choisir la date souhaitée</label>
                        <input type="date" required value={selectedDate} onChange={function(e) { setSelectedDate(e.target.value); }} min={new Date().toISOString().split('T')[0]} className="w-full bg-surface-card border border-hairline-strong text-ink rounded-lg p-3 text-sm focus:ring-1 focus:ring-accent-orange" />
                      </div>

                      <div className="space-y-3">
                        <label className="text-xs text-ash uppercase font-caption tracking-wider block">Créneaux horaires disponibles</label>
                        <div className="grid grid-cols-2 gap-2">
                          {TIME_SLOTS.map(function(slot, idx) {
                            return (
                              <button key={idx} type="button" onClick={function() { setSelectedTimeSlot(slot); }} className={`p-3 rounded-lg border text-xs font-semibold text-center transition-all cursor-pointer ${selectedTimeSlot === slot ? 'border-accent-orange bg-accent-orange/10 text-ink shadow-sm' : 'border-hairline bg-surface-card hover:bg-surface-elevated text-ash'}`}>
                                {slot}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="pt-2">
                        <div className="bg-surface-elevated border border-hairline p-3 rounded-lg flex items-center gap-3 text-xs text-ash">
                          <svg className="h-4.5 w-4.5 text-accent-green shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          <span>{isFirstFree ? 'Premier cours offert !' : 'Paiement sécurisé'}</span>
                        </div>
                      </div>

                      <button type="submit" disabled={!selectedDate || !selectedTimeSlot || loading} className="w-full bg-ink text-canvas hover:bg-ash disabled:bg-stone disabled:text-charcoal py-3 rounded-lg font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer">
                        {loading ? 'Chargement...' : <><svg className="h-4 w-4 text-accent-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg><span>Réserver la première heure</span></>}
                      </button>
                    </form>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center py-6 space-y-6">
                      <div className="relative py-4">
                        <div className="h-16 w-16 bg-accent-green/10 rounded-full flex items-center justify-center border border-accent-green/30 relative z-10">
                          <svg className="h-8 w-8 text-accent-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-heading-md text-xl text-ink font-bold">Réservation confirmée !</h3>
                        <p className="text-charcoal text-xs max-w-sm mx-auto leading-relaxed">Votre demande de cours particulier a été validée.</p>
                      </div>

                      <div className="w-full max-w-sm bg-surface-card border border-hairline p-4 rounded-xl space-y-3 text-left">
                        <div className="flex justify-between items-center pb-2 border-b border-divider-soft">
                          <span className="text-ash uppercase tracking-wider font-semibold">RÉFÉRENCE</span>
                          <span className="text-ink font-mono font-bold uppercase">{bookingData?.id || 'PENDING'}</span>
                        </div>
                        <div className="space-y-2 text-charcoal">
                          <p className="flex justify-between"><span>Matière :</span><span className="text-ink font-medium">{bookingData?.subject}</span></p>
                          <p className="flex justify-between"><span>Date :</span><span className="text-ink font-medium">{bookingData?.date}</span></p>
                          <p className="flex justify-between"><span>Horaire :</span><span className="text-ink font-medium">{bookingData?.time}</span></p>
                          <p className="flex justify-between"><span>Frais :</span><span className="text-accent-green font-semibold">À confirmer</span></p>
                        </div>
                      </div>

                      <div className="flex gap-2 w-full max-w-sm">
                        <button onClick={resetBooking} className="flex-1 border border-hairline hover:bg-surface-elevated py-2.5 rounded-lg text-xs font-semibold text-ink transition-all">Autre cours</button>
                        <button onClick={onClose} className="flex-1 bg-ink text-canvas hover:bg-ash py-2.5 rounded-lg text-xs font-bold transition-all">Fermer</button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}