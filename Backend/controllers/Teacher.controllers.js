import Teacher from "../models/Teacher.models.js";
import bcrypt from "bcrypt"
import User from "../models/User.models.js";
import mongoose from "mongoose"

export const addTeacher = async (req, res) => {
  try {
    const { name, email, phone, subject, assignedClasses } = req.body;

    const existingTeacher = await Teacher.findOne({email})
    if(existingTeacher){
      return res.status(400).json({message: "Teacher already exists."})
    }

    if (!name || !email) {
      return res.status(400).json({ message: "Name and Email are required" });
    }

    const defaultPassword = phone ;
    const hashedPassword = await bcrypt.hash(defaultPassword , 10)

    // Create user in User collection
        const newUser = new User({
          name,
          email,
          password: hashedPassword,
          role: "teacher",
          contactNumber: phone,
          firstLogin: true,
        });

        await newUser.save();

    const newTeacher = new Teacher({
      name,
      email,
      phone,
      subject,
      assignedClasses
    });

    const savedTeacher = await newTeacher.save();
    res.status(201).json(savedTeacher);
  } catch (error) {
    res.status(500).json({ message: "Failed to add teacher", error });
  }
};


export const getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch teachers", error });
  }
};

export const updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTeacher = await Teacher.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedTeacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.status(200).json(updatedTeacher);
  } catch (error) {
    res.status(500).json({ message: "Failed to update teacher", error });
  }
};

export const deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTeacher = await Teacher.findByIdAndDelete(id);

    if (!deletedTeacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.status(200).json({ message: "Teacher deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete teacher", error });
  }
};


// get teacher by id 

export const getTeacherById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("id:", id);

    // Validate the provided ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid teacher ID format" });
    }

    // Find the user using the provided ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const user_email = user.email;

    // Find teacher using the email associated with the user
    const teacher = await Teacher.findOne({ email: user_email });
    console.log("teacher:", teacher);

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Return the teacher data
    res.status(200).json({
      success: true,
      message: "Teacher profile fetched successfully",
      data: teacher,
    });
  } catch (error) {
    console.error("Error fetching teacher:", error);
    res.status(500).json({ message: "Server error while fetching teacher" });
  }
};
