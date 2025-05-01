import express from "express";
import {
  addTeacher,
  getAllTeachers,
  updateTeacher,
  deleteTeacher,
  getTeacherById
} from "../controllers/Teacher.controllers.js";

const router = express.Router();

router.post("/add", addTeacher);
router.get("/all", getAllTeachers);
router.put("/update/:id", updateTeacher);
router.delete("/delete/:id", deleteTeacher);
router.get("/:id", getTeacherById);

export default router;
