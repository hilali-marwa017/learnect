import React from 'react';
import { MapPin, Star, Video, Home, BadgeCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TeacherCard({ teacher, isDark }) {
  const navigate = useNavigate();
  const text = '#ffffff';
  const muted = 'rgba(255,255,255,0.6)';
  const orange = '#e04f00';
  const green = '#047857';

  return (
    <div
      onClick={() => navigate(`/teachers/${teacher.id}`)}
      style={{
        borderRadius: '16px',
        overflow: 'hidden',
        cursor: 'pointer',
        position: 'relative',
        height: '380px',
        background: '#111',
      }}
    >
      {/* Background image full card */}
      <img
        src={teacher.avatar}
        alt={teacher.name}
        style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0, filter: 'grayscale(100%) brightness(0.55)' }}
      />

      {/* Gradient overlay bottom */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '65%', background: 'linear-gradient(to top, rgba(0,0,0,0.95) 60%, transparent)' }} />

      {/* Badge 1er cours offert - top left */}
      {teacher.isFirstFree && (
        <span style={{ position: 'absolute', top: '12px', left: '12px', background: green, color: '#fff', fontSize: '0.6rem', fontWeight: 700, padding: '4px 10px', borderRadius: '6px', zIndex: 2, letterSpacing: '0.03em' }}>
          1er cours offert
        </span>
      )}

      {/* Content bottom */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1rem', zIndex: 2 }}>

        {/* Name + rating */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <h3 style={{ fontWeight: 700, color: text, fontSize: '1rem', margin: 0 }}>{teacher.name}</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <Star size={11} fill="#f59e0b" color="#f59e0b" />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f59e0b' }}>{teacher.rating}</span>
          </div>
        </div>

        {/* City */}
        <p style={{ fontSize: '0.7rem', color: muted, display: 'flex', alignItems: 'center', gap: '4px', margin: '0 0 6px' }}>
          <MapPin size={10} /> {teacher.city}
        </p>

        {/* Role / bio */}
        <p style={{ fontSize: '0.7rem', color: muted, marginBottom: '10px', lineHeight: 1.4 }}>
          {teacher.role.length > 80 ? teacher.role.substring(0, 80) + '...' : teacher.role}
        </p>

        {/* Delivery badges */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
          {(teacher.delivery === 'face à face & webcam' || teacher.delivery === 'face à face') && (
            <span style={{ fontSize: '0.6rem', background: 'rgba(255,255,255,0.12)', color: '#fff', padding: '3px 8px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Home size={10} /> Face à face
            </span>
          )}
          {(teacher.delivery === 'face à face & webcam' || teacher.delivery === 'webcam') && (
            <span style={{ fontSize: '0.6rem', background: 'rgba(255,255,255,0.12)', color: '#fff', padding: '3px 8px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Video size={10} /> Webcam
            </span>
          )}
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', marginBottom: '10px' }} />

        {/* Rate + subjects */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.55rem', color: muted, letterSpacing: '0.08em' }}>TARIF DIRECT</div>
            <div style={{ fontWeight: 800, color: '#ffffff', fontSize: '1rem' }}>
              {teacher.rate} MAD <span style={{ fontSize: '0.7rem', fontWeight: 400 }}>/h</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            {teacher.subjects.slice(0, 2).map((s, i) => (
              <span key={i} style={{ fontSize: '0.6rem', background: 'rgba(255,255,255,0.12)', color: '#fff', padding: '3px 8px', borderRadius: '4px' }}>{s}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}