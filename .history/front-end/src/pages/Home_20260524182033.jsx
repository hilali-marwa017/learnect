// ════════════════════════════════════════════════════════════════
// PROJET    : Learnect.ma — Plateforme de cours particuliers
// COMPOSANT : Home.jsx — Page d'accueil principale
// FORMATEUR : DAIF Othmane
// MODULE    : Développement Front-End — ReactJS
// ════════════════════════════════════════════════════════════════
//
// CONCEPTS REACT UTILISÉS DANS CE FICHIER :
//   ✔ Composants fonctionnels
//   ✔ Props & déstructuration
//   ✔ useState — gestion du state local
//   ✔ useEffect — cycle de vie (chargement API)
//   ✔ useNavigate / Link — React Router
//   ✔ Rendu conditionnel (ternaire, &&)
//   ✔ Rendu de listes avec .map() + key unique
//   ✔ Inputs contrôlés (onChange / value)
//   ✔ Appel API asynchrone avec Axios
//
// ────────────────────────────────────────────────────────────────

// ── ÉTAPE 1 : IMPORTS ──────────────────────────────────────────
// Règle DAIF : toujours importer uniquement ce dont on a besoin
// useState   → gérer les données dynamiques du composant
// useEffect  → exécuter du code au montage (appel API)
import { useState, useEffect } from 'react';

// useNavigate → navigation programmée (ex: après soumission form)
// Link        → navigation déclarative sans rechargement de page
import { useNavigate, Link } from 'react-router-dom';

// Instance Axios préconfigurée (baseURL, headers, interceptors)
import api from '../api/axios';


// ── ÉTAPE 2 : DONNÉES STATIQUES (CONSTANTES) ───────────────────
// Règle DAIF : on déclare les données hors du composant
// → elles ne changent pas → pas besoin de useState
// → déclarées une seule fois en mémoire (pas recréées à chaque rendu)

// Liste des matières pour l'autocomplete de la barre de recherche
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

// Liste des villes avec leur type (gps / online / city)
const VILLES_SUGGEST = [
  { label: 'Autour de moi', type: 'gps' },
  { label: 'En ligne (cours par webcam)', type: 'online' },
  { label: 'Casablanca', type: 'city' },
  { label: 'Marrakech', type: 'city' },
  { label: 'Rabat', type: 'city' },
  { label: 'Tanger', type: 'city' },
];

// Raccourcis de catégories affichés sous la barre de recherche
const CATEGORIES = [
  { label: 'Soutien scolaire', target: 'Mathématiques' },
  { label: 'Coaching Sportif', target: 'Sport' },
  { label: 'Langues', target: 'Français' },
  { label: 'Musique', target: 'Guitare' },
  { label: 'Arts & Dessin', target: 'Dessin & Aquarelle' },
];

// Questions / Réponses pour la section FAQ
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

// Données de démonstration affichées si l'API échoue (fallback)
// Règle DAIF : toujours prévoir un fallback pour éviter un écran vide
const DEMO_TEACHERS = [
  {
    id: 1,
    prenom: 'Sofia', nom: 'Bennani', ville: 'Casablanca',
    tarif: 100, note: 4.8,
    diplome: 'Cycle Ingénieur en Génie Civil (BNTP) & Agrégation de Mathématiques',
    bio: 'Ancienne élève de Math Sup/Math Spé avec 12 ans d\'expérience dans l\'enseignement public.',
    photo: null,
  },
  {
    id: 2,
    prenom: 'Amine', nom: 'Chraïbi', ville: 'Marrakech',
    tarif: 120, note: 4.6,
    diplome: 'Doctorat en Sciences Physiques — Université Cadi Ayyad',
    bio: 'Enseignant-chercheur universitaire passionné par la transmission des savoirs scientifiques.',
    photo: null,
  },
  {
    id: 3,
    prenom: 'Tarik', nom: 'Alaoui', ville: 'Tanger',
    tarif: 200, note: 5.0,
    diplome: 'Ingénieur d\'État Software & Professeur d\'Algorithmique appliqué',
    bio: 'Ingénieur Full-Stack en activité avec une passion dévorante pour l\'apprentissage actif.',
    photo: null,
  },
];


// ════════════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL : Home
// ════════════════════════════════════════════════════════════════
// Règle DAIF : un composant = une fonction qui retourne du JSX
// Exporté en default pour être importé dans App.jsx (React Router)

