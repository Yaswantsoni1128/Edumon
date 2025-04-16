import express from 'express';
import {
  getAllNotices,
  createNotice,
  deleteNotice,
  updateNotice,
} from '../controllers/Notice.controllers.js';

const router = express.Router();

router.get('/', getAllNotices);
router.post('/', createNotice);
router.delete('/:id', deleteNotice);
router.put('/:id', updateNotice);

export default router;