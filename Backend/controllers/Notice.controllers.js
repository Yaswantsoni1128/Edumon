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

// get students notice 


export const getStudentNotices = async (req, res) => {
  try {
    // Step 1: Retrieve all admin users
    const adminUsers = await User.find({ role: "admin" }).select("_id");
    const adminIds = adminUsers.map(user => user._id);

    // Step 2: Fetch notices posted by admins with target 'All' or 'Students'
    const notices = await Notice.find({
      postedBy: { $in: adminIds },
      target: { $in: ["All", "Students"] }
    })
      .populate("postedBy", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(notices);
  } catch (error) {
    console.error("Error fetching student notices:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// get teachers notices

export const getTeacherNotices = async (req, res) => {
  try {
    // Find all admin users
    const adminUsers = await User.find({ role: "admin" }).select("_id");
    const adminIds = adminUsers.map(user => user._id);

    // Fetch notices posted by admins and visible to teachers
    const notices = await Notice.find({
      postedBy: { $in: adminIds },
      target: { $in: ['All', 'Teachers'] }
    })
      .populate("postedBy", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(notices);
  } catch (error) {
    console.error("Error fetching teacher notices:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
