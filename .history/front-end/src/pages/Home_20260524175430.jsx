import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const categories = [
  { icon: '📚', label: 'Soutien scolaire' },
  { icon: '🏃', label: 'Coaching Sportif' },
  { icon: '🌍', label: 'Langues' },
  { icon: '🎵', label: 'Musique' },
  { icon: '🎨', label: 'Arts & Dessin' },
];

const faqs = [
  {
    q: 'Comment fonctionne la commission de 10% sur Learnect ?',
    a: 'Learnect applique une commission fixe et unique de 10%. Si un cours est tarifé à 100 DH, l\'enseignant reçoit exactement 90 DH nets sur son solde.',
  },
  {
    q: 'Les diplômes des enseignants sont-ils réellement authentiques ?',
    a: 'Oui. Chaque diplôme supérieur et CIN sont vérifiés manuellement par l\'administrateur avant que l\'annonce ne soit visible en ligne.',
  },
  {
    q: 'Qu\'est-ce que l\'offre "Premier cours offert" ?',
    a: 'Le premier cours est proposé à 0 DH pour permettre à l\'élève d\'évaluer la qualité sans risque.',
  },
  {
    q: 'Puis-je simuler l\'ensemble des interactions du soutien scolaire ?',
    a: 'Oui ! La plateforme permet de gérer réservations, paiements, messagerie et avis en toute autonomie.',
  },
];

