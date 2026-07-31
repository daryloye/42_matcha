import { Router } from 'express'; 
import { requireAuth, requireProfileCompleted } from '../middleware/auth.middleware';
import { createChatHandler, getChatHandler } from '../controllers/chat.controller';

const router = Router();

router.post('/send', requireAuth, requireProfileCompleted, createChatHandler);
router.get('/', requireAuth, requireProfileCompleted, getChatHandler);

export default router;