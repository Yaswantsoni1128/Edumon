import jwt from 'jsonwebtoken';
import Teacher from '../models/Teacher.models.js';
import Student from "../models/Student.models.js"
import User from '../models/User.models.js';

// Protect routes for teachers
export const verifyTeacher = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    if (decoded.role !== 'teacher') {
      return res.status(403).json({ success: false, message: 'Not authorized as a teacher' });
    }

    // Find the Teacher document using userId
    const teacher = await Teacher.findOne({ userId: decoded.id });

    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher profile not found' });
    }

    req.user = decoded;
    req.teacher = teacher;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

// Protect routes for students
export const protectStudent = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const user = await User.findById(decoded.id).select('-password');
    if (!user || user.role !== 'student') {
      return res.status(401).json({ success: false, message: 'Not authorized as a student' });
    }

    const student = await Student.findOne({ userId: user._id });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    req.user = user;
    req.student = student;
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    res.status(401).json({ success: false, message: 'Token is not valid' });
  }
};

// Generic admin protector
export const protectAdmin = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: 'Not authorized' });

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        if (decoded.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Access denied: Admins only' });
        }
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: 'Invalid token' });
    }
}