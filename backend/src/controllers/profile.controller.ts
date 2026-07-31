import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import {
  getProfileDetails,
  getProfileMe,
  updateProfile,
  addProfilePicture,
  setProfilePicture,
  deleteProfilePicture,
  getProfilePictures,
  updateUserInterests,
  getPictureCount,
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
            location_city,
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
            location_city
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

export const uploadProfilePicture = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    if (!req.file) {
      res.status(400).json({ error: "No file provided" });
      return;
    }
    
    const currentImageCount = await getPictureCount(userId);
    if (currentImageCount >= 5){
      res.status(400).json({
        message: "Image limit reached (maximum 5 images)",
      });
    }
    const isFirstPicture = (currentImageCount === 0);
    
    const imageUrl = `/uploads/${req.file.filename}`;
    const newPicture = await addProfilePicture(userId, imageUrl, isFirstPicture);
    res.status(200).json({
      message: "Picture uploaded successfully",
      picture: newPicture,
    });
  } catch (error) {
    console.error("upload error: ", error);
    res.status(500).json({ error: "Internal server error during upload" });
  }
};

export const setPrimaryPicture = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user!.userId;

    const pictureId = req.params.pictureId as string;
    if (!pictureId) {
      res.status(404).json({ error: "Picture ID is required" });
      return;
    }

    const picture = await setProfilePicture(userId, pictureId);
    if (!picture) {
      res.status(404).json({ error: "Picture not found" });
      return;
    }
    res.status(200).json({
      message: "Profile picture updated successfully",
      picture,
    });
  } catch (error) {
    console.error("set profile picture error: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const removePicture = async (
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

    const deleted = await deleteProfilePicture(userId, pictureId);
    if (!deleted) {
      res.status(404).json({ error: "Picture not found" });
      return;
    }
    if (!deleted.image_url.startsWith('http://') && !deleted.image_url.startsWith('https://')) {
      fs.rmSync(process.cwd() + deleted.image_url);
    }

    res.status(200).json({ message: "Picture deleted successfully" });
  } catch (error) {
    console.error("delete picture error: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getPictures = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const pictures = await getProfilePictures(userId);

    res.status(200).json({
      message: "Pictures retrieved successfully",
      pictures,
    });
  } catch (error) {
    console.error("get pictures error: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
