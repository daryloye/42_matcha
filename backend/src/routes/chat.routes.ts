import { Router } from 'express'; 
import { requireAuth } from '../middleware/auth.middleware';
import { createChatHandler, getChatHandler } from '../controllers/chat.controller';

const router = Router();

router.post('/send', requireAuth, createChatHandler);
router.get('/', requireAuth, getChatHandler);

export default router;