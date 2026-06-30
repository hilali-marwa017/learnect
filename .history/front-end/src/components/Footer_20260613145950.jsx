import React from 'react'
import { Globe, Languages, Mail, GraduationCap } from 'lucide-react'

export default function Footer({ onSectionScroll }) {
  return (
    <footer className="bg-canvas border-t border-hairline-strong pt-16 pb-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-16">
          <div className="col-span-1 lg:col-span-2 space-y-4">
            <a href="#" className="font-display-xl text-3xl text-ink tracking-tight flex items-center gap-2 hover:opacity-95 transition-all">
              <GraduationCap className="h-7 w-7 text-accent-orange" />
              <span>Learnect<span className="text-accent-orange font-bold">.ma</span></span>
            </a>
            <p className="text-charcoal text-sm leading-relaxed max-w-sm">
              La plateforme d'élite pour le soutien scolaire personnalisé et l'apprentissage de haut niveau au Maroc.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="p-2 bg-surface-deep/60 rounded-full border border-hairline hover:border-accent-orange text-charcoal hover:text-ink transition-all"><Globe className="h-4 w-4" /></a>
              <a href="#" className="p-2 bg-surface-deep/60 rounded-full border border-hairline hover:border-accent-blue text-charcoal hover:text-ink transition-all"><Languages className="h-4 w-4" /></a>
              <a href="#" className="p-2 bg-surface-deep/60 rounded-full border border-hairline hover:border-accent-yellow text-charcoal hover:text-ink transition-all"><Mail className="h-4 w-4" /></a>
            </div>
          </div>
          <div className="space-y-4">
            <h5 className="text-ink font-semibold text-xs tracking-wider uppercase font-caption">À propos</h5>
            <ul className="space-y-2.5 text-xs text-ash tracking-wide">
              <li><a href="#" className="hover:text-accent-orange transition-colors">Qui sommes-nous</a></li>
              <li><a href="#" className="hover:text-accent-orange transition-colors">Mentions légales</a></li>
              <li><a href="#" className="hover:text-accent-orange transition-colors">Confidentialité</a></li>
              <li><a href="#" className="hover:text-accent-orange transition-colors">Recrutement</a></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h5 className="text-ink font-semibold text-xs tracking-wider uppercase font-caption">Matières</h5>
            <ul className="space-y-2.5 text-xs text-ash tracking-wide">
              <li><button onClick={() => onSectionScroll('tutors-section')} className="hover:text-accent-blue text-left transition-colors">Mathématiques</button></li>
              <li><button onClick={() => onSectionScroll('tutors-section')} className="hover:text-accent-blue text-left transition-colors">Anglais & TOEFL</button></li>
              <li><button onClick={() => onSectionScroll('tutors-section')} className="hover:text-accent-blue text-left transition-colors">Programmation & Code</button></li>
              <li><button onClick={() => onSectionScroll('tutors-section')} className="hover:text-accent-blue text-left transition-colors">Musique & Piano</button></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h5 className="text-ink font-semibold text-xs tracking-wider uppercase font-caption">Assistance</h5>
            <ul className="space-y-2.5 text-xs text-ash tracking-wide">
              <li><a href="#" className="hover:text-accent-yellow transition-colors">Centre d'aide</a></li>
              <li><a href="#" className="hover:text-accent-yellow transition-colors">Contact Support</a></li>
              <li><a href="#" className="hover:text-accent-yellow transition-colors">FAQ Professeurs</a></li>
              <li><a href="#" className="hover:text-accent-yellow transition-colors">FAQ Élèves</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-hairline pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-ash font-caption">
          <p>© {new Date().getFullYear()} Learnect.ma — Precision in Education. Conçu pour le Maroc.</p>
          <div className="flex gap-6 tracking-wide">
            <a href="#" className="hover:text-ink transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-ink transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}