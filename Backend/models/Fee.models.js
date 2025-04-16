import mongoose from 'mongoose';

const feeSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['Paid', 'Unpaid', 'Partial'], default: 'Unpaid' },
  paidDate: Date,
  paymentMethod: String
}, { timestamps: true });

const Fee = mongoose.model('Fee', feeSchema);
export default Fee;
