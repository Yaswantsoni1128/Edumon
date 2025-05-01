import Attendance from '../models/Attendence.models.js';
import Student from '../models/Student.models.js';
import Teacher from '../models/Teacher.models.js';
import User from "../models/User.models.js";

// Create or update a single student's attendance
export const markSingleAttendance = async (req, res) => {
  try {
    const { student, date, status, markedBy, subject } = req.body;

    if (!student || !date || !status || !subject) {
      return res.status(400).json({ message: "student, date, status, and subject are required" });
    }

    const existing = await Attendance.findOne({ student, date, subject });

    if (existing) {
      existing.status = status;
      existing.markedBy = markedBy;
      await existing.save();
      return res.status(200).json({ message: "Attendance updated", data: existing });
    }

    const attendance = new Attendance({ student, date, status, markedBy, subject });
    await attendance.save();

    res.status(201).json({ message: "Attendance marked", data: attendance });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create or update multiple attendance records (bulk)
export const markBulkAttendance = async (req, res) => {
  try {
    const attendanceRecords = req.body; // Expecting an array of records

    if (!Array.isArray(attendanceRecords) || attendanceRecords.length === 0) {
      return res.status(400).json({ error: 'Invalid attendance data' });
    }

    const validRecords = attendanceRecords.filter(record =>
      record.student && record.date && record.status && record.subject
    );

    if (validRecords.length !== attendanceRecords.length) {
      return res.status(400).json({ error: 'All fields (student, date, status, subject) are required for each record' });
    }

    const attendanceToInsert = validRecords.map(record => ({
      student: record.student,
      date: record.date,
      status: record.status,
      markedBy: record.markedBy,
      subject: record.subject,
    }));

    const newAttendances = await Attendance.insertMany(attendanceToInsert);

    res.status(201).json({
      message: 'Attendance marked successfully!',
      data: newAttendances,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to mark attendance' });
  }
};

// Get attendance for a student
export const getAttendanceByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    const user = await User.findOne({ _id: studentId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const student = await Student.findOne({ email: user.email });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const id = student._id;

    const records = await Attendance.find({ student: id })
      .populate('markedBy', 'name email')
      .sort({ date: -1 });

    res.status(200).json(records);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get attendance by date
export const getAttendanceByDate = async (req, res) => {
  try {
    const { date } = req.params;

    const records = await Attendance.find({ date: new Date(date) })
      .populate('student', 'name rollNo class')
      .populate('markedBy', 'name email');

    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get attendance for a specific student on a specific date
export const getStudentAttendanceByDate = async (req, res) => {
  try {
    const { studentId, date } = req.params;

    const record = await Attendance.findOne({ student: studentId, date: new Date(date) })
      .populate('markedBy', 'name email');

    if (!record) {
      return res.status(404).json({ message: "Attendance not found" });
    }

    res.status(200).json(record);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
