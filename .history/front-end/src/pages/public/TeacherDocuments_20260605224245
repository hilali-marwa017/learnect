import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function TeacherDocuments() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);
  const [formulaire, setFormulaire] = useState(null);
  const [fichiers, setFichiers] = useState({
    cin_recto: null, cin_verso: null, diplome: null
  });

  useEffect(() => {
    // Récupérer les données de l'étape 1
    const savedData = sessionStorage.getItem('teacherData');
    if (!savedData) {
      navigate('/register/enseignant');
      return;
    }
    setFormulaire(JSON.parse(savedData));
  }, [navigate]);

  function handleFichier(e) {
    setFichiers({ ...fichiers, [e.target.name]: e.target.files[0] });
  }

  function validerDocuments() {
    if (!fichiers.cin_recto || !fichiers.cin_verso || !fichiers.diplome) {
      setErreur('Veuillez télécharger tous les documents requis');
      return false;
    }
    setErreur('');
    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validerDocuments()) return;

    setChargement(true);
    try {
      const donnees = new FormData();
      Object.entries(formulaire).forEach(([cle, valeur]) => donnees.append(cle, valeur));
      donnees.append('role', 'enseignant');
      donnees.append('cin_recto', fichiers.cin_recto);
      donnees.append('cin_verso', fichiers.cin_verso);
      donnees.append('diplome', fichiers.diplome);

      await register(donnees);
      
      // Nettoyer les données temporaires
      sessionStorage.removeItem('teacherData');
      navigate('/teacher/dashboard');
    } catch (err) {
      setErreur(err.response?.data?.message || "Erreur lors de l'inscription");
    } finally {
      setChargement(false);
    }
  }

  if (!formulaire) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center py-5" style={{ minHeight: '100vh' }}>

      <div className="w-100 mb-3" style={{ maxWidth: 550 }}>
        <Link to="/register/enseignant" className="text-muted text-decoration-none small">
          <i className="bi bi-arrow-left me-1"></i>Retour à l'étape précédente
        </Link>
      </div>

      <div className="card border-0 shadow rounded-4" style={{ maxWidth: 550, width: '100%' }}>
        <div className="card-body p-4">

          <div className="text-center mb-4">
            <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2"
              style={{ width: 52, height: 52 }}>
              <i className="bi bi-file-earmark-text fs-4"></i>
            </div>
            <h5 className="fw-bold mb-0">Documents requis</h5>
            <p className="text-muted small mt-1">Téléchargez vos justificatifs</p>
          </div>

          {/* Indicateur d'étape */}
          <div className="row g-0 mb-4 pb-2 border-bottom">
            <div className="col-6 text-center pb-2 fw-bold text-muted">
              <i className="bi bi-person-circle me-1"></i> Étape 1 : Profil
            </div>
            <div className="col-6 text-center pb-2 fw-bold text-primary border-bottom border-2 border-primary">
              <i className="bi bi-file-earmark-text me-1"></i> Étape 2 : Documents
            </div>
          </div>

          {erreur && (
            <div className="alert alert-danger py-2 small d-flex align-items-center gap-2 mb-3">
              <i className="bi bi-exclamation-triangle-fill"></i>
              {erreur}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="row g-3">

              {/* CIN Recto */}
              <div className="col-12">
                <label className="form-label small fw-semibold">CIN RECTO</label>
                <div className="border rounded-3 p-3 bg-white">
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-card-image text-primary fs-5"></i>
                    <input type="file" name="cin_recto" accept="image/*" className="form-control form-control-sm"
                      onChange={handleFichier} required />
                  </div>
                  <small className="text-muted">JPG/PNG — Max 2MB</small>
                </div>
              </div>

              {/* CIN Verso */}
              <div className="col-12">
                <label className="form-label small fw-semibold">CIN VERSO</label>
                <div className="border rounded-3 p-3 bg-white">
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-card-image text-primary fs-5"></i>
                    <input type="file" name="cin_verso" accept="image/*" className="form-control form-control-sm"
                      onChange={handleFichier} required />
                  </div>
                  <small className="text-muted">JPG/PNG — Max 2MB</small>
                </div>
              </div>

              {/* Diplôme */}
              <div className="col-12">
                <label className="form-label small fw-semibold">DIPLÔME</label>
                <div className="border rounded-3 p-3 bg-white">
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-file-pdf text-danger fs-5"></i>
                    <input type="file" name="diplome" accept=".pdf" className="form-control form-control-sm"
                      onChange={handleFichier} required />
                  </div>
                  <small className="text-muted">PDF — Max 5MB</small>
                </div>
              </div>

              {/* Info vérification */}
              <div className="col-12">
                <div className="bg-light rounded-3 p-3 d-flex gap-2">
                  <i className="bi bi-info-circle text-primary"></i>
                  <small className="text-muted">
                    Vérification sous <strong>24h</strong> après soumission
                  </small>
                </div>
              </div>

              <div className="col-12 mt-3">
                <div className="form-check">
                  <input type="checkbox" className="form-check-input" id="honneur" required />
                  <label className="form-check-label small text-muted" htmlFor="honneur">
                    Je certifie sur l'honneur l'exactitude des pièces fournies
                  </label>
                </div>
              </div>

              <div className="col-12 d-flex gap-3 mt-3">
                <button type="button" className="btn btn-outline-secondary flex-grow-1 py-2"
                  onClick={() => navigate('/register/enseignant')}>
                  ← Retour
                </button>
                <button type="submit" className="btn btn-primary flex-grow-1 py-2" disabled={chargement}>
                  {chargement ? (
                    <><span className="spinner-border spinner-border-sm me-2"></span>Soumission...</>
                  ) : (
                    'Soumettre ma candidature →'
                  )}
                </button>
              </div>

            </div>
          </form>

          <div className="text-center mt-4 pt-2 border-top">
            <small className="text-muted">
              Déjà un compte ?{' '}
              <Link to="/login" className="text-primary fw-bold text-decoration-none">
                Se connecter
              </Link>
            </small>
          </div>

        </div>
      </div>
    </div>
  );
}

export default TeacherDocuments;