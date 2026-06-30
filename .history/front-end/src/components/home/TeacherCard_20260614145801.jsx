import React from 'react';
import { MapPin, Star, Heart, Video, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TeacherCard({ teacher, isDark, isFav, onToggleFav }) {
  const navigate = useNavigate();
  const card = isDark ? '#1a1a1c' : '#ffffff';
  const text = isDark ? '#ffffff' : '#07090d';
  const muted = isDark ? '#a1a4a5' : '#718096';
  const border = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';
  const badge = isDark ? '#252527' : '#f1f3f5';
  const orange = '#e04f00';
  const green = '#047857';

  return (
    <div onClick={() => navigate(`/teachers/${teacher.id}`)} style={{ background: card, border: `1px solid ${border}`, borderRadius: '16px', overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
      <div style={{ height: '160px', background: badge, position: 'relative' }}>
        <img src={teacher.avatar} alt={teacher.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        {teacher.isFirstFree && <span style={{ position: 'absolute', top: '10px', left: '10px', background: green, color: '#fff', fontSize: '0.6rem', fontWeight: 700, padding: '3px 8px', borderRadius: '4px' }}>1er cours offert</span>}
        <button onClick={(e) => { e.stopPropagation(); onToggleFav(e, teacher.id); }} style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Heart size={16} color={isFav ? orange : '#fff'} fill={isFav ? orange : 'none'} />
        </button>
      </div>
      <div style={{ padding: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h3 style={{ fontWeight: 700, color: text }}>{teacher.name}</h3>
            <p style={{ fontSize: '0.7rem', color: muted, display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={10} /> {teacher.city}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', background: badge, padding: '2px 6px', borderRadius: '6px' }}>
            <Star size={10} fill="#b45309" color="#b45309" /> <span style={{ fontSize: '0.7rem', fontWeight: 700 }}>{teacher.rating}</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', margin: '8px 0' }}>
          {teacher.delivery === 'face à face & webcam' && (
            <>
              <span style={{ fontSize: '0.6rem', background: badge, padding: '2px 6px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}><Home size={10} /> Face à face</span>
              <span style={{ fontSize: '0.6rem', background: badge, padding: '2px 6px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}><Video size={10} /> Webcam</span>
            </>
          )}
          {teacher.delivery === 'webcam' && <span style={{ fontSize: '0.6rem', background: badge, padding: '2px 6px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}><Video size={10} /> Webcam</span>}
          {teacher.delivery === 'face à face' && <span style={{ fontSize: '0.6rem', background: badge, padding: '2px 6px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}><Home size={10} /> Face à face</span>}
        </div>
        <p style={{ fontSize: '0.7rem', color: muted, marginBottom: '12px', lineHeight: 1.4 }}>{teacher.role.length > 80 ? teacher.role.substring(0, 80) + '...' : teacher.role}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid ${border}`, paddingTop: '10px' }}>
          <div>
            <div style={{ fontSize: '0.6rem', color: muted }}>TARIF DIRECT</div>
            <div style={{ fontWeight: 800, color: text }}>{teacher.rate} MAD <span style={{ fontSize: '0.7rem', fontWeight: 400 }}>/h</span></div>
          </div>
          <div style={{ display: 'flex', gap: '4px' }}>
            {teacher.subjects.slice(0, 2).map((s, i) => <span key={i} style={{ fontSize: '0.6rem', background: badge, padding: '2px 6px', borderRadius: '4px' }}>{s}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
}