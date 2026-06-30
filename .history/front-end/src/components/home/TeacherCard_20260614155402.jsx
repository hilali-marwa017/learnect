import React from 'react';
import { MapPin, Star, Video, Home, Gift } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TeacherCard({ teacher, isDark }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/teachers/${teacher.id}`)}
      style={{
        borderRadius: '20px',
        overflow: 'hidden',
        cursor: 'pointer',
        position: 'relative',
        height: '420px',
        background: '#0f0f0f',
        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
      }}
    >
      {/* Background image full card — couleurs naturelles */}
      <img
        src={teacher.avatar}
        alt={teacher.name}
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

      {/* Gradient overlay — léger en haut, fort en bas */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.82) 70%, rgba(0,0,0,0.97) 100%)'
      }} />

      {/* Badge 1er cours offert — style Tailwind-like pill */}
      {teacher.isFirstFree && (
        <div style={{
          position: 'absolute', top: '14px', left: '14px', zIndex: 2,
          display: 'flex', alignItems: 'center', gap: '6px',
          background: 'linear-gradient(135deg, #059669, #047857)',
          color: '#fff', fontSize: '0.65rem', fontWeight: 700,
          padding: '5px 12px', borderRadius: '999px',
          boxShadow: '0 2px 8px rgba(4,120,87,0.45)',
          letterSpacing: '0.03em',
        }}>
          <Gift size={11} color="#fff" />
          1er cours offert
        </div>
      )}

      {/* Content bottom */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.2rem', zIndex: 2 }}>

        {/* Name + rating */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <h3 style={{ fontWeight: 800, color: '#ffffff', fontSize: '1.1rem', margin: 0 }}>{teacher.name}</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(0,0,0,0.45)', padding: '3px 8px', borderRadius: '8px' }}>
            <Star size={12} fill="#f59e0b" color="#f59e0b" />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f59e0b' }}>{teacher.rating}</span>
          </div>
        </div>

        {/* City */}
        <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.65)', display: 'flex', alignItems: 'center', gap: '4px', margin: '0 0 6px' }}>
          <MapPin size={11} color="#e04f00" /> {teacher.city}
        </p>

        {/* Role */}
        <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.75)', marginBottom: '10px', lineHeight: 1.45 }}>
          {teacher.role.length > 70 ? teacher.role.substring(0, 70) + '...' : teacher.role}
        </p>

        {/* Delivery badges */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
          {(teacher.delivery === 'face à face & webcam' || teacher.delivery === 'face à face') && (
            <span style={{ fontSize: '0.62rem', background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(6px)', color: '#fff', padding: '4px 10px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '5px', border: '1px solid rgba(255,255,255,0.15)' }}>
              <Home size={10} /> Face à face
            </span>
          )}
          {(teacher.delivery === 'face à face & webcam' || teacher.delivery === 'webcam') && (
            <span style={{ fontSize: '0.62rem', background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(6px)', color: '#fff', padding: '4px 10px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '5px', border: '1px solid rgba(255,255,255,0.15)' }}>
              <Video size={10} /> Webcam
            </span>
          )}
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.12)', marginBottom: '12px' }} />

        {/* Rate + subjects */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.1em', marginBottom: '2px' }}>TARIF DIRECT</div>
            <div style={{ fontWeight: 800, color: '#ffffff', fontSize: '1.15rem', display: 'flex', alignItems: 'baseline', gap: '3px' }}>
              <span style={{ color: '#e04f00' }}>{teacher.rate}</span>
              <span style={{ color: '#ffffff' }}> MAD</span>
              <span style={{ fontSize: '0.7rem', fontWeight: 400, color: 'rgba(255,255,255,0.55)' }}>/h</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            {teacher.subjects.slice(0, 2).map((s, i) => (
              <span key={i} style={{
                fontSize: '0.62rem',
                background: 'rgba(224,79,0,0.15)',
                color: '#ff7a3d',
                padding: '4px 10px',
                borderRadius: '6px',
                border: '1px solid rgba(224,79,0,0.3)',
                fontWeight: 600,
              }}>{s}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}