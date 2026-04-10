import Joi from 'joi';

export const createClassSchema = Joi.object({
  schoolId: Joi.string().required(),
  academicYear: Joi.string().required(),
  className: Joi.string().required(),
  section: Joi.string().required(),
  stream: Joi.string().valid('General', 'Science', 'Commerce', 'Arts'),
  medium: Joi.string(),
  board: Joi.string(),
  roomNumber: Joi.string().allow(''),
  shift: Joi.string().valid('Morning', 'Afternoon', 'Evening'),
  classTeacherId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).allow('', null),
  subjects: Joi.array().items(Joi.object({
    subjectName: Joi.string().required(),
    teacherId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).allow('', null)
  }))
});

export const updateClassSchema = Joi.object({
  className: Joi.string(),
  section: Joi.string(),
  academicYear: Joi.string(),
  stream: Joi.string().valid('General', 'Science', 'Commerce', 'Arts'),
  roomNumber: Joi.string().allow(''),
  isActive: Joi.boolean(),
  isArchived: Joi.boolean(),
  classTeacherId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).allow('', null),
  subjects: Joi.array().items(Joi.object({
    subjectName: Joi.string(),
    teacherId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).allow('', null)
  }))
});
