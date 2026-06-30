import React from 'react';
import { Mail, Phone, MapPin, Heart, Share2, Star, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer({ isDark }) {
  const orange = '#e04f00';
  const currentYear = new Date().getFullYear();

  const scrollToSection = function(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer className="bg-[#0a0a0c] pt-12 pb-6 px-6 border-t border-white/10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl font-bold text-white">Learn<span className="text-[#e04f00]">ect</span>.ma</span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            Soutien scolaire certifié et méthodologique pour les étudiants marocains.
            Trouvez le professeur parfait près de chez vous.
          </p>
          <div className="flex gap-3">
            {[Heart, Share2, Star, Globe].map((Icon, i) => (
              <div key={i} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center cursor-pointer transition-all hover:bg-[#e04f00] hover:-translate-y-0.5">
                <Icon size={14} className="text-white" />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="text-white font-semibold text-sm uppercase tracking-wide mb-4">Navigation</h4>
          <ul className="space-y-2">
            <li><span onClick={() => scrollToSection('tutors-section')} className="text-gray-400 text-sm cursor-pointer hover:text-[#e04f00] transition">Nos professeurs</span></li>
            <li><span onClick={() => scrollToSection('how-it-works')} className="text-gray-400 text-sm cursor-pointer hover:text-[#e04f00] transition">Comment ça marche</span></li>
            <li><span onClick={() => scrollToSection('faq-section')} className="text-gray-400 text-sm cursor-pointer hover:text-[#e04f00] transition">FAQ</span></li>
            <li><Link to="/register" className="text-gray-400 text-sm hover:text-[#e04f00] transition">Devenir tuteur</Link></li>
          </ul>
        </div>

        {/* Légal */}
        <div>
          <h4 className="text-white font-semibold text-sm uppercase tracking-wide mb-4">Légal</h4>
          <ul className="space-y-2">
            <li><Link to="/conditions" className="text-gray-400 text-sm hover:text-[#e04f00] transition">Conditions d'utilisation</Link></li>
            <li><Link to="/confidentialite" className="text-gray-400 text-sm hover:text-[#e04f00] transition">Politique de confidentialité</Link></li>
            <li><Link to="/mentions-legales" className="text-gray-400 text-sm hover:text-[#e04f00] transition">Mentions légales</Link></li>
            <li><Link to="/cookies" className="text-gray-400 text-sm hover:text-[#e04f00] transition">Cookies</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold text-sm uppercase tracking-wide mb-4">Contact</h4>
          <ul className="space-y-3">
            <li className="flex items-center gap-3 text-gray-400 text-sm">
              <Mail size={14} className="text-[#e04f00]" />
              <a href="mailto:contact@learnect.ma" className="hover:text-[#e04f00] transition">contact@learnect.ma</a>
            </li>
            <li className="flex items-center gap-3 text-gray-400 text-sm">
              <Phone size={14} className="text-[#e04f00]" />
              <a href="tel:+212522123456" className="hover:text-[#e04f00] transition">+212 522 123 456</a>
            </li>
            <li className="flex items-center gap-3 text-gray-400 text-sm">
              <MapPin size={14} className="text-[#e04f00]" />
              <span>Casablanca, Maroc</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-6xl mx-auto pt-6 border-t border-white/10 flex flex-wrap justify-between items-center gap-4">
        <div className="text-gray-500 text-xs">© {currentYear} Learnect.ma — Tous droits réservés.</div>
        <div className="flex gap-6 text-xs">
          <Link to="/conditions" className="text-gray-500 hover:text-[#e04f00] transition">CGU</Link>
          <Link to="/confidentialite" className="text-gray-500 hover:text-[#e04f00] transition">Confidentialité</Link>
          <Link to="/mentions-legales" className="text-gray-500 hover:text-[#e04f00] transition">Mentions légales</Link>
        </div>
      </div>
    </footer>
  );
}
export default Footer;