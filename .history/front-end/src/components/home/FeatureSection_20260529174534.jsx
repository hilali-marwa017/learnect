import { useNavigate } from 'react-router-dom'

export default function FeaturesSection() {
  const navigate = useNavigate()

  const listeMatieres = [
    { id: 'maths', nom: 'Mathématiques', description: 'Algèbre, Analyse, Géométrie', icone: '📐' },
    { id: 'anglais', nom: 'Anglais', description: 'TOEFL & Expression Orale', icone: '🇬🇧' },
    { id: 'francais', nom: 'Français', description: 'Préparation Régional & Bac', icone: '📝' },
    { id: 'arabe', nom: 'Arabe', description: 'Littéraire & Standard', icone: '📖' },
    { id: 'physique', nom: 'Physique - Chimie', description: 'Mécanique, Électricité', icone: '⚗️' },
    { id: 'informatique', nom: 'Informatique', description: 'Python & Algorithmes', icone: '💻' },
    { id: 'svt', nom: 'SVT', description: 'Biologie & Géologie', icone: '🌿' },
    { id: 'economie', nom: 'Économie', description: 'Comptabilité & Gestion', icone: '📊' },
    { id: 'philosophie', nom: 'Philosophie', description: 'Méthodologie & Dissertation', icone: '🏛️' },
    { id: 'sport', nom: 'Coaching Sportif', description: 'Fitness & Forme', icone: '🏃' },
  ]

  const handleSelectMatiere = (nom) => {
    navigate(`/enseignants?matiere=${nom}`)
  }

  return (
    <section className="py-5 bg-light border-bottom">
      <div className="container">

        <div className="text-center mb-4">
          <span className="badge bg-secondary text-uppercase px-3 py-2 mb-2" style={{ fontSize: '10px', letterSpacing: '0.5px' }}>
            Catégories
          </span>
          <h2 className="fw-bold text-dark">Explorez nos matières disponibles</h2>
          <p className="text-muted small mt-2">
            Des enseignants qualifiés pour toutes les disciplines
          </p>
        </div>

        {/* Grille responsive standard Bootstrap */}
        <div className="row row-cols-2 row-cols-md-3 row-cols-lg-5 g-3">
          {listeMatieres.map((matiere) => (
            <div key={matiere.id} className="col">
              <div
                className="card h-100 border-0 shadow-sm text-center p-3 bg-white"
                style={{ borderRadius: '12px', cursor: 'pointer', transition: 'transform 0.2s' }}
                onClick={() => handleSelectMatiere(matiere.nom)}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ fontSize: '32px' }} className="mb-2">{matiere.icone}</div>
                <h6 className="fw-bold text-dark mb-1" style={{ fontSize: '13px' }}>{matiere.nom}</h6>
                <p className="text-muted mb-2" style={{ fontSize: '11px' }}>{matiere.description}</p>
                <button
                  className="btn btn-outline-primary btn-sm fw-bold w-100"
                  style={{ fontSize: '11px', borderRadius: '8px' }}
                >
                  Voir les profs
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}