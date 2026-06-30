import React from 'react';
import { MapPin, Star, Heart, Video, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TeacherCard({ teacher, isDark, isFav, onToggleFav }) {
  const navigate = useNavigate();
  const bgCard = isDark ? '#1a1a1a' : '#ffffff';
  const textColor = isDark ? '#ffffff' : '#07090d';
  const textMuted = isDark ? '#a1a4a5' : '#718096';
  const borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const orange = '#e04f00';

  function handleCardClick() {
    navigate(`/teachers/${teacher.id}`);
  }

  function handleFavoriteClick(e) {
    e.stopPropagation();
    onToggleFav(e, teacher.id);
  }

  return (
    <div onClick={handleCardClick} style={{ background: bgCard, border: `1px solid ${borderColor}`, borderRadius: 16, overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
      
      <div style={{ height: 160, background: isDark ? '#2a2a2a' : '#f3f4f6', position: 'relative' }}>
        <img src={teacher.avatar} alt={teacher.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        
        {/* Badge 1er cours offert - GRIS */}
        {teacher.isFirstFree && (
          <span style={{ position: 'absolute', top: 10, left: 10, background: '#6b7280', color: '#ffffff', fontSize: '0.6rem', fontWeight: 700, padding: '3px 8px', borderRadius: 4 }}>
            1er cours offert
          </span>
        )}
        
        <button onClick={handleFavoriteClick} style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Heart size={16} color={isFav ? orange : '#fff'} fill={isFav ? orange : 'none'} />
        </button>
      </div>

      <div style={{ padding: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h3 style={{ fontWeight: 700, color: textColor }}>{teacher.name}</h3>
            <p style={{ fontSize: '0.7rem', color: textMuted, display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={10} /> {teacher.city}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, background: isDark ? '#2a2a2a' : '#f3f4f6', padding: '2px 6px', borderRadius: 6 }}>
            <Star size={10} fill="#b45309" color="#b45309" /> <span style={{ fontSize: '0.7rem', fontWeight: 700 }}>{teacher.rating}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, margin: '8px 0' }}>
          {teacher.delivery === 'face à face & webcam' && (
            <>
              <span style={{ fontSize: '0.6rem', background: isDark ? '#2a2a2a' : '#f3f4f6', padding: '2px 6px', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 4 }}><Home size={10} /> Face à face</span>
              <span style={{ fontSize: '0.6rem', background: isDark ? '#2a2a2a' : '#f3f4f6', padding: '2px 6px', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 4 }}><Video size={10} /> Webcam</span>
            </>
          )}
          {teacher.delivery === 'webcam' && (
            <span style={{ fontSize: '0.6rem', background: isDark ? '#2a2a2a' : '#f3f4f6', padding: '2px 6px', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 4 }}><Video size={10} /> Webcam</span>
          )}
          {teacher.delivery === 'face à face' && (
            <span style={{ fontSize: '0.6rem', background: isDark ? '#2a2a2a' : '#f3f4f6', padding: '2px 6px', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 4 }}><Home size={10} /> Face à face</span>
          )}
        </div>

        <p style={{ fontSize: '0.7rem', color: textMuted, marginBottom: 12, lineHeight: 1.4 }}>{teacher.role.substring(0, 80)}...</p>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid ${borderColor}`, paddingTop: 10 }}>
          <div>
            <div style={{ fontSize: '0.6rem', color: textMuted }}>TARIF DIRECT</div>
            <div style={{ fontWeight: 800, color: textColor }}>{teacher.rate} MAD <span style={{ fontSize: '0.7rem', fontWeight: 400 }}>/h</span></div>
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            {teacher.subjects.slice(0, 2).map(function(s) {
              return <span key={s} style={{ fontSize: '0.6rem', background: isDark ? '#2a2a2a' : '#f3f4f6', padding: '2px 6px', borderRadius: 4 }}>{s}</span>;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}