import Joi from 'joi';

export const createStudentSchema = Joi.object({
  fullName: Joi.string().required(),
  email: Joi.string().email().required(),
  admissionNumber: Joi.string().allow('', null),
  srNo: Joi.string().allow('', null),
  rollNumber: Joi.string().allow('', null),
  gender: Joi.string().valid('Male', 'Female', 'Other'),
  dateOfBirth: Joi.date(),
  parentName: Joi.string().required(),
  parentContact: Joi.string().required(),
  currentClassId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).allow('', null),
  section: Joi.string().allow('', null),
  academicYear: Joi.string().allow('', null),
  address: Joi.object({
    street: Joi.string().allow('', null),
    village: Joi.string().required(),
    city: Joi.string().required(),
    pincode: Joi.string().length(6).required(),
    district: Joi.string().allow('', null),
    state: Joi.string().allow('', null),
    country: Joi.string().default('India')
  })
});

export const updateStudentSchema = Joi.object({
  fullName: Joi.string(),
  email: Joi.string().email(),
  gender: Joi.string().valid('Male', 'Female', 'Other'),
  parentContact: Joi.string(),
  parentName: Joi.string(),
  rollNumber: Joi.string().allow('', null),
  admissionNumber: Joi.string().allow('', null),
  srNo: Joi.string().allow('', null),
  feeStatus: Joi.string().valid('Paid', 'Pending', 'Partial', 'Overdue'),
  currentClassId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).allow('', null),
  isActive: Joi.boolean(),
  address: Joi.object({
    street: Joi.string().allow('', null),
    village: Joi.string(),
    city: Joi.string(),
    pincode: Joi.string().length(6),
    district: Joi.string().allow('', null),
    state: Joi.string().allow('', null)
  })
});
