import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const MATIERES_SUGGEST = [
  { nom: 'Mathématiques', cat: 'Soutien' },
  { nom: 'Physique-Chimie', cat: 'Soutien' },
  { nom: 'Anglais', cat: 'Langues' },
  { nom: 'Algèbre & Analyse', cat: 'Soutien' },
  { nom: 'Français', cat: 'Langues' },
  { nom: 'Arabe', cat: 'Langues' },
  { nom: 'Informatique', cat: 'Sciences' },
  { nom: 'Guitare', cat: 'Musique' },
  { nom: 'Dessin & Aquarelle', cat: 'Arts' },
];

const VILLES_SUGGEST = [
  { label: 'Autour de moi', type: 'gps' },
  { label: 'En ligne (cours par webcam)', type: 'online' },
  { label: 'Casablanca', type: 'city' },
  { label: 'Marrakech', type: 'city' },
  { label: 'Rabat', type: 'city' },
  { label: 'Tanger', type: 'city' },
];

const CATEGORIES = [
  { label: 'Soutien scolaire', target: 'Mathématiques' },
  { label: 'Coaching Sportif', target: 'Sport' },
  { label: 'Langues', target: 'Français' },
  { label: 'Musique', target: 'Guitare' },
  { label: 'Arts & Dessin', target: 'Dessin & Aquarelle' },
];

const FAQS = [
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
    q: 'Puis-je gérer toutes mes interactions sur la plateforme ?',
    a: 'Oui ! La plateforme permet de gérer réservations, paiements, messagerie et avis en toute autonomie.',
  },
];

