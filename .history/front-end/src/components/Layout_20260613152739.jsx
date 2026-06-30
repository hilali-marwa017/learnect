import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ theme, onToggleTheme }) {
  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink relative transition-colors duration-200">
      <Navbar theme={theme} onToggleTheme={onToggleTheme} />
      <main className="flex-grow pt-16">
        <Outlet />
      </main>
      <Footer onSectionScroll={(sectionId) => {
        const elem = document.getElementById(sectionId);
        if (elem) elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }} />
    </div>
  );
}