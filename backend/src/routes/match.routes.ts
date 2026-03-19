import { Router } from "express";
import { updateMatchHandler } from "../controllers/match.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.post('/update', requireAuth, updateMatchHandler);

export default router;