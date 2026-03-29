import { Router } from 'express'; 
import { requireAuth } from '../middleware/auth.middleware';
import { getRecommendedSearchHandler, getUserProfileHandler } from '../controllers/search.controller';

const router = Router();

router.get('/', requireAuth, getRecommendedSearchHandler);
router.get('/:id', requireAuth, getUserProfileHandler);

export default router;