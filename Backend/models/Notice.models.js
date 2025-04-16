import mongoose from 'mongoose';

const noticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  target: { type: String, enum: ['All', 'Teachers', 'Students'], default: 'All' },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  visibleTill: { type: Date, required: true } 
}, { timestamps: true });

const Notice = mongoose.model('Notice', noticeSchema);
export default Notice;
