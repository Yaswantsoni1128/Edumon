import React from 'react'
import Navbar from '../../components/LandingPage/Navbar'
import Footer from '../../components/LandingPage/Footer'
import { Outlet } from 'react-router-dom'

const LayoutLandingPage = () => {
  return (
    <div>
      <Navbar/>
        <div >
          <Outlet/>
        </div>
      <Footer/>
    </div>
  )
}

export default LayoutLandingPage