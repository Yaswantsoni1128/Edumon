import React from 'react'
import Navbar from '../../components/LandingPage/Navbar'
import HeroSection from '../../components/LandingPage/HeroSection'
import Hero2 from '../../components/LandingPage/Hero2'
import Features from '../../components/LandingPage/Features'
import Contact from '../../components/LandingPage/Contact'
import Getintouch from '../../components/LandingPage/Getintouch'
import Footer from '../../components/LandingPage/Footer'

const LandingPage = () => {
  return (
    <div>
      <HeroSection />
      <Hero2 />
      <Features />
      <Contact />
      <Getintouch />
    </div>
  )
}

export default LandingPage