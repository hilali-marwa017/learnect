import React from 'react';
import { MapPin, Star, Video, Home, Gift, MessageCircle, Calendar, Shield } from 'lucide-react';
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
        border: '1px solid rgba(0,0,0,0.04)',
      }}
    >
      <img
        src={teacher.avatar || `https://ui-avatars.com/api/?name=${teacher.name}&background=e04f00&color