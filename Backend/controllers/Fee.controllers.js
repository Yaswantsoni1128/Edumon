import Fee from "../models/Fee.models.js";
import { getPaginatedResponse } from "../utils/pagination.js";

export const addFee = async (req, res) => {
  try {
    const { student, amount, status, paidDate, paymentMethod } = req.body;

    if (!student || !amount) {
      return res.status(400).json({ message: "Student and amount are required." });
    }

    const newFee = new Fee({
      student,
      amount,
      status,
      paidDate,
      paymentMethod,
    });

    const savedFee = await newFee.save();
    res.status(201).json(savedFee);
  } catch (error) {
    res.status(500).json({ message: "Failed to add fee record", error });
  }
};

export const getAllFees = async (req, res) => {
  try {
    const { page = 1, limit = 8, search = "" } = req.query;
    const skip = (page - 1) * limit;

    const pipeline = [
      {
        $lookup: {
          from: "students",
          localField: "student",
          foreignField: "_id",
          as: "studentInfo"
        }
      },
      { $unwind: "$studentInfo" }
    ];

    if (search) {
      pipeline.push({
        $match: {
          "studentInfo.name": { $regex: search, $options: "i" }
        }
      });
    }

    const [fees, totalResults] = await Promise.all([
      Fee.aggregate([...pipeline, { $sort: { createdAt: -1 } }, { $skip: skip }, { $limit: Number(limit) }]),
      Fee.aggregate([...pipeline, { $count: "total" }])
    ]);

    const total = totalResults[0]?.total || 0;

    // Map studentInfo back to 'student' key to maintain compatibility
    const formattedFees = fees.map(f => ({
      ...f,
      student: f.studentInfo
    }));

    res.status(200).json({
      success: true,
      ...getPaginatedResponse(formattedFees, total, page, limit)
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch fee records", error: error.message });
  }
};

export const getFeesByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const fees = await Fee.find({ student: studentId }).populate("student");

    if (!fees.length) {
      return res.status(404).json({ message: "No fee records found for this student" });
    }

    res.status(200).json(fees);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch student fees", error });
  }
};

export const updateFee = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedFee = await Fee.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedFee) {
      return res.status(404).json({ message: "Fee record not found" });
    }

    res.status(200).json(updatedFee);
  } catch (error) {
    res.status(500).json({ message: "Failed to update fee", error });
  }
};

export const deleteFee = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedFee = await Fee.findByIdAndDelete(id);

    if (!deletedFee) {
      return res.status(404).json({ message: "Fee record not found" });
    }

    res.status(200).json({ message: "Fee record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete fee record", error });
  }
};
