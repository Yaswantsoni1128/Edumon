import express from "express";
import {
  addFee,
  getAllFees,
  getFeesByStudent,
  updateFee,
  deleteFee,
} from "../controllers/Fee.controllers.js";

const router = express.Router();

// Add a new fee record
router.post("/add", addFee);

// Get all fee records
router.get("/", getAllFees);

// Get fee records by student ID
router.get("/student/:studentId", getFeesByStudent);

// Update a fee record
router.put("/update/:id", updateFee);

// Delete a fee record
router.delete("/delete/:id", deleteFee);

export default router;
