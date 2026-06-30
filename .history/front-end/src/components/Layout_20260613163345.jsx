import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { useEffect } from 'react';

export default function Layout({ theme, onToggleTheme }) {
  var location = useLocation();
  var navigate = useNavigate();

  useEffect(function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink relative transition-colors duration-200">
      <Navbar theme={theme} onToggleTheme={onToggleTheme} />
      <main className="flex-grow pt-16">
        <Outlet />
      </main>
      <Footer onSectionScroll={function(sectionId) {
        var elem = document.getElementById(sectionId);
        if (elem) elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }} />
    </div>
  );
}