import Teacher from "../models/Teacher.models.js";
import bcrypt from "bcrypt"
import User from "../models/User.models.js";

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
