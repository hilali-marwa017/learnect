import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'

// ─── Map backend response → tutor object ─────────────────────────
function mapEnseignant(e) {
  return {
    id: String(e.utilisateur_id),
    name: `${e.user?.prenom || ''} ${e.user?.nom || ''}`.trim(),
    role: e.titre || 'Professeur de Soutien Scolaire',
    city: e.user?.ville || 'Maroc',
    rating: parseFloat(e.noteMoyenne) || 0,
    bio: e.description_profil || '',
    avatar: e.user?.photo
      ? `http://localhost:8000/storage/${e.user.photo}`
      : `https://ui-avatars.com/api/?name=${encodeURIComponent((e.user?.prenom || 'P') + '+' + (e.user?.nom || 'N'))}&background=e96f2a&color=fff&size=200`,
    rate: parseFloat(e.tarifHeure) || 0,
    subjects: e.matieres?.map(m => m.nom) || [],
    domicile: Boolean(e.cours_domicile),
    enligne: Boolean(e.cours_enligne),
  }
}

const SUBJECTS_LIST = ['Mathématiques','Physique-Chimie','SVT','Français','Anglais','Arabe','Espagnol','Philosophie','Code','Python','Web Dev','Économie']
const CITIES_LIST   = ['Casablanca','Rabat','Marrakech','Tanger','Agadir','Fès','Meknès','Oujda','Kénitra','Tétouan','Salé']
const SUBJECT_PILLS = ['Mathématiques','Anglais','Arabe','Physique-Chimie','Français','SVT','Code']

const FAQS = [
  { q: 'Comment est vérifié le profil des professeurs ?',      a: "Chaque professeur doit soumettre une CIN et ses diplômes. Nos admins vérifient manuellement chaque document sous 24h avant de valider l'annonce." },
  { q: 'Le premier cours est-il vraiment offert ?',             a: "Oui ! Nos tuteurs certifiés proposent une première heure de diagnostic 100% offerte pour analyser le niveau et définir le rythme de travail." },
  { q: "Y a-t-il des frais d'inscription ou un abonnement ?",  a: "Aucun. L'inscription sur Learnect.ma est entièrement gratuite. Les tarifs affichés sont directs, sans surcoût caché." },
  { q: "Puis-je changer de professeur en cours d'année ?",      a: "Oui, vous êtes libre de changer à tout moment si la pédagogie ou les horaires ne correspondent plus à vos besoins." },
]

