import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ── HERO ──────────────────────────────────────
function HeroSection() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");

  function handleSearch(e) {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/teachers?q=${searchQuery}&location=${location}`);
  }

  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-badge">🇲🇦 N°1 au Maroc</div>
        <h1 className="hero-title">
          Trouvez le prof parfait<br />
          <span className="hero-accent">pour votre réussite</span>
        </h1>
        <p className="hero-subtitle">
          Plus de 10 000 enseignants qualifiés en mathématiques, anglais,
          arabe, sciences et bien plus — en ligne ou à domicile.
        </p>

        <form className="search-bar" onSubmit={handleSearch}>
          <div className="search-field">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Matière ou nom du prof..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="search-divider" />
          <div className="search-field">
            <span className="search-icon">📍</span>
            <input
              type="text"
              placeholder="Ville (ex: Casablanca)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-search">Rechercher</button>
        </form>

        <div className="hero-tags">
          <span className="tag-label">Populaires :</span>
          {["Mathématiques", "Anglais", "Physique", "Arabe", "Informatique"].map((tag) => (
            <span key={tag} className="tag" onClick={() => navigate(`/teachers?q=${tag}`)}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="hero-visual">
        <div className="hero-card floating">
          <div className="hc-avatar">👨‍🏫</div>
          <div>
            <div className="hc-name">Prof. Karim</div>
            <div className="hc-subject">Mathématiques</div>
            <div className="hc-stars">⭐⭐⭐⭐⭐</div>
          </div>
        </div>
        <div className="hero-stat-badge top"><strong>+10 000</strong> profs</div>
        <div className="hero-stat-badge bottom"><strong>98%</strong> satisfaits</div>
      </div>
    </section>
  );
}

// ── CATEGORIES ────────────────────────────────
const categories = [
  { icon: "📐", label: "Mathématiques", count: "1 240 profs" },
  { icon: "🔬", label: "Sciences", count: "980 profs" },
  { icon: "🌍", label: "Langues", count: "2 100 profs" },
  { icon: "💻", label: "Informatique", count: "750 profs" },
  { icon: "📖", label: "Histoire-Géo", count: "430 profs" },
  { icon: "🎨", label: "Arts & Musique", count: "310 profs" },
  { icon: "⚖️", label: "Droit", count: "220 profs" },
  { icon: "🏃", label: "Sport", count: "190 profs" },
];

function CategoriesSection() {
  const navigate = useNavigate();
  return (
    <section className="section categories-section">
      <div className="section-header">
        <h2 className="section-title">Toutes les matières</h2>
        <p className="section-subtitle">De l'école primaire jusqu'au supérieur, trouvez un expert dans chaque domaine</p>
      </div>
      <div className="categories-grid">
        {categories.map((cat) => (
          <div key={cat.label} className="category-card" onClick={() => navigate(`/teachers?q=${cat.label}`)}>
            <div className="cat-icon">{cat.icon}</div>
            <div className="cat-label">{cat.label}</div>
            <div className="cat-count">{cat.count}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── FEATURED TEACHERS ─────────────────────────
const featuredTeachers = [
  { id: 1, nom: "Karim Benali", matiere: "Mathématiques", niveau: "Lycée / Bac", note: 4.9, avis: 127, prix: 120, avatar: "👨‍🏫", badge: "Top Rated", ville: "Casablanca", experience: "8 ans" },
  { id: 2, nom: "Sara Moussaoui", matiere: "Anglais", niveau: "Tous niveaux", note: 4.8, avis: 95, prix: 100, avatar: "👩‍🏫", badge: "Nouveau", ville: "Rabat", experience: "5 ans" },
  { id: 3, nom: "Youssef Tazi", matiere: "Physique-Chimie", niveau: "Terminale", note: 5.0, avis: 63, prix: 150, avatar: "🧑‍🔬", badge: "Expert", ville: "Marrakech", experience: "12 ans" },
  { id: 4, nom: "Fatima Zohra", matiere: "Arabe & Darija", niveau: "Tous niveaux", note: 4.7, avis: 210, prix: 80, avatar: "👩‍💼", badge: "Top Rated", ville: "Fès", experience: "10 ans" },
];

function FeaturedTeachersSection() {
  const navigate = useNavigate();
  return (
    <section className="section featured-section">
      <div className="section-header">
        <h2 className="section-title">Enseignants en vedette</h2>
        <p className="section-subtitle">Sélectionnés pour leur qualité, leur engagement et leurs résultats</p>
      </div>
      <div className="teachers-grid">
        {featuredTeachers.map((prof) => (
          <div key={prof.id} className="teacher-card">
            <div className="tc-header">
              <div className="tc-avatar">{prof.avatar}</div>
              <div className={`tc-badge badge-${prof.badge === "Top Rated" ? "top" : prof.badge === "Expert" ? "expert" : "new"}`}>
                {prof.badge}
              </div>
            </div>
            <div className="tc-body">
              <h3 className="tc-name">{prof.nom}</h3>
              <p className="tc-subject">📚 {prof.matiere}</p>
              <p className="tc-level">🎓 {prof.niveau}</p>
              <p className="tc-location">📍 {prof.ville} · {prof.experience}</p>
              <div className="tc-rating">
                <span className="stars">{"⭐".repeat(Math.round(prof.note))}</span>
                <span className="note">{prof.note}</span>
                <span className="avis">({prof.avis} avis)</span>
              </div>
            </div>
            <div className="tc-footer">
              <div className="tc-price"><strong>{prof.prix} DH</strong>/heure</div>
              <button className="btn btn-primary btn-sm" onClick={() => navigate(`/teacher/${prof.id}`)}>
                Voir le profil
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="see-all">
        <button className="btn btn-outline" onClick={() => navigate("/teachers")}>
          Voir tous les enseignants →
        </button>
      </div>
    </section>
  );
}

// ── WHY US ────────────────────────────────────
const whyUsItems = [
  { icon: "✅", title: "Profs vérifiés", desc: "Chaque enseignant est vérifié, diplômé et évalué par de vrais élèves." },
  { icon: "💳", title: "Paiement sécurisé", desc: "Paiement en ligne sécurisé. Remboursement garanti si insatisfait." },
  { icon: "📅", title: "Flexibilité totale", desc: "Cours en ligne, à domicile ou en présentiel — à votre rythme." },
  { icon: "🔍", title: "Double usage", desc: "Vous êtes enseignant ? Vous pouvez aussi chercher un prof pour vous former !" },
];

function WhyUsSection() {
  return (
    <section className="section why-section">
      <div className="section-header">
        <h2 className="section-title">Pourquoi choisir SuperProf ?</h2>
        <p className="section-subtitle">Une plateforme pensée pour les deux côtés : apprendre ET enseigner</p>
      </div>
      <div className="why-grid">
        {whyUsItems.map((item) => (
          <div key={item.title} className="why-card">
            <div className="why-icon">{item.icon}</div>
            <h3 className="why-title">{item.title}</h3>
            <p className="why-desc">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── FAQ ───────────────────────────────────────
const faqData = [
  { q: "Comment trouver un prof ?", a: "Utilisez la barre de recherche, choisissez la matière et votre ville. Parcourez les profils, lisez les avis et contactez directement le prof." },
  { q: "Je suis enseignant, est-ce que je peux aussi chercher un prof ?", a: "Absolument ! Un prof d'anglais peut chercher un prof d'histoire ou de sport. SuperProf est ouvert à tout le monde, peu importe le rôle." },
  { q: "Comment devenir enseignant sur SuperProf ?", a: "Cliquez sur 'Donner des cours', remplissez le formulaire d'inscription enseignant, validez votre profil et commencez à recevoir des élèves." },
  { q: "Les cours sont-ils disponibles en ligne ?", a: "Oui ! Les profs peuvent proposer des cours en ligne (via visio), à domicile, ou en présentiel dans leur établissement." },
  { q: "Comment fonctionne le système d'avis ?", a: "Après chaque cours, l'élève laisse un avis noté de 1 à 5 étoiles avec un commentaire. Ces avis sont visibles sur le profil du prof." },
];

function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);
  function toggleFaq(index) {
    setOpenIndex(openIndex === index ? null : index);
  }
  return (
    <section className="section faq-section">
      <div className="section-header">
        <h2 className="section-title">Questions fréquentes</h2>
        <p className="section-subtitle">Tout ce que vous devez savoir avant de commencer</p>
      </div>
      <div className="faq-list">
        {faqData.map((item, index) => (
          <div key={index} className={`faq-item ${openIndex === index ? "open" : ""}`}>
            <div className="faq-question" onClick={() => toggleFaq(index)}>
              <span>{item.q}</span>
              <span className="faq-toggle">{openIndex === index ? "−" : "+"}</span>
            </div>
            {openIndex === index && <div className="faq-answer">{item.a}</div>}
          </div>
        ))}
      </div>
    </section>
  );
}

// ── HOME PAGE ─────────────────────────────────
function Home() {
  return (
    <main>
      <HeroSection />
      <CategoriesSection />
      <FeaturedTeachersSection />
      <WhyUsSection />
      <FAQSection />
    </main>
  );
}

export default Home