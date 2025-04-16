import express from "express";
import {
  addTeacher,
  getAllTeachers,
  updateTeacher,
  deleteTeacher,
} from "../controllers/Teacher.controllers.js";

const router = express.Router();

router.post("/add", addTeacher);
router.get("/all", getAllTeachers);
router.put("/update/:id", updateTeacher);
router.delete("/delete/:id", deleteTeacher);

export default router;
