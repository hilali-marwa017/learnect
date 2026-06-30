import { useState } from 'react';
import { Link } from 'react-router-dom';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const url = 'http://localhost:8000/api/login';
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: form.email, password: form.password })
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(errData => {
            throw new Error(errData.message || 'Email ou mot de passe incorrect');
          });
        }
        return response.json();
      })
      .then(result => {
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        const user = result.user;
        
        // SOLUTION: window.location.href pour forcer le rechargement
        if (user.role === 'admin') {
          window.location.href = '/admin/dashboard';
        } else if (user.role === 'enseignant') {
          window.location.href = '/enseignant/dashboard';
        } else {
          window.location.href = '/etudiant/dashboard';
        }
      })
      .catch(err => setError(err.message || 'Email ou mot de passe incorrect'))
      .finally(() => setLoading(false));
  }

  return (
    // ... reste du JSX inchangé
  );
}

export default Login;