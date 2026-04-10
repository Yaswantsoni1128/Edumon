import Class from "../models/Class.models.js";
import Student from "../models/Student.models.js";
import { createClassSchema, updateClassSchema } from "../validations/class.validation.js";
import { getPaginatedResponse } from "../utils/pagination.js";
import { generateTemplate, parseExcel } from "../utils/excelUtils.js";
import mongoose from "mongoose";

// Helper to sanitize potentially empty ObjectIds
const sanitizeClassData = (data) => {
    const sanitized = { ...data };
    if (sanitized.classTeacherId === "" || sanitized.classTeacherId === null) {
        delete sanitized.classTeacherId;
    }
    if (sanitized.subjects) {
        sanitized.subjects = sanitized.subjects.map(sub => ({
            ...sub,
            teacherId: (sub.teacherId === "" || sub.teacherId === null) ? undefined : sub.teacherId
        })).filter(sub => sub.subjectName); // Also remove empty subject rows
    }
    return sanitized;
};

// Create Class
export const createClass = async (req, res) => {
  try {
    const { error, value } = createClassSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const sanitizedValue = sanitizeClassData(value);

    const existingClass = await Class.findOne({
      className: sanitizedValue.className,
      section: sanitizedValue.section,
      academicYear: sanitizedValue.academicYear
    });

    if (existingClass) {
      return res.status(400).json({ message: "Class with this section and academic year already exists." });
    }

    const newClass = new Class({
      ...sanitizedValue,
      createdBy: req.user?.id || req.user?._id
    });

    await newClass.save();
    res.status(201).json({ success: true, message: "Class created successfully", data: newClass });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Classes
export const getAllClasses = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", academicYear, stream } = req.query;
    const skip = (page - 1) * limit;

    const query = {
      isArchived: false,
      ...(search && { displayName: { $regex: search, $options: "i" } }),
      ...(academicYear && { academicYear }),
      ...(stream && { stream })
    };

    const [classes, total] = await Promise.all([
      Class.find(query)
        .populate('classTeacherId', 'name email')
        .sort({ className: 1, section: 1 })
        .skip(skip)
        .limit(Number(limit)),
      Class.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      ...getPaginatedResponse(classes, total, page, limit)
    });
  } catch (error) {
    res.status(500).json({ message: "Fetch failed" });
  }
};

// Assign Student to Class
export const assignStudentToClass = async (req, res) => {
  const { classId, studentId } = req.body;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [targetClass, student] = await Promise.all([
      Class.findById(classId),
      Student.findById(studentId)
    ]);

    if (!targetClass || !student) throw new Error("Class or Student not found");
    if (targetClass.studentIds.includes(studentId)) throw new Error("Student already assigned to this class.");

    // Remove from previous class if exists
    if (student.currentClassId) {
      await Class.findByIdAndUpdate(student.currentClassId, {
        $pull: { studentIds: studentId },
        $inc: { currentStrength: -1 }
      }, { session });
    }

    // Add to new class
    targetClass.studentIds.push(studentId);
    targetClass.currentStrength += 1;
    await targetClass.save({ session });

    // Update student
    student.currentClassId = classId;
    student.section = targetClass.section;
    student.academicYear = targetClass.academicYear;
    await student.save({ session });

    await session.commitTransaction();
    res.status(200).json({ success: true, message: "Student assigned successfully" });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ message: error.message });
  } finally {
    session.endSession();
  }
};

// Remove Student from Class
export const removeStudentFromClass = async (req, res) => {
    const { classId, studentId } = req.body;
    try {
        await Promise.all([
            Class.findByIdAndUpdate(classId, {
                $pull: { studentIds: studentId },
                $inc: { currentStrength: -1 }
            }),
            Student.findByIdAndUpdate(studentId, {
                currentClassId: null,
                section: null
            })
        ]);
        res.status(200).json({ success: true, message: "Student removed from class" });
    } catch (error) {
        res.status(500).json({ message: "Operation failed" });
    }
}

export const updateClass = async (req, res) => {
    try {
        const { error, value } = updateClassSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const sanitizedValue = sanitizeClassData(value);

        const updatedClass = await Class.findByIdAndUpdate(req.params.id, {
            ...sanitizedValue,
            updatedBy: req.user?.id || req.user?._id
        }, { new: true });

        res.status(200).json({ success: true, data: updatedClass });
    } catch (error) {
        res.status(500).json({ message: "Update failed" });
    }
}

export const getClassById = async (req, res) => {
    try {
        const classData = await Class.findById(req.params.id)
            .populate('studentIds', 'fullName rollNumber admissionNumber')
            .populate('classTeacherId', 'name email');
        if (!classData) return res.status(404).json({ message: "Class not found" });
        res.status(200).json({ success: true, data: classData });
    } catch (error) {
        res.status(500).json({ message: "Fetch failed" });
    }
}

export const deleteClass = async (req, res) => {
    try {
        const deletedClass = await Class.findByIdAndUpdate(req.params.id, { isArchived: true }, { new: true });
        if (!deletedClass) return res.status(404).json({ message: "Class not found" });
        res.status(200).json({ success: true, message: "Class decommissioned successfully" });
    } catch (error) {
        res.status(500).json({ message: "Decommissioning failed" });
    }
}

// BULK OPERATIONS
export const getBulkTemplate = async (req, res) => {
    const headers = ["CLASS_NAME", "SECTION", "ACADEMIC_YEAR", "STREAM", "MEDIUM", "BOARD", "ROOM_NUMBER", "SHIFT"];
    const buffer = generateTemplate(headers);
    res.setHeader('Content-Disposition', 'attachment; filename="class_template.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
};

export const bulkUploadClasses = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "No file uploaded" });
        const rows = parseExcel(req.file.buffer);
        
        const results = { success: 0, skipped: 0, errors: [] };

        for (const row of rows) {
            try {
                const payload = {
                    schoolId: "SCH-001",
                    className: String(row.CLASS_NAME || ""),
                    section: String(row.SECTION || ""),
                    academicYear: String(row.ACADEMIC_YEAR || ""),
                    stream: row.STREAM || "General",
                    medium: row.MEDIUM || "English",
                    board: row.BOARD || "CBSE",
                    roomNumber: String(row.ROOM_NUMBER || ""),
                    shift: row.SHIFT || "Morning"
                };

                const existing = await Class.findOne({ 
                    className: payload.className, 
                    section: payload.section, 
                    academicYear: payload.academicYear 
                });

                if (existing) {
                    results.skipped++;
                    continue;
                }

                const newClass = new Class({ ...payload, createdBy: req.user?.id });
                await newClass.save();
                results.success++;
            } catch (err) {
                results.errors.push({ row: row.CLASS_NAME, error: err.message });
            }
        }

        res.status(200).json({ success: true, message: "Bulk upload completed", data: results });
    } catch (error) {
        res.status(500).json({ message: "Bulk upload failed" });
    }
};
