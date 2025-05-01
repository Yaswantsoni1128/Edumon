import jwt from 'jsonwebtoken';
import Teacher from '../models/Teacher.models.js'; // Adjust path as needed
import Student from "../models/Student.models.js"
import User from '../models/User.models.js';

export const verifyTeacher = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract token from header

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Check if the role is teacher
    if (decoded.role !== 'teacher') {
      return res.status(403).json({ message: 'Not authorized as a teacher' });
    }

    // Find the Teacher document using user._id
    const teacher = await Teacher.findOne({ user: decoded._id });

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found for the given user ID' });
    }

    req.user = decoded;      // Contains the decoded user info
    req.teacher = teacher;   // Contains the actual Teacher document (_id, etc.)

    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Protect routes for students by verifying JWT token
export const protectStudent = async (req, res, next) => {
  let token = req.headers.authorization?.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    // Verify the token and extract the user data
    const decoded = jwt.verify(token, process.env.SECRET_KEY); // Replace with your actual secret key

    // Attach the user (without password) to the request object
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = user; // Attach the user data to the request object
    console.log(req.user);

    // Find the associated student based on the userId (assuming 'userId' field in Student model)
    const student = await Student.findOne({ email: user.email }); // Use 'userId' field here
    console.log("student",student)

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    req.student = student; // Attach the student data to the request object

    next(); // Proceed to the next middleware or controller
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};