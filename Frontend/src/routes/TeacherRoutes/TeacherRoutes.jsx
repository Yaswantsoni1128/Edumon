import React from 'react'
import { Route, Routes } from 'react-router-dom'
import TeacherLayout from '../../pages/Teacher/TeacherLayout'
import TeacherDashboard from '../../pages/Teacher/TeacherDashboard'
import TeacherProfile from '../../pages/Teacher/TeacherProfile'
import MarkAttendence from '../../pages/Teacher/MarkAttendence'
import CreateAssignment from '../../pages/Teacher/CreateAssignment'
import TeacherNotices from '../../pages/Teacher/TeacherNotices'

const TeacherRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<TeacherLayout />}>
        <Route path="dashboard" element={<TeacherDashboard />} />
        <Route path='profile/:id' element={<TeacherProfile/>}/>
        <Route path='attendence/:id' element={<MarkAttendence/>}/>
        <Route path='assignment' element={<CreateAssignment/>}/>
        <Route path='notices' element={<TeacherNotices/>}/>
      </Route>
    </Routes>
  )
}

export default TeacherRoutes