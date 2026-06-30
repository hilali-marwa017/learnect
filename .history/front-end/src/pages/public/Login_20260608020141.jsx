import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Login() {

  const [form, setForm] = useState({ email: '', password: '' });
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);
  const [afficherMotDePasse, setAfficherMotDePasse] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setChargement(true);
    setErreur('');
    try {
      const utilisateur = await login(form.email, form.password);

      if (utilisateur.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (utilisateur.role === 'enseignant') {
        navigate('/enseignant/dashboard');
      } else {
        navigate('/etudiant/dashboard');
      }

    } catch (err) {
      setErreur(err.response?.data?.message || 'Email ou mot de passe incorrect');
    } finally {
      setChargement(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ display: 'flex', maxWidth: '1000px', width: '100%', background: 'white', borderRadius: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>

        {/* Partie gauche */}
        <div style={{ flex: 1, background: 'linear-gradient(135deg, #3c78d3, #0a58ca)', padding: '48px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ width: '56px', height: '56px', background: '#ffffff33', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
              <i className="bi bi-mortarboard" style={{ fontSize: '28px', color: 'white' }}></i>
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'white', marginBottom: '12px', letterSpacing: '-0.5px' }}>
              Learnect<span style={{ color: '#0b0b0b' }}>.ma</span>
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#ffffffcc', marginBottom: '32px', lineHeight: '1.6' }}>
              PORTAL ACADÉMIQUE MAROCAIN
            </p>
            <div style={{ background: '#ffffff26', borderRadius: '12px', padding: '16px', marginBottom: '24px', borderLeft: '2px solid #060606' }}>
              <p style={{ fontSize: '0.85rem', color: 'white', margin: 0 }}>
                <i className="bi bi-lightbulb me-2"></i>
                Premier cours offert sur Learnect !
              </p>
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', color: 'white', marginBottom: '8px' }}>
              Trouvez le tuteur idéal<br />qui fera la différence.
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#ffffffb3', marginBottom: '24px' }}>
              Rejoignez des milliers d'étudiants marocains pour réussir
            </p>
            <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
              <div><div style={{ fontSize: '24px', fontWeight: '800', color: 'white' }}>10k+</div><div style={{ fontSize: '0.7rem', color: '#ffffff99' }}>Étudiants</div></div>
              <div><div style={{ fontSize: '24px', fontWeight: '800', color: 'white' }}>500+</div><div style={{ fontSize: '0.7rem', color: '#ffffff99' }}>Professeurs</div></div>
              <div><div style={{ fontSize: '24px', fontWeight: '800', color: 'white' }}>4.9★</div><div style={{ fontSize: '0.7rem', color: '#ffffff99' }}>Note moyenne</div></div>
            </div>
          </div>
        </div>

        {/* Partie droite */}
        <div style={{ flex: 1, padding: '48px 44px', background: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#f0f0f0', color: '#666', textDecoration: 'none' }}>
              <i className="bi bi-x-lg" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}></i>
            </Link>
          </div>

          <div className="text-center mb-4">
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1e293b', marginBottom: '4px' }}>Content de vous revoir !</h3>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Veuillez vous authentifier pour accéder à votre espace</p>
          </div>

          {erreur && (
            <div style={{ background: '#fef2f2', borderLeft: '2px solid #ef4444', padding: '10px 14px', borderRadius: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#e63a3a' }}>
              <i className="bi bi-exclamation-triangle-fill"></i>
              <span>{erreur}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#334155', fontSize: '0.75rem', letterSpacing: '0.5px' }}>ADRESSE EMAIL</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '1rem', color: '#94a3b8' }}>
                  <i className="bi bi-envelope"></i>
                </span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: '12px 16px 12px 44px', border: '1.5px solid #e2e8f0', borderRadius: '12px', fontSize: '0.9rem', outline: 'none', background: '#f8fafc' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#334155', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>MOT DE PASSE</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '1rem', color: '#94a3b8' }}>
                  <i className="bi bi-lock"></i>
                </span>
                <input
                  type={afficherMotDePasse ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: '12px 16px 12px 44px', paddingRight: '48px', border: '1.5px solid #e2e8f0', borderRadius: '12px', fontSize: '0.9rem', outline: 'none', background: '#f8fafc' }}
                />
                <button
                  type="button"
                  onClick={() => setAfficherMotDePasse(!afficherMotDePasse)}
                  style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#94a3b8' }}
                >
                  {afficherMotDePasse
                    ? <i className="bi bi-eye" style={{ fontSize: '1.1rem' }}></i>
                    : <i className="bi bi-eye-slash" style={{ fontSize: '1.1rem' }}></i>
                  }
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={chargement}
              style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #0d6efd, #0a58ca)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '0.9rem', cursor: chargement ? 'not-allowed' : 'pointer', opacity: chargement ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}
            >
              {chargement
                ? <><span className="spinner-border spinner-border-sm"></span> Connexion...</>
                : <><i className="bi bi-box-arrow-in-right me-2"></i> OUVRIR MA SESSION</>
              }
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Pas encore de compte ?{' '}
              <Link to="/register" style={{ color: '#0d6efd', fontWeight: '600', textDecoration: 'none' }}>Créer un compte</Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Login