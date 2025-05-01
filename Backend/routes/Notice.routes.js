import express from 'express';
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
router.post('/', createNotice);
router.delete('/:id', deleteNotice);
router.put('/:id', updateNotice);
router.get("/student", getStudentNotices);
router.get("/teacher", getTeacherNotices);

export default router;