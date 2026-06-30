import React, { useState, useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    totalEleves: 0,
    totalTuteurs: 4,
    totalReservations: 0,
    totalCommission: 0,
  });

  // Bar chart data
  const barData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
    datasets: [
      {
        label: 'Réservations',
        data: [12, 19, 15, 17, 14, 18],
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderRadius: 4,
      },
    ],
  };

  // Pie chart data
  const pieData = {
    labels: ['Élèves', 'Tuteurs'],
    datasets: [
      {
        data: [stats.totalEleves, stats.totalTuteurs],
        backgroundColor: ['#3b82f6', '#10b981'],
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Learnetc.ma</h1>
            <p className="text-sm text-gray-500">COURS PARTICULIERS - MAROC</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Admin Admin</span>
            <button className="text-sm text-red-600 hover:text-red-800">
              Déconnexion
            </button>
          </div>
        </div>
      </div>

      {/* Tabs - Simple text, no transitions */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`pb-3 text-sm font-medium ${
              activeTab === 'dashboard'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`pb-3 text-sm font-medium ${
              activeTab === 'students'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500'
            }`}
          >
            Élèves
          </button>
          <button
            onClick={() => setActiveTab('tutors')}
            className={`pb-3 text-sm font-medium ${
              activeTab === 'tutors'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500'
            }`}
          >
            Tuteurs
          </button>
          <button
            onClick={() => setActiveTab('reservations')}
            className={`pb-3 text-sm font-medium ${
              activeTab === 'reservations'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500'
            }`}
          >
            Réservations
          </button>
          <button
            onClick={() => setActiveTab('commission')}
            className={`pb-3 text-sm font-medium ${
              activeTab === 'commission'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500'
            }`}
          >
            Commission
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'dashboard' && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-sm text-gray-500">Total Élèves</p>
                <p className="text-2xl font-bold">{stats.totalEleves}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-sm text-gray-500">Total Tuteurs</p>
                <p className="text-2xl font-bold">{stats.totalTuteurs}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-sm text-gray-500">Réservations</p>
                <p className="text-2xl font-bold">{stats.totalReservations}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-sm text-gray-500">Commission</p>
                <p className="text-2xl font-bold">{stats.totalCommission} DH</p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Réservations mensuelles
                </h3>
                <div className="h-64">
                  <Bar data={barData} options={barOptions} />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Répartition Élèves / Tuteurs
                </h3>
                <div className="h-64">
                  <Pie data={pieData} />
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'students' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Gestion des élèves</h2>
            <p className="text-gray-500">Liste des élèves à venir...</p>
          </div>
        )}

        {activeTab === 'tutors' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Gestion des tuteurs</h2>
            <p className="text-gray-500">Liste des tuteurs à venir...</p>
          </div>
        )}

        {activeTab === 'reservations' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              Gestion des réservations
            </h2>
            <p className="text-gray-500">Liste des réservations à venir...</p>
          </div>
        )}

        {activeTab === 'commission' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              Gestion des commissions
            </h2>
            <p className="text-gray-500">Détails des commissions à venir...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;