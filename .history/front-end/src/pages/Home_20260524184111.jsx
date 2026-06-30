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

function Home() {

  const navigate = useNavigate();

  const [matiereInput, setMatiereInput] = useState('');
  const [villeInput, setVilleInput] = useState('');
  const [showMatieres, setShowMatieres] = useState(false);
  const [showVilles, setShowVilles] = useState(false);

  // state enseignants
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  // faq open close
  const [openFaq, setOpenFaq] = useState(null);

  // filtre autocomplete matières
  const filteredMatieres = MATIERES_SUGGEST.filter(m =>
    m.nom.toLowerCase().includes(matiereInput.toLowerCase())
  );

  // filtre autocomplete villes
  const filteredVilles = VILLES_SUGGEST.filter(v =>
    v.label.toLowerCase().includes(villeInput.toLowerCase())
  );

  // chargement enseignants depuis backend
  useEffect(() => {

    async function loadTeachers() {

      try {

        const res = await api.get('/enseignants');

        // juste 3 profs homepage
        setTeachers(res.data.slice(0, 3));

      } catch (error) {

        console.log(error);
        setTeachers([]);

      } finally {

        setLoading(false);

      }

    }

    loadTeachers();

  }, []);

  // search redirect
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

  // data cards enseignants
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

    <div style={{
      fontFamily: 'Inter, sans-serif',
      background: '#f8fafc',
      minHeight: '100vh'
    }}>

      {/* HERO SECTION */}

      <section style={{
        background: 'linear-gradient(180deg, rgba(236,253,245,0.6) 0%, rgba(209,250,229,0.2) 60%, #ffffff 100%)',
        padding: '64px 24px 80px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>

        {/* bg deco */}

        <div style={{
          position: 'absolute',
          top: 40,
          right: 40,
          width: 384,
          height: 384,
          borderRadius: '50%',
          background: 'rgba(209,250,229,0.4)',
          filter: 'blur(80px)',
        }} />

        <div style={{
          maxWidth: 1100,
          margin: '0 auto',
          position: 'relative'
        }}>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(255,255,255,0.8)',
            border: '1px solid rgba(16,185,129,0.3)',
            borderRadius: 50,
            padding: '6px 16px',
            fontSize: '0.72rem',
            fontWeight: 700,
            color: '#065f46',
            marginBottom: 24
          }}>
            🔥 Soutien Scolaire Particulier au Maroc
          </div>

          <h1 style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 'clamp(2rem, 5vw, 4rem)',
            fontWeight: 800,
            color: '#0f172a',
            lineHeight: 1.12,
            letterSpacing: '-1.5px',
            marginBottom: 16
          }}>
            Le cours particulier qui vous ressemble.<br />
            <span style={{ color: '#059669' }}>
              Trouvez le prof idéal.
            </span>
          </h1>

          <p style={{
            color: '#64748b',
            fontSize: '0.95rem',
            maxWidth: 540,
            margin: '0 auto 40px',
            lineHeight: 1.7,
            fontWeight: 500
          }}>
            Rejoignez Learnect et trouvez des enseignants qualifiés partout au Maroc.
          </p>

          {/* SEARCH BAR */}

          <form
            onSubmit={handleSearch}
            style={{
              background: 'white',
              borderRadius: 40,
              padding: '10px 10px 10px 0',
              display: 'flex',
              alignItems: 'center',
              maxWidth: 820,
              margin: '0 auto 32px',
              boxShadow: '0 15px 40px rgba(16,185,129,0.08)',
              border: '1px solid rgba(16,185,129,0.15)',
            }}
          >

            {/* matière */}

            <div style={{
              flex: 1,
              position: 'relative',
              padding: '0 16px'
            }}>

              <input
                type="text"
                placeholder="Quelle matière ?"
                value={matiereInput}
                onChange={e => {
                  setMatiereInput(e.target.value);
                  setShowMatieres(true);
                }}
                onFocus={() => {
                  setShowMatieres(true);
                  setShowVilles(false);
                }}
                onBlur={() => setTimeout(() => setShowMatieres(false), 150)}
                style={{
                  border: 'none',
                  outline: 'none',
                  width: '100%',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  background: 'transparent'
                }}
              />

              {showMatieres && (

                <div style={{
                  position: 'absolute',
                  top: 50,
                  left: 0,
                  right: 0,
                  background: 'white',
                  borderRadius: 16,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                  zIndex: 100,
                  overflow: 'hidden'
                }}>

                  {filteredMatieres.map((m, i) => (

                    <div
                      key={i}
                      onMouseDown={() => selectMatiere(m.nom)}
                      style={{
                        padding: '10px 16px',
                        cursor: 'pointer',
                        fontSize: '0.84rem',
                        fontWeight: 600
                      }}
                    >
                      {m.nom}
                    </div>

                  ))}

                </div>

              )}

            </div>

            {/* separator */}

            <div style={{
              width: 1,
              height: 36,
              background: '#e2e8f0'
            }} />

            {/* ville */}

            <div style={{
              flex: 1,
              position: 'relative',
              padding: '0 16px'
            }}>

              <input
                type="text"
                placeholder="Ville ?"
                value={villeInput}
                onChange={e => {
                  setVilleInput(e.target.value);
                  setShowVilles(true);
                }}
                onFocus={() => {
                  setShowVilles(true);
                  setShowMatieres(false);
                }}
                onBlur={() => setTimeout(() => setShowVilles(false), 150)}
                style={{
                  border: 'none',
                  outline: 'none',
                  width: '100%',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  background: 'transparent'
                }}
              />

              {showVilles && (

                <div style={{
                  position: 'absolute',
                  top: 50,
                  left: 0,
                  right: 0,
                  background: 'white',
                  borderRadius: 16,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                  zIndex: 100,
                  overflow: 'hidden'
                }}>

                  {filteredVilles.map((v, i) => (

                    <div
                      key={i}
                      onMouseDown={() => selectVille(v)}
                      style={{
                        padding: '10px 16px',
                        cursor: 'pointer',
                        fontSize: '0.84rem',
                        fontWeight: 600
                      }}
                    >
                      📍 {v.label}
                    </div>

                  ))}

                </div>

              )}

            </div>

            {/* button */}

            <button
              type="submit"
              style={{
                background: '#059669',
                color: 'white',
                border: 'none',
                padding: '14px 28px',
                borderRadius: 50,
                fontSize: '0.88rem',
                fontWeight: 800,
                cursor: 'pointer',
                marginRight: 4,
              }}
            >
              🔍 Rechercher
            </button>

          </form>

          {/* catégories */}

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 10,
            flexWrap: 'wrap'
          }}>

            {CATEGORIES.map((c, i) => (

              <button
                key={i}
                onClick={() => navigate(`/teachers?matiere=${c.target}`)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 50,
                  border: '1px solid #d1fae5',
                  background: 'white',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {c.label}
              </button>

            ))}

          </div>

        </div>

      </section>

      {/* TEACHERS */}

      <section style={{
        padding: '80px 24px',
        background: 'white'
      }}>

        <div style={{
          maxWidth: 1100,
          margin: '0 auto'
        }}>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: 40
          }}>

            <div>

              <h2 style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '2rem',
                fontWeight: 800,
                color: '#0f172a'
              }}>
                Nos enseignants
              </h2>

              <p style={{
                color: '#64748b',
                fontSize: '0.82rem'
              }}>
                Découvrez les meilleurs enseignants de la plateforme
              </p>

            </div>

            <Link
              to="/teachers"
              style={{
                color: '#059669',
                fontWeight: 700,
                fontSize: '0.82rem',
                textDecoration: 'none'
              }}
            >
              Voir plus →
            </Link>

          </div>

          {loading ? (

            <p style={{
              textAlign: 'center',
              padding: 40
            }}>
              Chargement...
            </p>

          ) : (

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3,1fr)',
              gap: 20
            }}>

              {displayTeachers.map((t, i) => (

                <TeacherCard key={i} t={t} />

              ))}

            </div>

          )}

        </div>

      </section>

      {/* FAQ */}

      <section style={{
        padding: '80px 24px',
        background: '#f8fafc'
      }}>

        <div style={{
          maxWidth: 760,
          margin: '0 auto'
        }}>

          <div style={{
            textAlign: 'center',
            marginBottom: 48
          }}>

            <h2 style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: '2rem',
              fontWeight: 800,
              color: '#0f172a'
            }}>
              Questions fréquentes
            </h2>

          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12
          }}>

            {FAQS.map((f, i) => (

              <div
                key={i}
                style={{
                  background: 'white',
                  borderRadius: 20,
                  border: '1px solid #e2e8f0',
                  overflow: 'hidden'
                }}
              >

                <button
                  onClick={() => toggleFaq(i)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '18px 22px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 700
                  }}
                >
                  {f.q}
                </button>

                {openFaq === i && (

                  <div style={{
                    padding: '0 22px 18px',
                    color: '#64748b',
                    fontSize: '0.84rem',
                    lineHeight: 1.7
                  }}>
                    {f.a}
                  </div>

                )}

              </div>

            ))}

          </div>

        </div>

      </section>

    </div>

  );

}

