import { Router } from "express";
import { getMatchStatusHandler, updateMatchHandler } from "../controllers/match.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.post('/update', requireAuth, updateMatchHandler);
router.get('/status', requireAuth, getMatchStatusHandler);

export default router;