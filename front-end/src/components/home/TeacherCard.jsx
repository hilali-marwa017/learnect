import React from 'react';
import { MapPin, Star, Video, Home, Navigation, Gift, MessageCircle, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TeacherCard({ teacher, user }) {
  const navigate = useNavigate();

  if (!teacher) return null;

  const id = teacher.utilisateur_id;
  const prenom = teacher.user?.prenom || '';
  const nom = teacher.user?.nom || '';
  const nomComplet = prenom + ' ' + nom || 'Professeur';

  const photo = teacher.user?.photo;
  const photoUrl = photo ? (photo.startsWith('http') ? photo : 'http://localhost:8000/storage/' + photo) : null;
  const avatar = photoUrl || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(nomComplet) + '&background=e04f00&color=fff';

  const ville = teacher.user?.ville || '';
  const tarifHeure = teacher.tarifHeure || 0;
  const noteMoyenne = parseFloat(teacher.noteMoyenne) || 0;
  const titre = teacher.titre || '';
  const estVerifie = teacher.estVerifie;

  // ✅ FIX : forcer les valeurs boolean avec !!
  const coursDomicile = !!teacher.cours_domicile;
  const coursEnligne = !!teacher.cours_enligne;
  const coursDeplacement = !!teacher.cours_deplacement;

  const isStudent = user?.role === 'etudiant';

  function handleAction(e) {
    e.stopPropagation();
    if (!user) { navigate('/login'); return; }
    navigate('/teachers/' + id);
  }

  return (
    <div onClick={() => navigate('/teachers/' + id)} style={{ borderRadius: '20px', overflow: 'hidden', cursor: 'pointer', position: 'relative', height: '420px', background: '#0f0f0f', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}>
      <img src={avatar} alt={nomComplet} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', position: 'absolute', top: 0, left: 0 }} onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(nomComplet) + '&background=e04f00&color=fff'; }} />
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.82) 70%, rgba(0,0,0,0.97) 100%)' }} />
      <div style={{ position: 'absolute', top: '14px', left: '14px', zIndex: 2, display: 'flex', alignItems: 'center', gap: '6px', background: 'linear-gradient(135deg, #059669, #047857)', color: '#fff', fontSize: '0.65rem', fontWeight: 700, padding: '5px 12px', borderRadius: '999px', boxShadow: '0 2px 8px rgba(4,120,87,0.45)', letterSpacing: '0.03em' }}><Gift size={11} color="#fff" /> 1er cours offert</div>
      {estVerifie && <div style={{ position: 'absolute', top: '14px', right: '14px', zIndex: 2, background: 'rgba(37,99,235,0.85)', color: '#fff', fontSize: '0.6rem', fontWeight: 700, padding: '4px 10px', borderRadius: '999px', letterSpacing: '0.05em' }}>✓ VÉRIFIÉ</div>}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.2rem', zIndex: 2 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <h3 style={{ fontWeight: 800, color: '#ffffff', fontSize: '1.1rem', margin: 0 }}>{nomComplet}</h3>
          {noteMoyenne > 0 && <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(0,0,0,0.45)', padding: '3px 8px', borderRadius: '8px' }}><Star size={12} fill="#f59e0b" color="#f59e0b" /><span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f59e0b' }}>{noteMoyenne}</span></div>}
        </div>
        <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.65)', display: 'flex', alignItems: 'center', gap: '4px', margin: '0 0 6px' }}><MapPin size={11} color="#e04f00" /> {ville}</p>
        <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.75)', marginBottom: '10px', lineHeight: 1.45 }}>{titre && titre.length > 70 ? titre.substring(0, 70) + '...' : (titre || '')}</p>
        <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
          {coursDomicile && <span style={{ fontSize: '0.62rem', background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(6px)', color: '#fff', padding: '4px 10px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '5px', border: '1px solid rgba(255,255,255,0.15)' }}><Home size={10} /> Domicile</span>}
          {coursEnligne && <span style={{ fontSize: '0.62rem', background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(6px)', color: '#fff', padding: '4px 10px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '5px', border: '1px solid rgba(255,255,255,0.15)' }}><Video size={10} /> Webcam</span>}
          {coursDeplacement && <span style={{ fontSize: '0.62rem', background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(6px)', color: '#fff', padding: '4px 10px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '5px', border: '1px solid rgba(255,255,255,0.15)' }}><Navigation size={10} /> Déplacement</span>}
        </div>
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.12)', marginBottom: '12px' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div><div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.1em', marginBottom: '2px' }}>TARIF DIRECT</div><div style={{ fontWeight: 800, color: '#ffffff', fontSize: '1.15rem', display: 'flex', alignItems: 'baseline', gap: '3px' }}><span style={{ color: '#e04f00' }}>{tarifHeure}</span><span style={{ color: '#ffffff' }}> MAD</span><span style={{ fontSize: '0.7rem', fontWeight: 400, color: 'rgba(255,255,255,0.55)' }}>/h</span></div></div>
          <button onClick={handleAction} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: isStudent ? 'linear-gradient(135deg, #059669, #047857)' : 'linear-gradient(135deg, #e04f00, #c43d00)', color: '#fff', border: 'none', borderRadius: '10px', padding: '8px 16px', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', boxShadow: isStudent ? '0 2px 10px rgba(5,150,105,0.4)' : '0 2px 10px rgba(224,79,0,0.4)', letterSpacing: '0.02em' }}>{isStudent ? <><Calendar size={14} /> Réserver</> : <><MessageCircle size={14} /> Contacter</>}</button>
        </div>
      </div>
    </div>
  );
}