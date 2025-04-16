import Notice from '../models/Notice.models.js';
import User from '../models/User.models.js'

// Get all notices
export const getAllNotices = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch notices.' });
  }
};

// Create a new notice
export const createNotice = async (req, res) => {
  try {
    console.log("Received body:", req.body); // Debugging

    const { title, message, target, visibleTill } = req.body;

    // Find the user by role 'admin' instead of username
    const user = await User.findOne({ role: 'admin' });  // Adjusted lookup by role
    if (!user) {
      return res.status(400).json({ message: 'Admin user not found.' });
    }

    console.log("Found User:", user);  // Debugging: print the user found

    const newNotice = new Notice({ 
      title, 
      message, 
      target, 
      postedBy: user._id,  // Use the ObjectId here
      visibleTill 
    });

    await newNotice.save();
    console.log("Notice created:", newNotice);  // Debugging the saved notice

    res.status(201).json(newNotice);
  } catch (error) {
    console.error("Error occurred:", error);  // Detailed error logging
    res.status(500).json({ message: 'Failed to create notice.' });
  }
};



// Delete a notice
export const deleteNotice = async (req, res) => {
  try {
    const { id } = req.params;
    await Notice.findByIdAndDelete(id);
    res.json({ message: 'Notice deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete notice.' });
  }
};

// Update a notice
export const updateNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedNotice = await Notice.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedNotice);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update notice.' });
  }
};