import { Bars3Icon, BellIcon, CurrencyRupeeIcon, HomeIcon, UsersIcon, XMarkIcon } from '@heroicons/react/24/outline'
import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const SideBar = () => {
  const [isOpen , setIsOpen] = useState(true)
  const location = useLocation()
  const menuItems = [
    {name: "Dashboard" , path: "/admin/dashboard" , icon: <HomeIcon className='w-6 h-6' />},
    {name: "Students" , path: "/admin/student" , icon: <UsersIcon className='w-6 h-6' />},
    {name: "Teachers" , path: "/admin/teacher" , icon: <UsersIcon className='w-6 h-6' />},
    {name: "Fee" , path: "/admin/fee" , icon: <CurrencyRupeeIcon className='w-6 h-6' />},
    {name: "Notices" , path: "/admin/notice" , icon: <BellIcon className='w-6 h-6' />},
  ]
  return (
    <div className={`flex ${isOpen?"w-64":"w-20"} min-h-screen bg-sky-600 text-white transition-all duration-300`}>
      <div className='flex flex-col w-full'>
        <div className='flex justify-between p-4 '>
            <span className={`text-lg font-semibold ${isOpen?"block":"hidden"}`}>Admin Panel</span>
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

export default SideBar