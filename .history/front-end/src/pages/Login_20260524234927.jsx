import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../store/slices/authSlice";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (form.email && form.password) {
      const role = form.email.includes("prof") ? "enseignant" : "eleve";
      dispatch(login({
        id: Date.now(),
        nom: form.email.split("@")[0],
        email: form.email,
        role: role,
      }));
      navigate("/");
    } else {
      setError("Veuillez remplir tous les champs.");
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">🎓 SuperProf</div>
        <h2>Se connecter</h2>
        <p className="auth-subtitle">Bon retour parmi nous !</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="votre@email.com" />
          </div>
          <div className="form-group">
            <label>Mot de passe</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••••" />
          </div>
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="btn btn-primary btn-full">Se connecter</button>
        </form>

        <div className="auth-switch">
          Pas encore de compte ?{" "}
          <span onClick={() => navigate("/register")}>S'inscrire</span>
        </div>
        <div className="auth-switch">
          Vous voulez enseigner ?{" "}
          <span onClick={() => navigate("/register-teacher")}>Devenir enseignant</span>
        </div>
      </div>
    </div>
  );
}

export default Login;