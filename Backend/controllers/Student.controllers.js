import mongoose from "mongoose";
import bcrypt from "bcrypt";
import Student from "../models/Student.models.js";
import User from "../models/User.models.js";
import Class from "../models/Class.models.js";
import { generateInstitutionalPassword } from "../utils/passwordUtils.js";
import sendWelcomeEmail from "../utils/MailSender.js";
import { getPaginatedResponse } from "../utils/pagination.js";
import { createStudentSchema, updateStudentSchema } from "../validations/student.validation.js";
import { generateTemplate, parseExcel } from "../utils/excelUtils.js";

// Create Student (Production Grade)
export const createStudent = async (req, res) => {
  try {
    const { error, value } = createStudentSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    if (!value.admissionNumber) {
        value.admissionNumber = `ADM-${Date.now()}`;
    }
    const { fullName, email, admissionNumber, currentClassId, parentName, rollNumber, parentContact } = value;

    const [existingUser, existingStudent] = await Promise.all([
      User.findOne({ email }),
      Student.findOne({ admissionNumber })
    ]);

    if (existingUser) return res.status(400).json({ message: "Email already registered." });
    if (existingStudent) return res.status(400).json({ message: "Admission Number already exists." });

    // Use parentName for password if fatherName is missing
    const rawPassword = generateInstitutionalPassword(fullName, rollNumber || "000", parentName || "EDU");
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const newUser = new User({
        name: fullName,
        email,
        password: hashedPassword,
        role: "student",
        contactNumber: parentContact,
        firstLogin: true,
      });
      await newUser.save({ session });

      const newStudent = new Student({
        ...value,
        userId: newUser._id,
        createdBy: req.user?.id || req.user?._id,
      });
      await newStudent.save({ session });

      if (currentClassId) {
        const targetClass = await Class.findById(currentClassId);
        if (targetClass) {
          targetClass.studentIds.push(newStudent._id);
          targetClass.currentStrength += 1;
          await targetClass.save({ session });
        }
      }

      await session.commitTransaction();
      sendWelcomeEmail(email, fullName, rawPassword).catch(e => console.error("Mail Error:", e));
      res.status(201).json({ success: true, message: "Student enrolled successfully", data: newStudent });
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  } catch (error) {
    res.status(500).json({ message: error.message || "Enrollment failed." });
  }
};

// Update Student
export const updateStudent = async (req, res) => {
  try {
    const { error, value } = updateStudentSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const student = await Student.findByIdAndUpdate(req.params.id, { ...value, updatedBy: req.user?.id || req.user?._id }, { new: true });
    if (!student) return res.status(404).json({ message: "Not found." });

    if (value.fullName || value.email || value.parentContact) {
      await User.findByIdAndUpdate(student.userId, {
        ...(value.fullName && { name: value.fullName }),
        ...(value.email && { email: value.email }),
        ...(value.parentContact && { contactNumber: value.parentContact })
      });
    }
    res.status(200).json({ success: true, student });
  } catch (error) { res.status(500).json({ message: "Update failed." }); }
};

// Promote Student
export const promoteStudent = async (req, res) => {
  const { studentId, targetClassId, resetAttendance = true } = req.body;
  try {
    const [student, targetClass] = await Promise.all([Student.findById(studentId), Class.findById(targetClassId)]);
    if (!student || !targetClass) throw new Error("Entity not found.");

    if (student.currentClassId) {
      await Class.findByIdAndUpdate(student.currentClassId, { $pull: { studentIds: studentId }, $inc: { currentStrength: -1 } });
    }

    targetClass.studentIds.push(studentId);
    targetClass.currentStrength += 1;
    await targetClass.save();

    student.currentClassId = targetClassId;
    student.section = targetClass.section;
    student.academicYear = targetClass.academicYear;
    if (resetAttendance) student.attendancePercentage = 0;
    await student.save();

    res.status(200).json({ success: true, message: "Promoted successfully." });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// Get All (Pagination + Filters)
export const getAllStudents = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", classId, gender, feeStatus } = req.query;
    const skip = (page - 1) * limit;
    const query = {
      isActive: true,
      ...(search && { 
        $or: [
            { fullName: { $regex: search, $options: "i" } }, 
            { admissionNumber: { $regex: search, $options: "i" } },
            { srNo: { $regex: search, $options: "i" } }
        ] 
      }),
      ...(classId && { currentClassId: classId }),
      ...(gender && { gender }),
      ...(feeStatus && { feeStatus })
    };
    const [students, total] = await Promise.all([
      Student.find(query).populate('currentClassId', 'displayName').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Student.countDocuments(query)
    ]);
    res.status(200).json({ success: true, ...getPaginatedResponse(students, total, page, limit) });
  } catch (error) { res.status(500).json({ message: "Fetch failed." }); }
};

