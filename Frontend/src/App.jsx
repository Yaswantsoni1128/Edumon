import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage/LandingPage';
import LoginPage from './pages/LoginSignUp/LoginPage';
import SignUpPage from './pages/LoginSignUp/SignUpPage';
import AdminRoutes from './routes/AdminRoutes/AdminRoutes';
import NotFound from './pages/Admin/NotFound';
import Services from './components/Services';
import About from './components/About';
import Home from './components/Home';
import ContactUs from './components/ContactUs';
import LayoutLandingPage from './pages/LandingPage/LayoutLandingPage';
import StudentRoutes from './routes/StudentRoutes/StudentRoutes';
import TeacherRoutes from './routes/TeacherRoutes/TeacherRoutes';

const App = () => {
  return (
      
      <Routes>
        {/* Public Routes */}
        <Route element={<LayoutLandingPage/>}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/*" element={<AdminRoutes />} />
        {/* Student routes */}
        <Route path="/student/*" element={<StudentRoutes />} />
        {/* Teacher routes */}
        <Route path="/teacher/*" element={<TeacherRoutes />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    
  );
};

export default App;
