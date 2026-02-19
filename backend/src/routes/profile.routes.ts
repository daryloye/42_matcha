import { Router } from "express";
import {
  completeProfile,
  getOthersProfile,
  getOwnerProfile,
  updateOwnProfile,
} from "../controllers/profile.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.get("/me", requireAuth, getOwnerProfile); // /user ? to get name and profile pic
router.get("/update", requireAuth, completeProfile); // to load Profile Page
router.post("/update", requireAuth, updateOwnProfile); // to update Profile Page
router.get("/:id", requireAuth, getOthersProfile);

export default router;
