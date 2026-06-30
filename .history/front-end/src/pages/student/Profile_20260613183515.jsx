import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { Save, User, Phone, Mail, GraduationCap } from 'lucide-react';

export default function StudentProfile() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    ville: '',
    niveau: '',
    budget: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(function() {
    chargerProfil();
  }, []);

  async function chargerProfil() {
    try {
      const response = await api.get('/etudiant/profile');
      const data = response.data;
      setForm({
        nom: data.user?.nom || '',
        prenom: data.user?.prenom || '',
        email: data.user?.email || '',
        telephone: data.user?.telephone || '',
        ville: data.user?.ville || '',
        niveau: data.niveau || '',
        budget: data.budget || ''
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      await api.put('/etudiant/profile', form);
      setSuccess(true);
      setTimeout(function() { setSuccess(false); }, 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
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
      <div className="max-w-2xl mx-auto px-6">
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Mon Profil</h1>
          <p className="text-gray-500 text-sm">Modifiez vos informations personnelles</p>
        </div>

        <div className="bg-white border rounded-2xl p-6">
          {success && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">
              Profil mis à jour avec succès !
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Prénom</label>
                <input type="text" name="prenom" value={form.prenom} onChange={handleChange} className="w-full border rounded-lg p-2 text-sm" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Nom</label>
                <input type="text" name="nom" value={form.nom} onChange={handleChange} className="w-full border rounded-lg p-2 text-sm" required />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full border rounded-lg p-2 text-sm bg-gray-50" disabled />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Téléphone</label>
              <input type="tel" name="telephone" value={form.telephone} onChange={handleChange} className="w-full border rounded-lg p-2 text-sm" required />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Ville</label>
              <input type="text" name="ville" value={form.ville} onChange={handleChange} className="w-full border rounded-lg p-2 text-sm" required />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Niveau d'études</label>
              <select name="niveau" value={form.niveau} onChange={handleChange} className="w-full border rounded-lg p-2 text-sm">
                <option value="">Sélectionnez</option>
                <option value="Primaire">Primaire</option>
                <option value="Collège">Collège</option>
                <option value="Lycée">Lycée</option>
                <option value="Baccalauréat">Baccalauréat</option>
                <option value="Université">Université</option>
                <option value="Master">Master</option>
                <option value="Doctorat">Doctorat</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Budget max (DH/h)</label>
              <input type="number" name="budget" value={form.budget} onChange={handleChange} className="w-full border rounded-lg p-2 text-sm" />
            </div>

            <button type="submit" disabled={saving} className="w-full bg-gray-900 text-white py-3 rounded-lg font-bold hover:bg-gray-700 disabled:opacity-50 flex items-center justify-center gap-2">
              <Save className="h-4 w-4" />
              {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}