import { Router } from 'express'; 
import { requireAuth } from '../middleware/auth.middleware';
import { getRecommendedSearchHandler } from '../controllers/search.controller';

const router = Router();

router.get('/', requireAuth, getRecommendedSearchHandler);

export default router;