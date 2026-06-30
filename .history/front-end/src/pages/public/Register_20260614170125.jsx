import React from 'react'
import { useNavigate } from 'react-router-dom'
import { GraduationCap, BookOpen, User, CheckCircle, ArrowRight } from 'lucide-react'

export default function Register() {
  const navigate = useNavigate()

  const orange = '#e04f00'
  const text = '#07090d'
  const muted = '#718096'
  const border = 'rgba(0,0,0,0.10)'
  const card = '#f8f9fc'

  return (
    <div style={{ minHeight: '100vh', background: '#f0f0f2', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '560px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '0.5rem' }}>
            <GraduationCap size={24} color={orange} />
            <span style={{ fontWeight: 800, fontSize: '1.1rem', color: text }}>
              Learn<span style={{ color: orange }}>ect</span>.ma
            </span>
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: text, marginBottom: '0.4rem' }}>Rejoindre Learnect</h1>
          <p style={{ fontSize: '0.85rem', color: muted }}>Choisissez votre profil pour commencer.</p>
        </div>

        {/* Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Teacher Card */}
          <div
            onClick={() => navigate('/register/teacher')}
            style={{
              background: '#fff', border: `1px solid ${border}`, borderRadius: '16px',
              padding: '1.5rem', cursor: 'pointer', transition: 'all 0.2s',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = orange}
            onMouseLeave={e => e.currentTarget.style.borderColor = border}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '48px', height: '48px', background: `${orange}15`, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BookOpen size={22} color={orange} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: text, margin: 0 }}>Je suis Professeur / Tuteur</h3>
                  <p style={{ fontSize: '0.8rem', color: muted, margin: '3px 0 0' }}>Donnez des cours et gérez vos revenus</p>
                </div>
              </div>
              <ArrowRight size={18} color={muted} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '1rem', paddingTop: '1rem', borderTop: `1px solid ${border}` }}>
              {['Visibilité auprès de milliers de familles', 'Zéro commission d\'engagement', 'Panel de gestion des cours et gains'].map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: muted }}>
                  <CheckCircle size={14} color={orange} />
                  {f}
                </div>
              ))}
            </div>
          </div>

          {/* Student Card */}
          <div
            onClick={() => navigate('/register/student')}
            style={{
              background: '#fff', border: `1px solid ${border}`, borderRadius: '16px',
              padding: '1.5rem', cursor: 'pointer', transition: 'all 0.2s',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#1c64f2'}
            onMouseLeave={e => e.currentTarget.style.borderColor = border}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '48px', height: '48px', background: 'rgba(28,100,242,0.08)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={22} color="#1c64f2" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: text, margin: 0 }}>Je suis Élève / Étudiant</h3>
                  <p style={{ fontSize: '0.8rem', color: muted, margin: '3px 0 0' }}>Trouvez un tuteur qualifié près de chez vous</p>
                </div>
              </div>
              <ArrowRight size={18} color={muted} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '1rem', paddingTop: '1rem', borderTop: `1px solid ${border}` }}>
              {['Annuaire d\'enseignants accrédités', 'Première heure de diagnostic offerte', 'Messagerie privée sécurisée'].map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: muted }}>
                  <CheckCircle size={14} color="#1c64f2" />
                  {f}
                </div>
              ))}
            </div>
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: '0.82rem', color: muted, marginTop: '1.5rem' }}>
          Déjà un compte ?{' '}
          <span style={{ color: orange, cursor: 'pointer', fontWeight: 600 }} onClick={() => navigate('/login')}>
            Se connecter
          </span>
        </p>
      </div>
    </div>
  )
}