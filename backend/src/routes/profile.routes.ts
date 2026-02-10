import { Router } from 'express'
import { requireAuth } from '../middleware/auth.middleware';
import { completeProfile, getOthersProfile, getOwnerProfile, updateOwnProfile } from '../controllers/profile.controller';

const router = Router();

router.post('/complete-profile', requireAuth, completeProfile);
router.get('/my-profile', requireAuth, getOwnerProfile);
router.post('/update', requireAuth, updateOwnProfile);
router.get('/:id', requireAuth, getOthersProfile);

export default router;