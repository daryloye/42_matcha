import { Router } from "express";
import {
  handleGetMessages,
  handlePostMessage,
} from "../controllers/chat.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.get("/messages", requireAuth, handleGetMessages);
router.post("/messages", requireAuth, handlePostMessage);

export default router;
