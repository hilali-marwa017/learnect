import React, { useState, useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout() {
  const [theme, setTheme] = useState(() => localStorage.getItem('learnect_theme') || 'light')
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    localStorage.setItem('learnect_theme', theme)
    if (theme === 'dark') document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }, [theme])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink relative selection:bg-accent-orange selection:text-canvas overflow-x-hidden transition-colors duration-200">
      <Navbar
        onAddTutorClick={() => navigate('/register')}
        theme={theme}
        onToggleTheme={() => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))}
      />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer onSectionScroll={(sectionId) => {
        const elem = document.getElementById(sectionId)
        if (elem) elem.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }} />
    </div>
  )
}