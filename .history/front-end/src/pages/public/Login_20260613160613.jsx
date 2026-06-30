import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  var { login } = useAuth();
  var navigate = useNavigate();
  var [email, setEmail] = useState('');
  var [password, setPassword] = useState('');
  var [showPassword, setShowPassword] = useState(false);
  var [success, setSuccess] = useState(false);
  var [errorMsg, setErrorMsg] = useState('');
  var [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    
    try {
      var userData = await login(email, password);
      setSuccess(true);
      
      setTimeout(function() {
        if (userData.role === 'admin') {
          navigate('/admin/dashboard');
        } else if (userData.role === 'enseignant') {
          navigate('/enseignant/dashboard');
        } else {
          navigate('/etudiant/dashboard');
        }
      }, 1000);
    } catch (err) {
      setErrorMsg('Email ou mot de passe incorrect');
      setSuccess(false);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center pt-24 pb-16 bg-canvas px-4">
      <div className="relative w-full max-w-4xl bg-surface-card border border-hairline-strong rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[500px]">
        
        <div className="bg-surface-deep md:col-span-12 lg:col-span-5 p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-hairline-strong relative overflow-hidden">
          <div className="relative z-10 space-y-8">
            <div>
              <div className="inline-flex items-center justify-center p-3 rounded-xl bg-accent-orange-glow border border-accent-orange/15 shadow-sm">
                <svg className="h-6 w-6 text-accent-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>
              </div>
            </div>

            <div className="space-y-1">
              <div className="font-display-xl text-3.5xl text-ink tracking-tight">
                <span>Learnect<span className="text-accent-orange font-bold">.ma</span></span>
              </div>
              <p className="text-[10px] tracking-[0.2em] font-mono text-mute font-bold uppercase">PORTAL ACADÉMIQUE MAROCAIN</p>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-surface-card border border-hairline text-ink shadow-sm">
              <div className="p-1.5 rounded-lg bg-accent-yellow/10 border border-accent-yellow/20 text-accent-yellow shrink-0">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
              </div>
              <p className="text-xs font-semibold text-body leading-relaxed">Utilisez vos identifiants pour accéder à votre espace personnel.</p>
            </div>
          </div>

          <div className="relative z-10 space-y-3 pt-6">
            <h3 className="text-xl font-bold font-sans text-ink leading-tight">Réussissez vos examens<br />avec nos tuteurs d'élite.</h3>
            <p className="text-xs text-mute leading-relaxed font-medium">Plateforme préférée pour le soutien scolaire personnalisé au Maroc.</p>
          </div>
        </div>

        <div className="md:col-span-12 lg:col-span-7 p-8 md:p-12 flex flex-col justify-center relative bg-surface-card">
          <Link to="/" className="absolute top-6 right-6 p-2 rounded-full border border-hairline bg-surface-card hover:bg-surface-elevated text-charcoal hover:text-ink transition-all flex items-center justify-center">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </Link>

          <div className="w-full max-w-sm mx-auto space-y-6">
            <div className="text-center space-y-1.5">
              <h2 className="text-2xl font-black text-ink tracking-tight">Authentification</h2>
              <p className="text-xs text-mute font-medium leading-relaxed">Veuillez saisir votre email et mot de passe</p>
            </div>

            {success ? (
              <div className="p-6 bg-accent-green/10 border border-accent-green/20 rounded-xl text-accent-green text-xs font-bold text-center animate-in zoom-in space-y-1">
                <span className="block text-sm">✓ Connexion acceptée</span>
                <p className="font-normal text-mute">Redirection...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMsg && (
                  <div className="p-3 bg-accent-red/10 border border-accent-red/20 rounded-lg text-accent-red text-xs font-bold font-mono">
                    {errorMsg}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-[10px] text-mute uppercase font-caption tracking-wider font-bold block">ADRESSE EMAIL</label>
                  <div className="relative">
                    <svg className="absolute left-3 top-3 h-4 w-4 text-mute" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    <input required type="email" value={email} onChange={function(e) { setEmail(e.target.value); }} placeholder="email@exemple.ma" className="w-full bg-surface-deep/50 border border-hairline-strong text-ink rounded-lg pl-10 pr-4 py-2.5 text-xs focus:ring-1 focus:ring-accent-orange outline-none" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] text-mute uppercase font-caption tracking-wider font-bold block">MOT DE PASSE</label>
                  </div>
                  <div className="relative">
                    <svg className="absolute left-3 top-3 h-4 w-4 text-mute" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    <input required type={showPassword ? "text" : "password"} value={password} onChange={function(e) { setPassword(e.target.value); }} placeholder="••••••••" className="w-full bg-surface-deep/50 border border-hairline-strong text-ink rounded-lg pl-10 pr-10 py-2.5 text-xs focus:ring-1 focus:ring-accent-orange outline-none" />
                    <button type="button" onClick={function() { setShowPassword(!showPassword); }} className="absolute inset-y-0 right-0 flex items-center pr-3 text-mute hover:text-ink cursor-pointer">
                      {showPassword ? (
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                      ) : (
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      )}
                    </button>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="w-full bg-ink text-canvas hover:bg-accent-orange hover:text-white py-3 px-4 rounded-lg text-xs font-bold font-mono tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2">
                  {loading ? <div className="spinner-border spinner-border-sm"></div> : <><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg><span>OUVRIR MA SESSION</span></>}
                </button>
              </form>
            )}

            <div className="text-center pt-2">
              <p className="text-xs text-mute font-medium">Pas encore adhérent ? <Link to="/register" className="text-accent-orange hover:underline font-bold transition-all">Créer un espace gratuit</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}