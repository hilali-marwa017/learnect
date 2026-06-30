import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const villes = ['Casablanca','Rabat','Marrakech','Fès','Tanger','Agadir','Meknès','Oujda','Salé','Tétouan'];

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nom: '', prenom: '', email: '', password: '',
    password_confirmation: '', telephone: '', ville: '', role: 'etudiant',
  });
  const [docs, setDocs] = useState({ cin_recto: null, cin_verso: null, diplome: null });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
  function handleFile(e) {
    setDocs({ ...docs, [e.target.name]: e.target.files[0] });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (form.role === 'enseignant') {
        fd.append('cin_recto', docs.cin_recto);
        fd.append('cin_verso', docs.cin_verso);
        fd.append('diplome',   docs.diplome);
      }
      const res  = await fetch('http://localhost:8000/api/register', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw data;
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.location.href = data.user.role === 'enseignant' ? '/teacher/dashboard' : '/student/dashboard';
    } catch (err) {
      setError(err.message || Object.values(err.errors || {})[0]?.[0] || 'Erreur');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--light)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <div style={{ width: '100%', maxWidth: 560 }}>

        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontWeight: 800, fontSize: '1.3rem', color: 'var(--dark)' }}>Learnect</span>
          </Link>
          <h2 style={{ fontWeight: 900, fontSize: '1.8rem', letterSpacing: -0.5, marginTop: 16, marginBottom: 4 }}>Créer un compte</h2>
          <p style={{ color: 'var(--gray)', fontSize: '0.93rem' }}>Rejoignez des milliers d'apprenants</p>
        </div>

        <div className="card" style={{ padding: 36 }}>

          {error && (
            <div style={{ background: '#FFF0F3', border: '1px solid #FFD6E0', color: '#C0143C', padding: '12px 16px', borderRadius: 12, marginBottom: 20, fontSize: '0.88rem' }}>
              ⚠️ {error}
            </div>
          )}

          {/* ROLE */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
            {[
              { val: 'etudiant',   icon: '📚', label: 'Étudiant' },
              { val: 'enseignant', icon: '👨‍🏫', label: 'Enseignant' },
            ].map(r => (
              <div key={r.val} onClick={() => setForm({ ...form, role: r.val })} style={{
                border: `2px solid ${form.role === r.val ? 'var(--p1)' : 'var(--border)'}`,
                borderRadius: 14, padding: '16px 12px', textAlign: 'center', cursor: 'pointer',
                background: form.role === r.val ? 'linear-gradient(135deg, rgba(108,71,255,0.05), rgba(255,71,163,0.05))' : 'white',
                transition: 'all 0.2s',
              }}>
                <div style={{ fontSize: '1.8rem', marginBottom: 6 }}>{r.icon}</div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: form.role === r.val ? 'var(--p1)' : 'var(--dark)' }}>{r.label}</div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={{ fontWeight: 600, fontSize: '0.84rem', display: 'block', marginBottom: 6 }}>Nom</label>
                <input name="nom" className="inp" placeholder="Benali" value={form.nom} onChange={handleChange} required />
              </div>
              <div>
                <label style={{ fontWeight: 600, fontSize: '0.84rem', display: 'block', marginBottom: 6 }}>Prénom</label>
                <input name="prenom" className="inp" placeholder="Sara" value={form.prenom} onChange={handleChange} required />
              </div>
            </div>

            <div>
              <label style={{ fontWeight: 600, fontSize: '0.84rem', display: 'block', marginBottom: 6 }}>Email</label>
              <input type="email" name="email" className="inp" placeholder="vous@example.com" value={form.email} onChange={handleChange} required />
            </div>

            <div>
              <label style={{ fontWeight: 600, fontSize: '0.84rem', display: 'block', marginBottom: 6 }}>Téléphone</label>
              <input name="telephone" className="inp" placeholder="0612345678" value={form.telephone} onChange={handleChange} required />
            </div>

            <div>
              <label style={{ fontWeight: 600, fontSize: '0.84rem', display: 'block', marginBottom: 6 }}>Ville</label>
              <select name="ville" className="inp" value={form.ville} onChange={handleChange} required>
                <option value="">Choisir une ville</option>
                {villes.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={{ fontWeight: 600, fontSize: '0.84rem', display: 'block', marginBottom: 6 }}>Mot de passe</label>
                <input type="password" name="password" className="inp" placeholder="••••••••" value={form.password} onChange={handleChange} required />
              </div>
              <div>
                <label style={{ fontWeight: 600, fontSize: '0.84rem', display: 'block', marginBottom: 6 }}>Confirmer</label>
                <input type="password" name="password_confirmation" className="inp" placeholder="••••••••" value={form.password_confirmation} onChange={handleChange} required />
              </div>
            </div>

            {form.role === 'enseignant' && (
              <div style={{ background: 'linear-gradient(135deg, rgba(108,71,255,0.04), rgba(255,71,163,0.04))', border: '1.5px dashed rgba(108,71,255,0.2)', borderRadius: 14, padding: 20 }}>
                <p style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 14, color: 'var(--p1)' }}>📎 Documents requis</p>
                {[
                  { name: 'cin_recto', label: 'CIN Recto', accept: 'image/*' },
                  { name: 'cin_verso', label: 'CIN Verso', accept: 'image/*' },
                  { name: 'diplome',   label: 'Diplôme (PDF)', accept: '.pdf' },
                ].map(d => (
                  <div key={d.name} style={{ marginBottom: 10 }}>
                    <label style={{ fontWeight: 600, fontSize: '0.83rem', display: 'block', marginBottom: 5 }}>{d.label}</label>
                    <input type="file" name={d.name} className="inp" style={{ padding: '8px 12px', fontSize: '0.85rem' }} accept={d.accept} onChange={handleFile} required />
                  </div>
                ))}
              </div>
            )}

            <button type="submit" className="btn-grad" style={{ width: '100%', textAlign: 'center', padding: '14px', fontSize: '0.95rem', marginTop: 4, opacity: loading ? 0.7 : 1 }} disabled={loading}>
              {loading ? 'Inscription...' : 'Créer mon compte →'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 20, color: 'var(--gray)', fontSize: '0.88rem' }}>
            Déjà un compte ?{' '}
            <Link to="/login" style={{ color: 'var(--p1)', fontWeight: 700, textDecoration: 'none' }}>Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;