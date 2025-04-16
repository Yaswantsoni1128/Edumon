import React from 'react'
import { Link } from 'react-router-dom'

const HeroSection = () => {
  return (
    <div>
      <section className={`p-5 min-h-[500px] z-10 flex justify-left items-center`}>
          <div className='mt-20 mb-10'>
            <div className='px-20 text-3xl font-semibold flex justify-between items-center'>
              <div className='w-[40%] p-0 flex flex-col gap-3'>
                <p className='text-5xl text-gray-800'>Welcome to Edumon</p>
                <p className='text-gray-700 text-sm w-1/2'>EduMon is a smart school tracking platform that helps parents monitor attendance, assignments, fees, academic progress, and communication seamlessly.</p>
                <button className='mt-5 px-4 py-2 w-fit bg-sky-700 text-lg font-md text-white rounded-xl flex items-center gap-1.5 hover:bg-gray-200 hover:text-sky-700 cursor-pointer'><img src="./right.png" alt="" className='h-8 w-8 rounded-full bg-white'/><Link to={"/login"}>Get Started</Link></button>
              </div>
              <div className='w-auto p-0'>
                <img src="./school_bg.jpg" alt="school" className='rounded-full'/>
              </div>
            </div>
            <div>
            </div>
          </div>
        </section>
    </div>
  )
}

export default HeroSection