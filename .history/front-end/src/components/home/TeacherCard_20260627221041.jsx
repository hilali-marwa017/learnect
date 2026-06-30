import React from 'react';
import { MapPin, Star, Video, Home, Gift, MessageCircle, Calendar, Award, Shield, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TeacherCard({ teacher, user }) {
  const navigate = useNavigate();

  if (!teacher) return null;

  const isStudent = user?.role === 'etudiant';

  function handleAction(e) {
    e.stopPropagation();
    if (!user) { navigate('/login'); return; }
    navigate(`/teachers/${teacher.id}`);
  }

  return (
    <div
      onClick={() => navigate(`/teachers/${teacher.id}`)}
      style={{
        borderRadius: '20px',
        overflow: 'hidden',
        cursor: 'pointer',
        position: 'relative',
        height: '440px',
        background: '#0f0f0f',
        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.18)';
      }}
    >
      <img
        src={teacher.avatar || `https://ui-avatars.com/api/?name=${teacher.name}&background=e04f00&color=fff&size=400`}
        alt={teacher.name || 'Professeur'}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'top center',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      />

      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.1) 30%, rgba(0,0,0,0.6) 60%, rgba(0,0,0,0.95) 100%)'
      }} />

      {teacher.isFirstFree && (
        <div style={{
          position: 'absolute',
          top: '14px',
          left: '14px',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'linear-gradient(135deg, #059669, #047857)',
          color: '#fff',
          fontSize: '0.6rem',
          fontWeight: 700,
          padding: '5px 12px',
          borderRadius: '999px',
          boxShadow: '0 2px 12px rgba(4,120,87,0.5)',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}>
          <Gift size={11} color="#fff" /> 1er cours offert
        </div>
      )}

      {teacher.isVerified && (
        <div style={{
          position: 'absolute',
          top: '14px',
          right: '14px',
          zIndex: 2,
          background: 'rgba(37,99,235,0.92)',
          backdropFilter: 'blur(4px)',
          color: '#fff',
          fontSize: '0.55rem',
          fontWeight: 700,
          padding: '4px 12px',
          borderRadius: '999px',
          letterSpacing: '0.06em',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          boxShadow: '0 2px 8px rgba(37,99,235,0.3)',
        }}>
          <Shield size={11} /> VÉRIFIÉ
        </div>
      )}

      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '1.5rem 1.2rem 1.2rem',
        zIndex: 2,
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '4px',
        }}>
          <h3 style={{
            fontWeight: 800,
            color: '#ffffff',
            fontSize: '1.15rem',
            margin: 0,
            textShadow: '0 2px 8px rgba(0,0,0,0.5)',
            letterSpacing: '-0.01em',
          }}>
            {teacher.name}
          </h3>
          {teacher.rating > 0 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(4px)',
              padding: '3px 10px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.08)',
            }}>
              <Star size={13} fill="#f59e0b" color="#f59e0b" />
              <span style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#f59e0b',
              }}>
                {teacher.rating}
              </span>
              <span style={{
                fontSize: '0.6rem',
                color: 'rgba(255,255,255,0.4)',
                fontWeight: 400,
              }}>
                ({teacher.reviews || 0})
              </span>
            </div>
          )}
        </div>

        <p style={{
          fontSize: '0.7rem',
          color: 'rgba(255,255,255,0.6)',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          margin: '0 0 6px',
        }}>
          <MapPin size={11} color="#e04f00" /> {teacher.city || 'Maroc'}
        </p>

        <p style={{
          fontSize: '0.72rem',
          color: 'rgba(255,255,255,0.7)',
          marginBottom: '10px',
          lineHeight: 1.5,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textShadow: '0 1px 4px rgba(0,0,0,0.3)',
        }}>
          {teacher.role && teacher.role.length > 70 ? teacher.role.substring(0, 70) + '...' : (teacher.role || '')}
        </p>

        <div style={{
          display: 'flex',
          gap: '6px',
          marginBottom: '12px',
          flexWrap: 'wrap',
        }}>
          {(teacher.delivery === 'face à face & webcam' || teacher.delivery === 'face à face') && (
            <span style={{
              fontSize: '0.58rem',
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(8px)',
              color: '#fff',
              padding: '4px 10px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              border: '1px solid rgba(255,255,255,0.1)',
            }}>
              <Home size={10} /> Présentiel
            </span>
          )}
          {(teacher.delivery === 'face à face & webcam' || teacher.delivery === 'webcam') && (
            <span style={{
              fontSize: '0.58rem',
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(8px)',
              color: '#fff',
              padding: '4px 10px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              border: '1px solid rgba(255,255,255,0.1)',
            }}>
              <Video size={10} /> En ligne
            </span>
          )}
          {teacher.experience && (
            <span style={{
              fontSize: '0.58rem',
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(8px)',
              color: '#fff',
              padding: '4px 10px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              border: '1px solid rgba(255,255,255,0.1)',
            }}>
              <Clock size={10} /> {teacher.experience} ans
            </span>
          )}
        </div>

        <div style={{
          height: '1px',
          background: 'rgba(255,255,255,0.08)',
          marginBottom: '12px',
        }} />

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <div style={{
              fontSize: '0.5rem',
              color: 'rgba(255,255,255,0.35)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: '2px',
            }}>
              Tarif / heure
            </div>
            <div style={{
              fontWeight: 800,
              color: '#ffffff',
              fontSize: '1.2rem',
              display: 'flex',
              alignItems: 'baseline',
              gap: '2px',
            }}>
              <span style={{ color: '#e04f00' }}>{teacher.rate}</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'rgba(255,255,255,0.5)' }}>MAD</span>
            </div>
          </div>

          <button
            onClick={handleAction}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: isStudent
                ? 'linear-gradient(135deg, #059669, #047857)'
                : 'linear-gradient(135deg, #e04f00, #c43d00)',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              padding: '9px 18px',
              fontWeight: 700,
              fontSize: '0.75rem',
              cursor: 'pointer',
              boxShadow: isStudent
                ? '0 4px 16px rgba(5,150,105,0.35)'
                : '0 4px 16px rgba(224,79,0,0.35)',
              letterSpacing: '0.03em',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.04)';
              e.currentTarget.style.boxShadow = isStudent
                ? '0 6px 24px rgba(5,150,105,0.5)'
                : '0 6px 24px rgba(224,79,0,0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = isStudent
                ? '0 4px 16px rgba(5,150,105,0.35)'
                : '0 4px 16px rgba(224,79,0,0.35)';
            }}
          >
            {isStudent
              ? <><Calendar size={14} /> Réserver</>
              : <><MessageCircle size={14} /> Contacter</>
            }
          </button>
        </div>
      </div>
    </div>
  );
}