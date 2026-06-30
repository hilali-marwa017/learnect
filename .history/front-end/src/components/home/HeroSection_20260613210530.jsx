import { Search, MapPin, X } from 'lucide-react';

export default function HeroSection({
  isDark,
  querySubject,
  setQuerySubject,
  queryCity,
  setQueryCity,
  activePill,
  setActivePill,
  showSubjectDrop,
  setShowSubjectDrop,
  showCityDrop,
  setShowCityDrop,
  onSearch,
  onReset,
  subjectsList = [],
  citiesList = [],
  subjectPills = []
}) {
  const ink = isDark ? '#f0f0f0' : '#111111';
  const muted = isDark ? '#888888' : '#666666';
  const dimmed = isDark ? '#444444' : '#aaaaaa';
  const bgCard = isDark ? '#1a1a1a' : '#ffffff';
  const bdr = isDark ? '#2a2a2a' : '#e9ecef';
  const orange = '#e96f2a';

  return (
    <section style={{ padding: '5rem 2rem 3rem', textAlign: 'center' }}>
      <span style={{
        fontSize: '0.65rem',
        letterSpacing: '0.2em',
        fontWeight: 700,
        textTransform: 'uppercase',
        color: orange,
        display: 'block',
        marginBottom: '0.5rem'
      }}>
        SOUTIEN SCOLAIRE D'EXCEPTION AU MAROC
      </span>

      <h1 style={{
        fontSize: 'clamp(2.5rem, 6vw, 4rem)',
        fontWeight: 800,
        color: ink,
        lineHeight: 1.05,
        letterSpacing: '-0.03em',
        margin: '0 auto 1.2rem',
        maxWidth: 620
      }}>
        Trouvez le professeur parfait
      </h1>

      <p style={{
        fontSize: '0.95rem',
        color: muted,
        maxWidth: 480,
        margin: '0 auto 2.5rem',
        lineHeight: 1.75
      }}>
        Soutien scolaire certifié, méthodologique et sur-mesure pour les étudiants marocains.
        Premier cours offert par nos tuteurs.
      </p>

      {/* Search bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: bgCard,
        border: `1.5px solid ${bdr}`,
        borderRadius: 14,
        padding: 6,
        maxWidth: 700,
        margin: '0 auto 1.5rem',
        boxShadow: isDark ? 'none' : '0 2px 16px rgba(0,0,0,0.06)'
      }}>
        {/* Subject input */}
        <div style={{ flex: 1, position: 'relative', borderRight: `1px solid ${bdr}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px' }}>
            <Search size={16} color={dimmed} />
            <input
              value={querySubject}
              onChange={e => { setQuerySubject(e.target.value); setActivePill(null) }}
              onFocus={() => setShowSubjectDrop(true)}
              onBlur={() => setTimeout(() => setShowSubjectDrop(false), 200)}
              placeholder="Quelle matière ? (Maths, SVT...)"
              style={{
                background: 'none',
                border: 'none',
                outline: 'none',
                color: ink,
                fontSize: '0.83rem',
                width: '100%'
              }}
            />
            {querySubject && (
              <X size={14} color={dimmed} style={{ cursor: 'pointer' }} onClick={() => setQuerySubject('')} />
            )}
          </div>

          {showSubjectDrop && subjectsList.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '110%',
              left: 0,
              right: 0,
              background: bgCard,
              border: `1px solid ${bdr}`,
              borderRadius: 12,
              zIndex: 60,
              overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
            }}>
              {subjectsList
                .filter(s => !querySubject || s.toLowerCase().includes(querySubject.toLowerCase()))
                .slice(0, 7)
                .map(s => (
                  <div
                    key={s}
                    onMouseDown={() => { setQuerySubject(s); setShowSubjectDrop(false) }}
                    style={{
                      padding: '10px 16px',
                      fontSize: '0.8rem',
                      color: ink,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = isDark ? '#222' : '#fff7f0'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <span style={{ color: orange, fontSize: 12 }}>✦</span>{s}
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* City input */}
        <div style={{ flex: 1, position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px' }}>
            <MapPin size={16} color={dimmed} />
            <input
              value={queryCity}
              onChange={e => setQueryCity(e.target.value)}
              onFocus={() => setShowCityDrop(true)}
              onBlur={() => setTimeout(() => setShowCityDrop(false), 200)}
              placeholder="À Casablanca, Rabat..."
              style={{
                background: 'none',
                border: 'none',
                outline: 'none',
                color: ink,
                fontSize: '0.83rem',
                width: '100%'
              }}
            />
            {queryCity && (
              <X size={14} color={dimmed} style={{ cursor: 'pointer' }} onClick={() => setQueryCity('')} />
            )}
          </div>

          {showCityDrop && citiesList.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '110%',
              left: 0,
              right: 0,
              background: bgCard,
              border: `1px solid ${bdr}`,
              borderRadius: 12,
              zIndex: 60,
              overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
            }}>
              {citiesList
                .filter(c => !queryCity || c.toLowerCase().includes(queryCity.toLowerCase()))
                .slice(0, 6)
                .map(c => (
                  <div
                    key={c}
                    onMouseDown={() => { setQueryCity(c); setShowCityDrop(false) }}
                    style={{
                      padding: '10px 16px',
                      fontSize: '0.8rem',
                      color: ink,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = isDark ? '#222' : '#fff7f0'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <MapPin size={12} color={orange} />
                    <span>{c}</span>
                  </div>
                ))}
            </div>
          )}
        </div>

        <button
          onClick={onSearch}
          style={{
            background: ink,
            color: bgCard,
            border: 'none',
            borderRadius: 10,
            padding: '11px 26px',
            fontWeight: 700,
            fontSize: '0.82rem',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            flexShrink: 0
          }}
        >
          Rechercher
        </button>
      </div>

      {/* Pills */}
      {subjectPills.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginTop: 8 }}>
          <span style={{
            fontSize: '0.62rem',
            color: dimmed,
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            width: '100%',
            marginBottom: 4
          }}>
            Accès Rapide
          </span>
          {subjectPills.map(pill => {
            const isActive = activePill === pill;
            return (
              <button
                key={pill}
                onClick={() => setActivePill(prev => prev === pill ? null : pill)}
                style={{
                  padding: '5px 16px',
                  borderRadius: 99,
                  border: `1px solid ${isActive ? orange : bdr}`,
                  background: isActive ? orange : 'transparent',
                  color: isActive ? '#fff' : muted,
                  fontSize: '0.72rem',
                  cursor: 'pointer',
                  fontWeight: isActive ? 700 : 400,
                  transition: 'all .15s'
                }}
              >
                {pill}
              </button>
            );
          })}
          {(activePill || querySubject || queryCity) && (
            <button
              onClick={onReset}
              style={{
                padding: '5px 14px',
                borderRadius: 99,
                border: '1px solid rgba(226,75,74,0.3)',
                background: 'rgba(226,75,74,0.08)',
                color: '#e24b4a',
                fontSize: '0.72rem',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              Réinitialiser
            </button>
          )}
        </div>
      )}
    </section>
  );
}