function Home() {
  const navigate = useNavigate();

  const [search, setSearch]         = useState('');
  const [ville, setVille]           = useState('');
  const [showVilles, setShowVilles] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [teachers, setTeachers]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [openFaq, setOpenFaq]       = useState(null);

  const villes = ['Autour de moi', 'En ligne (webcam)', 'Casablanca', 'Marrakech', 'Rabat', 'Tanger'];

  // charger enseignants — méthode useEffect du cours DAIF
  useEffect(() => {
    async function loadTeachers() {
      try {
        const res = await api.get('/enseignants');
        setTeachers(res.data.slice(0, 3));
      } catch (e) {
        setTeachers([]);
      } finally {
        setLoading(false);
      }
    }
    loadTeachers();
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    navigate(`/teachers?matiere=${search}&ville=${ville}`);
  }

  function toggleFaq(i) {
    setOpenFaq(openFaq === i ? null : i);
  }

  // données démo si backend vide
  const demoTeachers = [
    { id: 1, prenom: 'Sofia', nom: 'Bennani', ville: 'Casablanca', tarif: 100, note: 4.8, diplome: 'Cycle Ingénieur en Génie Civil (BNTP) & Agrégation de Mathématiques', bio: 'Ancienne élève de Math Sup/Math Spé avec 12 ans d\'expérience dans l\'enseignement.' },
    { id: 2, prenom: 'Amine', nom: 'Chraïbi', ville: 'Marrakech', tarif: 120, note: 4.6, diplome: 'Doctorat en Sciences Physiques - Université Cadi Ayyad', bio: 'Enseignant-chercheur universitaire passionné par la transmission des savoirs scientifiques.' },
    { id: 3, prenom: 'Tarik', nom: 'Alaoui', ville: 'Tanger', tarif: 200, note: 5.0, diplome: 'Ingénieur d\'État Software & Professeur d\'Algorithmique appliqué', bio: 'Ingénieur Full-Stack en activité avec une passion dévorante pour l\'apprentissage actif.' },
  ];

  const displayTeachers = teachers.length > 0
    ? teachers.map(t => ({
        id: t.utilisateur_id,
        prenom: t.user?.prenom,
        nom: t.user?.nom,
        ville: t.user?.ville,
        tarif: t.tarifHeure,
        note: t.noteMoyenne,
        diplome: t.diplome,
        bio: t.description_profil,
      }))
    : demoTeachers;

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>

      {/* ── HERO ─────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(180deg, rgba(236,253,245,0.6) 0%, rgba(209,250,229,0.2) 60%, #ffffff 100%)',
        padding: '64px 24px 80px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(16,185,129,0.1)',
      }}>

        {/* blobs déco */}
        <div style={{ position: 'absolute', top: 40, right: 40, width: 384, height: 384, borderRadius: '50%', background: 'rgba(209,250,229,0.4)', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: 20, left: 40, width: 320, height: 320, borderRadius: '50%', background: 'rgba(187,247,208,0.2)', filter: 'blur(80px)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative' }}>

          {/* badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 50, padding: '6px 16px', fontSize: '0.72rem', fontWeight: 700, color: '#065f46', marginBottom: 24, backdropFilter: 'blur(8px)' }}>
            🔥 Soutien Scolaire Particulier au Maroc · 100% Direct & Transparent
          </div>

          {/* titre */}
          <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(2.2rem, 5vw, 4rem)', fontWeight: 800, color: '#0f172a', lineHeight: 1.12, letterSpacing: '-1.5px', marginBottom: 16 }}>
            Le cours particulier qui vous ressemble.<br />
            <span style={{ color: '#059669' }}>Trouvez le prof idéal.</span>
          </h1>

          {/* sous-titre */}
          <p style={{ color: '#64748b', fontSize: '0.95rem', maxWidth: 540, margin: '0 auto 40px', lineHeight: 1.7, fontWeight: 500 }}>
            Rejoignez Learnect : Des cours d'accompagnement d'exception certifiés, sans frais de dossier.{' '}
            <strong style={{ color: '#059669' }}>10% de commission unique</strong> pour la plateforme, 1er cours offert pour l'élève.
          </p>

          {/* SEARCH BAR */}
          <form onSubmit={handleSearch} style={{
            background: 'white',
            borderRadius: 40,
            padding: '10px 10px 10px 24px',
            display: 'flex',
            alignItems: 'center',
            maxWidth: 760,
            margin: '0 auto 32px',
            boxShadow: '0 15px 40px rgba(16,185,129,0.08)',
            border: '1px solid rgba(16,185,129,0.15)',
            gap: 8,
          }}>

            {/* matière */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
              <div style={{ background: '#ecfdf5', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                📚
              </div>
              <div style={{ textAlign: 'left', flex: 1 }}>
                <div style={{ fontSize: '0.62rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 2 }}>
                  Je veux apprendre :
                </div>
                <input
                  type="text"
                  placeholder="Quelle matière ? (ex: Mathématiques, Arabe…)"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', fontFamily: 'Inter, sans-serif', background: 'transparent' }}
                />
              </div>
            </div>

            {/* séparateur */}
            <div style={{ width: 1, height: 32, background: '#e2e8f0', flexShrink: 0 }} />

            {/* ville */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 8px' }}>
                <div style={{ background: '#ecfdf5', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  📍
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.62rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 2 }}>
                    Adresse ou ville :
                  </div>
                  <input
                    type="text"
                    placeholder="Où ?"
                    value={ville}
                    onChange={e => setVille(e.target.value)}
                    onFocus={() => setShowVilles(true)}
                    onBlur={() => setTimeout(() => setShowVilles(false), 150)}
                    style={{ border: 'none', outline: 'none', width: 120, fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', fontFamily: 'Inter, sans-serif', background: 'transparent' }}
                  />
                </div>
              </div>
              {showVilles && (
                <div style={{ position: 'absolute', top: 56, left: 0, background: 'white', borderRadius: 16, boxShadow: '0 8px 32px rgba(0,0,0,0.12)', zIndex: 100, minWidth: 220, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                  <div style={{ padding: '8px 16px 4px', fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1.5 }}>
                    Lieux suggérés au Maroc
                  </div>
                  {villes.map(v => (
                    <div key={v}
                      onMouseDown={() => { setVille(v); setShowVilles(false); }}
                      style={{ padding: '10px 16px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}
                      onMouseOver={e => e.currentTarget.style.background = '#f0fdf4'}
                      onMouseOut={e => e.currentTarget.style.background = 'white'}>
                      📍 {v}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* bouton */}
            <button type="submit" style={{
              background: '#059669',
              color: 'white',
              border: 'none',
              padding: '14px 28px',
              borderRadius: 50,
              fontSize: '0.88rem',
              fontWeight: 800,
              cursor: 'pointer',
              flexShrink: 0,
              fontFamily: 'Inter, sans-serif',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'background 0.2s',
            }}
              onMouseOver={e => e.currentTarget.style.background = '#047857'}
              onMouseOut={e => e.currentTarget.style.background = '#059669'}>
              🔍 Rechercher
            </button>
          </form>

          {/* CATEGORIES */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1.5 }}>Raccourcis :</span>
            {categories.map((c, i) => (
              <button key={i}
                onClick={() => navigate(`/teachers?matiere=${c.label}`)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '8px 16px', borderRadius: 50,
                  border: '1px solid #d1fae5', background: 'rgba(255,255,255,0.6)',
                  fontSize: '0.78rem', fontWeight: 700, color: '#0f172a',
                  cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                  transition: 'all 0.2s',
                }}
                onMouseOver={e => { e.currentTarget.style.background = '#ecfdf5'; e.currentTarget.style.borderColor = '#6ee7b7'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.6)'; e.currentTarget.style.borderColor = '#d1fae5'; }}>
                {c.icon} {c.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── CE QUI REND LEARNECT DIFFERENT ───── */}
      <section style={{ padding: '80px 24px', background: 'rgba(236,253,245,0.2)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>

          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>
              Modèle Éthique & Transparent
            </div>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 800, color: '#0f172a', letterSpacing: -0.5, marginBottom: 8 }}>
              Qu'est-ce qui rend Learnect différent ?
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.88rem' }}>
              Une charte basée sur la transparence des prix et l'excellence académique des tuteurs au Maroc.
            </p>
          </div>

          {/* grid 3 cartes */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr', gap: 20 }}>

            {/* carte verte */}
            <div style={{ background: 'linear-gradient(135deg, #059669, #047857)', borderRadius: 28, padding: 32, color: 'white', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', filter: 'blur(20px)' }} />
              <div style={{ fontSize: '0.62rem', fontWeight: 800, background: 'rgba(255,255,255,0.2)', color: 'white', padding: '4px 12px', borderRadius: 50, display: 'inline-block', marginBottom: 16, letterSpacing: 1 }}>
                COMMISSION TRANSPARENTE · 10%
              </div>
              <h4 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.2rem', fontWeight: 800, marginBottom: 12, lineHeight: 1.3 }}>
                Pas de frais cachés ou de prélèvements opaques de 30%
              </h4>
              <p style={{ fontSize: '0.83rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.7 }}>
                Learnect applique une commission fixe de 10%. Si vous fixez votre tarif à 150 DH l'heure, vous percevez 135 DH nets directs.
              </p>
              <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: 10, fontSize: '1.2rem' }}>💰</div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.82rem' }}>Rétribution directe garantie à 90%</div>
                  <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)' }}>Transparence des rapports financiers</div>
                </div>
              </div>
            </div>

            {/* carte diplômes */}
            <div style={{ background: 'white', borderRadius: 28, padding: 28, border: '1px solid rgba(16,185,129,0.1)', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
              <div style={{ width: 40, height: 40, background: '#ecfdf5', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', marginBottom: 20 }}>
                🎓
              </div>
              <h4 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginBottom: 10 }}>
                Diplômes validés à la main
              </h4>
              <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.7 }}>
                La sécurité est notre priorité. Chaque diplôme supérieur est rigoureusement vérifié par notre équipe avant mise en ligne.
              </p>
              <div style={{ marginTop: 20, fontSize: '0.72rem', fontWeight: 700, color: '#059669' }}>
                Assurance Qualité Premium · Maroc
              </div>
            </div>

            {/* carte 1er cours */}
            <div style={{ background: 'white', borderRadius: 28, padding: 28, border: '1px solid rgba(16,185,129,0.1)', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
              <div style={{ width: 40, height: 40, background: '#ecfdf5', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', marginBottom: 20 }}>
                ✨
              </div>
              <h4 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginBottom: 10 }}>
                1er cours offert pour t'orienter
              </h4>
              <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.7 }}>
                Aucun risque : le premier créneau est proposé à 0 DH pour faciliter la prise de contact sans friction.
              </p>
              <div style={{ marginTop: 20, fontSize: '0.72rem', fontWeight: 700, color: '#059669' }}>
                Découverte & Essai Gratuit →
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── NOS SUPER-ENSEIGNANTS ─────────────── */}
      <section style={{ padding: '80px 24px', background: 'white', borderTop: '1px solid rgba(16,185,129,0.08)', borderBottom: '1px solid rgba(16,185,129,0.08)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40 }}>
            <div>
              <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 6 }}>
                À l'affiche ce mois-ci
              </div>
              <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', fontWeight: 800, color: '#0f172a', letterSpacing: -0.5, marginBottom: 4 }}>
                Rencontrez nos super-enseignants
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.82rem' }}>
                Enseignants chevronnés, agrégés issus de grandes écoles d'ingénieurs
              </p>
            </div>
            <Link to="/teachers" style={{ color: '#059669', fontWeight: 700, fontSize: '0.82rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
              Parcourir tout l'annuaire scolaire →
            </Link>
          </div>

          {loading ? (
            <p style={{ textAlign: 'center', color: '#94a3b8' }}>Chargement...</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
              {displayTeachers.map((t, i) => (
                <TeacherCard key={i} t={t} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────── */}
      <section style={{ padding: '80px 24px', background: '#f8fafc' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>
              Une question ?
            </div>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', fontWeight: 800, color: '#0f172a', letterSpacing: -0.5 }}>
              Foire Aux Questions Learnect
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.83rem', marginTop: 8 }}>
              Tout savoir sur le tchat de cours particuliers, l'agenda libre, et la politique tarifaire.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {faqs.map((f, i) => (
              <div key={i} style={{ background: 'white', borderRadius: 20, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                <button
                  onClick={() => toggleFaq(i)}
                  style={{ width: '100%', textAlign: 'left', padding: '18px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: '0.88rem', color: '#0f172a' }}>
                  {f.q}
                  <span style={{ color: '#059669', fontSize: '1rem', marginLeft: 12, flexShrink: 0, transition: 'transform 0.2s', transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: '0 22px 18px', fontSize: '0.83rem', color: '#64748b', lineHeight: 1.75, borderTop: '1px solid #f0f0f0', paddingTop: 14 }}>
                    {f.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ─────────────────────────── */}
      <section style={{ background: '#0f172a', padding: '80px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, right: '25%', width: 500, height: 300, background: 'rgba(5,150,105,0.1)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 700, margin: '0 auto', position: 'relative' }}>
          <div style={{ fontSize: '2rem', marginBottom: 20 }}>🏆</div>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 800, color: 'white', letterSpacing: -0.5, marginBottom: 12 }}>
            Démarrez l'expérience dès aujourd'hui
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: 36 }}>
            Trouvez les meilleurs tuteurs du Maroc certifiés. Explorez la messagerie intégrée, réservez des créneaux et commencez l'apprentissage !
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            <Link to="/teachers" style={{ background: '#059669', color: 'white', padding: '14px 32px', borderRadius: 50, fontWeight: 800, fontSize: '0.88rem', textDecoration: 'none', display: 'inline-block', transition: 'background 0.2s' }}
              onMouseOver={e => e.currentTarget.style.background = '#047857'}
              onMouseOut={e => e.currentTarget.style.background = '#059669'}>
              🎓 Parcourir les tuteurs
            </Link>
            <Link to="/register" style={{ background: '#1e293b', color: '#cbd5e1', padding: '14px 32px', borderRadius: 50, fontWeight: 700, fontSize: '0.88rem', textDecoration: 'none', display: 'inline-block', border: '1px solid #334155' }}>
              🍎 S'inscrire comme Enseignant
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────── */}
      <footer style={{ background: '#020617', padding: '64px 24px', borderTop: '1px solid #1e293b' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 48 }}>

            {/* brand */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 36, height: 36, background: '#059669', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>🎓</div>
                <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: '1.1rem', color: 'white' }}>
                  Learnect<span style={{ color: '#059669' }}>.ma</span>
                </span>
              </div>
              <p style={{ color: '#64748b', fontSize: '0.8rem', lineHeight: 1.7 }}>
                La plateforme élite de mise en relation directe élève-prof au Maroc.
              </p>
            </div>

            {/* matières */}
            <div>
              <h4 style={{ color: 'white', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 16 }}>Matières</h4>
              {['Mathématiques', 'Physique-Chimie', 'Français', 'Anglais', 'Arabe', 'Informatique'].map(m => (
                <Link key={m} to={`/teachers?matiere=${m}`} style={{ display: 'block', color: '#64748b', fontSize: '0.8rem', fontWeight: 500, textDecoration: 'none', marginBottom: 8, transition: 'color 0.2s' }}
                  onMouseOver={e => e.currentTarget.style.color = '#34d399'}
                  onMouseOut={e => e.currentTarget.style.color = '#64748b'}>
                  {m}
                </Link>
              ))}
            </div>

            {/* villes */}
            <div>
              <h4 style={{ color: 'white', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 16 }}>Villes</h4>
              {['Casablanca', 'Marrakech', 'Rabat', 'Tanger', 'Agadir', 'En ligne'].map(v => (
                <Link key={v} to={`/teachers?ville=${v}`} style={{ display: 'block', color: '#64748b', fontSize: '0.8rem', fontWeight: 500, textDecoration: 'none', marginBottom: 8, transition: 'color 0.2s' }}
                  onMouseOver={e => e.currentTarget.style.color = '#34d399'}
                  onMouseOut={e => e.currentTarget.style.color = '#64748b'}>
                  Cours à {v}
                </Link>
              ))}
            </div>

            {/* aide */}
            <div>
              <h4 style={{ color: 'white', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 16 }}>Aide</h4>
              <div style={{ background: '#0d2a1f', border: '1px solid #064e3b', borderRadius: 12, padding: '12px 14px', fontSize: '0.72rem', fontWeight: 700, color: '#34d399' }}>
                💡 10% de commission technique fixe sur toutes les réservations validées.
              </div>
            </div>
          </div>

          <div style={{ paddingTop: 28, borderTop: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#475569' }}>
            <p>© 2025 Learnect.ma · Tous droits réservés</p>
            <div style={{ display: 'flex', gap: 16 }}>
              <span style={{ cursor: 'pointer' }}>Conditions d'utilisation</span>
              <span>·</span>
              <span style={{ cursor: 'pointer' }}>Confidentialité</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}

// ── TEACHER CARD ─────────────────────────
function TeacherCard({ t }) {
  return (
    <div style={{ background: 'white', borderRadius: 28, border: '1px solid #f1f5f9', padding: 24, boxShadow: '0 4px 20px rgba(16,185,129,0.02)', transition: 'all 0.25s', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
      onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(16,185,129,0.06)'; }}
      onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(16,185,129,0.02)'; }}>

      {/* header */}
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 16 }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#ecfdf5', border: '2px solid rgba(5,150,105,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: '1.1rem', color: '#059669', flexShrink: 0 }}>
          {t.prenom?.[0]?.toUpperCase() || 'P'}
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: '0.9rem', color: '#0f172a', marginBottom: 2 }}>
            {t.prenom} {t.nom}
          </p>
          <p style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500, marginBottom: 4 }}>
            📍 {t.ville || 'Maroc'}
          </p>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, background: 'rgba(245,158,11,0.1)', color: '#92400e', padding: '2px 8px', bo