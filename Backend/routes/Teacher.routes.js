import express from "express";
import {
  addTeacher,
  getAllTeachers,
  updateTeacher,
  deleteTeacher,
  getTeacherById
} from "../controllers/Teacher.controllers.js";

import { protectAdmin } from "../middlewares/Auth.middlewares.js";

const router = express.Router();

router.post("/", protectAdmin, addTeacher);
router.get("/", getAllTeachers);
router.put("/:id", protectAdmin, updateTeacher);
router.delete("/:id", protectAdmin, deleteTeacher);
router.get("/:id", getTeacherById);

export default router;
