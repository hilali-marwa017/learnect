import { Link } from 'react-router-dom';

export default function Footer({ onSectionScroll }) {
  return (
    <footer className="bg-canvas border-t border-hairline-strong pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-16">
          
          <div className="col-span-1 lg:col-span-2 space-y-4">
            <Link to="/" className="font-display-xl text-2xl text-ink tracking-tight flex items-center gap-2">
              <svg className="h-7 w-7 text-accent-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>
              <span>Learnect<span className="text-accent-orange font-bold">.ma</span></span>
            </Link>
            <p className="text-charcoal text-sm leading-relaxed max-w-sm">La plateforme d'élite pour le soutien scolaire personnalisé, le coaching académique d'excellence au Maroc.</p>
          </div>

          <div className="space-y-4">
            <h5 className="text-ink font-semibold text-xs tracking-wider uppercase font-caption">Matières</h5>
            <ul className="space-y-2.5 text-xs text-ash">
              <li><button onClick={function() { onSectionScroll('tutors-section'); }} className="hover:text-accent-blue cursor-pointer">Mathématiques</button></li>
              <li><button onClick={function() { onSectionScroll('tutors-section'); }} className="hover:text-accent-blue cursor-pointer">Anglais & TOEFL</button></li>
              <li><button onClick={function() { onSectionScroll('tutors-section'); }} className="hover:text-accent-blue cursor-pointer">Programmation & Code</button></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h5 className="text-ink font-semibold text-xs tracking-wider uppercase font-caption">À propos</h5>
            <ul className="space-y-2.5 text-xs text-ash">
              <li><Link to="#" className="hover:text-accent-orange">Qui sommes-nous</Link></li>
              <li><Link to="#" className="hover:text-accent-orange">Mentions légales</Link></li>
              <li><Link to="#" className="hover:text-accent-orange">Confidentialité</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h5 className="text-ink font-semibold text-xs tracking-wider uppercase font-caption">Assistance</h5>
            <ul className="space-y-2.5 text-xs text-ash">
              <li><Link to="#" className="hover:text-accent-yellow">Centre d'aide</Link></li>
              <li><Link to="#" className="hover:text-accent-yellow">Contact Support</Link></li>
              <li><Link to="#" className="hover:text-accent-yellow">FAQ</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-hairline pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-ash">
          <p>© {new Date().getFullYear()} Learnect.ma — Precision in Education. Conçu pour le Maroc.</p>
          <div className="flex gap-6">
            <Link to="#" className="hover:text-ink">Privacy Policy</Link>
            <Link to="#" className="hover:text-ink">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}