function TeacherCard({ t }) {

  return (

    <div style={{
      background: 'white',
      borderRadius: 28,
      border: '1px solid rgba(16,185,129,0.08)',
      overflow: 'hidden',
    }}>

      <div style={{
        padding: 24
      }}>

        <div style={{
          display: 'flex',
          gap: 14,
          alignItems: 'flex-start',
          marginBottom: 16
        }}>

          {/* avatar */}

          <div style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: '#ecfdf5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            color: '#059669',
          }}>
            {t.prenom?.[0]?.toUpperCase() || 'P'}
          </div>

          <div>

            <p style={{
              fontWeight: 800,
              fontSize: '0.9rem',
              color: '#0f172a'
            }}>
              {t.prenom} {t.nom}
            </p>

            <p style={{
              fontSize: '0.75rem',
              color: '#64748b'
            }}>
              📍 {t.ville || 'Maroc'}
            </p>

            <span style={{
              fontSize: '0.82rem',
              fontWeight: 800,
              color: '#059669'
            }}>
              {t.tarif} DH / h
            </span>

          </div>

        </div>

        <div style={{
          background: '#f0fdf4',
          borderRadius: 14,
          padding: '12px 14px',
          marginBottom: 14
        }}>

          <p style={{
            fontSize: '0.78rem',
            color: '#1e293b',
            fontWeight: 600
          }}>
            "{t.diplome || 'Enseignant qualifié'}"
          </p>

        </div>

        <p style={{
          fontSize: '0.78rem',
          color: '#64748b',
          lineHeight: 1.7
        }}>
          {t.bio || 'Passionné par la transmission du savoir.'}
        </p>

      </div>

      <div style={{
        padding: '14px 24px',
        borderTop: '1px solid rgba(16,185,129,0.08)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>

        <span style={{
          fontSize: '0.65rem',
          fontWeight: 700,
          color: '#b45309'
        }}>
          1ER COURS OFFERT 🎁
        </span>

        <Link
          to={t.id ? `/teachers/${t.id}` : '/teachers'}
          style={{
            color: '#059669',
            fontWeight: 700,
            textDecoration: 'none'
          }}
        >
          Contacter →
        </Link>

      </div>

    </div>

  );

}

export default Home;