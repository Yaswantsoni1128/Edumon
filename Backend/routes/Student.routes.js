import express from "express";
import { addStudent, getAllStudents, getStudentById, updateStudent, deleteStudent, getStudentProfile, getStudentsByClass, bulkUploadStudents } from "../controllers/Student.controllers.js";
import { protectAdmin } from "../middlewares/Auth.middlewares.js";
import multer from "multer";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", protectAdmin, addStudent);
router.post("/bulk", protectAdmin, upload.single("file"), bulkUploadStudents);
router.get("/", getAllStudents);
router.get("/:id", getStudentById);
router.put("/:id", protectAdmin, updateStudent);
router.delete("/:id", protectAdmin, deleteStudent);
router.get('/profile/:id', getStudentProfile);
router.get("/class/:selectedClass", getStudentsByClass);


export default router;
