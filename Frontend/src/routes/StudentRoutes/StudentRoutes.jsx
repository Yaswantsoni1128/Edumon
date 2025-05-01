import React from 'react'
import StudentDashboard from '../../pages/Student/StudentDashboard'
import StudentLayout from '../../pages/Student/StudentLayout'
import { Route, Routes } from 'react-router-dom'
import StudentProfile from '../../pages/Student/StudentProfile'
import Assignment from '../../pages/Student/Assignment'
import Attendence from '../../pages/Student/Attendence'
import StudentNotices from '../../pages/Student/StudentNotices'

const StudentRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<StudentLayout />}>
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="profile/:id" element={<StudentProfile />} />
        <Route path="attendence/:id" element={<Attendence />} />
        <Route path="assignment" element={<Assignment />} />
        <Route path="notices" element={<StudentNotices />} />
      </Route>
    </Routes>
  )
}

export default StudentRoutes
