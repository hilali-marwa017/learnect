import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'

export default function Layout({ theme, onToggleTheme }) {
  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <Navbar theme={theme} onToggleTheme={onToggleTheme} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}