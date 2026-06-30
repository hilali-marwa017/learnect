import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const categories = [
  { icon: '📐', label: 'Maths' },
  { icon: '⚗️', label: 'Physique' },
  { icon: '🇫🇷', label: 'Français' },
  { icon: '🇬🇧', label: 'Anglais' },
  { icon: '🇸🇦', label: 'Arabe' },
  { icon: '💻', label: 'Informatique' },
  { icon: '🧬', label: 'SVT' },
  { icon: '🎵', label: 'Musique' },
];

const features = [
  {
    tag: 'COMMISSION TRANSPARENTE · 10%',
    title: 'Pas de frais cachés ou de commissions opaques',
    desc: 'Une commission unique de 10% pour la plateforme. Rétribution directe garantie à 90%.',
    icon: '💰',
    highlight: true,
  },
  {
    title: 'Diplômes validés à la main',
    desc: 'La sécurité est notre priorité. Chaque diplôme supérieur est rigoureusement vérifié par notre équipe.',
    icon: '🎓',
    highlight: false,
    link: 'Assurance Qualité Profs →',
  },
  {
    title: '1er cours offert pour l\'orienter',
    desc: 'Aucun risque : le premier cours est proposé à -50% lors de la réservation initiale.',
    icon: '🚀',
    highlight: false,
    link: 'Découvrir & Essai Gratuit →',
  },
];