function Home() {

  // ── HOOK : useNavigate ────────────────────────────────────────
  // Permet la navigation programmée (sans clic sur un <Link>)
  // Exemple : navigate('/teachers?matiere=Maths') après soumission
  const navigate = useNavigate();


  // ── HOOK : useState — Déclaration des states locaux ───────────
  // Règle DAIF : useState retourne [valeur, fonctionMàJ]
  // Chaque appel à setXxx() déclenche un nouveau rendu du composant

  // State de l'input "matière" (barre de recherche)
  const [matiereInput, setMatiereInput] = useState('');

  // State de l'input "ville"
  const [villeInput, setVilleInput] = useState('');

  // Contrôle l'affichage du dropdown de suggestions matières
  const [showMatieres, setShowMatieres] = useState(false);

  // Contrôle l'affichage du dropdown de suggestions villes
  const [showVilles, setShowVilles] = useState(false);

  // Stocke les enseignants chargés depuis l'API backend
  const [teachers, setTeachers] = useState([]);

  // Indique si le chargement API est en cours (pour afficher "Chargement...")
  const [loading, setLoading] = useState(true);

  // Index de la question FAQ actuellement ouverte (null = toutes fermées)
  const [openFaq, setOpenFaq] = useState(null);


  // ── CALCUL DÉRIVÉ : Filtrage des suggestions ──────────────────
  // Règle DAIF : les valeurs calculées depuis le state ne nécessitent
  // PAS de useState — on les recalcule à chaque rendu automatiquement
  // .filter() → crée un nouveau tableau (immutabilité)
  // .toLowerCase() → comparaison insensible à la casse

  const filteredMatieres = MATIERES_SUGGEST.filter(m =>
    m.nom.toLowerCase().includes(matiereInput.toLowerCase())
  );

  const filteredVilles = VILLES_SUGGEST.filter(v =>
    v.label.toLowerCase().includes(villeInput.toLowerCase())
  );


  // ── HOOK : useEffect — Chargement API au montage ──────────────
  // Règle DAIF : useEffect avec [] s'exécute UNE SEULE FOIS
  // au montage du composant (équivalent componentDidMount)
  //
  // Structure recommandée par DAIF :
  //   1. déclarer une fonction async DANS le useEffect
  //   2. l'appeler immédiatement
  //   3. toujours gérer try / catch / finally
  //
  // POURQUOI async DANS useEffect et pas directement ?
  // → useEffect ne peut pas retourner une Promise
  //   (il retourne soit rien, soit une fonction cleanup)

  useEffect(() => {
    async function loadTeachers() {
      try {
        // GET /enseignants → retourne la liste complète
        // .slice(0, 3) → on n'affiche que les 3 premiers en page d'accueil
        const res = await api.get('/enseignants');
        setTeachers(res.data.slice(0, 3));
      } catch (e) {
        // En cas d'erreur réseau ou API, on vide le tableau
        // → le fallback DEMO_TEACHERS prendra le relais (voir displayTeachers)
        setTeachers([]);
      } finally {
        // finally s'exécute TOUJOURS (succès ou erreur)
        // → on retire le loader dans tous les cas
        setLoading(false);
      }
    }
    loadTeachers(); // appel immédiat de la fonction async
  }, []); // [] = dépendances vides → exécution unique au montage


  // ── GESTIONNAIRES D'ÉVÉNEMENTS ────────────────────────────────
  // Règle DAIF : les fonctions handlers sont déclarées DANS le composant
  // pour accéder au state et aux setters via la closure

  // Soumission du formulaire de recherche → navigation avec paramètres URL
  function handleSearch(e) {
    e.preventDefault(); // empêche le rechargement de la page (comportement HTML natif)
    navigate(`/teachers?matiere=${matiereInput}&ville=${villeInput}`);
  }

  // Sélection d'une matière dans le dropdown → remplit l'input + ferme le dropdown
  function selectMatiere(nom) {
    setMatiereInput(nom);
    setShowMatieres(false);
  }

  // Sélection d'une ville dans le dropdown → remplit l'input + ferme le dropdown
  function selectVille(v) {
    setVilleInput(v.label);
    setShowVilles(false);
  }

  // Toggle FAQ : si l'index cliqué est déjà ouvert → on ferme (null)
  //              sinon → on ouvre l'index cliqué
  // Règle DAIF : rendu conditionnel avec opérateur ternaire
  function toggleFaq(i) {
    setOpenFaq(openFaq === i ? null : i);
  }


  // ── TRANSFORMATION DES DONNÉES : Mapping API → Format Affichage
  // Règle DAIF : on adapte les données du backend au format attendu
  // par nos composants d'affichage (séparation des responsabilités)
  //
  // Si teachers.length > 0  → données réelles de l'API
  // Sinon                   → données de démonstration (fallback)
  //
  // Optional chaining (?.) → évite les erreurs si user est null/undefined

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
        photo: t.user?.photo,
      }))
    : DEMO_TEACHERS;


  // ── RENDU JSX ─────────────────────────────────────────────────
  // Règle DAIF : le return contient UNIQUEMENT du JSX
  // Toute la logique est déclarée AVANT le return
  // Un composant retourne UN SEUL élément parent

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>

      {/* ══════════════════════════════════════
          SECTION 1 : HERO
          Contient : badge, titre h1, sous-titre,
                     barre de recherche, raccourcis catégories
      ══════════════════════════════════════ */}
      <section style={{
        background: 'linear-gradient(180deg, rgba(236,253,245,0.6) 0%, rgba(209,250,229,0.2) 60%, #ffffff 100%)',
        padding: '64px 24px 80px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(16,185,129,0.1)',
      }}>
        {/* Décorations visuelles (blobs) — purement esthétiques */}
        <div style={{ position: 'absolute', top: 40, right: 40, width: 384, height: 384, borderRadius: '50%', background: 'rgba(209,250,229,0.4)', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: 20, left: 40, width: 320, height: 320, borderRadius: '50%', background: 'rgba(187,247,208,0.2)', filter: 'blur(80px)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative' }}>

          {/* Badge de présentation */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 50, padding: '6px 16px', fontSize: '0.72rem', fontWeight: 700, color: '#065f46', marginBottom: 24 }}>
            🔥 Soutien Scolaire Particulier au Maroc · 100% Direct & Transparent
          </div>

          {/* Titre principal H1 */}
          <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 800, color: '#0f172a', lineHeight: 1.12, letterSpacing: '-1.5px', marginBottom: 16 }}>
            Le cours particulier qui vous ressemble.<br />
            <span style={{ color: '#059669' }}>Trouvez le prof idéal.</span>
          </h1>

          {/* Sous-titre descriptif */}
          <p style={{ color: '#64748b', fontSize: '0.95rem', maxWidth: 540, margin: '0 auto 40px', lineHeight: 1.7, fontWeight: 500 }}>
            Rejoignez Learnect : Des cours d'accompagnement d'exception certifiés, sans frais de dossier.{' '}
            <strong style={{ color: '#059669' }}>10% de commission unique</strong> pour la plateforme,
            1er cours offert pour l'élève.
          </p>

          {/* ── BARRE DE RECHERCHE ──────────────────────────────
              Concept DAIF : Formulaire contrôlé
              - onSubmit sur le <form> (pas sur le bouton)
              - e.preventDefault() pour bloquer le rechargement
              - value={state} + onChange={setter} = input contrôlé
              - onFocus/onBlur pour ouvrir/fermer les dropdowns
          ─────────────────────────────────────────────────── */}
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

            {/* Input contrôlé : Matière */}
            <div style={{ flex: 1, position: 'relative', padding: '0 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ background: '#ecfdf5', borderRadius: '50%', width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1rem' }}>
                  📚
                </div>
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{ fontSize: '0.6rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 2 }}>
                    Je veux apprendre :
                  </div>
                  {/* Input contrôlé DAIF :
                      value={matiereInput}       → source de vérité = state
                      onChange → met à jour le state + affiche le dropdown
                      onFocus  → affiche le dropdown matières
                      onBlur   → ferme avec délai (150ms) pour laisser
                                 le temps au onMouseDown du dropdown de s'exécuter */}
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

              {/* Dropdown Matières — Rendu conditionnel avec &&
                  Concept DAIF : {condition && <JSX>}
                  Si showMatieres est false → rien n'est rendu
                  Si showMatieres est true  → le dropdown s'affiche */}
              {showMatieres && (
                <div style={{ position: 'absolute', top: 56, left: 0, right: 0, background: 'white', borderRadius: 16, boxShadow: '0 8px 32px rgba(0,0,0,0.12)', zIndex: 100, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                  <div style={{ padding: '8px 16px 4px', fontSize: '0.62rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1.5 }}>
                    Matières suggérées
                  </div>
                  {/* Rendu de liste DAIF : .map() avec key unique
                      onMouseDown (et pas onClick) → s'exécute AVANT onBlur */}
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

            {/* Séparateur visuel */}
            <div style={{ width: 1, height: 36, background: '#e2e8f0', flexShrink: 0 }} />

            {/* Input contrôlé : Ville */}
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

              {/* Dropdown Villes */}
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
                      {/* Rendu conditionnel : badge "Populaire" uniquement pour le type online */}
                      {v.type === 'online' && (
                        <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#059669', background: '#ecfdf5', padding: '2px 8px', borderRadius: 50 }}>Populaire</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bouton de soumission du formulaire */}
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

          {/* Raccourcis catégories — Rendu de liste avec .map() */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1.5 }}>Raccourcis :</span>
            {CATEGORIES.map((c, i) => (
              // onClick → navigate() programmé (hook useNavigate)
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
          SECTION 2 : DIFFÉRENCIATEURS LEARNECT
          Composants réutilisables sous forme de cartes
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

          {/* Grille Bento — 3 colonnes asymétriques */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr', gap: 20 }}>

            {/* Carte principale : Commission transparente */}
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

            {/* Carte : Diplômes validés */}
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

            {/* Carte : Premier cours offert */}
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
          SECTION 3 : ENSEIGNANTS VEDETTES
          Concept DAIF : useEffect + chargement API
          + rendu conditionnel (loading) + .map() sur displayTeachers
          + composant enfant TeacherCard avec props
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
            {/* Link DAIF : navigation déclarative sans rechargement */}
            <Link to="/teachers" style={{ color: '#059669', fontWeight: 700, fontSize: '0.82rem', textDecoration: 'none' }}>
              Parcourir tout l'annuaire scolaire →
            </Link>
          </div>

          {/* Rendu conditionnel DAIF : ternaire sur le state loading
              loading = true  → affiche le message "Chargement..."
              loading = false → affiche la grille de cards */}
          {loading ? (
            <p style={{ textAlign: 'center', color: '#94a3b8', padding: 40 }}>Chargement...</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
              {/* Rendu de liste : displayTeachers.map()
                  Chaque enseignant → composant TeacherCard avec props
                  key={i} : identifiant unique pour le Virtual DOM DAIF */}
              {displayTeachers.map((t, i) => (
                <TeacherCard key={i} t={t} />
              ))}
            </div>
          )}
        </div>
      </section>


      {/* ══════════════════════════════════════
          SECTION 4 : FAQ ACCORDÉON
          Concept DAIF : useState (openFaq) + rendu conditionnel
          toggleFaq() → ouvre/ferme les réponses
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
            {/* Rendu de liste FAQ avec .map() + key unique */}
            {FAQS.map((f, i) => (
              <div key={i} style={{ background: 'white', borderRadius: 20, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                {/* onClick → toggleFaq(i) : ouvre ou ferme cette question */}
                <button
                  onClick={() => toggleFaq(i)}
                  style={{ width: '100%', textAlign: 'left', padding: '18px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: '0.88rem', color: '#0f172a' }}>
                  {f.q}
                  {/* Rotation de la flèche selon l'état ouvert/fermé
                      openFaq === i → true  → rotate(180deg) = flèche vers le haut
                      openFaq !== i → false → rotate(0deg)   = flèche vers le bas */}
                  <span style={{ color: '#059669', fontSize: '0.9rem', marginLeft: 12, flexShrink: 0, display: 'inline-block', transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
                </button>
                {/* Rendu conditionnel : la réponse n'apparaît que si openFaq === i */}
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
          SECTION 5 : CTA FINAL (Call To Action)
      ══════════════════════════════════════ */}
      <section style={{ background: '#0f172a', padding: '80px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, right: '25%', width: 500, height: 300, background: 'rgba(5,150,105,0.1)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 700, margin: '0 auto', position: 'relative' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 20 }}>🏆</div>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 800, color: 'white', letterSpacing: -0.5, marginBottom: 12 }}>
            Démarrez l'expérience dès aujourd'hui
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: 36 }}>
            Trouvez les meilleurs tuteurs du Maroc certifiés. Explorez la messagerie intégrée, réservez des créneaux et commencez l'apprentissage !
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            {/* Link DAIF : navigation déclarative vers /teachers */}
            <Link to="/teachers"
              style={{ background: '#059669', color: 'white', padding: '14px 32px', borderRadius: 50, fontWeight: 800, fontSize: '0.88rem', textDecoration: 'none', display: 'inline-block' }}
              onMouseOver={e => e.currentTarget.style.background = '#047857'}
              onMouseOut={e => e.currentTarget.style.background = '#059669'}>
              🎓 Parcourir les tuteurs
            </Link>
            <Link to="/register"
              style={{ background: '#1e293b', color: '#cbd5e1', padding: '14px 32px', borderRadius: 50, fontWeight: 700, fontSize: '0.88rem', textDecoration: 'none', display: 'inline-block', border: '1px solid #334155' }}>
              🍎 S'inscrire comme Enseignant
            </Link>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════
          FOOTER
      ══════════════════════════════════════ */}
      <footer style={{ background: '#020617', padding: '64px 24px', borderTop: '1px solid #1e293b' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 48 }}>

            {/* Colonne Brand */}
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

            {/* Colonne Matières — Rendu de liste avec .map() */}
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

            {/* Colonne Villes — Rendu de liste avec .map() */}
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

            {/* Colonne Aide */}
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


// ════════════════════════════════════════════════════════════════
// COMPOSANT ENFANT : TeacherCard
// ════════════════════════════════════════════════════════════════
// Concept DAIF : composant réutilisable avec props
//
// Props reçues : { t } (objet enseignant)
//   t.prenom, t.nom   → nom complet
//   t.ville           → localisation
//   t.note            → note moyenne (Number)
//   t.tarif           → tarif horaire en DH
//   t.diplome         → diplôme académique
//   t.bio             → description (limité à 3 lignes CSS)
//   t.id              → pour construire le lien vers la fiche détail
//
// Séparation des responsabilités DAIF :
//   Home    → gère les données et la logique
//   TeacherCard → responsable uniquement de l'affichage d'un enseignant

function TeacherCard({ t }) {
  return (
    <div
      style={{ background: 'white', borderRadius: 28, border: '1px solid rgba(16,185,129,0.08)', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'all 0.25s' }}
      onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(16,185,129,0.06)'; }}
      onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>

      {/* Zone contenu principal de la card */}
      <div style={{ padding: 24 }}>

        {/* En-tête : Avatar initiale + nom + ville + note + tarif */}
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 16 }}>
          {/* Avatar : initiale du prénom — optional chaining (?.) DAIF
              t.prenom?.[0]  → si prenom est undefined → pas d'erreur → 'P' par défaut */}
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
              {/* Rendu conditionnel ternaire : note > 0 → affiche la note, sinon "Nouveau Prof" */}
              <span style={{ fontSize: '0.7rem', fontWeight: 800, background: 'rgba(245,158,11,0.12)', color: '#92400e', padding: '2px 8px', borderRadius: 50 }}>
                ⭐ {t.note > 0 ? Number(t.note).toFixed(1) : 'Nouveau Prof'}
              </span>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#059669' }}>
                {t.tarif} DH / h
              </span>
            </div>
          </div>
        </div>

        {/* Bloc diplôme académique */}
        <div style={{ background: 'rgba(236,253,245,0.4)', borderRadius: 14, padding: '12px 14px', marginBottom: 14, border: '1px solid rgba(16,185,129,0.1)' }}>
          <div style={{ fontSize: '0.58rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
            🎓 Diplôme académique :
          </div>
          <p style={{ fontSize: '0.78rem', color: '#1e293b', fontWeight: 600, fontStyle: 'italic', lineHeight: 1.5 }}>
            "{t.diplome || 'Enseignant qualifié et expérimenté'}"
          </p>
        </div>

        {/* Bio : limitée à 3 lignes via CSS webkit-line-clamp */}
        <p style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.7, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {t.bio || 'Passionné par la transmission du savoir.'}
        </p>

      </div>

      {/* Pied de carte : badge + bouton "Contacter" */}
      <div style={{ padding: '14px 24px', borderTop: '1px solid rgba(16,185,129,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(236,253,245,0.05)' }}>
        <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#b45309', background: '#fef3c7', padding: '3px 10px', borderRadius: 50 }}>
          1ER COURS OFFERT 🎁
        </span>
        {/* Lien dynamique DAIF : /teachers/:id si id existe, sinon /teachers (fallback)
            Concept : routes dynamiques avec paramètre (useParams dans la page cible) */}
        <Link to={t.id ? `/teachers/${t.id}` : '/teachers'}
          style={{ border: '1.5px solid #d1fae5', background: 'white', color: '#059669', padding: '8px 18px', borderRadius: 50, fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none', transition: 'all 0.2s' }}
          onMouseOver={e => { e.currentTarget.style.background = '#059669'; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = '#059669'; }}
          onMouseOut={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#059669'; e.currentTarget.style.borderColor = '#d1fae5'; }}>
          Contacter →
        </Link>
      </div>

    </div>
  );
}

// ── EXPORT DEFAULT ────────────────────────────────────────────────
// Règle DAIF : chaque fichier exporte un seul composant par défaut
// Cet export permet à App.jsx de l'importer dans React Router
export default Home;