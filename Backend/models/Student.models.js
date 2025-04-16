import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  rollNo: { type: String, required: true },
  class: String,
  parentContact: String,
  password: {type: String , required: true}
}, { timestamps: true });

const Student = mongoose.model('Student', studentSchema);
export default Student;
