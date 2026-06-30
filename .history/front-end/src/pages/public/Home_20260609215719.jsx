// src/pages/public/Home.jsx
import HeroSection from '../../components/home/HeroSection';
import FeaturesSection from '../../components/home/FeaturesSection';
import HowItWorks from '../../components/home/HowItWorks';
import TeachersSection from '../../components/home/TeachersSection';
import TestimonialsSection from '../../components/home/TestimonialsSection';
import CTASection from '../../components/home/CTASection';
import FaqSection from '../../components/home/FaqSection';

function Home() {
  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <HowItWorks />
      <TeachersSection />
      <TestimonialsSection />
      <CTASection />
      <FaqSection />
    </div>
  );
}

export default Home;