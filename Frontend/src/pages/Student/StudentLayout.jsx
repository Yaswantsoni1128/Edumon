import React from 'react';
import { Outlet } from 'react-router-dom';
import StudentSideBar from './StudentSideBar';

const StudentLayout = () => {
  return (
    <div className='flex'>
      <StudentSideBar />
      <div className='flex-1 p-6 bg-gray-100 w-full'>
        <Outlet /> {/* Renders the nested routes */}
      </div>
    </div>
  );
};

export default StudentLayout;
