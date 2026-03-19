import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { getMessagesHandler, postMessageHandler } from "../controllers/messages.controller";

const router = Router();

router.get('/:id', requireAuth, getMessagesHandler);
router.post('/:id', requireAuth, postMessageHandler);

export default router;
