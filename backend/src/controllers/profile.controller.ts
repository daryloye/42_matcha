import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import {
  getProfileDetails,
  getProfileMe,
  updateProfile,
  updateUserInterests,
  deleteProfilePictureByUserId,
  addProfilePictureByUserId,
  getProfilePictureByUserId,
  getPicturesByUserId,
  getPictureCount,
  addPictureByUserId,
  deletePictureByUserId,
} from "../models/profile.model";
import { updateLastSeen, updateUser } from '../models/user.model';
import fs from 'fs'

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const profile = await getProfileMe(userId);
    if (!profile) {
      res.status(404).json({ error: "user profile does not exist" });
      return;
    }

    await updateLastSeen(userId);
    res.status(200).json({ message: "Owner's Profile returned successfully", profile });
  } catch (error) {
    console.error("error getting profile", error);
    res.status(500).json({ error: "Internal server error" });
  }

  /*
        as requested:

        what gets returned:
        {
            firstname,
            lastname,
            username,
            picture,
            isProfileCompleted
        }
    */
};

export const getFullProfileDetails = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const profile = await getProfileDetails(userId);

    if (!profile) {
      res.status(404).json({ error: "user profile does not exist" });
      return;
    }
    res.status(200).json({ message: "Profile returned successfully", profile });
  } catch (error) {
    console.error("error getting owner", error);
    res.status(500).json({ error: "Internal server error" });
  }
  /*as requested

    what gets returned:

        {
                firstname: "firstname"
                lastname: "lastname"
                email: "user@email.com"
                date_of_birth: "01/01/2000"
                gender: "male"
                preference: "female"
                fame: 10
                biography: "this is my biography"
                interest:
                  - "one"
                  - "two"
                  - "three"
                  - "four"
                  - "five"
                pictures:
                  - "http://localhost:5001/image/profile.jpg"
                  - "http://localhost:5001/image/one.jpg"
                  - "http://localhost:5001/image/two.jpg"
                  - "http://localhost:5001/image/three.jpg"
                  - "http://localhost:5001/image/four.jpg"
                location:
                  latitude: 123
                  longitude: 456
        }*/
};

export const updateProfileDetails = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user!.userId;
        const {
          first_name,
          last_name,
          email,
          gender,
          sexual_preference,
          biography,
          date_of_birth,
          latitude,
          longitude,
          interests
        } = req.body

        await updateUser(userId, { first_name, last_name, email });

        await updateProfile(userId, { 
          gender, 
          sexual_preference, 
          biography, 
          date_of_birth,
          latitude,
          longitude,
        });

        if (interests && Array.isArray(interests)){
          await updateUserInterests(userId, interests);
        }
        
        const profile = await getProfileDetails(userId);

        res.status(200).json({
          message: 'Profile updated successfully',
          profile
        });

    } catch (error) {
      console.error('update profile details error: ', error);
      res.status(500).json({  error: 'Internal server error' });
    }
};

export const addProfilePicture = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    
    if (!req.file) {
      res.status(400).json({ error: "No file provided" });
      return;
    }

    // delete old profile pic
    const oldProfilePic = await deleteProfilePictureByUserId(userId);
    if (oldProfilePic && !oldProfilePic.image_url.startsWith('http://') && !oldProfilePic.image_url.startsWith('https://')) {
      fs.rmSync(process.cwd() + oldProfilePic.image_url);
    }
    
    const imageUrl = `/uploads/${req.file.filename}`;
    const profilePic = await addProfilePictureByUserId(userId, imageUrl);
    res.status(200).json({
      message: "Picture uploaded",
      picture: profilePic,
    });
  } catch (error) {
    console.error("upload error: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getProfilePicture = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    
    const profilePic = await getProfilePictureByUserId(userId);
    res.status(200).json({
      picture: profilePic,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteProfilePicture = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    
    const oldProfilePic = await deleteProfilePictureByUserId(userId);
    if (oldProfilePic && !oldProfilePic.image_url.startsWith('http://') && !oldProfilePic.image_url.startsWith('https://')) {
      fs.rmSync(process.cwd() + oldProfilePic.image_url);
    }

    res.status(200).json({message: "Picture deleted"});
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const addPicture = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    if (!req.file) {
      res.status(400).json({ error: "No file provided" });
      return;
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    
    const currentImageCount = await getPictureCount(userId);
    if (currentImageCount >= 4){
      res.status(400).json({ message: "Image limit reached (maximum 4 images)" });
      fs.rmSync(process.cwd() + imageUrl);
      return;
    }
    
    const picture = await addPictureByUserId(userId, imageUrl);
    res.status(200).json({
      message: "Picture uploaded",
      picture: picture,
    });
  } catch (error) {
    console.error("upload error: ", error);
    res.status(500).json({ error: "Internal server error during upload" });
  }
};

export const getPictures = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    
    const pictures = await getPicturesByUserId(userId);
    res.status(200).json({
      pictures,
    });
  } catch (error) {
    console.error("get pictures error: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deletePicture = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user!.userId;

    const pictureId = req.params.pictureId as string;
    if (!pictureId) {
      res.status(400).json({ error: "Picture ID is required" });
      return;
    }

    const deleted = await deletePictureByUserId(userId, pictureId);
    if (deleted && !deleted.image_url.startsWith('http://') && !deleted.image_url.startsWith('https://')) {
      fs.rmSync(process.cwd() + deleted.image_url);
    }

    res.status(200).json({ message: "Picture deleted" });
  } catch (error) {
    console.error("delete picture error: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
