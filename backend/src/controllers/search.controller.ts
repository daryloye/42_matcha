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
    const userId = req.user!.userId;
    const userProfile = await getProfileDetails(userId);
    const tags = req.query.tags ? (req.query.tags as string).split(',').map(tag => tag.trim()) : null;

    const rows = await getReommendedProfiles(userId, tags);
    if (!rows) {
      res.status(200).json({ profiles: [] });
      return;
    }

    const userHasLocation =
      userProfile.latitude !== null && userProfile.longitude !== null;

    const profiles: RecommendedProfile[] = rows.map((row) => {
      const profileHasLocation =
        row.latitude !== null && row.longitude !== null;

      const distance =
        userHasLocation && profileHasLocation
          ? calculateDistance(
              userProfile.latitude,
              userProfile.longitude,
              row.latitude!,
              row.longitude!,
            )
          : null;

      return {
        id: row.id,
        first_name: row.first_name,
        last_name: row.last_name,
        gender: row.gender,
        fame_rating: row.fame_rating,
        profile_pic: row.profile_pic,
        common_tags_count: row.common_tags_count,
        interests: row.interests,
        distance,
        latitude: row.latitude,
        longitude: row.longitude,
        age: getAge(row.date_of_birth),
      };
    });

    const sortBy = req.query.sortBy as string | undefined;

    profiles.sort((a, b) => {
      // profiles with null distance should go last
      if (sortBy === "age") return a.age - b.age;
      if (sortBy === "fame_rating") return b.fame_rating - a.fame_rating;
      if (sortBy === "common_tags")
        return b.common_tags_count - a.common_tags_count;
      if (a.distance === null) return 1;
      if (b.distance === null) return -1;
      return a.distance - b.distance; // closest first
    });

    const maxDistance = req.query.maxDistance
      ? parseFloat(req.query.maxDistance as string)
      : null;
    const minAge = req.query.minAge
      ? parseInt(req.query.minAge as string)
      : null;
    const maxAge = req.query.maxAge
      ? parseInt(req.query.maxAge as string)
      : null;
    const minFame = req.query.minFame
      ? parseInt(req.query.minFame as string)
      : null;
    const maxFame = req.query.maxFame
      ? parseInt(req.query.maxFame as string)
      : null;
    const minCommonTags = req.query.minCommonTags
      ? parseInt(req.query.minCommonTags as string)
      : null;

    let filteredProfiles = maxDistance
      ? profiles.filter(
          (profile) =>
            profile.distance !== null && profile.distance <= maxDistance,
        )
      : profiles;
    if (minAge !== null) {
      filteredProfiles = filteredProfiles.filter(
        (profile) => profile.age >= minAge,
      );
    }
    if (maxAge !== null) {
      filteredProfiles = filteredProfiles.filter(
        (profile) => profile.age <= maxAge,
      );
    }
    if (minFame !== null) {
      filteredProfiles = filteredProfiles.filter(
        (profile) => profile.fame_rating >= minFame,
      );
    }
    if (maxFame !== null) {
      filteredProfiles = filteredProfiles.filter(
        (profile) => profile.fame_rating <= maxFame,
      );
    }
    if (minCommonTags !== null) {
      filteredProfiles = filteredProfiles.filter(
        (profile) => profile.common_tags_count >= minCommonTags,
      );
    }
    res.status(200).json({ profiles: filteredProfiles });
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
    const userId = req.user!.userId;
    const userProfile = await getProfileDetails(userId);

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

    const userHasLocation =
      userProfile.latitude !== null && userProfile.longitude !== null;

    const profileHasLocation =
      profile.latitude !== null && profile.longitude !== null;

    profile.distance =
      userHasLocation && profileHasLocation
        ? calculateDistance(
          userProfile.latitude,
          userProfile.longitude,
          profile.latitude!,
          profile.longitude!,
        )
        : null;

    profile.age = getAge(profile.date_of_birth);
    profile.online = profile.last_seen
      ? (new Date().getTime() - new Date(profile.last_seen).getTime() < 15000) 
      : false;    // offline if last seen more than 15 seconds ago

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
