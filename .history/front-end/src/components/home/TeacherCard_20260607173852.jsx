// src/components/home/TeacherCard.jsx
import { useNavigate } from 'react-router-dom';

function TeacherCard({ prof }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/teachers/${prof.utilisateur_id}`)}
      style={{
        background: 'white',
        borderRadius: 16,
        border: '1px solid #E2E8F0',
        padding: '1.2rem',
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(13,110,253,0.12)';
        e.currentTarget.style.borderColor = '#0d6efd';
        e.currentTarget.style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = '#E2E8F0';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'flex-start',
        gap: 12, marginBottom: '0.8rem',
      }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          {prof.user?.photo ? (
            <img
              src={`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/storage/${prof.user.photo}`}
              alt={prof.user?.prenom}
              style={{
                width: 52, height: 52, borderRadius: '50%',
                objectFit: 'cover',
              }}
            />
          ) : (
            <div style={{
              width: 52, height: 52, borderRadius: '50%',
              background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '1.3rem',
            }}>
              👨‍🏫
            </div>
          )}
          {prof.estVerifie && (
            <div style={{
              position: 'absolute', bottom: -2, right: -2,
              background: '#0d6efd', color: 'white',
              width: 16, height: 16, borderRadius: '50%',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '0.6rem',
            }}>
              <i className="bi bi-check" />
            </div>
          )}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700, color: '#0F172A', fontSize: '0.95rem',
          }}>
            {prof.user?.prenom} {prof.user?.nom}
          </div>
          <div style={{
            color: '#6B7280', fontSize: '0.78rem', marginTop: 2,
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
            <i className="bi bi-geo-alt" style={{ color: '#0d6efd' }} />
            {prof.user?.ville}
            {prof.cours_enligne && ' (face à face & webcam)'}
          </div>
          <div style={{
            color: '#F59E0B', fontSize: '0.82rem',
            fontWeight: 700, marginTop: 3,
          }}>
            <i className="bi bi-star-fill" />
            {' '}{prof.noteMoyenne > 0 ? Number(prof.noteMoyenne).toFixed(1) : '5.0'}
          </div>
        </div>

        <div style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 800, color: '#0F172A',
          fontSize: '1rem', textAlign: 'right',
          flexShrink: 0,
        }}>
          {prof.tarifHeure}
          <span style={{
            fontSize: '0.7rem', fontWeight: 500,
            color: '#6B7280', display: 'block',
          }}>DH/h</span>
        </div>
      </div>

      {/* Badge diplôme */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        background: '#EFF6FF',
        border: '1px solid #BFDBFE',
        borderRadius: 6, padding: '5px 10px',
        marginBottom: '0.7rem',
      }}>
        <i className="bi bi-patch-check-fill" style={{ color: '#0d6efd', fontSize: '0.75rem' }} />
        <span style={{
          color: '#0d6efd', fontSize: '0.72rem', fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: 0.5,
        }}>
          Diplôme Académique
        </span>
      </div>

      {/* Description */}
      <p style={{
        color: '#6B7280', fontSize: '0.82rem',
        lineHeight: 1.6, marginBottom: '1rem',
        overflow: 'hidden',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
      }}>
        {prof.description_profil || 'Enseignant expérimenté et passionné par la transmission des savoirs.'}
      </p>

      {/* Matières */}
      {prof.matieres && prof.matieres.length > 0 && (
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 4,
          marginBottom: '0.8rem',
        }}>
          {prof.matieres.slice(0, 2).map(m => (
            <span key={m.id_matiere} style={{
              background: '#EFF6FF', color: '#0d6efd',
              padding: '2px 8px', borderRadius: 10,
              fontSize: '0.72rem', fontWeight: 600,
              border: '1px solid #BFDBFE',
            }}>
              {m.nom}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={e => { e.stopPropagation(); }}
          style={{
            flex: 1,
            background: '#EFF6FF', color: '#0d6efd',
            border: '1px solid #BFDBFE',
            borderRadius: 8, padding: '8px 0',
            fontSize: '0.78rem', fontWeight: 700,
            cursor: 'pointer',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: 4,
          }}
        >
          <i className="bi bi-gift" />
          1ER COURS OFFERT
        </button>
        <button
          onClick={e => {
            e.stopPropagation();
            navigate(`/teachers/${prof.utilisateur_id}`);
          }}
          style={{
            flex: 1,
            background: 'white', color: '#374151',
            border: '1px solid #E2E8F0',
            borderRadius: 8, padding: '8px 0',
            fontSize: '0.78rem', fontWeight: 600,
            cursor: 'pointer',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: 4,
          }}
        >
          <i className="bi bi-arrow-right" />
          Contacter
        </button>
      </div>
    </div>
  );
}

export default TeacherCard;