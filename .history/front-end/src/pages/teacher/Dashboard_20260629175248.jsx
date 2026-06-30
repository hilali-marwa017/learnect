import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import {
  Calendar, DollarSign, Clock, Settings, Check, X,
  ShieldAlert, Star, MessageSquare, Sparkles,
  CreditCard, TrendingUp, CheckCircle2, XCircle
} from 'lucide-react';

// ============================================================
// COMPOSANT NAVIGATION ENSEIGNANT
// ============================================================
export function TeacherNavigationActive({ activeTab, isDark }) {
  const bg = isDark ? '#1a1a1c' : '#f8f9fc';
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const text = isDark ? '#d1d5db' : '#374151';
  const muted = isDark ? '#6b7280' : '#9ca3af';

  const [msgCount, setMsgCount] = useState(0);
  const [demandesCount, setDemandesCount] = useState(0);
  const [pendingPayCount, setPendingPayCount] = useState(0);

  useEffect(() => {
    async function fetchCounts() {
      try {
        const msgRes = await api.get('/messages/non-lus');
        setMsgCount(msgRes.data?.non_lus || 0);

        const demRes = await api.get('/demandes');
        const demandes = demRes.data || [];

        const offRes = await api.get('/offres/mes-offres');
        const mesOffres = offRes.data || [];

        setDemandesCount(demandes.filter(d => !mesOffres.some(o => o.id_demande === d.id_demande)).length);

        const resRes = await api.get('/enseignant/reservations');
        let count = 0;
        (resRes.data || []).forEach(creneau => {
          (creneau.reservations || []).forEach(r => {
            if (r.statut === 'paiement_recu') count++;
          });
        });
        setPendingPayCount(count);
      } catch (e) {
        console.error(e);
      }
    }
    fetchCounts();
    const interval = setInterval(fetchCounts, 30000);
    return () => clearInterval(interval);
  }, []);

  const links = [
    { label: 'Tableau de bord', path: '/teacher', icon: Clock, id: 'dashboard' },
    { label: 'Disponibilités', path: '/teacher/availability', icon: Calendar, id: 'availability' },
    { label: 'Demandes Étudiants', path: '/teacher/demandes', icon: Sparkles, id: 'demandes', badge: demandesCount },
    { label: 'Mes Revenus', path: '/teacher/earnings', icon: DollarSign, id: 'earnings' },
    { label: 'Messages', path: '/teacher/messages', icon: MessageSquare, id: 'messages', badge: msgCount },
    { label: 'Modifier Profil', path: '/teacher/profile', icon: Settings, id