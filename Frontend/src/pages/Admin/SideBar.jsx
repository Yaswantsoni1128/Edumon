import { AcademicCapIcon, Bars3Icon, BellIcon, CurrencyRupeeIcon, HomeIcon, UsersIcon, XMarkIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline'
import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const SideBar = ({ onCollapse }) => {
  const [isOpen, setIsOpen] = useState(true)
  const location = useLocation()
  const navigate = useNavigate()

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <HomeIcon className='w-6 h-6 outline-none' /> },
    { name: "Students", path: "/admin/student", icon: <UsersIcon className='w-6 h-6 outline-none' /> },
    { name: "Teachers", path: "/admin/teacher", icon: <UsersIcon className='w-6 h-6 outline-none' /> },
    { name: "Fees", path: "/admin/fee", icon: <CurrencyRupeeIcon className='w-6 h-6 outline-none' /> },
    { name: "Notices", path: "/admin/notice", icon: <BellIcon className='w-6 h-6 outline-none' /> },
    { name: "Classes", path: "/admin/classes", icon: <AcademicCapIcon className='w-6 h-6 outline-none' /> },
  ]

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  const toggleSidebar = () => {
    if (window.innerWidth < 768 && onCollapse) {
      onCollapse();
    } else {
      setIsOpen(!isOpen);
    }
  }

  return (
    <div className={`flex flex-col h-screen bg-sky-900 border-r border-sky-800 text-white transition-all duration-300 shadow-2xl z-50 ${isOpen ? "w-72" : "w-20"}`}>
      {/* Sidebar Header */}
      <div className={`flex items-center justify-between py-6 border-b border-sky-800 shrink-0 ${isOpen ? "px-6" : "px-[1.7rem]"}`}>
        <div className={`flex items-center gap-3 ${isOpen ? "flex opacity-100" : "hidden opacity-0"} transition-all duration-300`}>
          <div className="p-1.5 bg-white rounded-lg">
            <img src="/smartSchoolTracker.jpg" alt="logo" className="h-6 w-6 rounded-sm object-cover" />
          </div>
          <span className="text-xl font-black tracking-tighter uppercase whitespace-nowrap">
            EDU<span className="text-sky-400">MON</span>
          </span>
        </div>
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-xl hover:bg-sky-800 transition-colors"
        >
          {isOpen ? <XMarkIcon className='w-6 h-6 md:block hidden' /> : <Bars3Icon className='w-6 h-6' />}
          <XMarkIcon className='w-6 h-6 md:hidden block' />
        </button>
      </div>

      {/* Nav Menu - Vertically Scrollable */}
      <nav className='flex-1 overflow-y-auto px-4 py-6 space-y-2 custom-scrollbar'>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => window.innerWidth < 768 && onCollapse && onCollapse()}
              className={`flex items-center transition-all duration-300 rounded-2xl group ${
                isOpen ? "px-4 gap-4 py-3.5" : "px-[1.75rem] py-3.5"
              } ${
                isActive
                  ? "bg-sky-600 shadow-lg shadow-sky-900/50 text-white"
                  : "text-sky-300 hover:bg-sky-800 hover:text-white"
              }`}
            >
              <div className={`${isActive ? "scale-110" : "group-hover:scale-110"} transition-transform duration-300`}>
                {item.icon}
              </div>
              <span className={`text-[13px] font-black uppercase tracking-widest whitespace-nowrap overflow-hidden transition-all duration-300 ${isOpen ? "w-auto opacity-100" : "w-0 opacity-0"}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer - Logout */}
      <div className='p-4 border-t border-sky-800 shrink-0'>
        <button
          onClick={handleLogout}
          className={`flex items-center transition-all duration-300 rounded-2xl text-red-100 bg-red-500/10 hover:bg-red-500 hover:text-white group ${
            isOpen ? "px-4 gap-4 py-3.5 w-full" : "px-[1.75rem] py-3.5"
          }`}
        >
          <div className="group-hover:scale-110 transition-transform duration-300">
            <ArrowLeftOnRectangleIcon className="w-6 h-6" />
          </div>
          <span className={`text-[13px] font-black uppercase tracking-widest whitespace-nowrap overflow-hidden transition-all duration-300 ${isOpen ? "w-auto opacity-100" : "w-0 opacity-0"}`}>
            Logout
          </span>
        </button>
      </div>
    </div>
  )
}

export default SideBar