function Home() {
  const navigate = useNavigate();
  const [search, setSearch]       = useState('');
  const [ville, setVille]         = useState('');
  const [showVilles, setShowVilles] = useState(false);
  const [teachers, setTeachers]   = useState([]);
  const [loading, setLoading]     = useState(true);

  const villes = ['Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Agadir', 'En ligne'];

  // charger quelques enseignants pour la section "nos super-enseignants"
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

  // styles inline réutilisables
  const S = {
    page:       { fontFamily: 'Inter, sans-serif', background: 'white', color: '#111' },
    wrap:       { maxWidth: 1100, margin: '0 auto', padding: '0 28px' },

    // HERO
    hero:       { background: 'linear-gradient(160deg, #f0faf4 0%, #e6f7ee 60%, #ffffff 100%)', padding: '80px 28px 72px', textAlign: 'center' },
    badge:      { display: 'inline-block', background: '#d4f0e0', color: '#1a7a45', fontSize: '0.75rem', fontWeight: 700, padding: '5px 14px', borderRadius: 50, marginBottom: 20, letterSpacing: 0.5 },
    h1:         { fontSize: 'clamp(2rem, 4.5vw, 3.4rem)', fontWeight: 900, color: '#111', lineHeight: 1.12, letterSpacing: '-1.5px', marginBottom: 12 },
    h1green:    { color: '#1db954', display: 'block' },
    subtitle:   { color: '#555', fontSize: '1rem', lineHeight: 1.7, maxWidth: 560, margin: '0 auto 36px' },

    // SEARCH
    searchWrap: { background: 'white', borderRadius: 60, padding: '7px 7px 7px 22px', display: 'flex', alignItems: 'center', maxWidth: 680, margin: '0 auto 28px', boxShadow: '0 4px 28px rgba(0,0,0,0.09)', gap: 6 },
    searchInp:  { border: 'none', outline: 'none', flex: 1, fontSize: '0.95rem', fontFamily: 'Inter,sans-serif', color: '#111', background: 'transparent', padding: '8px 0' },
    divider:    { width: 1, height: 26, background: '#e0e0e0', flexShrink: 0 },
    villeInp:   { border: 'none', outline: 'none', width: 140, fontSize: '0.95rem', fontFamily: 'Inter,sans-serif', color: '#111', background: 'transparent', padding: '8px 0' },
    searchBtn:  { background: '#1db954', color: 'white', border: 'none', padding: '12px 28px', borderRadius: 50, fontSize: '0.92rem', fontWeight: 700, cursor: 'pointer', flexShrink: 0, fontFamily: 'Inter,sans-serif' },
    dropdown:   { position: 'absolute', top: 48, left: -16, background: 'white', borderRadius: 14, boxShadow: '0 8px 32px rgba(0,0,0,0.12)', zIndex: 100, minWidth: 200, overflow: 'hidden', border: '1px solid #ebebeb' },

    // CATS
    catsWrap:   { background: 'white', borderRadius: 60, padding: '14px 28px', display: 'inline-flex', alignItems: 'center', gap: 28, boxShadow: '0 2px 14px rgba(0,0,0,0.06)', flexWrap: 'wrap', justifyContent: 'center' },
    catItem:    { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, cursor: 'pointer', textDecoration: 'none', transition: 'transform 0.2s' },
    catIcon:    { width: 40, height: 40, borderRadius: 10, background: '#f0faf4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' },
    catLabel:   { fontSize: '0.72rem', fontWeight: 600, color: '#111' },

    // SECTION TITLES
    secLabel:   { fontSize: '0.72rem', fontWeight: 700, color: '#1db954', letterSpacing: 1.5, textTransform: 'uppercase', display: 'block', marginBottom: 8 },
    secTitle:   { fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 900, color: '#111', letterSpacing: '-0.8px', marginBottom: 8 },
    secSub:     { color: '#666', fontSize: '0.92rem', marginBottom: 48 },

    // FEATURES
    featGrid:   { display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: 16 },
    featCard:   { borderRadius: 18, border: '1px solid #e8e8e8', padding: 28, background: 'white' },
    featCardHL: { borderRadius: 18, padding: 28, background: '#1db954', color: 'white' },
    featTag:    { fontSize: '0.68rem', fontWeight: 800, background: 'rgba(255,255,255,0.25)', color: 'white', padding: '4px 10px', borderRadius: 50, display: 'inline-block', marginBottom: 16, letterSpacing: 0.5 },
    featIcon:   { fontSize: '1.8rem', marginBottom: 14 },
    featTitle:  { fontWeight: 800, fontSize: '1.15rem', marginBottom: 10, lineHeight: 1.3 },
    featDesc:   { fontSize: '0.86rem', lineHeight: 1.7, color: '#555' },
    featDescW:  { fontSize: '0.86rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.82)' },
    featLink:   { fontSize: '0.82rem', fontWeight: 700, color: '#1db954', display: 'block', marginTop: 16, textDecoration: 'none' },

    // TEACHERS
    teachGrid:  { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 },
    teachCard:  { borderRadius: 18, border: '1px solid #e8e8e8', padding: 24, background: 'white', transition: 'all 0.25s' },
    avatar:     { width: 52, height: 52, borderRadius: '50%', background: '#1db954', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '1.1rem', flexShrink: 0 },
    diplTag:    { fontSize: '0.68rem', fontWeight: 800, color: '#1db954', background: '#e6f7ee', padding: '3px 10px', borderRadius: 50, letterSpacing: 0.5, display: 'inline-block', marginBottom: 6 },
    tag1er:     { fontSize: '0.7rem', fontWeight: 700, color: '#d4850a', background: '#fff4e0', padding: '3px 10px', borderRadius: 50, display: 'inline-block' },
    tagGrat:    { fontSize: '0.7rem', fontWeight: 700, color: '#888', background: '#f5f5f5', padding: '3px 10px', borderRadius: 50, display: 'inline-block', marginLeft: 6 },
    contactBtn: { border: '1.5px solid #e0e0e0', background: 'white', color: '#111', padding: '8px 18px', borderRadius: 50, fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter,sans-serif', transition: 'all 0.2s' },

    // FAQ
    faqItem:    { borderBottom: '1px solid #f0f0f0', padding: '18px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' },
    faqQ:       { fontWeight: 600, fontSize: '0.95rem', color: '#111' },
    faqA:       { color: '#555', fontSize: '0.88rem', lineHeight: 1.7, paddingTop: 12, paddingRight: 32 },
  };

  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    { q: 'Comment fonctionne la commission de 10% au Learnect ?', a: 'Contrairement aux plateformes traditionnelles qui prennent des marges de 30%, Learnect applique une commission fixe de 10% sur le prix fixé par l\'enseignant. Ainsi, sur un cours de 100 DH, l\'enseignant reçoit 90 DH directement.' },
    { q: 'Les diplômes et justificatifs des enseignants sont-ils réellement authentiques ?', a: 'Oui, chaque diplôme est rigoureusement vérifié par notre équipe avant validation du profil enseignant.' },
    { q: 'Qu\'est-ce que l\'offre promotionnelle "Premier cours offert" ?', a: 'Le premier cours avec un enseignant est proposé à -50% pour vous permettre d\'évaluer la qualité sans risque.' },
    { q: 'Puis-je simuler l\'ensemble des interactions du soutien scolaire ?', a: 'Oui, la plateforme permet de gérer réservations, paiements, messagerie et avis en toute autonomie.' },
  ];

  return (
    <div style={S.page}>

      {/* ── HERO ─────────────────────────────── */}
      <section style={S.hero}>
        <div style={S.wrap}>
          <span style={S.badge}>Soutien Scolaire Particulier au Maroc · 100% Direct & Transparent</span>
          <h1 style={S.h1}>
            Le cours particulier qui<br />vous ressemble.
            <span style={S.h1green}>Trouvez le prof idéal.</span>
          </h1>
          <p style={S.subtitle}>
            Rejoignez Learnect : Des cours d'accompagnement d'exception certifiés,
            sans frais de dossier. <strong>10% de commission unique</strong> pour la plateforme,
            1er cours offert pour l'élève.
          </p>

          {/* SEARCH BAR */}
          <form onSubmit={handleSearch} style={S.searchWrap}>
            <span style={{ fontSize: '1rem', flexShrink: 0 }}>📚</span>
            <input
              style={S.searchInp}
              placeholder="Quelle matière ? ex: Mathématiques"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <div style={S.divider} />
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <input
                style={S.villeInp}
                placeholder="Adresse ou ville"
                value={ville}
                onChange={e => setVille(e.target.value)}
                onFocus={() => setShowVilles(true)}
                onBlur={() => setTimeout(() => setShowVilles(false), 150)}
              />
              {showVilles && (
                <div style={S.dropdown}>
                  {villes.map(v => (
                    <div key={v}
                      onMouseDown={() => { setVille(v); setShowVilles(false); }}
                      style={{ padding: '11px 20px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500 }}
                      onMouseOver={e => e.currentTarget.style.background = '#f5f5f5'}
                      onMouseOut={e => e.currentTarget.style.background = 'white'}>
                      {v}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button type="submit" style={S.searchBtn}>🔍 Rechercher</button>
          </form>

          {/* CATEGORIES */}
          <div style={S.catsWrap}>
            {categories.map((c, i) => (
              <Link key={i} to={`/teachers?matiere=${c.label}`} style={S.catItem}
                onMouseOver={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={S.catIcon}>{c.icon}</div>
                <span style={S.catLabel}>{c.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CE QUI REND LEARNECT DIFFERENT ───── */}
      <section style={{ padding: '80px 28px', background: 'white' }}>
        <div style={S.wrap}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span style={S.secLabel}>NOBLE · ÉTHIQUE · TRANSPARENT</span>
            <h2 style={S.secTitle}>Qu'est-ce qui rend Learnect différent ?</h2>
            <p style={S.secSub}>Une charte basée sur la transparence des prix et l'excellence académique des tuteurs au Maroc.</p>
          </div>
          <div style={S.featGrid}>
            {features.map((f, i) => (
              <div key={i} style={f.highlight ? S.featCardHL : S.featCard}>
                {f.highlight && <span style={S.featTag}>{f.tag}</span>}
                <div style={S.featIcon}>{f.icon}</div>
                <h4 style={{ ...S.featTitle, color: f.highlight ? 'white' : '#111' }}>{f.title}</h4>
                <p style={f.highlight ? S.featDescW : S.featDesc}>{f.desc}</p>
                {f.link && <a href="/teachers" style={S.featLink}>{f.link}</a>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NOS SUPER-ENSEIGNANTS ─────────────── */}
      <section style={{ padding: '80px 28px', background: '#f8fdf9' }}>
        <div style={S.wrap}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
            <div>
              <span style={S.secLabel}>À L'AFFICHE CE MOIS-CI</span>
              <h2 style={{ ...S.secTitle, marginBottom: 6 }}>Rencontrez nos super-enseignants</h2>
              <p style={{ color: '#666', fontSize: '0.88rem' }}>Enseignants chevronnés, agréés issus de grandes écoles d'ingénieurs</p>
            </div>
            <Link to="/teachers" style={{ color: '#1db954', fontWeight: 700, fontSize: '0.88rem', textDecoration: 'none' }}>
              Parcourir tout l'annuaire scolaire →
            </Link>
          </div>

          {loading ? (
            <p style={{ color: '#888', textAlign: 'center' }}>Chargement...</p>
          ) : teachers.length === 0 ? (
            // cartes démo si pas de données
            <div style={S.teachGrid}>
              {[
                { nom: 'Sofia', prenom: 'Bennani', ville: 'Casablanca', tarif: 100, note: 4.8, matiere: 'Mathématiques' },
                { nom: 'Amine', prenom: 'Chraïbi', ville: 'Marrakech', tarif: 120, note: 4.6, matiere: 'Physique' },
                { nom: 'Tarik', prenom: 'Alaoui', ville: 'Tanger', tarif: 200, note: 5.0, matiere: 'Informatique' },
              ].map((t, i) => (
                <TeacherCard key={i} t={t} S={S} />
              ))}
            </div>
          ) : (
            <div style={S.teachGrid}>
              {teachers.map((t, i) => (
                <TeacherCard key={i} t={{ nom: t.user?.nom, prenom: t.user?.prenom, ville: t.user?.ville, tarif: t.tarifHeure, note: t.noteMoyenne, matiere: t.titre }} S={S} id={t.utilisateur_id} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────── */}
      <section style={{ padding: '80px 28px', background: 'white' }}>
        <div style={{ ...S.wrap, maxWidth: 760 }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span style={S.secLabel}>UNE QUESTION ?</span>
            <h2 style={S.secTitle}>Foire Aux Questions Learnect</h2>
            <p style={{ color: '#666', fontSize: '0.88rem' }}>Tout savoir sur le fond de cours particuliers, la rigueur des prix, et la politique tarifaire.</p>
          </div>
          <div>
            {faqs.map((f, i) => (
              <div key={i} style={S.faqItem} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <div style={{ flex: 1 }}>
                  <p style={S.faqQ}>{f.q}</p>
                  {openFaq === i && <p style={S.faqA}>{f.a}</p>}
                </div>
                <span style={{ color: '#1db954', fontSize: '1.2rem', fontWeight: 700, marginLeft: 16 }}>
                  {openFaq === i ? '−' : '+'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────── */}
      <footer style={{ background: '#111', padding: '28px 28px', textAlign: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.82rem', margin: 0 }}>
          © 2025 Learnect · Tous droits réservés
        </p>
      </footer>

    </div>
  );
}

// ── COMPOSANT TEACHER CARD ───────────────
function TeacherCard({ t, S, id }) {
  return (
    <div style={S.teachCard}
      onMouseOver={e => { e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.10)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
      onMouseOut={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}>

      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div style={S.avatar}>
          {t.prenom?.[0]?.toUpperCase() || 'P'}
        </div>
        <div>
          <p style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: 2 }}>{t.prenom} {t.nom}</p>
          <p style={{ color: '#888', fontSize: '0.8rem' }}>📍 {t.ville || 'Maroc'}</p>
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <p style={{ fontWeight: 800, fontSize: '0.95rem', color: '#111' }}>{t.tarif} DH/h</p>
          <p style={{ color: '#f5a623', fontSize: '0.78rem' }}>{'★'.repeat(Math.round(t.note || 5))}</p>
        </div>
      </div>

      {/* diplome tag */}
      <span style={S.diplTag}>🎓 DIPLÔME ACADÉMIQUE</span>
      <p style={{ color: '#555', fontSize: '0.83rem', lineHeight: 1.6, margin: '8px 0 16px' }}>
        {t.matiere || 'Enseignant qualifié et expérimenté, passionné par la transmission du savoir.'}
      </p>

      {/* footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 14, borderTop: '1px solid #f0f0f0' }}>
        <div>
          <span style={S.tag1er}>1ER COURS OFFERT 🎁</span>
          <span style={S.tagGrat}>Gratuit</span>
        </div>
        <Link to={id ? `/teachers/${id}` : '/teachers'}
          style={{ border: '1.5px solid #e0e0e0', background: 'white', color: '#111', padding: '8px 18px', borderRadius: 50, fontSize: '0.82rem', fontWeight: 700, textDecoration: 'none', transition: 'all 0.2s' }}
          onMouseOver={e => { e.currentTarget.style.borderColor = '#1db954'; e.currentTarget.style.color = '#1db954'; }}
          onMouseOut={e => { e.currentTarget.style.borderColor = '#e0e0e0'; e.currentTarget.style.color = '#111'; }}>
          Contacter ↓
        </Link>
      </div>
    </div>
  );
}

export default Home;