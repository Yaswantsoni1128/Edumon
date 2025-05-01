import express from "express";
import {
  addStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getStudentProfile,
  getStudentsByClass
} from "../controllers/Student.controllers.js";

const router = express.Router();

router.post("/", addStudent);
router.get("/", getAllStudents);
router.get("/:id", getStudentById);
router.put("/:id", updateStudent);
router.delete("/:id", deleteStudent);
router.get('/profile/:id', getStudentProfile);
router.get("/class/:selectedClass", getStudentsByClass);


export default router;
