import Assignment from '../models/Assignment.models.js';
import Student from "../models/Student.models.js"

export const createAssignment = async (req, res) => {
  try {
    const { title, description, subject, class: className, dueDate } = req.body;

    // Validation for required fields
    if (!title || !className || !subject || !dueDate) {
      return res.status(400).json({ message: 'Title, class, subject, and due date are required.' });
    }

    // Validation for dueDate
    if (isNaN(new Date(dueDate))) {
      return res.status(400).json({ message: 'Valid due date is required.' });
    }

    // Ensure req.teacher exists
    if (!req.teacher || !req.teacher._id) {
      return res.status(400).json({ message: 'Teacher not found or unauthorized.' });
    }

    // Create a new assignment
    const assignment = new Assignment({
      title,
      description,
      subject,
      class: className,  // 'class' is renamed to className due to keyword conflict
      dueDate,
      createdBy: req.teacher._id  // Using the Teacher document's ID
    });

    // Save the assignment
    const savedAssignment = await assignment.save();
    res.status(201).json(savedAssignment);

  } catch (error) {
    console.error('Error creating assignment:', error);
    res.status(500).json({ message: 'Error creating assignment', error: error.message });
  }
};



//  Get assignments for logged-in student based on their class

// Get assignments for a student based on their class
export const getAssignmentsForStudent = async (req, res) => {
  try {
    // Extract the student class from the authenticated user object
    const studentClass = req.student.class; 
    const student = req.student
    const user = req.user ;
    console.log("user",user)
    console.log("student",student)
    console.log("studentclass",studentClass)
    // Find assignments by the student's class
    const assignments = await Assignment.find({ class: studentClass });

    // Return the assignments as a response
    res.json(assignments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve assignments' });
  }
};