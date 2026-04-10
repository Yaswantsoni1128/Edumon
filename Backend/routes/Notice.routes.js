import express from 'express';
import { protectAdmin } from '../middlewares/Auth.middlewares.js';
import {
  getAllNotices,
  createNotice,
  deleteNotice,
  updateNotice,
  getStudentNotices,
  getTeacherNotices
} from '../controllers/Notice.controllers.js';

const router = express.Router();

router.get('/', getAllNotices);
router.post('/', protectAdmin, createNotice);
router.delete('/:id', protectAdmin, deleteNotice);
router.put('/:id', protectAdmin, updateNotice);
router.get("/student", getStudentNotices);
router.get("/teacher", getTeacherNotices);

export default router;