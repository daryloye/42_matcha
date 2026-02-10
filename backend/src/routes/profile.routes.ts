import { Router } from 'express'
import { requireAuth } from '../middleware/auth.middleware';
import { completeProfile } from '../controllers/profile.controller';

const router = Router();

router.post('/complete-profile', requireAuth, completeProfile);

export default router;