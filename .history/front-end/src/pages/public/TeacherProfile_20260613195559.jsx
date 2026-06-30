import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../api/axios.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { Star, MapPin, Clock, Calendar, CheckCircle, ArrowLeft } from 'lucide-react'

export default function TeacherProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [enseignant, setEnseignant] = useState(null)
  const [loading, setLoading] = useState(true)
  const [creneaux, setCreneaux] = useState([])
  const [selectedCreneau, setSelectedCreneau] = useState(null)
  const [date, setDate] = useState('')
  const [methode, setMethode] = useState('cash')
  const [booking, setBooking] = useState(false)
  const [bookingDone, setBookingDone] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ensRes, creneauxRes] = await Promise.all([
          api.get(`/enseignants/${id}`),
          api.get(`/creneaux/${id}`)
        ])
        setEnseignant(ensRes.data)
        setCreneaux(creneauxRes.data.filter(c => c.estDisponible))
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  const handleReserver = async () => {
    if (!selectedCreneau || !date) { setErrorMsg('Veuillez choisir un créneau et une date.'); return }
    if (!user) { navigate('/login'); return }
    setBooking(true)
    setErrorMsg('')
    try {
      await api.post('/reservations', { id_creneau: selectedCreneau, date, methode })
      setBookingDone(true)
    } catch (e) {
      setErrorMsg(e.response?.data?.message || 'Erreur lors de la réservation.')
    } finally {
      setBooking(false)
    }
  }

  if (loading) return <div className="pt-24 text-center py-20 text-xs text-mute font-mono animate-pulse">Chargement...</div>
  if (!enseignant) return <div className="pt-24 text-center py-20 text-xs text-mute">Professeur introuvable.</div>

  const avatarUrl = enseignant.user?.photo ? `http://localhost:8000/storage/${enseignant.user.photo}` : `https://ui-avatars.com/api/?name=${enseignant.user?.prenom}+${enseignant.user?.nom}&background=e04f00&color=fff&size=128`

  return (
    <div className="pt-24 pb-16 min-h-screen bg-canvas">
      <div className="max-w-6xl mx-auto px-6 space-y-8 animate-in fade-in duration-300">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-xs text-mute hover:text-ink font-semibold transition-colors cursor-pointer">
          <ArrowLeft className="h-4 w-4" /><span>Retour</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-surface-card border border-hairline-strong rounded-2xl p-6 md:p-8 flex gap-6 items-start">
              <img src={avatarUrl} alt="" className="h-24 w-24 rounded-xl object-cover border border-hairline-strong shrink-0" />
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-black text-ink">{enseignant.user?.prenom} {enseignant.user?.nom}</h1>
                  {enseignant.estVerifie && <span className="bg-accent-green/10 border border-accent-green/20 text-accent-green text-[9px] font-bold px-2 py-0.5 rounded font-mono">✓ VÉRIFIÉ</span>}
                </div>
                <p className="text-xs text-accent-orange font-bold">{enseignant.titre}</p>
                <div className="flex items-center gap-4 text-xs text-mute">
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{enseignant.user?.ville}</span>
                  <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-accent-yellow text-accent-yellow" />{enseignant.noteMoyenne}/5</span>
                </div>
                <div className="flex gap-2 flex-wrap pt-1">
                  {enseignant.matieres?.map(m => (
                    <span key={m.id_matiere} className="px-2 py-0.5 bg-surface-elevated border border-hairline rounded text-[10px] font-bold text-charcoal">{m.nom}</span>
                  ))}
                </div>
              </div>
            </div>

            {enseignant.description_profil && (
              <div className="bg-surface-card border border-hairline-strong rounded-2xl p-6 space-y-3">
                <h3 className="text-sm font-bold text-ink uppercase tracking-wider font-mono">À propos</h3>
                <p className="text-charcoal text-sm leading-relaxed">{enseignant.description_profil}</p>
              </div>
            )}

            {enseignant.description_cours && (
              <div className="bg-surface-card border border-hairline-strong rounded-2xl p-6 space-y-3">
                <h3 className="text-sm font-bold text-ink uppercase tracking-wider font-mono">Méthode Pédagogique</h3>
                <p className="text-charcoal text-sm leading-relaxed">{enseignant.description_cours}</p>
              </div>
            )}

            {enseignant.avis?.length > 0 && (
              <div className="bg-surface-card border border-hairline-strong rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-ink uppercase tracking-wider font-mono border-b border-divider-soft pb-2">Avis des étudiants</h3>
                {enseignant.avis.map(a => (
                  <div key={a.id_avis} className="p-4 bg-surface-deep/30 rounded-xl space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-3 w-3 ${i < a.note ? 'fill-accent-yellow text-accent-yellow' : 'text-stone'}`} />
                        ))}
                      </div>
                      <span className="text-[10px] text-mute font-mono">{a.etudiant?.prenom} {a.etudiant?.nom}</span>
                    </div>
                    <p className="text-xs text-charcoal italic">"{a.commentaire}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="bg-surface-card border border-hairline-strong rounded-2xl p-6 space-y-4 sticky top-24">
              <div className="flex justify-between items-center border-b border-divider-soft pb-3">
                <div>
                  <span className="text-[10px] text-mute uppercase font-mono block">TARIF HORAIRE</span>
                  <span className="text-2xl font-black text-ink">{enseignant.tarifHeure} MAD<span className="text-sm font-normal text-mute">/h</span></span>
                </div>
                <span className="text-xs bg-accent-green/10 border border-accent-green/20 text-accent-green px-2 py-1 rounded font-bold font-mono">1er cours offert</span>
              </div>

              {bookingDone ? (
                <div className="p-6 bg-accent-green/10 border border-accent-green/20 rounded-xl text-center space-y-2">
                  <CheckCircle className="h-8 w-8 text-accent-green mx-auto" />
                  <p className="font-bold text-sm text-ink">Réservation créée !</p>
                  <p className="text-xs text-charcoal">Accédez à vos réservations pour confirmer le paiement.</p>
                  <button onClick={() => navigate('/student/reservations')} className="mt-3 w-full bg-ink text-canvas py-2 rounded-lg text-xs font-bold">Mes réservations</button>
                </div>
              ) : (
                <div className="space-y-4">
                  {errorMsg && <div className="p-3 bg-accent-red/10 border border-accent-red/20 text-accent-red text-xs font-bold rounded-lg">{errorMsg}</div>}

                  <div className="space-y-2">
                    <label className="text-[10px] text-mute uppercase font-mono font-bold block">Choisir un créneau</label>
                    <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                      {creneaux.length > 0 ? creneaux.map(c => (
                        <button key={c.id_creneau} onClick={() => setSelectedCreneau(c.id_creneau)}
                          className={`p-3 rounded-lg border text-xs font-semibold text-left transition-all cursor-pointer ${selectedCreneau === c.id_creneau ? 'border-accent-orange bg-accent-orange/10 text-ink' : 'border-hairline bg-surface-deep/30 text-charcoal hover:border-accent-orange/40'}`}>
                          <span className="capitalize font-bold">{c.jour}</span>
                          <span className="text-mute ml-2">{c.heureDebut} → {c.heureFin}</span>
                        </button>
                      )) : (
                        <p className="text-xs text-mute text-center py-4 font-mono">Aucun créneau disponible.</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] text-mute uppercase font-mono font-bold block">Date souhaitée</label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} min={new Date().toISOString().split('T')[0]}
                      className="w-full bg-surface-deep/30 border border-hairline-strong text-ink rounded-lg p-2.5 text-xs outline-none focus:ring-1 focus:ring-accent-orange" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] text-mute uppercase font-mono font-bold block">Mode de paiement</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[{ val: 'cash', label: '💵 Cash' }, { val: 'simulation', label: '💳 Simulation' }].map(m => (
                        <button key={m.val} onClick={() => setMethode(m.val)}
                          className={`p-2.5 rounded-lg border text-xs font-bold cursor-pointer transition-all ${methode === m.val ? 'border-accent-orange bg-accent-orange/10 text-ink' : 'border-hairline text-mute hover:border-accent-orange/40'}`}>
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button onClick={handleReserver} disabled={booking || !selectedCreneau || !date}
                    className="w-full bg-ink text-canvas hover:bg-accent-orange hover:text-white py-3 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer disabled:opacity-60">
                    {booking ? 'RÉSERVATION EN COURS...' : 'RÉSERVER CE COURS'}
                  </button>

                  {!user && (
                    <p className="text-center text-[10px] text-mute">Vous devez être <button onClick={() => navigate('/login')} className="text-accent-orange underline font-bold cursor-pointer">connecté</button> pour réserver.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}