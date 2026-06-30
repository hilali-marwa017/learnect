import React from 'react';
import { MapPin, Star, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TeacherCard({ teacher, isDark, isFav, onToggleFav }) {
  const navigate = useNavigate();

  const bgCard = isDark ? '#111111' : '#ffffff';
  const bgSurf = isDark ? '#1a1a1a' : '#f1f3f5';
  const border = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';
  const textColor = isDark ? '#ffffff' : '#07090d';
  const textMuted = isDark ? '#a1a4a5' : '#718096';
  const orange = '#e04f00';
  const green = '#047857';

  return (
    <div
      onClick={function() { navigate('/teachers/' + teacher.id); }}
      style={{
        background: bgCard, border: `1px solid ${border}`,
        borderRadius: 14, overflow: 'hidden', cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        boxShadow: isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.06)'
      }}
      onMouseEnter={function(e) {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = isDark ? '0 8px 24px rgba(0,0,0,0.4)' : '0 8px 24px rgba(0,0,0,0.12)';
      }}
      onMouseLeave={function(e) {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.06)';
      }}>

      {/* Image */}
      <div style={{ height: 200, background: bgSurf, position: 'relative', overflow: 'hidden' }}>
        <img
          src={teacher.avatar}
          alt={teacher.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(30%)', transition: 'filter 0.3s' }}
          onMouseEnter={function(e) { e.target.style.filter = 'grayscale(0%)'; }}
          onMouseLeave={function(e) { e.target.style.filter = 'grayscale(30%)'; }}
        />
        <span style={{
          position: 'absolute', top: 10, left: 10,
          background: green, color: '#fff',
          fontSize: '0.65rem', fontWeight: 700,
          padding: '3px 10px', borderRadius: 4
        }}>
          1er cours offert
        </span>
        <button
          onClick={function(e) { onToggleFav(e, teacher.id); }}
          style={{
            position: 'absolute', top: 10, right: 10,
            background: 'rgba(0,0,0,0.45)', border: 'none',
            borderRadius: '50%', width: 34, height: 34,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
          <Heart size={16} color={isFav ? orange : '#fff'} fill={isFav ? orange : 'none'} />
        </button>
      </div>

      {/* Body */}
      <div style={{ padding: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
          <div>
            <h3 style={{ fontWeight: 700, color: textColor, margin: 0, fontSize: '1rem' }}>{teacher.name}</h3>
            <p style={{ fontSize: '0.7rem', color: textMuted, display: 'flex', alignItems: 'center', gap: 4, margin: '3px 0 0' }}>
              <MapPin size={10} color="#1c64f2" />
              {teacher.city}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, background: bgSurf, padding: '3px 8px', borderRadius: 6 }}>
            <Star size={11} fill="#b45309" color="#b45309" />
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: textColor }}>{Number(teacher.rating || 0).toFixed(1)}</span>
          </div>
        </div>

        <p style={{ fontSize: '0.7rem', color: textMuted, margin: '4px 0 6px', fontFamily: 'monospace' }}>{teacher.role}</p>

        {teacher.bio && (
          <p style={{ fontSize: '0.75rem', color: textMuted, fontStyle: 'italic', marginBottom: 12, lineHeight: 1.5 }}>
            "{teacher.bio.substring(0, 70)}..."
          </p>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid ${border}`, paddingTop: 10, marginTop: 4 }}>
          <div>
            <div style={{ fontSize: '0.6rem', color: textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tarif direct</div>
            <div style={{ fontWeight: 900, color: textColor, fontSize: '1.1rem' }}>
              {teacher.rate} MAD <span style={{ fontSize: '0.75rem', fontWeight: 400 }}>/h</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'flex-end', maxWidth: '55%' }}>
            {(teacher.subjects || []).slice(0, 2).map(function(s) {
              return (
                <span key={s} style={{ fontSize: '0.62rem', background: bgSurf, padding: '2px 7px', borderRadius: 5, color: textMuted, border: `1px solid ${border}` }}>
                  {s}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}