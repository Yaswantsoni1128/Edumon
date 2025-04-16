import React from 'react';
import { Outlet } from 'react-router-dom';
import SideBar from './SideBar';

const AdminLayout = () => {
  return (
    <div className='flex'>
      <SideBar />
      <div className='flex-1 p-6 bg-gray-100 w-full'>
        <Outlet /> {/* Renders the nested routes */}
      </div>
    </div>
  );
};

export default AdminLayout;
