import { Link } from 'react-router-dom';

function TeacherCard(props) {
  const enseignant = props.enseignant;
  if (!enseignant || !enseignant.user) return null;
  const user = enseignant.user;
  let premiereMatiere = 'Professeur';
  if (enseignant.matieres && enseignant.matieres.length > 0) {
    premiereMatiere = enseignant.matieres[0].nom;
  }
  const tarif = enseignant.tarifHeure || 0;
  const note = enseignant.noteMoyenne || 0;
  let nbAvis = 0;
  if (enseignant.avis) nbAvis = enseignant.avis.length;

  function getInitials() {
    const prenom = user.prenom || '';
    const nom = user.nom || '';
    if (prenom.length > 0 && nom.length > 0) return prenom[0] + nom[0];
    if (prenom.length > 0) return prenom[0];
    if (nom.length > 0) return nom[0];
    return 'P';
  }

  function renderStars() {
    const stars = [];
    const roundedNote = Math.round(note);
    for (let i = 1; i <= 5; i++) {
      if (i <= roundedNote) {
        stars.push(<i key={i} className="bi bi-star-fill" style={{ color: '#fbbf24', fontSize: '12px' }}></i>);
      } else {
        stars.push(<i key={i} className="bi bi-star" style={{ color: '#CBD5E1', fontSize: '12px' }}></i>);
      }
    }
    return stars;
  }

  return (
    <Link to={`/enseignants/${user.utilisateur_id}`} style={{ textDecoration: 'none' }}>
      <div style={{ background: 'white', borderRadius: '20px', padding: '1.2rem', border: '1px solid #E2E8F0', height: '100%' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, #0d6efd, #0a58ca)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.2rem', flexShrink: 0 }}>
            {getInitials()}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#0F172A', marginBottom: '2px' }}>{user.prenom} {user.nom}</h3>
                <p style={{ fontSize: '0.7rem', color: '#6B7280', marginBottom: '4px' }}><i className="bi bi-geo-alt" style={{ fontSize: '0.65rem', marginRight: '2px' }}></i>{user.ville} {enseignant.cours_enligne ? '· webcam' : ''}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {renderStars()}
                  {nbAvis > 0 && <span style={{ fontSize: '0.65rem', color: '#94A3B8' }}>({nbAvis})</span>}
                </div>
                {enseignant.estVerifie && (
                  <span style={{ fontSize: '0.6rem', background: '#EFF6FF', color: '#0d6efd', padding: '2px 8px', borderRadius: '20px', display: 'inline-block', marginTop: '4px' }}>
                    <i className="bi bi-patch-check-fill" style={{ fontSize: '0.55rem', marginRight: '2px' }}></i> Vérifié
                  </span>
                )}
              </div>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#334155', marginTop: '8px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <i className="bi bi-book" style={{ color: '#0d6efd', fontSize: '0.7rem' }}></i>
              {premiereMatiere} - {enseignant.titre ? enseignant.titre.substring(0, 50) : 'Cours particuliers de qualité'}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
              <div><span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0F172A' }}>{tarif} MAD</span><span style={{ fontSize: '0.7rem', color: '#6B7280' }}>/h</span></div>
              <div style={{ background: '#EFF6FF', padding: '4px 10px', borderRadius: '20px', fontSize: '0.65rem', fontWeight: 600, color: '#0d6efd' }}>1er cours offert</div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default TeacherCard;