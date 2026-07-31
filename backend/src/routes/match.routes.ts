import { Router } from "express";
import { getAccountDataHandler, getConnectedUsersHandler, getMatchStatusHandler, updateMatchHandler } from "../controllers/match.controller";
import { requireAuth, requireProfileCompleted } from "../middleware/auth.middleware";

const router = Router();

router.post('/update', requireAuth, requireProfileCompleted, updateMatchHandler);
router.get('/status', requireAuth, requireProfileCompleted, getMatchStatusHandler);
router.get('/connected', requireAuth, requireProfileCompleted, getConnectedUsersHandler);
router.get('/account', requireAuth, requireProfileCompleted, getAccountDataHandler);

export default router;