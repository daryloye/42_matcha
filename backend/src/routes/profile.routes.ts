import { Router } from "express";
import {
  completeProfile,
  getOthersProfile,
  getOwnerProfile,
  updateOwnProfile,
  getFullProfileDetails,
  getMe
} from "../controllers/profile.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

// router.get("/me", requireAuth, getOwnerProfile); // /user ? to get name and profile pic
// router.get("/update", requireAuth, completeProfile); // to load Profile Page
// router.post("/update", requireAuth, updateOwnProfile); // to update Profile Page
// router.get("/:id", requireAuth, getOthersProfile);

router.post('/complete-profile', requireAuth, completeProfile);
router.get('/my-profile', requireAuth, getOwnerProfile);
router.post('/update', requireAuth, updateOwnProfile);

//FE requested end points
router.get('/me', requireAuth, getMe);
router.get('/details', requireAuth, getFullProfileDetails);

router.get('/:id', requireAuth, getOthersProfile);
export default router;
