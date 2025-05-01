import express from 'express';
import { createAssignment , getAssignmentsForStudent } from '../controllers/Assignment.controllers.js';
import { verifyTeacher , protectStudent} from '../middlewares/Auth.middlewares.js'


const router = express.Router();

// Create assignment
router.post('/', verifyTeacher , createAssignment);
router.get('/student',protectStudent, getAssignmentsForStudent);

export default router;
