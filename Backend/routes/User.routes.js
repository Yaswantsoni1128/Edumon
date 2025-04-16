import express from 'express';
import { loginUser, signupUser, getAllUsers, createUserByAdmin } from '../controllers/User.controllers.js';
const router = express.Router();

router.post('/login', loginUser);
router.post('/signup', signupUser);
router.post('/create', createUserByAdmin); // Admin creates user with default password
router.get('/', getAllUsers);

export default router;