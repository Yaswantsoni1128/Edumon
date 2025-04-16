import React from 'react'
import StudentDashboard from '../../pages/Student/StudentDashboard'
import StudentLayout from '../../pages/Student/StudentLayout'
import { Route, Routes } from 'react-router-dom'

const StudentRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<StudentLayout />}>
        <Route path="dashboard" element={<StudentDashboard />} />
        {/* <Route path="student" element={<StudentManagement />} />
        <Route path="teacher" element={<TeacherManagement />} />
        <Route path="fee" element={<FeeManagement />} />
        <Route path="notice" element={<NoticeManagement />} />
        <Route path="*" element={<NotFound />} /> */}
      </Route>
    </Routes>
  )
}

export default StudentRoutes