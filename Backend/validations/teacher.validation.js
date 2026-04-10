import Joi from 'joi';

export const createTeacherSchema = Joi.object({
  fullName: Joi.string().required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().required(),
  employeeCode: Joi.string(), // Backend can auto-generate if missing
  gender: Joi.string().valid('Male', 'Female', 'Other'),
  dateOfBirth: Joi.date(),
  teacherType: Joi.string().valid('Primary', 'Upper Primary', 'Secondary', 'Senior Secondary'),
  designation: Joi.string().valid('Teacher', 'HOD', 'Coordinator'),
  department: Joi.string(),
  experienceYears: Joi.number().min(0),
  address: Joi.object({
    street: Joi.string().allow(''),
    village: Joi.string().allow(''),
    city: Joi.string().required(),
    pincode: Joi.string().regex(/^[1-9][0-9]{5}$/).required(),
    district: Joi.string().allow(''),
    state: Joi.string().allow(''),
    country: Joi.string().default('India')
  }),
  salary: Joi.object({
    fixedAmount: Joi.number().min(0)
  }),
  bankDetails: Joi.object({
    accountHolderName: Joi.string(),
    bankName: Joi.string(),
    accountNumber: Joi.string(),
    ifscCode: Joi.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/)
  }),
  qualificationDetails: Joi.array().items(Joi.object({
    degreeName: Joi.string(),
    fieldOfStudy: Joi.string(),
    institutionName: Joi.string(),
    passingYear: Joi.string()
  })),
  classIds: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)),
  subjectIds: Joi.array().items(Joi.string()),
  classTeacherOf: Joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null)
});

export const updateTeacherSchema = Joi.object({
  fullName: Joi.string(),
  phoneNumber: Joi.string(),
  designation: Joi.string().valid('Teacher', 'HOD', 'Coordinator'),
  employmentStatus: Joi.string().valid('active', 'onLeave', 'resigned'),
  isActive: Joi.boolean(),
  address: Joi.object({
    street: Joi.string().allow(''),
    village: Joi.string().allow(''),
    city: Joi.string(),
    pincode: Joi.string().regex(/^[1-9][0-9]{5}$/),
    district: Joi.string().allow(''),
    state: Joi.string().allow(''),
    country: Joi.string()
  }),
  salary: Joi.object({
    fixedAmount: Joi.number().min(0)
  }),
  bankDetails: Joi.object({
    accountHolderName: Joi.string(),
    bankName: Joi.string(),
    accountNumber: Joi.string(),
    ifscCode: Joi.string()
  }),
  classIds: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)),
  subjectIds: Joi.array().items(Joi.string()),
  classTeacherOf: Joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null)
});
