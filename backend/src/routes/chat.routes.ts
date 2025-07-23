import { Router } from 'express';
import { saveChat, getChatHistory, deleteChat } from '../controllers/chat.controller';

const router = Router();

router.post('/save', saveChat);
router.get('/history', getChatHistory);
router.delete('/:threadId', deleteChat);

export default router;