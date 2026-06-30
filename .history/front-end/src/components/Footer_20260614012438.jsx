import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer({ isDark }) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pt-12 pb-6 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Brand */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Learn<span className="text-orange-accent">ect</span>.ma
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Soutien scolaire certifié pour les étudiants marocains.
            Trouvez le professeur parfait près de chez vous.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Navigation</h3>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li>Nos professeurs</li>
            <li>Comment ça marche</li>
            <li>FAQ</li>
            <li>Devenir tuteur</li>
          </ul>
        </div>

        {/* Légal */}
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Légal</h3>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li><Link to="/conditions">Conditions d'utilisation</Link></li>
            <li><Link to="/confidentialite">Confidentialité</Link></li>
            <li><Link to="/mentions-legales">Mentions légales</Link></li>
            <li><Link to="/cookies">Cookies</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Contact</h3>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li className="flex items-center gap-2"><Mail size={14} className="text-orange-accent" /> contact@learnect.ma</li>
            <li className="flex items-center gap-2"><Phone size={14} className="text-orange-accent" /> +212 522 123 456</li>
            <li className="flex items-center gap-2"><MapPin size={14} className="text-orange-accent" /> Casablanca, Maroc</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-800 pt-6 text-center text-xs text-gray-500 dark:text-gray-500">
        © {year} Learnect.ma — Tous droits réservés.
      </div>
    </footer>
  );
}