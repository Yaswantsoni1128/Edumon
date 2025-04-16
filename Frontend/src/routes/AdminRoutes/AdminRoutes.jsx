import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import AdminDashboard from '../../pages/Admin/AdminDashboard';
import StudentManagement from '../../pages/Admin/StudentManagement';
import TeacherManagement from '../../pages/Admin/TeacherManagement';
import FeeManagement from '../../pages/Admin/FeeManagement';
import NoticeManagement from '../../pages/Admin/NoticeManagement';
import NotFound from '../../pages/Admin/NotFound';
import AdminLayout from '../../pages/Admin/AdminLayout'; // Layout with Sidebar

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="student" element={<StudentManagement />} />
        <Route path="teacher" element={<TeacherManagement />} />
        <Route path="fee" element={<FeeManagement />} />
        <Route path="notice" element={<NoticeManagement />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
