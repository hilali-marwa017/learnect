import React from 'react';
import { MapPin, Star, Video, Home, Gift, MessageCircle, Calendar, Shield, Award, Sparkles } from 'lucide-react';
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
        borderRadius: '16px',
        overflow: 'hidden',
        cursor: 'pointer',
        position: 'relative',
        height: '400px',
        background: '#fff',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        border: '1px solid rgba(0,0,0,0.04)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px) scale(1.01)';
        e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
      }}
    >
      {/* Image avec overlay gradient */}
      <img
        src={teacher.avatar || `https://ui-avatars.com/api/?name=${teacher.name}&background=e04f00&color=fff&size=400&font-size=0.5`}
        alt={teacher.name || 'Professeur'}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      />

      {/* Overlay gradient */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.85) 80%, rgba(0,0,0,0.95) 100%)'
      }} />

      {/* Badge 1er cours offert - EN ORANGE */}
      {teacher.isFirstFree && (
        <div style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'linear-gradient(135deg, #f59e0b, #d97706)',
          color: '#fff',
          fontSize: '0.6rem',
          fontWeight: 800,
          padding: '5px 14px',
          borderRadius: '999px',
          boxShadow: '0 4px 16px rgba(245,158,11,0.4)',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
        }}>
          <Sparkles size={12} /> 1er cours offert
        </div>
      )}

      {/* Badge Vérifié */}
      {teacher.isVerified && (
        <div style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          zIndex: 2,
          background: 'rgba(16,185,129,0.95)',
          backdropFilter: 'blur(4px)',
          color: '#fff',
          fontSize: '0.55rem',
          fontWeight: 700,
          padding: '4px 12px',
          borderRadius: '999px',
          letterSpacing: '0.05em',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          boxShadow: '0 2px 12px rgba(16,185,129,0.3)',
          border: '1px solid rgba(255,255,255,0.15)',
        }}>
          <Shield size={10} /> Vérifié
        </div>
      )}

      {/* Contenu en bas */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '1.5rem 1.2rem 1.2rem',
        zIndex: 2,
      }}>
        {/* Nom et Note */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '4px',
        }}>
          <h3 style={{
            fontWeight: 800,
            color: '#ffffff',
            fontSize: '1.1rem',
            margin: 0,
            textShadow: '0 2px 12px rgba(0,0,0,0.4)',
            letterSpacing: '-0.01em',
          }}>
            {teacher.name}
          </h3>
          {teacher.rating > 0 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: 'rgba(0,0,0,0.4)',
              backdropFilter: 'blur(8px)',
              padding: '3px 10px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.08)',
            }}>
              <Star size={13} fill="#fbbf24" color="#fbbf24" />
              <span style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#fbbf24',
              }}>
                {teacher.rating}
              </span>
            </div>
          )}
        </div>

        {/* Ville */}
        <p style={{
          fontSize: '0.7rem',
          color: 'rgba(255,255,255,0.6)',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          margin: '0 0 8px',
        }}>
          <MapPin size={11} color="#f59e0b" /> {teacher.city || 'Maroc'}
        </p>

        {/* Badges */}
        <div style={{
          display: 'flex',
          gap: '6px',
          marginBottom: '12px',
          flexWrap: 'wrap',
        }}>
          {(teacher.delivery === 'face à face & webcam' || teacher.delivery === 'face à face') && (
            <span style={{
              fontSize: '0.55rem',
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(8px)',
              color: '#fff',
              padding: '3px 10px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              border: '1px solid rgba(255,255,255,0.1)',
              fontWeight: 600,
            }}>
              <Home size={9} /> Présentiel
            </span>
          )}
          {(teacher.delivery === 'face à face & webcam' || teacher.delivery === 'webcam') && (
            <span style={{
              fontSize: '0.55rem',
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(8px)',
              color: '#fff',
              padding: '3px 10px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              border: '1px solid rgba(255,255,255,0.1)',
              fontWeight: 600,
            }}>
              <Video size={9} /> En ligne
            </span>
          )}
        </div>

        {/* Séparateur */}
        <div style={{
          height: '1px',
          background: 'rgba(255,255,255,0.1)',
          marginBottom: '12px',
        }} />

        {/* Prix et Bouton */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <div style={{
              fontSize: '0.45rem',
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
              <span style={{ color: '#f59e0b' }}>{teacher.rate}</span>
              <span style={{ fontSize: '0.7rem', fontWeight: 400, color: 'rgba(255,255,255,0.4)' }}>MAD</span>
            </div>
          </div>

          <button
            onClick={handleAction}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: isStudent
                ? 'linear-gradient(135deg, #10b981, #059669)'
                : 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              padding: '8px 16px',
              fontWeight: 700,
              fontSize: '0.7rem',
              cursor: 'pointer',
              boxShadow: isStudent
                ? '0 4px 16px rgba(16,185,129,0.3)'
                : '0 4px 16px rgba(245,158,11,0.3)',
              letterSpacing: '0.02em',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = isStudent
                ? '0 6px 24px rgba(16,185,129,0.4)'
                : '0 6px 24px rgba(245,158,11,0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = isStudent
                ? '0 4px 16px rgba(16,185,129,0.3)'
                : '0 4px 16px rgba(245,158,11,0.3)';
            }}
          >
            {isStudent
              ? <><Calendar size={13} /> Réserver</>
              : <><MessageCircle size={13} /> Contacter</>
            }
          </button>
        </div>
      </div>
    </div>
  );
} 