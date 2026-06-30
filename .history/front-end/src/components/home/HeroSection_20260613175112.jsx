import { useState, useEffect } from 'react';
import api from '../../api/axios';

export default function HeroSection({ querySubject, setQuerySubject, queryCity, setQueryCity, activeSubjectFilter, setActiveSubjectFilter, onSearchSubmit }) {
  const [isSubjectFocused, setIsSubjectFocused] = useState(false);
  const [isCityFocused, setIsCityFocused] = useState(false);
  const [matieres, setMatieres] = useState([]);
  const [villes, setVilles] = useState([]);

  useEffect(() => {
    api.get('/matieres').then(res => setMatieres(res.data)).catch(console.error);
    api.get('/villes').then(res => setVilles(res.data)).catch(console.error);
  }, []);

  const SUBJECT_PILLS = ['Maths', 'Anglais', 'Arabe', 'Physique', 'Français', 'SVT', 'Code'];

  return (
    <section className="relative pt-32 pb-24 bg-gradient-to-b from-orange-50 to-white overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <span className="text-xs uppercase tracking-wider text-orange-600 font-bold animate-pulse">Soutien Scolaire d'Exception au Maroc</span>
        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mt-4">Trouvez le professeur parfait</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-4">Soutien scolaire certifié, méthodologique et sur-mesure pour les étudiants marocains. Premier cours offert.</p>

        <div className="relative max-w-3xl mx-auto bg-white border p-3 flex flex-col md:flex-row gap-3 rounded-xl shadow-lg mt-8">
          <div className="flex-1 flex items-center gap-3 px-3 relative">
            <i className="bi bi-search text-gray-400"></i>
            <input type="text" value={querySubject} onChange={(e) => setQuerySubject(e.target.value)} className="w-full py-2.5 text-sm outline-none bg-transparent" placeholder="Quelle matière ? (Ex: Maths)" />
          </div>
          <div className="w-px h-8 bg-gray-200 hidden md:block" />
          <div className="flex-1 flex items-center gap-3 px-3 relative">
            <i className="bi bi-geo-alt text-gray-400"></i>
            <input type="text" value={queryCity} onChange={(e) => setQueryCity(e.target.value)} className="w-full py-2.5 text-sm outline-none bg-transparent" placeholder="À Casablanca, Rabat..." />
          </div>
          <button onClick={onSearchSubmit} className="bg-gray-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-700">Rechercher</button>
        </div>

        <div className="mt-6">
          <span className="text-xs text-gray-400 uppercase block mb-3">Accès Rapide</span>
          <div className="flex flex-wrap justify-center gap-2">
            {SUBJECT_PILLS.map(pill => (
              <button key={pill} onClick={() => setQuerySubject(pill)} className="px-4 py-1.5 rounded-full border text-sm bg-white hover:bg-gray-50">
                {pill}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}