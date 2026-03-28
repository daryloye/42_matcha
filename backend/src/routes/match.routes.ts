import { Router } from "express";
import { getConnectedUsersHandler, getMatchStatusHandler, updateMatchHandler } from "../controllers/match.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.post('/update', requireAuth, updateMatchHandler);
router.get('/status', requireAuth, getMatchStatusHandler);
router.get('/connected', requireAuth, getConnectedUsersHandler);

export default router;