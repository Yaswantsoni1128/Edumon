import express from 'express';
import { 
  createClass, 
  getAllClasses, 
  getClassById, 
  updateClass, 
  assignStudentToClass, 
  removeStudentFromClass,
  deleteClass,
  getBulkTemplate,
  bulkUploadClasses
} from '../controllers/Class.controllers.js';
import { protectAdmin } from '../middlewares/Auth.middlewares.js';
import multer from 'multer';

const upload = multer();
const router = express.Router();

router.get('/template', protectAdmin, getBulkTemplate);
router.post('/bulk', protectAdmin, upload.single('file'), bulkUploadClasses);

router.post('/', protectAdmin, createClass);
router.get('/', getAllClasses);
router.get('/:id', getClassById);
router.put('/:id', protectAdmin, updateClass);
router.delete('/:id', protectAdmin, deleteClass);

// Assignment routes
router.post('/assign-student', protectAdmin, assignStudentToClass);
router.post('/remove-student', protectAdmin, removeStudentFromClass);

export default router;
