import { Router } from "express";
import {
  completeProfile,
  getOwnerProfile,
  updateOwnProfile,
  getFullProfileDetails,
  getMe,
  uploadProfilePicture,
  setPrimaryPicture,
  removePicture,
  getPictures
} from "../controllers/profile.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { upload } from "../middleware/multer";
 
const router = Router();

router.post('/complete-profile', requireAuth, completeProfile);
router.get('/my-profile', requireAuth, getOwnerProfile);

//FE requested end points
router.get('/me', requireAuth, getMe);
router.get('/details', requireAuth, getFullProfileDetails);
router.post('/update', requireAuth, updateOwnProfile);

//profilepicture upload
router.post('/picture', requireAuth, upload.single('picture'), uploadProfilePicture);
router.post('/picture/:pictureId/primary', requireAuth, setPrimaryPicture);
router.delete('/picture/:pictureId', requireAuth, removePicture);
router.get('/pictures', requireAuth, getPictures);

export default router;
