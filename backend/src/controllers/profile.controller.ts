import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import {
  createBlankProfile,
  getProfileByUserId,
  getProfileDetails,
  getProfileMe,
  updateProfile,
  addProfilePicture,
  setProfilePicture,
  deleteProfilePicture,
  getProfilePictures,
  updateUserInterests,
} from "../models/profile.model";
import { updateUser } from '../models/user.model';


// 1. Get userId from authenticated user
// 2. Get profile data from request body
// 3. Check if profile already exists
// 4. Create blank profile if doesn't exist

// 5. Update profile with provided data
// 6. Return updated profile

export const completeProfile = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: "user not authenticated" });
      return;
    }
    const {
      gender,
      sexual_preference,
      biography,
      latitude,
      longitude,
      location_city,
    } = req.body;
    let profile = await getProfileByUserId(userId);
    if (!profile) {
      await createBlankProfile(userId);
    }
    profile = await updateProfile(userId, {
      gender,
      sexual_preference,
      biography,
      latitude,
      longitude,
      location_city,
    });
    res
      .status(200)
      .json({ message: "Profile completed successfully", profile });
  } catch (error) {
    console.error("complete profile error: ", error);
    res.status(500).json({ error: "failed to complete profile" });
  }
};

/*
1. Get userId from req.user (set by requireAuth middleware)
2. Check if userId exists
3. Get profile from database using getProfileByUserId(userId)
4. Check if profile exists
5. If no profile → return 404 error
6. If profile exists → return it
*/
export const getOwnerProfile = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: "user not authenticated" });
      return;
    }
    const userProfile = await getProfileByUserId(userId);
    if (!userProfile) {
      res.status(404).json({ error: "user profile does not exist" });
      return;
    }
    res
      .status(200)
      .json({ message: "Owner's Profile returnted successfully", userProfile });
  } catch (error) {
    console.error("error getting owner", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/*Get userId from req.user
Get update data from req.body
Call updateProfile(userId, data)
Return updated profile*/

export const updateOwnProfile = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: "user not authenticated" });
      return;
    }

    const {
      gender,
      sexual_preference,
      biography,
      latitude,
      longitude,
      location_city,
    } = req.body;
    const profile = await updateProfile(userId, {
      gender,
      sexual_preference,
      biography,
      latitude,
      longitude,
      location_city,
    });

    if (!profile) {
      res.status(404).json({ error: "Profile not found" });
      return;
    }
    res.status(200).json({ message: "Profile updated successfully", profile });
  } catch (error) {
    console.error("error getting owner", error);
    res.status(500).json({ error: "internal server error" });
  }
};

/*Get userId from req.user
Check it exists
Call the model function
Handle null case
Return result

{
  firstname,
  lastname,
  username,
  picture,
  isProfileCompleted
}

*/

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: "user not authenticated" });
      return;
    }
    const profile = await getProfileMe(userId);

    if (!profile) {
      res.status(404).json({ error: "user profile does not exist" });
      return;
    }
    res
      .status(200)
      .json({ message: "Owner's Profile returnted successfully", profile });
  } catch (error) {
    console.error("error getting owner", error);
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
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: "user not authenticated" });
      return;
    }

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

export const uploadProfilePicture = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }
    if (!req.file) {
      res.status(400).json({ error: "No file provided" });
      return;
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    const newPicture = await addProfilePicture(userId, imageUrl);
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
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: "User not authententicated" });
      return;
    }

    const pictureId = req.params.pictureId as string;
    if (!pictureId) {
      res.status(404).json({ error: "Picture ID is required" });
      return;
    }

    const picture = await setProfilePicture(userId, pictureId);
    if (!picture) {
      res.status(404).json({ error: "Picture is not found" });
      return;
    }
    res.status(200).json({
      message: "Profile. picture updated successfully",
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
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

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
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

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

export const updateProfileDetails = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        if(!userId){
            res.status(401).json({ error: 'User not authenticated' });
            return;
        }

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
}