import React from 'react'
import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-ink text-canvas/60 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <h3 className="text-xl font-black text-canvas tracking-tight">
              Learn<span className="text-accent-orange">ect</span>
            </h3>
            <p className="text-sm leading-relaxed">
              Soutien scolaire certifié et méthodologique pour les étudiants marocains. Trouvez le professeur parfait près de chez vous.
            </p>
          </div>

          <div>
            <h4 className="text-canvas font-semibold text-sm mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/#tutors-section" className="hover:text-canvas transition-colors">Nos professeurs</a></li>
              <li><a href="/#how-it-works" className="hover:text-canvas transition-colors">Comment ça marche</a></li>
              <li><a href="/#faq-section" className="hover:text-canvas transition-colors">FAQ</a></li>
              <li><Link to="/register" className="hover:text-canvas transition-colors">Devenir tuteur</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-canvas font-semibold text-sm mb-4">Légal</h4>
            <ul className="space-y-2 text-sm">
              <li><span className="hover:text-canvas transition-colors cursor-pointer">Conditions d'utilisation</span></li>
              <li><span className="hover:text-canvas transition-colors cursor-pointer">Politique de confidentialité</span></li>
              <li><span className="hover:text-canvas transition-colors cursor-pointer">Mentions légales</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-canvas font-semibold text-sm mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-accent-orange" />
                contact@learnect.ma
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-accent-orange" />
                +212 5XX-XXXXXX
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-accent-orange" />
                Casablanca, Maroc
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-canvas/10 mt-12 pt-8 text-center text-xs">
          <p>© 2026 Learnect.ma - Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}