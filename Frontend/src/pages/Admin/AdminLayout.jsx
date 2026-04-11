import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import SideBar from './SideBar';
import { Bars3Icon } from '@heroicons/react/24/outline';

const AdminLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className='flex h-screen overflow-hidden bg-gray-100 relative'>
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar - Responsive */}
      <div className={`
        fixed inset-y-0 left-0 z-50 transform md:relative md:translate-x-0 transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <SideBar onCollapse={() => setIsMobileMenuOpen(false)} />
      </div>

      <div className='flex-1 flex flex-col overflow-hidden'>
        {/* Mobile Header Toggle */}
        <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200">
           <div className="flex items-center gap-2">
            <div className="p-1 bg-sky-600 rounded-lg">
              <img src="/smartSchoolTracker.jpg" alt="logo" className="h-5 w-5 rounded-sm object-cover" />
            </div>
            <span className="text-sm font-black tracking-tighter uppercase">
              EDU<span className="text-sky-600">MON</span>
            </span>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl"
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
        </header>

        <div className='flex-1 overflow-y-auto'>
          <main className='p-4 md:p-6'>
            <Outlet /> {/* Renders the nested routes */}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
