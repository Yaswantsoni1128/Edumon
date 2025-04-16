import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  subject: String,
  class: { type: String, required: true },
  dueDate: Date,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true }
}, { timestamps: true });

const Assignment = mongoose.model('Assignment', assignmentSchema);
export default Assignment;
