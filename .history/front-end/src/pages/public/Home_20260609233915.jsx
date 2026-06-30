// src/pages/public/Home.jsx
import HeroSection from '../../components/home/HeroSection';
import FeaturesSection from '../../components/home/FeaturesSection';
import HowItWorks from '../../components/home/HowItWorks';
import TeachersSection from '../../components/home/TeachersSection';
import StatsSection from '../../components/home/StatsSection';
import FaqSection from '../../components/home/FaqSection';

function Home() {
  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <HowItWorks />
      <TeachersSection />
      <StatsSection />
      <FaqSection />
    </div>
  );
}

export default Home;