export default function Home({ theme, onToggleTheme }) {
  const navigate = useNavigate()
  const isDark   = theme === 'dark'

  // ── State ─────────────────────────────────────────────────────
  const [tutors,          setTutors]          = useState([])
  const [loading,         setLoading]         = useState(true)
  const [error,           setError]           = useState('')
  const [querySubject,    setQuerySubject]    = useState('')
  const [queryCity,       setQueryCity]       = useState('')
  const [activePill,      setActivePill]      = useState(null)
  const [showSubjectDrop, setShowSubjectDrop] = useState(false)
  const [showCityDrop,    setShowCityDrop]    = useState(false)
  const [favorites,       setFavorites]       = useState([])
  const [openFaq,         setOpenFaq]         = useState(null)

  // ── Fetch (méthode DAIF) ──────────────────────────────────────
  useEffect(function () {
    async function fetchTutors() {
      try {
        setLoading(true)
        setError('')
        const res = await api.get('/enseignants')
        setTutors(res.data.map(mapEnseignant))
      } catch (err) {
        setError('Impossible de charger les professeurs. Vérifiez que le serveur est démarré.')
      } finally {
        setLoading(false)
      }
    }
    fetchTutors()
  }, [])

  // ── Filter ────────────────────────────────────────────────────
  const filteredTutors = tutors.filter(function (t) {
    const subjectMatch = activePill
      ? t.subjects.some(s => s.toLowerCase().includes(activePill.toLowerCase()))
      : querySubject
        ? t.subjects.some(s => s.toLowerCase().includes(querySubject.toLowerCase())) ||
          t.role.toLowerCase().includes(querySubject.toLowerCase())
        : true
    const cityMatch = queryCity
      ? t.city.toLowerCase().includes(queryCity.toLowerCase())
      : true
    return subjectMatch && cityMatch
  })

  // ── Handlers ─────────────────────────────────────────────────
  function handlePill(pill) {
    setActivePill(prev => prev === pill ? null : pill)
    setQuerySubject('')
    setTimeout(function () {
      document.getElementById('tutors-section')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  function handleSearch() {
    document.getElementById('tutors-section')?.scrollIntoView({ behavior: 'smooth' })
  }

  function handleReset() {
    setQuerySubject('')
    setQueryCity('')
    setActivePill(null)
  }

  function handleToggleFav(e, id) {
    e.stopPropagation()
    setFavorites(function (prev) {
      return prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    })
  }

  // ── Theme tokens ──────────────────────────────────────────────
  const bg     = isDark ? '#0d0d0d' : '#ffffff'
  const bgSurf = isDark ? '#141414' : '#f7f8fa'
  const bgCard = isDark ? '#1a1a1a' : '#ffffff'
  const bdr    = isDark ? '#2a2a2a' : '#e9ecef'
  const ink    = isDark ? '#f0f0f0' : '#111111'
  const muted  = isDark ? '#888888' : '#666666'
  const dimmed = isDark ? '#444444' : '#aaaaaa'
  const orange = '#e96f2a'
  const blue   = '#378add'
  const green  = '#1d9e75'

  // ── Shared styles ─────────────────────────────────────────────
  const secBadge = function (color) {
    return { fontSize: '0.65rem', letterSpacing: '0.2em', fontWeight: 700, textTransform: 'uppercase', color, display: 'block', marginBottom: '0.5rem' }
  }
  const secTitle = { fontSize: '2rem', fontWeight: 800, color: ink, lineHeight: 1.1, letterSpacing: '-0.01em', marginBottom: '0.4rem' }
  const card     = { background: bgCard, border: `1px solid ${bdr}`, borderRadius: 14, overflow: 'hidden', cursor: 'pointer', transition: 'transform .2s, box-shadow .2s' }

  // ─────────────────────────────────────────────────────────────
  return (
    <div style={{ background: bg, color: ink, fontFamily: "'Segoe UI', Arial, sans-serif", minHeight: '100vh' }}>

      {/* ══ NAVBAR ════════════════════════════════════════════════ */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 99, background: bgCard, borderBottom: `1px solid ${bdr}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', height: 60 }}>

        <div style={{ fontWeight: 800, fontSize: '1.15rem', color: ink, cursor: 'pointer' }} onClick={() => navigate('/')}>
          Learn<span style={{ color: orange }}>ect.ma</span>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.82rem' }}>
          {[
            { label: 'Trouver un Prof',     path: '/teachers' },
            { label: 'Comment ça marche',   id: 'how-it-works' },
            { label: 'Qualité certifiée',   id: 'features-section' },
          ].map(function (link) {
            return (
              <span key={link.label}
                style={{ color: muted, cursor: 'pointer', transition: 'color .15s' }}
                onClick={function () {
                  if (link.path) { navigate(link.path) }
                  else { document.getElementById(link.id)?.scrollIntoView({ behavior: 'smooth' }) }
                }}
                onMouseEnter={e => e.target.style.color = orange}
                onMouseLeave={e => e.target.style.color = muted}>
                {link.label}
              </span>
            )
          })}
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button onClick={onToggleTheme}
            style={{ background: bgSurf, border: `1px solid ${bdr}`, borderRadius: 8, padding: '6px 12px', cursor: 'pointer', color: ink, fontSize: '0.78rem', fontWeight: 600 }}>
            {isDark ? '☀️ Mode clair' : '🌙 Mode sombre'}
          </button>
          <button onClick={() => navigate('/login')}
            style={{ background: 'none', border: `1px solid ${bdr}`, borderRadius: 8, padding: '6px 14px', cursor: 'pointer', color: ink, fontWeight: 600, fontSize: '0.78rem' }}>
            Connexion
          </button>
          <button onClick={() => navigate('/register')}
            style={{ background: ink, color: bg, border: 'none', borderRadius: 8, padding: '7px 14px', cursor: 'pointer', fontWeight: 700, fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: 5 }}>
            ✦ Devenir Tuteur
          </button>
        </div>
      </nav>

      {/* ══ HERO ══════════════════════════════════════════════════ */}
      <section style={{ padding: '5rem 2rem 3rem', textAlign: 'center', background: bg }}>
        <span style={secBadge(orange)}>Soutien Scolaire d'Exception au Maroc</span>
        <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 800, color: ink, lineHeight: 1.05, letterSpacing: '-0.03em', margin: '0 auto 1.2rem', maxWidth: 620 }}>
          Trouvez le professeur parfait
        </h1>
        <p style={{ fontSize: '0.95rem', color: muted, maxWidth: 480, margin: '0 auto 2.5rem', lineHeight: 1.75 }}>
          Soutien scolaire certifié, méthodologique et sur-mesure pour les étudiants marocains. Premier cours offert par nos tuteurs.
        </p>

        {/* Search bar */}
        <div style={{ display: 'flex', alignItems: 'center', background: bgCard, border: `1.5px solid ${bdr}`, borderRadius: 14, padding: 6, maxWidth: 700, margin: '0 auto 1.5rem', boxShadow: isDark ? 'none' : '0 2px 16px rgba(0,0,0,0.06)', position: 'relative' }}>

          {/* Matière */}
          <div style={{ flex: 1, position: 'relative', borderRight: `1px solid ${bdr}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px' }}>
              <span style={{ color: dimmed, fontSize: 16 }}>🔍</span>
              <input
                value={querySubject}
                onChange={e => { setQuerySubject(e.target.value); setActivePill(null) }}
                onFocus={() => setShowSubjectDrop(true)}
                onBlur={() => setTimeout(() => setShowSubjectDrop(false), 200)}
                placeholder="Quelle matière ? (Maths, SVT...)"
                style={{ background: 'none', border: 'none', outline: 'none', color: ink, fontSize: '0.83rem', width: '100%' }}
              />
              {querySubject && (
                <span onClick={() => setQuerySubject('')} style={{ color: dimmed, cursor: 'pointer', fontSize: '0.75rem', flexShrink: 0 }}>✕</span>
              )}
            </div>
            {showSubjectDrop && (
              <div style={{ position: 'absolute', top: '110%', left: 0, right: 0, background: bgCard, border: `1px solid ${bdr}`, borderRadius: 12, zIndex: 60, overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
                {SUBJECTS_LIST
                  .filter(s => !querySubject || s.toLowerCase().includes(querySubject.toLowerCase()))
                  .slice(0, 7)
                  .map(function (s) {
                    return (
                      <div key={s}
                        onMouseDown={() => { setQuerySubject(s); setShowSubjectDrop(false) }}
                        style={{ padding: '10px 16px', fontSize: '0.8rem', color: ink, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, transition: 'background .1s' }}
                        onMouseEnter={e => e.currentTarget.style.background = isDark ? '#222' : '#fff7f0'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <span style={{ color: orange, fontSize: 12 }}>✦</span>{s}
                      </div>
                    )
                  })}
              </div>
            )}
          </div>

          {/* Ville */}
          <div style={{ flex: 1, position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px' }}>
              <span style={{ color: dimmed, fontSize: 16 }}>📍</span>
              <input
                value={queryCity}
                onChange={e => setQueryCity(e.target.value)}
                onFocus={() => setShowCityDrop(true)}
                onBlur={() => setTimeout(() => setShowCityDrop(false), 200)}
                placeholder="À Casablanca, Rabat..."
                style={{ background: 'none', border: 'none', outline: 'none', color: ink, fontSize: '0.83rem', width: '100%' }}
              />
              {queryCity && (
                <span onClick={() => setQueryCity('')} style={{ color: dimmed, cursor: 'pointer', fontSize: '0.75rem', flexShrink: 0 }}>✕</span>
              )}
            </div>
            {showCityDrop && (
              <div style={{ position: 'absolute', top: '110%', left: 0, right: 0, background: bgCard, border: `1px solid ${bdr}`, borderRadius: 12, zIndex: 60, overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
                {CITIES_LIST
                  .filter(c => !queryCity || c.toLowerCase().includes(queryCity.toLowerCase()))
                  .slice(0, 6)
                  .map(function (c) {
                    return (
                      <div key={c}
                        onMouseDown={() => { setQueryCity(c); setShowCityDrop(false) }}
                        style={{ padding: '10px 16px', fontSize: '0.8rem', color: ink, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
                        onMouseEnter={e => e.currentTarget.style.background = isDark ? '#222' : '#fff7f0'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <span style={{ color: orange, fontSize: 12 }}>📍</span>{c}
                      </div>
                    )
                  })}
              </div>
            )}
          </div>

          <button onClick={handleSearch}
            style={{ background: ink, color: bg, border: 'none', borderRadius: 10, padding: '11px 26px', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
            Rechercher
          </button>
        </div>

        {/* Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginTop: 8 }}>
          <span style={{ fontSize: '0.62rem', color: dimmed, textTransform: 'uppercase', letterSpacing: '0.15em', width: '100%', marginBottom: 4 }}>
            Accès Rapide
          </span>
          {SUBJECT_PILLS.map(function (pill) {
            const isActive = activePill === pill
            return (
              <button key={pill} onClick={() => handlePill(pill)}
                style={{ padding: '5px 16px', borderRadius: 99, border: `1px solid ${isActive ? orange : bdr}`, background: isActive ? orange : 'transparent', color: isActive ? '#fff' : muted, fontSize: '0.72rem', cursor: 'pointer', fontWeight: isActive ? 700 : 400, transition: 'all .15s' }}>
                {pill}
              </button>
            )
          })}
          {(activePill || querySubject || queryCity) && (
            <button onClick={handleReset}
              style={{ padding: '5px 14px', borderRadius: 99, border: '1px solid rgba(226,75,74,0.3)', background: 'rgba(226,75,74,0.08)', color: '#e24b4a', fontSize: '0.72rem', cursor: 'pointer', fontWeight: 600 }}>
              ↺ Réinitialiser
            </button>
          )}
        </div>
      </section>

      {/* ══ STATS ═════════════════════════════════════════════════ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, padding: '1.5rem 2rem', background: bgSurf, borderTop: `1px solid ${bdr}`, borderBottom: `1px solid ${bdr}` }}>
        {[
          { icon: '🎓', val: '450+',   label: 'Tuteurs Accrédités' },
          { icon: '📚', val: '45+',    label: 'Matières Couvertes' },
          { icon: '👥', val: '3 200+', label: 'Élèves Accompagnés' },
          { icon: '⭐', val: '4.9/5',  label: 'Satisfaction Client' },
        ].map(function (s) {
          return (
            <div key={s.label} style={{ background: bgCard, border: `1px solid ${bdr}`, borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ padding: 8, background: bgSurf, border: `1px solid ${bdr}`, borderRadius: 8, fontSize: 18, lineHeight: 1 }}>{s.icon}</div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: ink, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{s.val}</div>
                <div style={{ fontSize: '0.62rem', color: dimmed, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 2 }}>{s.label}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* ══ HOW IT WORKS ══════════════════════════════════════════ */}
      <section id="how-it-works" style={{ padding: '4rem 2rem', background: bgSurf, borderBottom: `1px solid ${bdr}`, textAlign: 'center' }}>
        <span style={secBadge(orange)}>Méthodologie et Accompagnement</span>
        <h2 style={secTitle}>Comment fonctionne Learnect ?</h2>
        <p style={{ fontSize: '0.82rem', color: muted, marginBottom: '3rem' }}>
          Une mise en relation simple, rapide et entièrement sécurisée.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '2.5rem', maxWidth: 900, margin: '0 auto' }}>
          {[
            { num: '01', color: orange, title: 'Cherchez le tuteur parfait',        desc: 'Renseignez la matière et votre ville pour filtrer nos professeurs à proximité.' },
            { num: '02', color: blue,   title: 'Échangez et offrez le diagnostic',  desc: "Entrez en contact directement et bénéficiez d'une première heure d'évaluation totalement offerte." },
            { num: '03', color: green,  title: 'Apprenez et progressez',             desc: "Prenez vos cours à domicile ou en ligne, sans contrat d'engagement." },
          ].map(function (step) {
            return (
              <div key={step.num}>
                <div style={{ width: 56, height: 56, borderRadius: 14, background: bgCard, border: `1px solid ${bdr}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace', fontSize: '1.1rem', fontWeight: 800, color: step.color, margin: '0 auto 1rem' }}>
                  {step.num}
                </div>
                <div style={{ fontWeight: 700, color: ink, marginBottom: 6, fontSize: '0.95rem' }}>{step.title}</div>
                <div style={{ fontSize: '0.8rem', color: muted, lineHeight: 1.65, maxWidth: 220, margin: '0 auto' }}>{step.desc}</div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ══ TEACHERS ══════════════════════════════════════════════ */}
      <section id="tutors-section" style={{ padding: '4rem 2rem', background: bg }}>
        <span style={secBadge(blue)}>Sélection Hebdomadaire</span>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2 style={secTitle}>
              {activePill ? `Les profs de : ${activePill}` : 'Les profs de la semaine'}
            </h2>
            <p style={{ fontSize: '0.82rem', color: muted }}>
              Nos meilleurs enseignants accrédités disponibles partout au Maroc.
            </p>
          </div>
          <div style={{ background: bgCard, border: `1px solid ${bdr}`, borderRadius: 8, padding: '8px 14px', fontSize: '0.72rem', fontFamily: 'monospace' }}>
            <div style={{ color: dimmed, textTransform: 'uppercase', fontSize: '0.6rem', letterSpacing: '0.1em' }}>Professeurs trouvés</div>
            <div style={{ fontWeight: 700, color: ink }}>{filteredTutors.length} correspondance{filteredTutors.length !== 1 ? 's' : ''}</div>
          </div>
        </div>

        {/* ─ Erreur ─ */}
        {error && (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#e24b4a', background: 'rgba(226,75,74,0.06)', border: '1px solid rgba(226,75,74,0.2)', borderRadius: 12, marginBottom: '2rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>⚠️</div>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>{error}</div>
            <div style={{ fontSize: '0.8rem', color: muted }}>Assurez-vous que le serveur Laravel tourne sur http://localhost:8000</div>
          </div>
        )}

        {/* ─ Skeleton loading ─ */}
        {loading && !error && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.25rem' }}>
            {[1,2,3,4,5,6].map(function (i) {
              return (
                <div key={i} style={{ background: bgCard, border: `1px solid ${bdr}`, borderRadius: 14, overflow: 'hidden' }}>
                  <div style={{ height: 180, background: bgSurf, animation: 'shimmer 1.5s infinite' }} />
                  <div style={{ padding: 16 }}>
                    {[70, 50, 100, 80].map(function (w, j) {
                      return <div key={j} style={{ height: 10, background: bgSurf, borderRadius: 4, marginBottom: 10, width: w + '%', animation: 'shimmer 1.5s infinite' }} />
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* ─ Empty state ─ */}
        {!loading && !error && filteredTutors.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', background: bgCard, border: `1px solid ${bdr}`, borderRadius: 16, maxWidth: 500, margin: '0 auto' }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>🔍</div>
            <div style={{ fontWeight: 700, color: ink, fontSize: '1.1rem', marginBottom: 8 }}>Aucun tuteur trouvé</div>
            <div style={{ fontSize: '0.82rem', color: muted, marginBottom: 20 }}>
              Aucun résultat pour{' '}
              <strong>« {querySubject || activePill || 'cette recherche'} »</strong>
              {queryCity && <> à <strong>{queryCity}</strong></>}.
            </div>
            <button onClick={handleReset}
              style={{ background: ink, color: bg, border: 'none', borderRadius: 8, padding: '10px 20px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>
              Tout réinitialiser
            </button>
          </div>
        )}

        {/* ─ Cards ─ */}
        {!loading && !error && filteredTutors.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.25rem' }}>
            {filteredTutors.map(function (t) {
              const isFav = favorites.includes(t.id)
              return (
                <div key={t.id} style={card}
                  onClick={() => navigate(`/teachers/${t.id}`)}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = isDark ? '0 8px 24px rgba(0,0,0,0.4)' : '0 8px 24px rgba(0,0,0,0.08)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}>

                  {/* Image */}
                  <div style={{ height: 185, background: bgSurf, position: 'relative', overflow: 'hidden' }}>
                    <img
                      src={t.avatar}
                      alt={t.name}
                      referrerPolicy="no-referrer"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(50%)', transition: 'filter .4s, transform .4s' }}
                      onMouseEnter={e => { e.target.style.filter = 'grayscale(0%)'; e.target.style.transform = 'scale(1.04)' }}
                      onMouseLeave={e => { e.target.style.filter = 'grayscale(50%)'; e.target.style.transform = 'scale(1)' }}
                    />
                    <span style={{ position: 'absolute', top: 10, left: 10, background: green, color: '#fff', fontSize: '0.62rem', fontWeight: 700, padding: '3px 8px', borderRadius: 5 }}>
                      1er cours offert
                    </span>
                    <button
                      onClick={e => handleToggleFav(e, t.id)}
                      style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
                      {isFav ? '❤️' : '🤍'}
                    </button>
                  </div>

                  {/* Body */}
                  <div style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                      <div>
                        <div style={{ fontWeight: 700, color: ink, fontSize: '0.92rem' }}>{t.name}</div>
                        <div style={{ fontSize: '0.7rem', color: muted, marginTop: 2 }}>📍 {t.city}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 3, background: bgSurf, border: `1px solid ${bdr}`, borderRadius: 6, padding: '3px 7px', fontSize: '0.72rem', fontWeight: 700, color: '#b45309', flexShrink: 0 }}>
                        ⭐ {t.rating.toFixed(1)}
                      </div>
                    </div>

                    <div style={{ fontSize: '0.68rem', color: dimmed, fontFamily: 'monospace', marginBottom: 6, lineHeight: 1.4 }}>{t.role}</div>

                    {t.bio && (
                      <div style={{ fontSize: '0.75rem', color: muted, fontStyle: 'italic', borderLeft: `2px solid ${bdr}`, paddingLeft: 10, marginBottom: 12, lineHeight: 1.55, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        "{t.bio}"
                      </div>
                    )}

                    {/* Tags domicile / en ligne */}
                    <div style={{ display: 'flex', gap: 5, marginBottom: 10 }}>
                      {t.domicile && <span style={{ fontSize: '0.6rem', background: 'rgba(29,158,117,0.1)', color: green, border: `1px solid rgba(29,158,117,0.3)`, padding: '2px 7px', borderRadius: 5 }}>🏠 Domicile</span>}
                      {t.enligne  && <span style={{ fontSize: '0.6rem', background: 'rgba(55,138,221,0.1)', color: blue,  border: `1px solid rgba(55,138,221,0.3)`, padding: '2px 7px', borderRadius: 5 }}>💻 En ligne</span>}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid ${bdr}`, paddingTop: 10 }}>
                      <div>
                        <div style={{ fontSize: '0.6rem', color: dimmed, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Tarif direct</div>
                        <div style={{ fontSize: '1.05rem', fontWeight: 800, color: ink }}>
                          {t.rate} MAD <span style={{ fontSize: '0.7rem', fontWeight: 400, color: dimmed }}>/h</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'flex-end', maxWidth: '55%' }}>
                        {t.subjects.slice(0, 3).map(function (s) {
                          return (
                            <span key={s} style={{ fontSize: '0.6rem', background: bgSurf, border: `1px solid ${bdr}`, color: muted, padding: '2px 6px', borderRadius: 5 }}>
                              {s}
                            </span>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* ══ FEATURES ══════════════════════════════════════════════ */}
      <section id="features-section" style={{ padding: '4rem 2rem', background: bgSurf, borderTop: `1px solid ${bdr}` }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span style={secBadge(blue)}>Confiance & Intégrité</span>
          <h2 style={secTitle}>Qualité garantie, transparence totale.</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.25rem', maxWidth: 900, margin: '0 auto' }}>
          {[
            { icon: '🛡️', title: 'Vérification stricte',      desc: "Nous vérifions manuellement l'identité, les diplômes et l'expérience de chaque enseignant avant validation." },
            { icon: '⚖️', title: 'Zéro commission cachée',    desc: 'Seulement 10% de frais fixes de mise en relation. Aucun abonnement, aucun frais caché.' },
            { icon: '🔥', title: 'Mise en relation directe',  desc: 'Échangez via notre messagerie sécurisée, définissez vos objectifs, puis réservez votre première heure offerte.' },
          ].map(function (f) {
            return (
              <div key={f.title} style={{ background: bgCard, border: `1px solid ${bdr}`, borderRadius: 14, padding: '1.5rem' }}>
                <div style={{ width: 44, height: 44, background: bgSurf, border: `1px solid ${bdr}`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: '1rem', lineHeight: 1 }}>
                  {f.icon}
                </div>
                <div style={{ fontWeight: 700, color: ink, marginBottom: 6, fontSize: '0.92rem' }}>{f.title}</div>
                <div style={{ fontSize: '0.78rem', color: muted, lineHeight: 1.65 }}>{f.desc}</div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ══ CTA ═══════════════════════════════════════════════════ */}
      <section style={{ background: '#111111', padding: '5rem 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <span style={secBadge(orange)}>Rejoignez Notre Réseau d'Élite</span>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.1, margin: '0 auto 1rem', maxWidth: 520, letterSpacing: '-0.01em' }}>
          Vivez de votre passion,<br />enseignez sur Learnect.
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', maxWidth: 480, margin: '0 auto 2rem', lineHeight: 1.75 }}>
          Rejoignez plus de 450 professeurs certifiés qui transmettent leur savoir sur la plateforme la plus innovante du Maroc. Définissez vos tarifs et gérez votre emploi du temps en toute liberté.
        </p>
        <button onClick={() => navigate('/register')}
          style={{ background: orange, color: '#fff', border: 'none', borderRadius: 12, padding: '13px 30px', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          ✦ Devenir Tuteur Partenaire
        </button>
      </section>

      {/* ══ FAQ ═══════════════════════════════════════════════════ */}
      <section style={{ padding: '4rem 2rem', background: bgSurf, borderTop: `1px solid ${bdr}` }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span style={secBadge(blue)}>Questions Fréquentes</span>
          <h2 style={secTitle}>Des réponses à vos questions.</h2>
          <p style={{ fontSize: '0.82rem', color: muted }}>Tout ce que vous devez savoir pour démarrer en toute sérénité.</p>
        </div>
        <div style={{ maxWidth: 700, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {FAQS.map(function (faq, i) {
            const isOpen = openFaq === i
            return (
              <div key={i} style={{ background: bgCard, border: `1px solid ${bdr}`, borderRadius: 12, overflow: 'hidden' }}>
                <button
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 18px', background: 'none', border: 'none', cursor: 'pointer', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ color: orange, fontSize: 15, flexShrink: 0 }}>❓</span>
                    <span style={{ fontWeight: 600, color: ink, fontSize: '0.83rem' }}>{faq.q}</span>
                  </div>
                  <span style={{ color: isOpen ? orange : dimmed, fontSize: 12, flexShrink: 0, display: 'inline-block', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform .25s' }}>▼</span>
                </button>
                {isOpen && (
                  <div style={{ padding: '0 18px 16px 18px', borderTop: `1px solid ${bdr}`, fontSize: '0.78rem', color: muted, lineHeight: 1.75 }}>
                    {faq.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* ══ FOOTER ════════════════════════════════════════════════ */}
      <footer style={{ background: '#111111', padding: '3.5rem 2rem 1.5rem', color: 'rgba(255,255,255,0.5)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#fff', marginBottom: '0.75rem' }}>
              Learn<span style={{ color: orange }}>ect</span>
            </div>
            <div style={{ fontSize: '0.78rem', lineHeight: 1.75 }}>
              Soutien scolaire certifié et méthodologique pour les étudiants marocains. Trouvez le professeur parfait près de chez vous.
            </div>
          </div>
          <div>
            <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.8rem', marginBottom: '0.75rem' }}>Navigation</div>
            {['Nos professeurs', 'Comment ça marche', 'FAQ', 'Devenir tuteur'].map(function (item) {
              return <div key={item} style={{ fontSize: '0.78rem', marginBottom: 8, cursor: 'pointer', transition: 'color .15s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>{item}</div>
            })}
          </div>
          <div>
            <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.8rem', marginBottom: '0.75rem' }}>Légal</div>
            {["Conditions d'utilisation", 'Confidentialité', 'Mentions légales'].map(function (item) {
              return <div key={item} style={{ fontSize: '0.78rem', marginBottom: 8, cursor: 'pointer', transition: 'color .15s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>{item}</div>
            })}
          </div>
          <div>
            <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.8rem', marginBottom: '0.75rem' }}>Contact</div>
            {[
              { icon: '✉️', text: 'contact@learnect.ma' },
              { icon: '📞', text: '+212 5XX-XXXXXX' },
              { icon: '📍', text: 'Casablanca, Maroc' },
            ].map(function (c) {
              return <div key={c.text} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.78rem', marginBottom: 8 }}>
                <span>{c.icon}</span>{c.text}
              </div>
            })}
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem', textAlign: 'center', fontSize: '0.72rem' }}>
          © 2026 Learnect.ma — Tous droits réservés.
        </div>
      </footer>

      <style>{`
        @keyframes shimmer {
          0%, 100% { opacity: 1 }
          50%       { opacity: 0.4 }
        }
      `}</style>
    </div>
  )
}