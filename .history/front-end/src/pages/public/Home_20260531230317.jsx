// src/pages/public/Home.jsx
import HeroSection from '../../components/home/HeroSection';
import StatsSection from '../../components/home/StatsSection';
import HowItWorks from '../../components/home/HowItWorks';
import FeaturesSection from '../../components/home/FeaturesSection';
import TeachersSection from '../../components/home/TeachersSection';
import FaqSection from '../../components/home/FaqSection';

function Home() {
  return (
    <div>
      <HeroSection />
      <StatsSection />
      <HowItWorks />
      <FeaturesSection />
      <FaqSection />
    </div>
  );
}

export default Home;