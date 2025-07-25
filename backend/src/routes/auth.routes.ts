import { Router } from 'express';
import { signup, login, logout, googleAuth } from '../controllers/auth.controller';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.post('/google', googleAuth);

export default router;
