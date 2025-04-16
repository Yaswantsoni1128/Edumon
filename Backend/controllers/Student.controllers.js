import bcrypt from "bcrypt";
import Student from "../models/Student.models.js";
import User from "../models/User.models.js"; // You forgot to import this

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

    // Create student in Student collection
    const newStudent = new Student({
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
    res.json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ message: "Server error while fetching students" });
  }
};

// Get student by ID
export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);
  } catch (error) {
    console.error("Error fetching student:", error);
    res.status(500).json({ message: "Server error while fetching student" });
  }
};

// Update student
export const updateStudent = async (req, res) => {
  try {
    const { name, email, rollNo, class: studentClass, parentContact } = req.body;

    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    student.name = name || student.name;
    student.email = email || student.email;
    student.rollNo = rollNo || student.rollNo;
    student.class = studentClass || student.class;
    student.parentContact = parentContact || student.parentContact;

    const updatedStudent = await student.save();
    res.json(updatedStudent);
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({ message: "Server error while updating student" });
  }
};

// Delete student
export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    await student.deleteOne();
    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({ message: "Server error while deleting student" });
  }
};
