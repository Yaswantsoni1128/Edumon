import User from '../models/User.models.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Signup: Only Admins can register directly
export const signupUser = async (req, res) => {
  const { name, email, password, role, contactNumber, schoolName } = req.body;

  try {
    if (role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can register through signup' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      contactNumber,
      schoolName,
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.SECRET_KEY,
      { expiresIn: '1d' }
    );

    res.status(201).json({ user: newUser, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login: Validates email, password, and role
export const loginUser = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check role
    if (user.role !== role) {
      return res.status(403).json({ message: `User does not have ${role} access` });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: '1d' }
    );

    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin-only: Fetch all users
export const getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin-only: Create other users
export const createUserByAdmin = async (req, res) => {
  const { name, email, role, defaultPassword } = req.body;

  try {
    // Authorization check: Only admins can create users
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can create users' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    res.status(201).json({ message: 'User created by admin successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
