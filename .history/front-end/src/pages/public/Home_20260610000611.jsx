import Navbar from '../../components/Navbar';
import HeroSection from '../../components/home/HeroSection';
import TeachersSection from '../../components/home/TeachersSection';
import FeaturesSection from '../../components/home/FeaturesSection';
import HowItWorks from '../../components/home/HowItWorks';
import StatsSection from '../../components/home/StatsSection';
import FaqSection from '../../components/home/FaqSection';
import Footer from '../../components/Footer';

function Home() {
  return (
    <div>
      <HeroSection />
      <TeachersSection />      
      <FeaturesSection />
      <HowItWorks />
      <StatsSection />
      <FaqSection />
    </div>
  );
}

export default Home;