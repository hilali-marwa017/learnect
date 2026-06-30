import React, { useState } from 'react'
import HeroSection from '../../components/home/HeroSection.jsx'
import StatsSection from '../../components/home/StatsSection.jsx'
import FeaturesSection from '../../components/home/FeaturesSection.jsx'
import HowItWorks from '../../components/home/HowItWorks.jsx'
import TeachersSection from '../../components/home/TeachersSection.jsx'
import FaqSection from '../../components/home/FaqSection.jsx'

export default function Home() {
  const [searchFilters, setSearchFilters] = useState({ subject: null, city: null })

  const handleSearch = (filters) => {
    setSearchFilters(filters)
    document.getElementById('tutors-section')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div>
      <HeroSection onSearch={handleSearch} />
      <StatsSection />
      <FeaturesSection />
      <HowItWorks />
      <TeachersSection searchFilters={searchFilters} />
      <FaqSection />
    </div>
  )
}