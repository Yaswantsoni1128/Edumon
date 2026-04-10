import mongoose from 'mongoose';

const teacherSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  
  // Basic Details
  employeeCode: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  dateOfBirth: { type: Date },
  address: {
    street: String,
    village: { type: String },
    city: { type: String, required: true },
    pincode: { type: String, required: true },
    district: { type: String },
    state: { type: String },
    country: { type: String, default: 'India' }
  },

  // Professional Details
  teacherType: { 
    type: String, 
    enum: ['Primary', 'Upper Primary', 'Secondary', 'Senior Secondary'],
    default: 'Primary'
  },
  designation: { type: String, enum: ['Teacher', 'HOD', 'Coordinator'], default: 'Teacher' },
  department: { type: String },
  joiningDate: { type: Date, default: Date.now },
  employmentStatus: { type: String, enum: ['active', 'onLeave', 'resigned'], default: 'active' },
  experienceYears: { type: Number, default: 0 },

  // Qualification Details
  qualificationDetails: [{
    degreeName: String,
    fieldOfStudy: String,
    institutionName: String,
    passingYear: String
  }],

  // Bank Details
  bankDetails: {
    accountHolderName: String,
    bankName: String,
    accountNumber: String,
    ifscCode: String
  },

  // Salary Details
  salary: {
    fixedAmount: { type: Number, default: 0 }
  },

  // Academic Assignment
  subjectIds: [{ type: String }], // or refs if you have a Subject model
  classIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }],
  classTeacherOf: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },

  // System Fields
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }

}, { timestamps: true });

// Backward compatibility (legacy support)
teacherSchema.virtual('name').get(function() { return this.fullName; });
teacherSchema.virtual('contactNumber').get(function() { return this.phoneNumber; });

const Teacher = mongoose.model('Teacher', teacherSchema);
export default Teacher;
