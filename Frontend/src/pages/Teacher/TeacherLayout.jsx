import React from 'react'
import { Outlet } from 'react-router-dom';
import TeacherSideBar from './TeacherSideBar';

const TeacherLayout= () => {
  return (
    <div className='flex'>
      <TeacherSideBar />
      <div className='flex-1 p-6 bg-gray-100 w-full'>
        <Outlet /> {/* Renders the nested routes */}
      </div>
    </div>
  );
};

export default TeacherLayout

