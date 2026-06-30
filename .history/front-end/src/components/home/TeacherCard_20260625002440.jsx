import React from 'react';
import { MapPin, Star, Video, Home, Gift, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TeacherCard({ teacher, isDark, user }) {
  const navigate = useNavigate();

  function handleContact(e) {
    e.stopPropagation();
    if (!user) { navigate('/login'); return; }
    if (user.role === 'etudiant') navigate('/student/messages');
    else if (user.role === 'enseignant') navigate('/teacher/dashboard');
    else navigate('/login');
  }

  const card = isDark ? '#1a1a1c' : '#ffffff';
  const text = isDark ? '#ffffff' : '#07090d';
  const muted = isDark ? 'rgba(255,255,255,0.6)' : '#718096';
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const badge = isDark ? 'rgba(255,255,255,0.1)' : '#f1f3f5';
  const badgeText = isDark ? '#fff' : '#374151';

  return (
    <div
      onClick={() => navigate(`/teachers/${teacher.id}`)}
      style={{
        background: card,
        border: `1px solid ${border}`,
        borderRadius: '16px',
        overflow: 'hidden',
        cursor: 'pointer',
        boxShadow: isDark ? 'none' : '0 1px 6px rgba(0,0,0,0.06)',
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: '180px', background: badge }}>
        <img
          src={teacher.avatar}
          alt={teacher.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {teacher.isFirstFree && (
          <div style={{
            position: 'absolute', top: '10px', left: '10px',
            display: 'flex', alignItems: 'center', gap: '5px',
            background: 'linear-gradient(135deg, #059669, #047857)',
            color: '#fff', fontSize: '0.62rem', fontWeight: 700,
            padding: '4px 10px', borderRadius: '999px',
          }}>
            <Gift size={10} /> 1er cours offert
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '1rem' }}>

        {/* Name + rating */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <h3 style={{ fontWeight: 800, color: text, fontSize: '1rem', margin: 0 }}>{teacher.name}</h3>
          {teacher.rating > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Star size={13} fill="#f59e0b" color="#f59e0b" />
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#f59e0b' }}>{teacher.rating}</span>
            </div>
          )}
        </div>

        {/* City */}
        <p style={{ fontSize: '0.72rem', color: muted, display: 'flex', alignItems: 'center', gap: '4px', margin: '0 0 6px' }}>
          <MapPin size={11} color="#e04f00" /> {teacher.city}
        </p>

        {/* Role */}
        <p style={{ fontSize: '0.72rem', color: muted, marginBottom: '10px', lineHeight: 1.45 }}>
          {teacher.role.length > 70 ? teacher.role.substring(0, 70) + '...' : teacher.role}
        </p>

        {/* Delivery badges */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
          {(teacher.delivery === 'face à face & webcam' || teacher.delivery === 'face à face') && (
            <span style={{ fontSize: '0.62rem', background: badge, color: badgeText, padding: '4px 10px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Home size={10} /> Face à face
            </span>
          )}
          {(teacher.delivery === 'face à face & webcam' || teacher.delivery === 'webcam') && (
            <span style={{ fontSize: '0.62rem', background: badge, color: badgeText, padding: '4px 10px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Video size={10} /> Webcam
            </span>
          )}
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: border, marginBottom: '12px' }} />

        {/* Rate + bouton contacter */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.55rem', color: muted, letterSpacing: '0.1em', marginBottom: '2px' }}>TARIF DIRECT</div>
            <div style={{ fontWeight: 800, color: text, fontSize: '1.05rem', display: 'flex', alignItems: 'baseline', gap: '3px' }}>
              <span style={{ color: '#e04f00' }}>{teacher.rate}</span>
              <span> MAD</span>
              <span style={{ fontSize: '0.68rem', fontWeight: 400, color: muted }}>/h</span>
            </div>
          </div>

          <button
            onClick={handleContact}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: 'linear-gradient(135deg, #e04f00, #c43d00)',
              color: '#fff', border: 'none', borderRadius: '10px',
              padding: '8px 16px', fontWeight: 700, fontSize: '0.76rem',
              cursor: 'pointer', boxShadow: '0 2px 8px rgba(224,79,0,0.35)',
            }}
          >
            <MessageCircle size={14} />
            Contacter
          </button>
        </div>
      </div>
    </div>
  );
}