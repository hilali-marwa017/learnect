import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { Award, Check, Sparkles } from 'lucide-react';

export default function StudentOffres() {
  const { user } = useAuth();
  const [offres, setOffres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(function() {
    chargerOffres();
  }, []);

  async function chargerOffres() {
    try {
      const response = await api.get('/offres/mes-offres');
      setOffres(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Offres reçues</h1>
          <p className="text-gray-500 text-sm">Propositions des professeurs pour vos demandes</p>
        </div>

        {offres.length === 0 ? (
          <div className="bg-white border rounded-xl p-8 text-center">
            <Award className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">Aucune offre reçue pour le moment</p>
            <Link to="/etudiant/demandes" className="mt-4 inline-block text-orange-500 text-sm font-semibold">Publier une demande</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {offres.map(function(o) {
              return (
                <div key={o.id_offre} className="bg-white border rounded-xl p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">{o.demande?.matiere}</h3>
                      <p className="text-gray-600 text-sm mt-1">De: {o.enseignant?.user?.prenom} {o.enseignant?.user?.nom}</p>
                      <p className="text-gray-600 text-sm">Prix proposé: {o.prix} DH/h</p>
                      <p className="text-gray-500 text-sm mt-2">{o.message}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${o.statut === 'acceptee' ? 'bg-green-100 text-green-700' : o.statut === 'refusee' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {o.statut === 'acceptee' ? 'Acceptée' : o.statut === 'refusee' ? 'Refusée' : 'En attente'}
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