// ── composant principal ──────────────────────────────────────────
function Home() {
  const navigate = useNavigate();

  const [matiereInput, setMatiereInput]     = useState('');
  const [villeInput, setVilleInput]         = useState('');
  const [showMatieres, setShowMatieres]     = useState(false);
  const [showVilles, setShowVilles]         = useState(false);
  const [teachers, setTeachers]             = useState([]);
  const [loading, setLoading]               = useState(true);
  const [openFaq, setOpenFaq]               = useState(null);

  // filtres autocomplete
  const filteredMatieres = MATIERES_SUGGEST.filter(m =>
    m.nom.toLowerCase().includes(matiereInput.toLowerCase())
  );

  const filteredVilles = VILLES_SUGGEST.filter(v =>
    v.label.toLowerCase().includes(villeInput.toLowerCase())
  );

  // charger enseignants — méthode useEffect DAIF
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
    navigate(`/teachers?matiere=${matiereInput}&ville=${villeInput}`);
  }

  function selectMatiere(nom) {
    setMatiereInput(nom);
    setShowMatieres(false);
  }

  function selectVille(v) {
    setVilleInput(v.label);
    setShowVilles(false);
  }

  function toggleFaq(i) {
    setOpenFaq(openFaq === i ? null : i);
  }

  // transformer données backend pour affichage cards
    const displayTeachers = teachers.map(t => ({
      id: t.utilisateur_id,
      prenom: t.user?.prenom,
      nom: t.user?.nom,
      ville: t.user?.ville,
      tarif: t.tarifHeure,
      note: t.noteMoyenne,
      diplome: t.diplome,
      bio: t.description_profil,
      photo: t.user?.photo,
    }));
    
  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
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
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 50, padding: '6px 16px', fontSize: '0.72rem', fontWeight: 700, color: '#065f46', marginBottom: 24 }}>
            🔥 Soutien Scolaire Particulier au Maroc · 100% Direct & Transparent
          </div>

          {/* titre h1 */}
          <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 800, color: '#0f172a', lineHeight: 1.12, letterSpacing: '-1.5px', marginBottom: 16 }}>
            Le cours particulier qui vous ressemble.<br />
            <span style={{ color: '#059669' }}>Trouvez le prof idéal.</span>
          </h1>

          {/* sous-titre */}
          <p style={{ color: '#64748b', fontSize: '0.95rem', maxWidth: 540, margin: '0 auto 40px', lineHeight: 1.7, fontWeight: 500 }}>
            Rejoignez Learnect : Des cours d'accompagnement d'exception certifiés, sans frais de dossier.{' '}
            <strong style={{ color: '#059669' }}>10% de commission unique</strong> pour la plateforme,
            1er cours offert pour l'élève.
          </p>

          {/* ── SEARCH BAR ── */}
          <form onSubmit={handleSearch} style={{
            background: 'white',
            borderRadius: 40,
            padding: '10px 10px 10px 0',
            display: 'flex',
            alignItems: 'center',
            maxWidth: 820,
            margin: '0 auto 32px',
            boxShadow: '0 15px 40px rgba(16,185,129,0.08)',
            border: '1px solid rgba(16,185,129,0.15)',
            gap: 0,
          }}>

            {/* input matière */}
            <div style={{ flex: 1, position: 'relative', padding: '0 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ background: '#ecfdf5', borderRadius: '50%', width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1rem' }}>
                  📚
                </div>
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{ fontSize: '0.6rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 2 }}>
                    Je veux apprendre :
                  </div>
                  <input
                    type="text"
                    placeholder="Quelle matière ? (ex: Mathématiques, Arabe…)"
                    value={matiereInput}
                    onChange={e => { setMatiereInput(e.target.value); setShowMatieres(true); }}
                    onFocus={() => { setShowMatieres(true); setShowVilles(false); }}
                    onBlur={() => setTimeout(() => setShowMatieres(false), 150)}
                    style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', fontFamily: 'Inter, sans-serif', background: 'transparent' }}
                  />
                </div>
              </div>

              {/* dropdown matières */}
              {showMatieres && (
                <div style={{ position: 'absolute', top: 56, left: 0, right: 0, background: 'white', borderRadius: 16, boxShadow: '0 8px 32px rgba(0,0,0,0.12)', zIndex: 100, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                  <div style={{ padding: '8px 16px 4px', fontSize: '0.62rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1.5 }}>
                    Matières suggérées
                  </div>
                  {filteredMatieres.map((m, i) => (
                    <div key={i}
                      onMouseDown={() => selectMatiere(m.nom)}
                      style={{ padding: '10px 16px', cursor: 'pointer', fontSize: '0.84rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                      onMouseOver={e => e.currentTarget.style.background = '#f0fdf4'}
                      onMouseOut={e => e.currentTarget.style.background = 'white'}>
                      <span>{m.nom}</span>
                      <span style={{ fontSize: '0.65rem', fontWeight: 700, background: '#f1f5f9', color: '#64748b', padding: '2px 8px', borderRadius: 50 }}>{m.cat}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* séparateur */}
            <div style={{ width: 1, height: 36, background: '#e2e8f0', flexShrink: 0 }} />

            {/* input ville */}
            <div style={{ flex: 1, position: 'relative', padding: '0 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ background: '#ecfdf5', borderRadius: '50%', width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1rem' }}>
                  📍
                </div>
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{ fontSize: '0.6rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 2 }}>
                    Adresse ou ville :
                  </div>
                  <input
                    type="text"
                    placeholder="Où ? (ex: Marrakech, En ligne…)"
                    value={villeInput}
                    onChange={e => { setVilleInput(e.target.value); setShowVilles(true); }}
                    onFocus={() => { setShowVilles(true); setShowMatieres(false); }}
                    onBlur={() => setTimeout(() => setShowVilles(false), 150)}
                    style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', fontFamily: 'Inter, sans-serif', background: 'transparent' }}
                  />
                </div>
              </div>

              {/* dropdown villes */}
              {showVilles && (
                <div style={{ position: 'absolute', top: 56, left: 0, right: 0, background: 'white', borderRadius: 16, boxShadow: '0 8px 32px rgba(0,0,0,0.12)', zIndex: 100, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                  <div style={{ padding: '8px 16px 4px', fontSize: '0.62rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1.5 }}>
                    Lieux suggérés au Maroc
                  </div>
                  {filteredVilles.map((v, i) => (
                    <div key={i}
                      onMouseDown={() => selectVille(v)}
                      style={{ padding: '10px 16px', cursor: 'pointer', fontSize: '0.84rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                      onMouseOver={e => e.currentTarget.style.background = '#f0fdf4'}
                      onMouseOut={e => e.currentTarget.style.background = 'white'}>
                      <span>📍 {v.label}</span>
                      {v.type === 'online' && (
                        <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#059669', background: '#ecfdf5', padding: '2px 8px', borderRadius: 50 }}>Populaire</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* bouton rechercher */}
            <button type="submit" style={{
              background: '#059669', color: 'white', border: 'none',
              padding: '14px 28px', borderRadius: 50,
              fontSize: '0.88rem', fontWeight: 800, cursor: 'pointer',
              flexShrink: 0, fontFamily: 'Inter, sans-serif',
              display: 'flex', alignItems: 'center', gap: 6,
              marginRight: 4,
            }}
              onMouseOver={e => e.currentTarget.style.background = '#047857'}
              onMouseOut={e => e.currentTarget.style.background = '#059669'}>
              🔍 Rechercher
            </button>
          </form>

          {/* raccourcis catégories */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1.5 }}>Raccourcis :</span>
            {CATEGORIES.map((c, i) => (
              <button key={i}
                onClick={() => navigate(`/teachers?matiere=${c.target}`)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '8px 16px', borderRadius: 50,
                  border: '1px solid #d1fae5', background: 'rgba(255,255,255,0.6)',
                  fontSize: '0.78rem', fontWeight: 700, color: '#0f172a',
                  cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 0.2s',
                }}
                onMouseOver={e => { e.currentTarget.style.background = '#ecfdf5'; e.currentTarget.style.borderColor = '#6ee7b7'; e.currentTarget.style.color = '#059669'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.6)'; e.currentTarget.style.borderColor = '#d1fae5'; e.currentTarget.style.color = '#0f172a'; }}>
                {c.label}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════
          CE QUI REND LEARNECT DIFFERENT
      ══════════════════════════════════════ */}
      <section style={{ padding: '80px 24px', background: 'rgba(236,253,245,0.2)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>

          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: '0.62rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>
              Modèle Éthique & Transparent
            </div>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 800, color: '#0f172a', letterSpacing: -0.5, marginBottom: 8 }}>
              Qu'est-ce qui rend Learnect différent ?
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.88rem' }}>
              Une charte basée sur la transparence des prix et l'excellence académique des tuteurs au Maroc.
            </p>
          </div>

          {/* bento grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr', gap: 20 }}>

            {/* carte verte principale */}
            <div style={{ background: 'linear-gradient(135deg, #059669, #047857)', borderRadius: 28, padding: 32, color: 'white', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', filter: 'blur(20px)' }} />
              <div>
                <span style={{ fontSize: '0.6rem', fontWeight: 800, background: 'rgba(255,255,255,0.2)', color: 'white', padding: '4px 12px', borderRadius: 50, display: 'inline-block', marginBottom: 16, letterSpacing: 1, textTransform: 'uppercase' }}>
                  Commission Transparente · 10%
                </span>
                <h4 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.2rem', fontWeight: 800, marginBottom: 12, lineHeight: 1.3 }}>
                  Pas de frais cachés ou de prélèvements opaques de 30%
                </h4>
                <p style={{ fontSize: '0.83rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.7 }}>
                  Alors que d'autres préparent des forfaits annuels prohibitifs, nous appliquons une commission claire de 10%. Si vous fixez votre tarif à 150 DH/h, vous percevez 135 DH nets directs.
                </p>
              </div>
              <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: 10, fontSize: '1.2rem' }}>💰</div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.82rem' }}>Rétribution directe garantie à 90%</div>
                  <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)' }}>Transparence des rapports financiers</div>
                </div>
              </div>
            </div>

            {/* carte diplômes */}
            <div style={{ background: 'white', borderRadius: 28, padding: 28, border: '1px solid rgba(16,185,129,0.1)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
              onMouseOver={e => e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'}
              onMouseOut={e => e.currentTarget.style.boxShadow = 'none'}>
              <div>
                <div style={{ width: 40, height: 40, background: '#ecfdf5', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', marginBottom: 20 }}>🎓</div>
                <h4 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginBottom: 10 }}>
                  Diplômes validés à la main
                </h4>
                <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.7 }}>
                  La sécurité est notre priorité. Chaque diplôme supérieur est rigoureusement vérifié par notre équipe avant mise en ligne.
                </p>
              </div>
              <div style={{ marginTop: 20, fontSize: '0.72rem', fontWeight: 700, color: '#059669' }}>
                Assurance Qualité Premium · Maroc
              </div>
            </div>

            {/* carte 1er cours */}
            <div style={{ background: 'white', borderRadius: 28, padding: 28, border: '1px solid rgba(16,185,129,0.1)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
              onMouseOver={e => e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'}
              onMouseOut={e => e.currentTarget.style.boxShadow = 'none'}>
              <div>
                <div style={{ width: 40, height: 40, background: '#ecfdf5', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', marginBottom: 20 }}>✨</div>
                <h4 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginBottom: 10 }}>
                  1er cours offert pour t'orienter
                </h4>
                <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.7 }}>
                  Aucun risque : le premier créneau est proposé à 0 DH lors de la réservation initiale, facilitant la prise de contact sans friction.
                </p>
              </div>
              <div style={{ marginTop: 20, fontSize: '0.72rem', fontWeight: 700, color: '#059669' }}>
                Découverte & Essai Gratuit →
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          NOS SUPER-ENSEIGNANTS
      ══════════════════════════════════════ */}
      <section style={{ padding: '80px 24px', background: 'white', borderTop: '1px solid rgba(16,185,129,0.08)', borderBottom: '1px solid rgba(16,185,129,0.08)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40 }}>
            <div>
              <div style={{ fontSize: '0.62rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 6 }}>
                À l'affiche ce mois-ci
              </div>
              <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', fontWeight: 800, color: '#0f172a', letterSpacing: -0.5, marginBottom: 4 }}>
                Rencontrez nos super-enseignants
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.82rem' }}>
                Enseignants chevronnés, agrégés issus de grandes écoles d'ingénieurs
              </p>
            </div>
            <Link to="/teachers" style={{ color: '#059669', fontWeight: 700, fontSize: '0.82rem', textDecoration: 'none' }}>
              Parcourir tout l'annuaire scolaire →
            </Link>
          </div>

          {loading ? (
            <p style={{ textAlign: 'center', color: '#94a3b8', padding: 40 }}>Chargement...</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
              {displayTeachers.map((t, i) => (
                <TeacherCard key={i} t={t} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════
          FAQ
      ══════════════════════════════════════ */}
      <section style={{ padding: '80px 24px', background: '#f8fafc' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: '0.62rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>
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
            {FAQS.map((f, i) => (
              <div key={i} style={{ background: 'white', borderRadius: 20, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <button
                  onClick={() => toggleFaq(i)}
                  style={{ width: '100%', textAlign: 'left', padding: '18px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: '0.88rem', color: '#0f172a' }}>
                  {f.q}
                  <span style={{ color: '#059669', fontSize: '0.9rem', marginLeft: 12, flexShrink: 0, display: 'inline-block', transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: '0 22px 18px', paddingTop: 14, fontSize: '0.83rem', color: '#64748b', lineHeight: 1.75, borderTop: '1px solid #f1f5f9' }}>
                    {f.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FOOTER
      ══════════════════════════════════════ */}
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
              <p style={{ color: '#64748b', fontSize: '0.8rem', lineHeight: 1.7, marginBottom: 12 }}>
                La plateforme élite de mise en relation directe élève-prof au Maroc. Sans intermédiaires gourmands.
              </p>
              <div style={{ fontSize: '0.68rem', fontFamily: 'monospace', color: '#334155' }}>
                Conçu pour l'excellence et la réussite scolaire au Maroc.
              </div>
            </div>

            {/* matières */}
            <div>
              <h4 style={{ color: 'white', fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 16 }}>Matières Vedettes</h4>
              {['Mathématiques - Brevet / Bac', 'Physique-Chimie & Ingénieur', 'Soutien Scolaire Français', 'Anglais américain & TOEFL', 'Langue Arabe Élite'].map((m, i) => (
                <Link key={i} to={`/teachers?matiere=${m.split(' ')[0]}`}
                  style={{ display: 'block', color: '#64748b', fontSize: '0.78rem', fontWeight: 500, textDecoration: 'none', marginBottom: 8 }}
                  onMouseOver={e => e.currentTarget.style.color = '#34d399'}
                  onMouseOut={e => e.currentTarget.style.color = '#64748b'}>
                  {m}
                </Link>
              ))}
            </div>

            {/* villes */}
            <div>
              <h4 style={{ color: 'white', fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 16 }}>Villes Populaires</h4>
              {['Casablanca', 'Marrakech', 'Rabat', 'Tanger', 'En ligne'].map((v, i) => (
                <Link key={i} to={`/teachers?ville=${v}`}
                  style={{ display: 'block', color: '#64748b', fontSize: '0.78rem', fontWeight: 500, textDecoration: 'none', marginBottom: 8 }}
                  onMouseOver={e => e.currentTarget.style.color = '#34d399'}
                  onMouseOut={e => e.currentTarget.style.color = '#64748b'}>
                  Cours à {v}
                </Link>
              ))}
            </div>

            {/* aide */}
            <div>
              <h4 style={{ color: 'white', fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 16 }}>Aide & Plateforme</h4>
              <p style={{ color: '#64748b', fontSize: '0.78rem', lineHeight: 1.7, marginBottom: 14 }}>
                Soutien scolaire de confiance au Maroc. Messagerie directe, agenda temps réel, paiement sécurisé.
              </p>
              <div style={{ background: '#0d2a1f', border: '1px solid #064e3b', borderRadius: 12, padding: '10px 14px', fontSize: '0.68rem', fontWeight: 700, color: '#34d399' }}>
                💡 10% de commission technique fixe sur toutes les réservations validées.
              </div>
            </div>
          </div>

          <div style={{ paddingTop: 24, borderTop: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', color: '#475569' }}>
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

// ══════════════════════════════════════
// TEACHER CARD — composant séparé
// ══════════════════════════════════════
function TeacherCard({ t }) {
  return (
    <div
      style={{ background: 'white', borderRadius: 28, border: '1px solid rgba(16,185,129,0.08)', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'all 0.25s' }}
      onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(16,185,129,0.06)'; }}
      onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>

      {/* contenu */}
      <div style={{ padding: 24 }}>

        {/* header card */}
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 16 }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#ecfdf5', border: '2px solid rgba(5,150,105,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: '1.1rem', color: '#059669', flexShrink: 0 }}>
            {t.prenom?.[0]?.toUpperCase() || 'P'}
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: '0.9rem', color: '#0f172a', marginBottom: 2 }}>
              {t.prenom} {t.nom}
            </p>
            <p style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500, marginBottom: 6 }}>
              📍 {t.ville || 'Maroc'}
            </p>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, background: 'rgba(245,158,11,0.12)', color: '#92400e', padding: '2px 8px', borderRadius: 50 }}>
                ⭐ {t.note > 0 ? Number(t.note).toFixed(1) : 'Nouveau Prof'}
              </span>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#059669' }}>
                {t.tarif} DH / h
              </span>
            </div>
          </div>
        </div>

        {/* diplôme box */}
        <div style={{ background: 'rgba(236,253,245,0.4)', borderRadius: 14, padding: '12px 14px', marginBottom: 14, border: '1px solid rgba(16,185,129,0.1)' }}>
          <div style={{ fontSize: '0.58rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
            🎓 Diplôme académique :
          </div>
          <p style={{ fontSize: '0.78rem', color: '#1e293b', fontWeight: 600, fontStyle: 'italic', lineHeight: 1.5 }}>
            "{t.diplome || 'Enseignant qualifié et expérimenté'}"
          </p>
        </div>

        {/* bio — 3 lignes max */}
        <p style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.7, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {t.bio || 'Passionné par la transmission du savoir.'}
        </p>

      </div>

    
  );
}

export default Home;    