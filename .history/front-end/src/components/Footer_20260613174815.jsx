import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Learnect.ma</h3>
            <p className="text-sm text-gray-600">Plateforme de cours particuliers au Maroc</p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">Matières</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link to="/teachers?matiere=Maths">Mathématiques</Link></li>
              <li><Link to="/teachers?matiere=Anglais">Anglais</Link></li>
              <li><Link to="/teachers?matiere=Français">Français</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">Villes</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link to="/teachers?ville=Casablanca">Casablanca</Link></li>
              <li><Link to="/teachers?ville=Rabat">Rabat</Link></li>
              <li><Link to="/teachers?ville=Marrakech">Marrakech</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">Plateforme</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link to="/register?role=enseignant">Devenir enseignant</Link></li>
              <li><Link to="/login">Se connecter</Link></li>
              <li><Link to="/teachers">Trouver un prof</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-6 text-center text-sm text-gray-500">
          © 2026 Learnect.ma - Tous droits réservés
        </div>
      </div>
    </footer>
  );
}