import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { StudentNavigationActive } from './Dashboard';
import { Calendar, Trash2, Check, MessageCircle, Phone, Star, CheckCheck } from 'lucide-react';
import api from '../../api/axios';
import PaymentSimulationModal from '../../components/PaymentSimulationModal';

function AvisForm({ id_reservation, id_enseignant, isDark, text, muted, border, forceShow = false }) {
  const [note, setNote] = useState(0);
  const [hover, setHover] = useState(0);
  const [commentaire, setCommentaire] = useState('');
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState('');
  const [dejaNote, setDejaNote] = useState(false);
  const [avisExistant, setAvisExistant] = useState(null);
  const [checking, setChecking] = useState(!forceShow);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (forceShow) { setChecking(false); return; }
    async function checkAvis() {
      try {
        const res = await api.get('/enseignants/' + id_enseignant + '/peut-noter');
        const peutNoter = !!res.data?.peut_noter;
        const idResNoter = res.data?.id_reservation;
        if (!peutNoter) {
          setDejaNote(true);
          try {
            const avisRes = await api.get('/enseignants/' + id_enseignant + '/avis');
            const avis = (avisRes.data || []).find(a => a.id_reservation === id_reservation);
            if (avis) setAvisExistant(avis);
          } catch (e) {}
        } else if (idResNoter !== id_reservation) {
          setDejaNote(true);
          try {
            const avisRes = await api.get('/enseignants/' + id_enseignant + '/avis');
            const avis = (avisRes.data || []).find(a => a.id_reservation === id_reservation);
            if (avis) setAvisExistant(avis);
          } catch (e) {}
        }
      } catch (e) {}
      finally { setChecking(false); }
    }
    checkAvis();
  }, [id_reservation, id_enseignant, forceShow]);

  async function handleDelete() {
    if (!avisExistant) return;
    if (!window.confirm('Supprimer votre avis ?')) return;
    setDeleting(true);
    try {
      await api.delete('/avis/' + avisExistant.id_avis);
      setDejaNote(false); setAvisExistant(null); setDone(false); setNote(0); setCommentaire('');
    } catch (e) {
      setErr(e.response?.data?.message || 'Erreur lors de la suppression.');
    } finally { setDeleting(false); }
  }

  async function handleSubmit() {
    if (note === 0) { setErr('Veuillez choisir une note.'); return; }
    if (commentaire.length < 10) { setErr('Commentaire trop court (