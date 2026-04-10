import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  
  // Identity
  admissionNumber: { type: String, required: true, unique: true },
  srNo: { type: String, unique: true }, // Serial Number / Scholar Register Number
  rollNumber: { type: String },
  fullName: { type: String, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  dateOfBirth: { type: Date },

  // Academic Mapping
  currentClassId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  section: { type: String },
  academicYear: { type: String },

  // Parent Info
  parentName: { type: String },
  parentContact: { type: String },
  email: { type: String, required: true },

  // Address Details
  address: {
    street: String,
    village: { type: String },
    city: { type: String, required: true },
    pincode: { type: String, required: true },
    district: { type: String },
    state: { type: String },
    country: { type: String, default: 'India' }
  },

  // Fee & Tracking
  feeStatus: { type: String, enum: ['Paid', 'Pending', 'Partial', 'Overdue'], default: 'Pending' },

  // System
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Legacy support virtuals
studentSchema.virtual('name').get(function() { return this.fullName; });
studentSchema.virtual('contactNumber').get(function() { return this.parentContact; });

const Student = mongoose.model('Student', studentSchema);
export default Student;
