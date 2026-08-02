import { Router } from "express";
import {
  getFullProfileDetails,
  getMe,
  getPictures,
  updateProfileDetails,
  addProfilePicture,
  getProfilePicture,
  deleteProfilePicture,
  addPicture,
  deletePicture
} from "../controllers/profile.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { upload } from "../middleware/multer";
 
const router = Router();

router.get('/me', requireAuth, getMe);
router.get('/details', requireAuth, getFullProfileDetails);
router.post('/details', requireAuth, updateProfileDetails);

//profilepicture upload
router.post('/profilepic', requireAuth, upload.single('picture'), addProfilePicture);
router.get('/profilepic', requireAuth, getProfilePicture);
router.delete('/profilepic', requireAuth, deleteProfilePicture);

router.post('/pictures', requireAuth, upload.single('picture'), addPicture);
router.get('/pictures', requireAuth, getPictures);
router.delete('/pictures/:pictureId', requireAuth, deletePicture);

export default router;