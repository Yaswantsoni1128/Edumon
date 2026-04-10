import express from "express";
import {
  createTeacher,
  getAllTeachers,
  updateTeacher,
  deleteTeacher,
  getTeacherById,
  assignTeacherToClass,
  getBulkTemplate,
  bulkUploadTeachers
} from "../controllers/Teacher.controllers.js";
import { protectAdmin } from "../middlewares/Auth.middlewares.js";
import multer from 'multer';

const upload = multer();
const router = express.Router();

router.get('/template', protectAdmin, getBulkTemplate);
router.post('/bulk', protectAdmin, upload.single('file'), bulkUploadTeachers);

router.post("/", protectAdmin, createTeacher);
router.get("/", getAllTeachers);
router.get("/:id", getTeacherById);
router.put("/:id", protectAdmin, updateTeacher);
router.delete("/:id", protectAdmin, deleteTeacher);

// Assignment routes
router.post("/assign", protectAdmin, assignTeacherToClass);

export default router;
