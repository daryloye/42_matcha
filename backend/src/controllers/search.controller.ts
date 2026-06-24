import { AuthRequest } from "../middleware/auth.middleware";
import { Response } from "express";
import { getProfileDetails } from "../models/profile.model";
import { getReommendedProfiles, getUserProfile } from "../models/search.model";
import { calculateDistance } from "../utils/geo";
import { RecommendedProfile } from "../types/search.types";

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
    const rows = await getReommendedProfiles(userId); // TODO: filter sexual preference

    if(!rows){
      res.status(200).json({ profiles: [] });
      return
    }

    const userHasLocation =
      userProfile.latitude !== null && userProfile.longitude !== null;

    const profiles: RecommendedProfile[] = rows.map((row) => {
      const profileHasLocation = row.latitude !== null && row.longitude !== null;

      const distance = userHasLocation && profileHasLocation 
        ? calculateDistance(
            userProfile.latitude,
            userProfile.longitude,
            row.latitude!,
            row.longitude!,
        ) : null;

        return{
          id: row.id,
          first_name: row.first_name,
          last_name: row.last_name,
          gender: row.gender,
          fame_rating: row.fame_rating,
          profile_pic: row.profile_pic,
          interests: row.interests,
          distance,
          age: getAge(row.date_of_birth),
        };
    });

    profiles.sort((a, b) => {
      // profiles with null distance should go last
      if (a.distance === null) return 1;
      if (b.distance === null) return -1;
      return a.distance - b.distance; // closest first
    });
    res.status(200).json({ profiles });
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

    profile.distance = 10; // TODO: calculate distance to user based on latitude and longitude
    profile.age = getAge(profile.date_of_birth);
    profile.online = true; // TODO: fetch this from db
    profile.last_seen = "";

    delete profile.latitude;
    delete profile.longitude;
    delete profile.date_of_birth;

    res.status(200).json({ profile });
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
    (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate());

  if (!hasHadBirthdayThisYear) {
    age--;
  }

  return age;
}
