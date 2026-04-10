import React from 'react'
import Navbar from '../../components/LandingPage/Navbar'
import Footer from '../../components/LandingPage/Footer'
import { Outlet } from 'react-router-dom'

const LayoutLandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar/>
      <main className="flex-grow pt-16 md:pt-20">
        <Outlet/>
      </main>
      <Footer/>
    </div>
  )
}

export default LayoutLandingPage
