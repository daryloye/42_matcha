import { Router } from 'express'; 
import { requireAuth, requireProfileCompleted } from '../middleware/auth.middleware';
import { getRecommendedSearchHandler, getUserProfileHandler } from '../controllers/search.controller';

const router = Router();

router.get('/', requireAuth, requireProfileCompleted, getRecommendedSearchHandler);
router.get('/:id', requireAuth, requireProfileCompleted, getUserProfileHandler);

export default router;