import { Router } from "express";
import { markNotificationsReadHandler, getNotificationHandler } from "../controllers/notification.controller"
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.get('/', requireAuth, getNotificationHandler);
router.patch('/read', requireAuth, markNotificationsReadHandler);

export default router;