import Teacher from "../models/Teacher.models.js";
import bcrypt from "bcrypt";
import User from "../models/User.models.js";
import mongoose from "mongoose";
import { getPaginatedResponse } from "../utils/pagination.js";

import sendWelcomeEmail from "../utils/MailSender.js";

// Add Teacher
export const addTeacher = async (req, res) => {
  try {
    const { name, email, contactNumber, subject, assignedClasses } = req.body;

    // Check if both User and Teacher exist (using email)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists." });
    }

    const defaultPassword = contactNumber || "Edumon@123"; 
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    // 1. Create User first
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: "teacher",
      contactNumber,
      firstLogin: true,
    });
    await newUser.save();

    // 2. Create Teacher linked to User
    const newTeacher = new Teacher({
      userId: newUser._id,
      name,
      email,
      contactNumber,
      subject,
      assignedClasses
    });

    const savedTeacher = await newTeacher.save();
    
    // 3. Send welcome email
    await sendWelcomeEmail(email, name, defaultPassword);

    res.status(201).json({
      success: true,
      message: "Teacher added successfully and credentials sent to email",
      teacher: savedTeacher
    });
  } catch (error) {
    console.error("Add Teacher Error:", error);
    res.status(500).json({ message: "Failed to add teacher", error: error.message });
  }
};

// Get All Teachers (with pagination)
export const getAllTeachers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const skip = (page - 1) * limit;

    const query = search 
      ? { $or: [{ name: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }] }
      : {};

    const [teachers, total] = await Promise.all([
      Teacher.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Teacher.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      ...getPaginatedResponse(teachers, total, page, limit)
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch teachers", error: error.message });
  }
};

// Update Teacher (now syncs with User)
export const updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, contactNumber, subject, assignedClasses } = req.body;

    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Update User model fields if provided
    if (name || email || contactNumber) {
      await User.findByIdAndUpdate(teacher.userId, {
        ...(name && { name }),
        ...(email && { email }),
        ...(contactNumber && { contactNumber }),
      });
    }

    // Update Teacher model
    const updatedTeacher = await Teacher.findByIdAndUpdate(id, {
      name, email, contactNumber, subject, assignedClasses
    }, { new: true });

    res.status(200).json({
      success: true,
      message: "Teacher updated successfully",
      teacher: updatedTeacher
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update teacher", error: error.message });
  }
};

// Delete Teacher (now also deletes User)
export const deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findById(id);

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Delete both linked records
    await Promise.all([
      User.findByIdAndDelete(teacher.userId),
      Teacher.findByIdAndDelete(id)
    ]);

    res.status(200).json({ success: true, message: "Teacher and associated user deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete teacher", error: error.message });
  }
};


// get teacher by id 

export const getTeacherById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("id:", id);

    // Validate the provided ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid teacher ID format" });
    }

    // Find the user using the provided ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const user_email = user.email;

    // Find teacher using the email associated with the user
    const teacher = await Teacher.findOne({ email: user_email });
    console.log("teacher:", teacher);

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Return the teacher data
    res.status(200).json({
      success: true,
      message: "Teacher profile fetched successfully",
      data: teacher,
    });
  } catch (error) {
    console.error("Error fetching teacher:", error);
    res.status(500).json({ message: "Server error while fetching teacher" });
  }
};