export const getStudentById = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id).populate('currentClassId');
        res.status(200).json({ success: true, data: student });
    } catch (e) { res.status(500).json({ message: "Error" }); }
};

export const deleteStudent = async (req, res) => {
    try {
        await Student.findByIdAndUpdate(req.params.id, { isActive: false });
        res.status(200).json({ success: true, message: "Deactivated" });
    } catch (e) { res.status(500).json({ message: "Fail" }); }
};

export const getStudentProfile = async (req, res) => {
    try {
        const student = await Student.findOne({ userId: req.params.id }).populate('currentClassId');
        res.status(200).json({ success: true, data: student });
    } catch (e) { res.status(500).json({ message: "Fail" }); }
};

export const getStudentsByClass = async (req, res) => {
    try {
        const students = await Student.find({ currentClassId: req.params.selectedClass });
        res.status(200).json({ success: true, data: students });
    } catch (e) { res.status(500).json({ message: "Fail" }); }
};

// BULK OPERATIONS
export const getBulkTemplate = async (req, res) => {
    const headers = ["FULL_NAME", "EMAIL", "PARENT_NAME", "PARENT_CONTACT", "ADMISSION_NUMBER", "SR_NO", "ROLL_NUMBER", "GENDER", "DATE_OF_BIRTH", "STREET", "VILLAGE", "CITY", "PINCODE"];
    const buffer = generateTemplate(headers);
    res.setHeader('Content-Disposition', 'attachment; filename="student_template.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
};

export const bulkUploadStudents = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "No file uploaded." });
        const rows = parseExcel(req.file.buffer);
        const results = { success: 0, skipped: 0, errors: [] };

        for (const row of rows) {
            try {
                const email = String(row.EMAIL || "").trim();
                if (!email) continue;

                const existingUser = await User.findOne({ email });
                if (existingUser) {
                    results.skipped++;
                    continue;
                }

                const fullName = String(row.FULL_NAME || "");
                const rollNumber = String(row.ROLL_NUMBER || "000");
                const parentName = String(row.PARENT_NAME || "EDU");
                const rawPassword = generateInstitutionalPassword(fullName, rollNumber, parentName);
                const hashedPassword = await bcrypt.hash(rawPassword, 10);

                const session = await mongoose.startSession();
                session.startTransaction();

                try {
                    const newUser = new User({
                        name: fullName,
                        email,
                        password: hashedPassword,
                        role: "student",
                        contactNumber: String(row.PARENT_CONTACT),
                        firstLogin: true,
                    });
                    await newUser.save({ session });

                    const newStudent = new Student({
                        userId: newUser._id,
                        fullName,
                        email,
                        admissionNumber: String(row.ADMISSION_NUMBER || `ADM-${Date.now()}`),
                        srNo: String(row.SR_NO || ""),
                        rollNumber,
                        parentName,
                        parentContact: String(row.PARENT_CONTACT),
                        gender: row.GENDER || "Male",
                        dateOfBirth: row.DATE_OF_BIRTH ? new Date(row.DATE_OF_BIRTH) : undefined,
                        address: {
                            street: row.STREET,
                            village: row.VILLAGE,
                            city: row.CITY,
                            pincode: String(row.PINCODE)
                        },
                        createdBy: req.user?.id
                    });
                    await newStudent.save({ session });

                    await session.commitTransaction();
                    sendWelcomeEmail(email, fullName, rawPassword).catch(e => console.error("Mail fail:", e));
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
        res.status(500).json({ message: "Bulk processing failed." });
    }
};
