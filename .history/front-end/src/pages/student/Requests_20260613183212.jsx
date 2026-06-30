// src/pages/student/Requests.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { Sparkles, Plus, Trash2 } from 'lucide-react';

// Supprime cet import qui cause l'erreur
// import { StudentNavigationActive } from './Dashboard';

export default function StudentRequests() {
  const { user } = useAuth();
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newMatiere, setNewMatiere] = useState('');
  const [newNiveau, setNewNiveau] = useState('');
  const [newBudget, setNewBudget] = useState('');
  const [newVille, setNewVille] = useState('');

  useEffect(function() {
    chargerDemandes();
  }, []);

  async function chargerDemandes() {
    try {
      const response = await api.get('/demandes/mes-demandes');
      setDemandes(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!newMatiere || !newNiveau || !newBudget || !newVille) return;

    try {
      const response = await api.post('/demandes', {
        matiere: newMatiere,
        niveau: newNiveau,
        budgetMin: 0,
        budgetMax: newBudget,
        ville: newVille
      });
      setDemandes([response.data.demande, ...demandes]);
      setShowForm(false);
      setNewMatiere('');
      setNewNiveau('');
      setNewBudget('');
      setNewVille('');
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la création');
    }
  }

  async function handleDelete(id) {
    if (window.confirm('Supprimer cette demande ?')) {
      try {
        await api.delete(`/demandes/${id}`);
        setDemandes(demandes.filter(function(d) { return d.id_demande !== id; }));
      } catch (err) {
        console.error(err);
        alert('Erreur lors de la suppression');
      }
    }
  }

  if (loading) {
    return (
      <div className="pt-24 pb-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="spinner-border text-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6">
        
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mes Demandes</h1>
            <p className="text-gray-500 text-sm">Gérez vos demandes de cours</p>
          </div>
          <button onClick={function() { setShowForm(!showForm); }} className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
            <Plus className="h-4 w-4" /> Nouvelle demande
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white border rounded-xl p-6 mb-6">
            <h3 className="font-bold mb-4">Publier une demande</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input type="text" placeholder="Matière" value={newMatiere} onChange={function(e) { setNewMatiere(e.target.value); }} className="border rounded-lg p-2 text-sm" required />
              <input type="text" placeholder="Niveau" value={newNiveau} onChange={function(e) { setNewNiveau(e.target.value); }} className="border rounded-lg p-2 text-sm" required />
              <input type="number" placeholder="Budget max (DH/h)" value={newBudget} onChange={function(e) { setNewBudget(e.target.value); }} className="border rounded-lg p-2 text-sm" required />
              <input type="text" placeholder="Ville" value={newVille} onChange={function(e) { setNewVille(e.target.value); }} className="border rounded-lg p-2 text-sm" required />
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={function() { setShowForm(false); }} className="px-4 py-2 border rounded-lg text-sm">Annuler</button>
              <button type="submit" className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm">Publier</button>
            </div>
          </form>
        )}

        {demandes.length === 0 ? (
          <div className="bg-white border rounded-xl p-8 text-center">
            <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">Aucune demande publiée</p>
            <button onClick={function() { setShowForm(true); }} className="mt-4 text-orange-500 text-sm font-semibold">Créer ma première demande</button>
          </div>
        ) : (
          <div className="space-y-4">
            {demandes.map(function(d) {
              return (
                <div key={d.id_demande} className="bg-white border rounded-xl p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">{d.matiere}</h3>
                      <p className="text-gray-500 text-sm">Niveau: {d.niveau}</p>
                      <p className="text-gray-500 text-sm">Budget: {d.budgetMax} DH/h</p>
                      <p className="text-gray-500 text-sm">Ville: {d.ville}</p>
                    </div>
                    <button onClick={function() { handleDelete(d.id_demande); }} className="text-red-500 hover:bg-red-50 p-2 rounded-lg">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="mt-3">
                    <span className={`text-xs px-2 py-1 rounded ${d.statut === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {d.statut === 'active' ? 'Active' : 'Expirée'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}