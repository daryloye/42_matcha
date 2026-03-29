import { Router } from "express";
import {
  completeProfile,
  getOwnerProfile,
  updateOwnProfile,
  getFullProfileDetails,
  getMe
} from "../controllers/profile.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.post('/complete-profile', requireAuth, completeProfile);
router.get('/my-profile', requireAuth, getOwnerProfile);

//FE requested end points
router.get('/me', requireAuth, getMe);
router.get('/details', requireAuth, getFullProfileDetails);
router.post('/update', requireAuth, updateOwnProfile);

export default router;
