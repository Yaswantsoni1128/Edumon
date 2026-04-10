import mongoose from "mongoose";
import bcrypt from "bcrypt";
import Student from "../models/Student.models.js";
import User from "../models/User.models.js";
import { generateInstitutionalPassword } from "../utils/passwordUtils.js";
import sendWelcomeEmail from "../utils/MailSender.js";
import { getPaginatedResponse } from "../utils/pagination.js";
import xlsx from "xlsx";
import fs from "fs";

// Add Student (Single)
export const addStudent = async (req, res) => {
  try {
    const { name, email, rollNo, class: studentClass, parentContact, fatherName } = req.body;

    if (!name || !email || !rollNo || !fatherName) {
        return res.status(400).json({ message: "Mandatory fields: Name, Email, Father's Name, Roll No." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists." });
    }

    // Generate custom institutional password
    const rawPassword = generateInstitutionalPassword(name, rollNo, fatherName);
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    // 1. Create User in User collection
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: "student",
      contactNumber: parentContact,
      firstLogin: true,
    });
    await newUser.save();

    // 2. Create student linked to User
    const newStudent = new Student({
      userId: newUser._id,
      name,
      email,
      fatherName,
      rollNo,
      class: studentClass,
      parentContact,
      password: hashedPassword, 
    });

    const savedStudent = await newStudent.save();

    // 3. Send credentials via email
    await sendWelcomeEmail(email, name, rawPassword);

    res.status(201).json({
      success: true,
      message: "Student created successfully and credentials sent to email.",
      student: savedStudent,
    });
  } catch (error) {
    console.error("Error adding student:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Bulk Upload Students
export const bulkUploadStudents = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded." });
        }

        const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        const results = { success: 0, failed: 0, errors: [] };

        for (const row of data) {
            try {
                const { Name, Email, RollNo, Class, ParentContact, FatherName } = row;

                if (!Name || !Email || !RollNo || !FatherName) {
                    throw new Error(`Missing mandatory fields for student: ${Name || 'Unknown'}`);
                }

                const existingUser = await User.findOne({ email: Email });
                if (existingUser) throw new Error(`Email ${Email} already registered.`);

                const rawPassword = generateInstitutionalPassword(Name, RollNo.toString(), FatherName);
                const hashedPassword = await bcrypt.hash(rawPassword, 10);

                const newUser = new User({
                    name: Name,
                    email: Email,
                    password: hashedPassword,
                    role: "student",
                    contactNumber: ParentContact,
                    firstLogin: true,
                });
                await newUser.save();

                const newStudent = new Student({
                    userId: newUser._id,
                    name: Name,
                    email: Email,
                    fatherName: FatherName,
                    rollNo: RollNo.toString(),
                    class: Class,
                    parentContact: ParentContact,
                    password: hashedPassword,
                });
                await newStudent.save();

                // Send email synchronously or asynchronously? Async is better for bulk.
                sendWelcomeEmail(Email, Name, rawPassword).catch(e => console.error("Async Mail Fail:", e));

                results.success++;
            } catch (err) {
                results.failed++;
                results.errors.push(err.message);
            }
        }

        res.status(200).json({
            success: true,
            message: `Bulk processing complete. ${results.success} uploaded, ${results.failed} failed.`,
            results
        });

    } catch (error) {
        console.error("Bulk Upload Error:", error);
        res.status(500).json({ message: "Critical error during bulk processing." });
    }
};

// Get all students (with pagination and search)
export const getAllStudents = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", class: studentClass } = req.query;
    const skip = (page - 1) * limit;

    const query = {
      ...(search && { 
        $or: [
          { name: { $regex: search, $options: "i" } }, 
          { rollNo: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } }
        ] 
      }),
      ...(studentClass && { class: studentClass })
    };

    const [students, total] = await Promise.all([
      Student.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Student.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      ...getPaginatedResponse(students, total, page, limit)
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ message: "Server error while fetching students" });
  }
};

// Get student by ID (profile)
export const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid student ID format" });
    }

    // Try finding by _id first, then by userId
    let student = await Student.findById(id);
    if (!student) {
        student = await Student.findOne({ userId: id });
    }

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({
      success: true,
      message: "Student profile fetched successfully",
      data: student,
    });
  } catch (error) {
    console.error("Error fetching student:", error);
    res.status(500).json({ message: "Server error while fetching student" });
  }
};

// Update student (Syncs with User)
export const updateStudent = async (req, res) => {
  try {
    const { name, email, rollNo, class: studentClass, parentContact, fatherName } = req.body;
    const { id } = req.params;

    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Update User model fields
    if (name || email || parentContact) {
        await User.findByIdAndUpdate(student.userId, {
            ...(name && { name }),
            ...(email && { email }),
            ...(parentContact && { contactNumber: parentContact }),
        });
    }

    // Update Student model
    const updatedStudent = await Student.findByIdAndUpdate(id, {
        name, email, rollNo, class: studentClass, parentContact, fatherName
    }, { new: true });

    res.status(200).json({
        success: true,
        message: "Student updated successfully",
        student: updatedStudent
    });
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({ message: "Server error while updating student" });
  }
};

// Delete student (Syncs with User)
export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Delete both linked records
    await Promise.all([
        User.findByIdAndDelete(student.userId),
        Student.findByIdAndDelete(id)
    ]);

    res.status(200).json({ success: true, message: "Student and associated user deleted successfully" });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({ message: "Server error while deleting student" });
  }
};


// Get logged-in student's profile using userId
export const getStudentProfile = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        statusCode: 400,
        success: false,
        message: "Invalid student ID",
      });
    }

    const student = await Student.findOne({ userId: id });

    if (!student) {
      return res.status(404).json({
        statusCode: 404,
        success: false,
        message: "Student profile not found",
      });
    }

    res.status(200).json({
      statusCode: 200,
      success: true,
      message: "Student profile fetched successfully",
      data: student,
    });
  } catch (error) {
    console.error("Error fetching student profile:", error);
    res.status(500).json({
      statusCode: 500,
      success: false,
      message: "Internal server error while fetching profile",
    });
  }
};

// Get students by class
export const getStudentsByClass = async (req, res) => {
  try {
    const { selectedClass } = req.params;

    const students = await Student.find({ class: selectedClass }).sort({ createdAt: -1 });

    if (!students || students.length === 0) {
      return res.status(404).json({
        message: `No students found in class ${selectedClass}`,
      });
    }

    res.status(200).json({
      message: `Students of class ${selectedClass} fetched successfully`,
      data: students,
    });
  } catch (error) {
    console.error("Error fetching students by class:", error);
    res.status(500).json({ message: "Server error while fetching students by class" });
  }
};
