import Teacher from "../models/Teacher.models.js";
import User from "../models/User.models.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { getPaginatedResponse } from "../utils/pagination.js";
import sendWelcomeEmail from "../utils/MailSender.js";
import { createTeacherSchema, updateTeacherSchema } from "../validations/teacher.validation.js";
import { generateTemplate, parseExcel } from "../utils/excelUtils.js";

// Create Teacher (Production Grade)
export const createTeacher = async (req, res) => {
  try {
    const { error, value } = createTeacherSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { fullName, email, phoneNumber } = value;

    // Uniqueness check
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already registered." });

    // Auto-generate employeeCode if missing
    if (!value.employeeCode) {
      value.employeeCode = `EMP-${Date.now()}`;
    }

    const rawPassword = phoneNumber || "Edumon@123";
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const newUser = new User({
        name: fullName,
        email,
        password: hashedPassword,
        role: "teacher",
        contactNumber: phoneNumber,
        firstLogin: true,
      });
      await newUser.save({ session });

      const newTeacher = new Teacher({
        ...value,
        userId: newUser._id,
        createdBy: req.user?.id || req.user?._id,
      });
      await newTeacher.save({ session });

      await session.commitTransaction();
      
      // Notify
      sendWelcomeEmail(email, fullName, rawPassword).catch(e => console.error("Mail Error:", e));

      res.status(201).json({ success: true, message: "Teacher registered successfully", data: newTeacher });
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  } catch (error) {
    res.status(500).json({ message: error.message || "Registration failed." });
  }
};

// Update Teacher
export const updateTeacher = async (req, res) => {
  try {
    const { error, value } = updateTeacherSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const teacher = await Teacher.findByIdAndUpdate(
      req.params.id, 
      { ...value, updatedBy: req.user?.id || req.user?._id }, 
      { new: true }
    );

    if (!teacher) return res.status(404).json({ message: "Teacher not found." });

    // Sync User details
    if (value.fullName || value.phoneNumber) {
      await User.findByIdAndUpdate(teacher.userId, {
        ...(value.fullName && { name: value.fullName }),
        ...(value.phoneNumber && { contactNumber: value.phoneNumber })
      });
    }

    res.status(200).json({ success: true, data: teacher });
  } catch (error) {
    res.status(500).json({ message: "Update failed." });
  }
};

// Assign Assignments (Classes/Subjects)
export const assignTeacherToClass = async (req, res) => {
  const { teacherId, classIds, subjectIds, classTeacherOf } = req.body;
  try {
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) return res.status(404).json({ message: "Teacher not found." });

    if (classIds) teacher.classIds = classIds;
    if (subjectIds) teacher.subjectIds = subjectIds;
    if (classTeacherOf !== undefined) teacher.classTeacherOf = classTeacherOf;

    await teacher.save();
    res.status(200).json({ success: true, message: "Assignments updated.", data: teacher });
  } catch (error) {
    res.status(500).json({ message: "Assignment failed." });
  }
};

// Get All Teachers (Pagination + Search)
export const getAllTeachers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", department, designation } = req.query;
    const skip = (page - 1) * limit;

    const query = {
      isActive: true,
      ...(search && { 
        $or: [
          { fullName: { $regex: search, $options: "i" } },
          { employeeCode: { $regex: search, $options: "i" } }
        ] 
      }),
      ...(department && { department }),
      ...(designation && { designation })
    };

    const [teachers, total] = await Promise.all([
      Teacher.find(query)
        .populate('classIds', 'displayName')
        .populate('classTeacherOf', 'displayName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Teacher.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      ...getPaginatedResponse(teachers, total, page, limit)
    });
  } catch (error) {
    res.status(500).json({ message: "Fetch failed." });
  }
};

export const getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id)
      .populate('classIds')
      .populate('classTeacherOf')
      .populate('userId', 'role lastLogin');
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });
    res.status(200).json({ success: true, data: teacher });
  } catch (error) {
    res.status(500).json({ message: "Fetch failed" });
  }
};

// Delete Teacher (Soft Delete)
export const deleteTeacher = async (req, res) => {
    try {
        await Teacher.findByIdAndUpdate(req.params.id, { isActive: false });
        res.status(200).json({ success: true, message: "Teacher record archived." });
    } catch (error) {
        res.status(500).json({ message: "Archive failed." });
    }
}

// BULK OPERATIONS
export const getBulkTemplate = async (req, res) => {
    const headers = ["FULL_NAME", "EMAIL", "PHONE_NUMBER", "GENDER", "DATE_OF_BIRTH", "TEACHER_TYPE", "DESIGNATION", "EXPERIENCE_YEARS", "FIXED_SALARY", "STREET", "VILLAGE", "CITY", "PINCODE"];
    const buffer = generateTemplate(headers);
    res.setHeader('Content-Disposition', 'attachment; filename="teacher_template.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
};

export const bulkUploadTeachers = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "No file uploaded" });
        const rows = parseExcel(req.file.buffer);
        const results = { success: 0, skipped: 0, errors: [] };

        for (const row of rows) {
            try {
                const email = String(row.EMAIL || "").trim();
                if (!email) continue;

                const existing = await User.findOne({ email });
                if (existing) {
                    results.skipped++;
                    continue;
                }

                const rawPassword = String(row.PHONE_NUMBER || "Edumon@123");
                const hashedPassword = await bcrypt.hash(rawPassword, 10);

                const session = await mongoose.startSession();
                session.startTransaction();

                try {
                    const newUser = new User({
                        name: row.FULL_NAME,
                        email,
                        password: hashedPassword,
                        role: "teacher",
                        contactNumber: String(row.PHONE_NUMBER),
                        firstLogin: true
                    });
                    await newUser.save({ session });

                    const newTeacher = new Teacher({
                        fullName: row.FULL_NAME,
                        email,
                        phoneNumber: String(row.PHONE_NUMBER),
                        gender: row.GENDER || "Male",
                        dateOfBirth: row.DATE_OF_BIRTH ? new Date(row.DATE_OF_BIRTH) : undefined,
                        teacherType: row.TEACHER_TYPE || "Primary",
                        designation: row.DESIGNATION || "Teacher",
                        experienceYears: Number(row.EXPERIENCE_YEARS || 0),
                        address: {
                            street: row.STREET,
                            village: row.VILLAGE,
                            city: row.CITY,
                            pincode: String(row.PINCODE)
                        },
                        salary: { fixedAmount: Number(row.FIXED_SALARY || 0) },
                        userId: newUser._id,
                        createdBy: req.user?.id,
                        employeeCode: `EMP-${Date.now()}-${results.success}`
                    });
                    await newTeacher.save({ session });

                    await session.commitTransaction();
                    results.success++;
                } catch (err) {
                    await session.abortTransaction();
                    throw err;
                } finally {
                    session.endSession();
                }
            } catch (err) {
                results.errors.push({ row: row.FULL_NAME, error: err.message });
            }
        }
        res.status(200).json({ success: true, message: "Bulk upload completed", data: results });
    } catch (error) {
        res.status(500).json({ message: "Bulk upload failed" });
    }
};
