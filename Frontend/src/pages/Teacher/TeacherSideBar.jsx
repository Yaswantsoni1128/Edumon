import { Bars3Icon, BellIcon, CurrencyRupeeIcon, HomeIcon, UsersIcon, XMarkIcon } from '@heroicons/react/24/outline'
import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const TeacherSideBar = () => {
  const user = JSON.parse(localStorage.getItem("user")) // Parse the user object from localStorage
    console.log("user:", user)
  
    // Check if the user exists and has the _id property
    const id = user ? user._id : null
    
  const [isOpen , setIsOpen] = useState(true)
  const location = useLocation()
  const menuItems = [
    {name: "Dashboard" , path: "/teacher/dashboard" , icon: <HomeIcon className='w-6 h-6' />},
    {name: "Profile" , path: `/teacher/profile/${id}` , icon: <UsersIcon className='w-6 h-6' />},
    {name: "Mark Attendence" , path: `/teacher/attendence/${id}` , icon: <UsersIcon className='w-6 h-6' />},
    {name: "Create Assignment" , path: "/teacher/assignment" , icon: <CurrencyRupeeIcon className='w-6 h-6' />},
    {name: "Notices" , path: "/teacher/notices" , icon: <BellIcon className='w-6 h-6' />},
  ]
  return (
    <div className={`flex ${isOpen?"w-64":"w-20"} min-h-screen bg-sky-600 text-white transition-all duration-300`}>
      <div className='flex flex-col w-full'>
        <div className='flex justify-between p-4 '>
            <span className={`text-lg font-semibold ${isOpen?"block":"hidden"}`}>Teacher Panel</span>
            <button onClick={()=>setIsOpen(!isOpen)}>
            {isOpen? <XMarkIcon className='w-6 h-6'/> : <Bars3Icon className='w-6 h-6'/>}
            </button>
        </div>
        <nav className='mt-4'>
            {menuItems.map((item)=>(
              <Link key={item.path} to={item.path} className={`flex items-center ${location.pathname === item.path? "bg-sky-800" : "hover:bg-sky-500"} px-4 py-2 rounded-md space-x-4 transition-all duration-200`}>
                {item.icon}
                <span className={`${isOpen?"block":"hidden"}`}>{item.name}</span>
              </Link>
            ))}
        </nav>
      </div>
    </div>
  )
}
export default TeacherSideBar