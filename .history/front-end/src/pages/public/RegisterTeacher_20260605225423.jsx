import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function RegisterTeacher() {
  const navigate = useNavigate()
  const { register } = useAuth()

  const [etape, setEtape] = useState(1)
  const [erreur, setErreur] = useState('')
  const [chargement, setChargement] = useState(false)

  const [formulaire, setFormulaire] = useState({
    prenom: '', nom: '', email: '', telephone: '', ville: '',
    password: '', password_confirmation: '', matiere: '', tarifHeure: ''
  })
  const [fichiers, setFichiers] = useState({
    cin_recto: null, cin_verso: null, diplome: null
  })

  function handleChange(e) {
    const { name, value } = e.target
    setFormulaire({ ...formulaire, [name]: value })
  }

  function handleFichier(e, nomFichier) {
    const fichier = e.target.files[0]
    if (fichier) setFichiers({ ...fichiers, [nomFichier]: fichier })
  }

  function validerEtape1() {
    const { prenom, nom, email, telephone, ville, password, password_confirmation, matiere, tarifHeure } = formulaire
    if (!prenom || !nom || !email || !telephone || !ville || !password || !matiere || !tarifHeure) {
      setErreur('Tous les champs sont obligatoires')
      return false
    }
    if (password !== password_confirmation) {
      setErreur('Les mots de passe ne correspondent pas')
      return false
    }
    if (password.length < 8) {
      setErreur('Le mot de passe doit contenir au moins 8 caractères')
      return false
    }
    if (Number(tarifHeure) < 50) {
      setErreur('Le tarif minimum est de 50 DH/h')
      return false
    }
    setErreur('')
    return true
  }

  function validerEtape2() {
    if (!fichiers.cin_recto || !fichiers.cin_verso || !fichiers.diplome) {
      setErreur('Veuillez télécharger tous les documents requis')
      return false
    }
    setErreur('')
    return true
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (etape === 1) {
      if (validerEtape1()) setEtape(2)
      return
    }
    if (!validerEtape2()) return

    setChargement(true)
    try {
      const donnees = new FormData()
      Object.entries(formulaire).forEach(([cle, valeur]) => donnees.append(cle, valeur))
      donnees.append('role', 'enseignant')
      donnees.append('cin_recto', fichiers.cin_recto)
      donnees.append('cin_verso', fichiers.cin_verso)
      donnees.append('diplome', fichiers.diplome)

      await register(donnees)
      navigate('/enseignant/dashboard')
    } catch (err) {
      setErreur(err.response?.data?.message || "Erreur lors de l'inscription")
    } finally {
      setChargement(false)
    }
  }

  return (
    <div className="page-auth" style={{ alignItems: 'flex-start', paddingTop: '40px' }}>
      <div style={{ width: '100%', maxWidth: '580px' }}>

        <Link to="/register" className="d-inline-flex align-items-center gap-2 text-secondary fw-medium mb-4" style={{ fontSize: '14px' }}>
          ← Retour au choix du profil
        </Link>

        <div className="carte-auth" style={{ maxWidth: '580px' }}>

          {/* Header */}
          <div className="text-center mb-4">
            <div className="logo-auth">👨‍🏫</div>
            <h3 style={{ fontFamily: 'var(--police-titre)' }}>Inscription Enseignant</h3>
            <p className="text-secondary small mt-1">Partagez votre savoir</p>
          </div>

          {/* Indicateur d'étapes */}
          <div className="d-flex align-items-center justify-content-center gap-3 mb-4">
            {[
              { num: 1, libelle: 'Profil' },
              { num: 2, libelle: 'Documents' }
            ].map((e, i) => (
              <div key={e.num} className="d-flex align-items-center gap-2">
                <div className="d-flex align-items-center gap-2">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                    style={{
                      width: '34px', height: '34px', fontSize: '14px',
                      background: etape >= e.num ? 'var(--couleur-principale)' : 'var(--fond-secondaire)',
                      color: etape >= e.num ? '#fff' : 'var(--texte-secondaire)'
                    }}
                  >
                    {etape > e.num ? '✓' : e.num}
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: etape >= e.num ? 'var(--couleur-principale)' : 'var(--texte-secondaire)' }}>
                    {e.libelle}
                  </span>
                </div>
                {i < 1 && (
                  <div style={{ width: '40px', height: '2px', background: etape > 1 ? 'var(--couleur-principale)' : 'var(--bordure)' }}></div>
                )}
              </div>
            ))}
          </div>

          {erreur && (
            <div className="alert alert-danger d-flex align-items-center gap-2 py-2 mb-3">
              <i className="bi bi-exclamation-triangle-fill"></i>
              <span>{erreur}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* ── Étape 1 : Profil ── */}
            {etape === 1 && (
              <div className="row g-3">
                <div className="col-6">
                  <label className="form-label">Prénom</label>
                  <input type="text" name="prenom" className="form-control" onChange={handleChange} required />
                </div>
                <div className="col-6">
                  <label className="form-label">Nom</label>
                  <input type="text" name="nom" className="form-control" onChange={handleChange} required />
                </div>
                <div className="col-12">
                  <label className="form-label">Email</label>
                  <input type="email" name="email" className="form-control" onChange={handleChange} required />
                </div>
                <div className="col-6">
                  <label className="form-label">Téléphone</label>
                  <input type="tel" name="telephone" className="form-control" placeholder="06XXXXXXXX" onChange={handleChange} required />
                </div>
                <div className="col-6">
                  <label className="form-label">Ville</label>
                  <select name="ville" className="form-select" onChange={handleChange} required>
                    <option value="">Choisir...</option>
                    {['Casablanca', 'Rabat', 'Marrakech', 'Tanger', 'Fès', 'Agadir'].map(v => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label">Mot de passe</label>
                  <input type="password" name="password" className="form-control" placeholder="8 caractères min." onChange={handleChange} required />
                </div>
                <div className="col-6">
                  <label className="form-label">Confirmer</label>
                  <input type="password" name="password_confirmation" className="form-control" placeholder="••••••••" onChange={handleChange} required />
                </div>
                <div className="col-8">
                  <label className="form-label">Matière principale</label>
                  <select name="matiere" className="form-select" onChange={handleChange} required>
                    <option value="">Choisir...</option>
                    {['Mathématiques', 'Physique-Chimie', 'SVT', 'Français', 'Anglais', 'Arabe', 'Informatique', 'Économie', 'Philosophie'].map(m => (
                      <option key={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div className="col-4">
                  <label className="form-label">Tarif (DH/h)</label>
                  <input type="number" name="tarifHeure" className="form-control" min="50" placeholder="Ex : 150" onChange={handleChange} required />
                </div>
                <div className="col-12 mt-2">
                  <button type="submit" className="btn btn-primary w-100 fw-bold py-2" style={{ borderRadius: '10px', fontSize: '15px' }}>
                    Continuer → Documents
                  </button>
                </div>
              </div>
            )}

            {/* ── Étape 2 : Documents ── */}
            {etape === 2 && (
              <div className="row g-3">

                {/* CIN Recto */}
                <div className="col-6">
                  <label className="form-label">CIN Recto (image)</label>
                  <div
                    className="border rounded-3 p-3 text-center"
                    style={{ background: fichiers.cin_recto ? 'var(--couleur-principale-claire)' : 'var(--fond-secondaire)', borderColor: fichiers.cin_recto ? 'var(--couleur-principale)' : 'var(--bordure)', borderStyle: 'dashed', cursor: 'pointer' }}
                    onClick={() => document.getElementById('cin_recto').click()}
                  >
                    <input type="file" id="cin_recto" accept="image/*" className="d-none" onChange={(e) => handleFichier(e, 'cin_recto')} />
                    {fichiers.cin_recto ? (
                      <>
                        <i className="bi bi-check-circle-fill text-primary" style={{ fontSize: '28px' }}></i>
                        <div className="fw-bold small text-primary mt-1">{fichiers.cin_recto.name}</div>
                      </>
                    ) : (
                      <>
                        <i className="bi bi-person-badge text-secondary" style={{ fontSize: '28px' }}></i>
                        <div className="small text-secondary mt-1">Cliquer pour télécharger</div>
                      </>
                    )}
                  </div>
                </div>

                {/* CIN Verso */}
                <div className="col-6">
                  <label className="form-label">CIN Verso (image)</label>
                  <div
                    className="border rounded-3 p-3 text-center"
                    style={{ background: fichiers.cin_verso ? 'var(--couleur-principale-claire)' : 'var(--fond-secondaire)', borderColor: fichiers.cin_verso ? 'var(--couleur-principale)' : 'var(--bordure)', borderStyle: 'dashed', cursor: 'pointer' }}
                    onClick={() => document.getElementById('cin_verso').click()}
                  >
                    <input type="file" id="cin_verso" accept="image/*" className="d-none" onChange={(e) => handleFichier(e, 'cin_verso')} />
                    {fichiers.cin_verso ? (
                      <>
                        <i className="bi bi-check-circle-fill text-primary" style={{ fontSize: '28px' }}></i>
                        <div className="fw-bold small text-primary mt-1">{fichiers.cin_verso.name}</div>
                      </>
                    ) : (
                      <>
                        <i className="bi bi-person-vcard text-secondary" style={{ fontSize: '28px' }}></i>
                        <div className="small text-secondary mt-1">Cliquer pour télécharger</div>
                      </>
                    )}
                  </div>
                </div>

                {/* Diplôme */}
                <div className="col-12">
                  <label className="form-label">Diplôme (PDF)</label>
                  <div
                    className="border rounded-3 p-3 text-center"
                    style={{ background: fichiers.diplome ? 'var(--couleur-principale-claire)' : 'var(--fond-secondaire)', borderColor: fichiers.diplome ? 'var(--couleur-principale)' : 'var(--bordure)', borderStyle: 'dashed', cursor: 'pointer' }}
                    onClick={() => document.getElementById('diplome').click()}
                  >
                    <input type="file" id="diplome" accept=".pdf" className="d-none" onChange={(e) => handleFichier(e, 'diplome')} />
                    {fichiers.diplome ? (
                      <>
                        <i className="bi bi-check-circle-fill text-primary" style={{ fontSize: '28px' }}></i>
                        <div className="fw-bold small text-primary mt-1">{fichiers.diplome.name}</div>
                      </>
                    ) : (
                      <>
                        <i className="bi bi-file-earmark-pdf text-danger" style={{ fontSize: '28px' }}></i>
                        <div className="small text-secondary mt-1">Cliquer pour télécharger votre diplôme (PDF)</div>
                      </>
                    )}
                  </div>
                </div>

                <div className="col-12">
                  <div className="form-check">
                    <input type="checkbox" className="form-check-input" id="honneur" required />
                    <label className="form-check-label small text-secondary" htmlFor="honneur">
                      Je certifie sur l'honneur l'exactitude des pièces fournies
                    </label>
                  </div>
                </div>

                <div className="col-12">
                  <div className="d-flex gap-2">
                    <button type="button" className="btn btn-outline-secondary fw-bold flex-grow-1" style={{ borderRadius: '10px' }} onClick={() => setEtape(1)}>
                      ← Retour
                    </button>
                    <button type="submit" className="btn btn-primary fw-bold flex-grow-1" style={{ borderRadius: '10px' }} disabled={chargement}>
                      {chargement
                        ? <><span className="spinner-border spinner-border-sm me-2"></span>Soumission...</>
                        : 'Soumettre ma candidature →'
                      }
                    </button>
                  </div>
                </div>

              </div>
            )}
          </form>

        </div>
      </div>
    </div>
  )
}