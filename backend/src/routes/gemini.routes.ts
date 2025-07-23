import { Router } from 'express';
import { handleGemini } from '../controllers/gemini.controller';

const router = Router();

router.post('/', handleGemini);

export default router; 