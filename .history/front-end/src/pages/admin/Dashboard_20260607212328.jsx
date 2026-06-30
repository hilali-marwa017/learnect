import { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import ManageUsers from './ManageUsers';
import Signalements from './Signalements';
import ValidatedTeachers from './ValidatedTeachers';
import api from '../../services/api';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

function AdminDashboard() {
  const [ongletActif, setOngletActif] = useState('stats');
  const [chargement, setChargement] = useState(true);
  const [statistiques, setStatistiques] = useState({
    totalEtudiants: 0,
    totalEnseignants: 0,
    totalReservations: 0,
    totalAvis: 0,
    revenusTotal: 0
  });
  const [enseignantsEnAttente, setEnseignantsEnAttente] = useState([]);
  const [listeSignalements, setListeSignalements] = useState([]);
  const [listeUtilisateurs, setListeUtilisateurs] = useState([]);

  useEffect(() => {
    chargerDonnees();
  }, []);

  async function chargerDonnees() {
    setChargement(true);
    try {
      const [statsRes, teachersRes, signalementsRes, usersRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/enseignantsEnAttente'),
        api.get('/admin/signalements'),
        api.get('/admin/users') // CHANGÉ: Users → users (minuscule)
      ]);

      setStatistiques({
        totalEtudiants: statsRes.data.total_etudiants || 0,
        totalEnseignants: statsRes.data.total_enseignants || 0,
        totalReservations: statsRes.data.total_reservations || 0,
        totalAvis: statsRes.data.total_avis || 0,
        revenusTotal: statsRes.data.revenus_total || 0
      });

      setEnseignantsEnAttente(teachersRes.data || []);
      setListeSignalements(signalementsRes.data || []);
      setListeUtilisateurs(usersRes.data || []);
    } catch (erreur) {
      console.error('Erreur chargement:', erreur);
    } finally {
      setChargement(false);
    }
  }

  // ... reste du code identique
}

export default AdminDashboard;