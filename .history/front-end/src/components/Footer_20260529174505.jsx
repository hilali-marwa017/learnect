export default function Footer() {
  const anneeActuelle = new Date().getFullYear()

  return (
    <footer className="bg-dark text-white-50 py-4 mt-auto border-top border-secondary text-center">
      <div className="container">
        <p className="mb-1 text-light fw-bold small">
          © {anneeActuelle} Learnect.ma — Plateforme de soutien scolaire au Maroc. Tous droits réservés.
        </p>
        <p className="mb-0 text-muted" style={{ fontSize: '11px' }}>
          Projet de Fin d'Études (PFE) développé par{' '}
          <strong className="text-success">HILALI Marwa</strong>, encadré par{' '}
          <strong className="text-success">DAIF Othmane</strong> (ISTA-AG), Année Universitaire 2025/2026.
        </p>
      </div>
    </footer>
  )
}