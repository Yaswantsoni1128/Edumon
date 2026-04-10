import express from 'express';
import { loginUser, signupUser, getAllUsers, createUserByAdmin } from '../controllers/User.controllers.js';
import { protectAdmin } from '../middlewares/Auth.middlewares.js';

const router = express.Router();

router.post('/login', loginUser);
router.post('/signup', signupUser);
router.post('/create', protectAdmin, createUserByAdmin); 
router.get('/', protectAdmin, getAllUsers);

export default router;