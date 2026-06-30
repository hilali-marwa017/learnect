import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../store/slices/authSlice";

// ── Inscription Élève ─────────────────────────
export function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nom: "", email: "", password: "" });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    dispatch(login({ id: Date.now(), nom: form.nom, email: form.email, role: "eleve" }));
    navigate("/");
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">🎓 SuperProf</div>
        <h2>Créer un compte</h2>
        <p className="auth-subtitle">Trouvez votre prof idéal dès aujourd'hui</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Prénom & Nom</label>
            <input type="text" name="nom" value={form.nom} onChange={handleChange} placeholder="Sara Benali" />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="votre@email.com" />
          </div>
          <div className="form-group">
            <label>Mot de passe</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••••" />
          </div>
          <button type="submit" className="btn btn-primary btn-full">Créer mon compte</button>
        </form>
        <div className="auth-switch">
          Déjà un compte ? <span onClick={() => navigate("/login")}>Se connecter</span>
        </div>
        <div className="auth-switch">
          Vous souhaitez enseigner ? <span onClick={() => navigate("/register-teacher")}>Inscription enseignant</span>
        </div>
      </div>
    </div>
  );
}

// ── Inscription Enseignant ─────────────────────
export function RegisterTeacher() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nom: "", email: "", password: "", matiere: "", tarif: "", ville: "", experience: "" });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    dispatch(login({ id: Date.now(), nom: form.nom, email: form.email, role: "enseignant", matiere: form.matiere, tarif: form.tarif, ville: form.ville }));
    navigate("/");
  }

  return (
    <div className="auth-page">
      <div className="auth-card auth-card-wide">
        <div className="auth-logo">👨‍🏫 SuperProf</div>
        <h2>Devenir enseignant</h2>
        <p className="auth-subtitle">Partagez votre savoir et rejoignez +10 000 profs</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label>Prénom & Nom</label>
              <input type="text" name="nom" value={form.nom} onChange={handleChange} placeholder="Karim Tazi" />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="prof@email.com" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Matière enseignée</label>
              <select name="matiere" value={form.matiere} onChange={handleChange}>
                <option value="">Choisir...</option>
                <option>Mathématiques</option>
                <option>Physique-Chimie</option>
                <option>Anglais</option>
                <option>Arabe</option>
                <option>Histoire-Géo</option>
                <option>Informatique</option>
                <option>Français</option>
                <option>Sciences naturelles</option>
              </select>
            </div>
            <div className="form-group">
              <label>Tarif horaire (DH)</label>
              <input type="number" name="tarif" value={form.tarif} onChange={handleChange} placeholder="ex: 120" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Ville</label>
              <input type="text" name="ville" value={form.ville} onChange={handleChange} placeholder="Casablanca" />
            </div>
            <div className="form-group">
              <label>Années d'expérience</label>
              <input type="number" name="experience" value={form.experience} onChange={handleChange} placeholder="ex: 5" />
            </div>
          </div>
          <div className="form-group">
            <label>Mot de passe</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••••" />
          </div>
          <div className="teacher-notice">
            💡 En tant qu'enseignant, vous pouvez aussi <strong>chercher un autre prof</strong> pour vous former dans une autre matière !
          </div>
          <button type="submit" className="btn btn-teacher btn-full">Créer mon profil enseignant</button>
        </form>
        <div className="auth-switch">
          Déjà un compte ? <span onClick={() => navigate("/login")}>Se connecter</span>
        </div>
      </div>
    </div>
  );
}