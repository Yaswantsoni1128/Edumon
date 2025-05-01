import mongoose from "mongoose";
import bcrypt from "bcrypt";
import Student from "../models/Student.models.js";
import User from "../models/User.models.js";

// Add Student
// Add Student
export const addStudent = async (req, res) => {
  try {
    const { name, email, rollNo, class: studentClass, parentContact } = req.body;

    const existingStudent = await Student.findOne({
      $or: [{ email }, { rollNo }],
    });

    if (existingStudent) {
      return res.status(400).json({ message: "Student with this email or roll number already exists." });
    }

    const defaultPassword = parentContact;
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    // Create user in User collection
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: "student",
      contactNumber: parentContact,
      firstLogin: true,
    });
    await newUser.save();

    // Create student in Student collection with userId
    const newStudent = new Student({
      userId: newUser._id,
      name,
      email,
      rollNo,
      class: studentClass,
      parentContact,
      password: hashedPassword,
    });

    const savedStudent = await newStudent.save();

    res.status(201).json({
      message: "Student created successfully",
      student: savedStudent,
    });
  } catch (error) {
    console.error("Error adding student:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};


// Get all students
export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ message: "Server error while fetching students" });
  }
};

// Get student by ID
// Get student by userId
export const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("id:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid student ID format" });
    }

    // Find the user using the userId (id param is userId here)
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const user_email = user.email;

    // Find student using email
    const student = await Student.findOne({ email: user_email });
    console.log("student:", student);

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



// Update student
export const updateStudent = async (req, res) => {
  try {
    const { name, email, rollNo, class: studentClass, parentContact } = req.body;
    const { id } = req.params;

    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    student.name = name || student.name;
    student.email = email || student.email;
    student.rollNo = rollNo || student.rollNo;
    student.class = studentClass || student.class;
    student.parentContact = parentContact || student.parentContact;

    const updatedStudent = await student.save();
    res.status(200).json(updatedStudent);
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({ message: "Server error while updating student" });
  }
};

// Delete student
export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    await student.deleteOne();
    res.status(200).json({ message: "Student deleted successfully" });
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
