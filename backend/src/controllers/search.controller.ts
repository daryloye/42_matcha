import { AuthRequest } from "../middleware/auth.middleware";
import { Response } from "express";
import { getProfileDetails } from "../models/profile.model";
import { getReommendedProfiles, getUserProfile } from "../models/search.model";

export const getRecommendedSearchHandler = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: "user not authenticated" });
      return;
    }

    const userProfile = await getProfileDetails(userId);
    const profiles = await getReommendedProfiles(userId);       // TODO: filter sexual preference

    for (const profile of profiles) {
      profile.distance = 10;                          // TODO: calculate distance to user based on latitude and longitude
      profile.age = getAge(profile.date_of_birth); 
      
      delete profile.latitude;
      delete profile.longitude;
      delete profile.date_of_birth;
    }
    
    res.status(200).json({ profiles } );

  } catch (error) {
    console.error("search error: ", error);
    res.status(500).json({ error: "internal server error" });
  }
};

export const getUserProfileHandler = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: "user not authenticated" });
      return;
    }

    const { id: targetId } = req.params as { id: string };
    if (!targetId) {
      res.status(400).json({ error: "invalid user id" });
      return;
    }

    const profile = await getUserProfile(targetId, userId);
    if (!profile) {
      res.status(400).json({ error: "invalid user id" });
      return;
    }

    profile.distance = 10;                          // TODO: calculate distance to user based on latitude and longitude
    profile.age = getAge(profile.date_of_birth); 
    profile.online = true;                          // TODO: fetch this from db
    profile.last_seen = '';
    
    delete profile.latitude;
    delete profile.longitude;
    delete profile.date_of_birth;
    
    res.status(200).json({ profile } );

  } catch (error) {
    console.error("search user error: ", error);
    res.status(500).json({ error: "internal server error" });
  }
};

function getAge(dateOfBirth: string): number {
  const dob = new Date(dateOfBirth);
  const today = new Date();

  let age = today.getFullYear() - dob.getFullYear();

  const hasHadBirthdayThisYear =
    today.getMonth() > dob.getMonth() ||
    (today.getMonth() === dob.getMonth() &&
     today.getDate() >= dob.getDate());

  if (!hasHadBirthdayThisYear) {
    age--;
  }

  return age;
}