import { Router } from "express";
import { handleGetOrCreateChat } from "../controllers/chat.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.post("/new", requireAuth, handleGetOrCreateChat);

export default router;
