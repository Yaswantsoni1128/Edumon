import mongoose from 'mongoose';

const classSchema = new mongoose.Schema({
  schoolId: { type: String, required: true },
  academicYear: { type: String, required: true },
  className: { type: String, required: true },
  section: { type: String, required: true },
  displayName: { type: String }, // e.g. "10-A"
  stream: { 
    type: String, 
    enum: ['General', 'Science', 'Commerce', 'Arts'], 
    default: 'General' 
  },
  medium: { type: String, default: 'English' },
  board: { type: String, default: 'CBSE' },

  // Structure
  classTeacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  subjectTeacherIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  studentIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  currentStrength: { type: Number, default: 0 },
  roomNumber: { type: String },
  shift: { type: String, enum: ['Morning', 'Afternoon', 'Evening'], default: 'Morning' },

  // Academic
  subjects: [{
    subjectName: String,
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  timetableId: { type: mongoose.Schema.Types.ObjectId, ref: 'Timetable' },
  examSchemeId: { type: mongoose.Schema.Types.ObjectId, ref: 'ExamScheme' },
  attendanceRequiredPercent: { type: Number, default: 75 },

  // Control
  isActive: { type: Boolean, default: true },
  isArchived: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Unique combination
classSchema.index({ className: 1, section: 1, academicYear: 1 }, { unique: true });

// Auto-generate displayName
classSchema.pre('save', function(next) {
  if (this.className && this.section) {
    this.displayName = `${this.className}-${this.section}`;
  }
  next();
});

const Class = mongoose.model('Class', classSchema);
export default Class;
