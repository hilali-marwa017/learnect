import React from 'react';
import { MapPin, Star, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TeacherCard({ teacher, isDark, isFav, onToggleFav }) {
  const navigate = useNavigate();
  const bgCard = isDark ? '#1a1a1a' : '#ffffff';
  const bgSurf = isDark ? '#2a2a2a' : '#f1f3f5';
  const border = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const textColor = isDark ? '#ffffff' : '#07090d';
  const textMuted = isDark ? '#a1a4a5' : '#718096';
  const orange = '#e04f00';
  const green = '#047857';

  return (
    <div onClick={() => navigate(`/teachers/${teacher.id}`)} style={{ background: bgCard, border: `1px solid ${border}`, borderRadius: 12, overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
      <div style={{ height: 180, background: bgSurf, position: 'relative' }}>
        <img src={teacher.avatar} alt={teacher.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <span style={{ position: 'absolute', top: 10, left: 10, background: green, color: '#fff', fontSize: '0.6rem', fontWeight: 700, padding: '3px 8px', borderRadius: 4 }}>1er cours offert</span>
        <button onClick={(e) => onToggleFav(e, teacher.id)} style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Heart size={16} color={isFav ? orange : '#fff'} fill={isFav ? orange : 'none'} />
        </button>
      </div>
      <div style={{ padding: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
          <div><h3 style={{ fontWeight: 700, color: textColor }}>{teacher.name}</h3><p style={{ fontSize: '0.7rem', color: textMuted, display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={10} /> {teacher.city}</p></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, background: bgSurf, padding: '2px 6px', borderRadius: 6 }}><Star size={10} fill="#b45309" color="#b45309" /><span style={{ fontSize: '0.7rem', fontWeight: 700 }}>{teacher.rating}</span></div>
        </div>
        <p style={{ fontSize: '0.65rem', color: textMuted, marginBottom: 8 }}>{teacher.role}</p>
        {teacher.bio && <p style={{ fontSize: '0.7rem', color: textMuted, fontStyle: 'italic', marginBottom: 12 }}>"{teacher.bio.substring(0, 60)}..."</p>}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid ${border}`, paddingTop: 10 }}>
          <div><div style={{ fontSize: '0.6rem', color: textMuted }}>Tarif direct</div><div style={{ fontWeight: 800, color: textColor }}>{teacher.rate} MAD <span style={{ fontSize: '0.7rem', fontWeight: 400 }}>/h</span></div></div>
          <div style={{ display: 'flex', gap: 4 }}>{teacher.subjects.slice(0, 2).map((s) => <span key={s} style={{ fontSize: '0.6rem', background: bgSurf, padding: '2px 6px', borderRadius: 4 }}>{s}</span>)}</div>
        </div>
      </div>
    </div>
  );
}