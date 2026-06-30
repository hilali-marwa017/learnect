import React from 'react';
import { Mail, Phone, MapPin, Heart, Share2, Star, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

function Footer({ isDark }) {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-400">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand column */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Learn<span className="text-orange-500">ect</span>.ma
            </h2>
            <p className="text-sm leading-relaxed mb-4">
              Soutien scolaire certifié et méthodologique pour les étudiants marocains.
              Trouvez le professeur parfait près de chez vous.
            </p>
            <div className="flex gap-3">
              {[Heart, Share2, Star, Globe].map((Icon, i) => (
                <div
                  key={i}
                  className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-orange-500 hover:text-white hover:-translate-y-1"
                >
                  <Icon size={16} />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation column */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Navigation</h3>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => scrollToSection('tutors-section')}
                  className="text-sm hover:text-orange-500 transition-colors cursor-pointer"
                >
                  Nos professeurs
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('how-it-works')}
                  className="text-sm hover:text-orange-500 transition-colors cursor-pointer"
                >
                  Comment ça marche
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('faq-section')}
                  className="text-sm hover:text-orange-500 transition-colors cursor-pointer"
                >
                  FAQ
                </button>
              </li>
              <li>
                <Link
                  to="/register"
                  className="text-sm hover:text-orange-500 transition-colors"
                >
                  Devenir tuteur
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal column */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Légal</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/conditions"
                  className="text-sm hover:text-orange-500 transition-colors"
                >
                  Conditions d'utilisation
                </Link>
              </li>
              <li>
                <Link
                  to="/confidentialite"
                  className="text-sm hover:text-orange-500 transition-colors"
                >
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link
                  to="/mentions-legales"
                  className="text-sm hover:text-orange-500 transition-colors"
                >
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link
                  to="/cookies"
                  className="text-sm hover:text-orange-500 transition-colors"
                >
                  Cookies
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact column */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm">
                <Mail size={16} className="text-orange-500 shrink-0" />
                <a
                  href="mailto:contact@learnect.ma"
                  className="hover:text-orange-500 transition-colors"
                >
                  contact@learnect.ma
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Phone size={16} className="text-orange-500 shrink-0" />
                <a
                  href="tel:+212522123456"
                  className="hover:text-orange-500 transition-colors"
                >
                  +212 522 123 456
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <MapPin size={16} className="text-orange-500 shrink-0" />
                <span>Casablanca, Maroc</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            © {currentYear} Learnect.ma — Tous droits réservés.
          </p>
          <div className="flex gap-6 text-xs">
            <Link
              to="/conditions"
              className="text-gray-500 hover:text-orange-500 transition-colors"
            >
              CGU
            </Link>
            <Link
              to="/confidentialite"
              className="text-gray-500 hover:text-orange-500 transition-colors"
            >
              Confidentialité
            </Link>
            <Link
              to="/mentions-legales"
              className="text-gray-500 hover:text-orange-500 transition-colors"
            >
              Mentions légales
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;