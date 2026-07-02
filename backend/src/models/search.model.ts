import { query } from "../config/database";
import { RecommendedProfileRow } from "../types/search.types";

export const getReommendedProfiles = async (
    userId: string,
): Promise<RecommendedProfileRow[] | null> => {
  const sql = `
    SELECT 
      u.id,
      u.first_name,
      u.last_name,
      p.gender,
      p.date_of_birth,
      p.latitude,
      p.longitude,
      p.fame_rating,
      pp.image_url as profile_pic,
      (
        SELECT COUNT(*)
        FROM user_interests ui2
        WHERE ui2.user_id = u.id
        AND ui2.interest_id IN (
          SELECT interest_id
          FROM user_interests
          WHERE user_id = $1
        )
      ) AS common_tags_count,
      JSON_AGG(i.name) as interests
    FROM users u
    left JOIN profiles p ON p.user_id = u.id
    LEFT JOIN profile_pictures pp ON pp.user_id = u.id
    LEFT JOIN user_interests ui ON ui.user_id = u.id
    LEFT JOIN interests i ON i.id = ui.interest_id
    WHERE 
    u.id <> $1
    AND NOT EXISTS (
      SELECT 1
      FROM relationships r
      WHERE r.user_id = u.id
        AND r.target_user_id = $1
        AND r.status = 'block'
    )
    AND (
      (SELECT sexual_preference FROM profiles WHERE user_id = $1) = 'both'
      OR p.gender = (SELECT sexual_preference FROM profiles WHERE user_id = $1)
    )
    AND (
      p.sexual_preference = 'both'
      OR p.sexual_preference = (SELECT gender FROM profiles WHERE user_id = $1)
    )
    GROUP BY u.id, p.id, pp.id;
  `;
  const result = await query(sql, [userId]);
  return result.rows.length > 0 ? result.rows : null;
};

export const getUserProfile = async (
    targetId: string,
    userId: string
): Promise<any | null> => {
  const sql = `
    SELECT 
      u.id,
      u.first_name,
      u.last_name,
      p.gender,
      p.date_of_birth,
      p.latitude,
      p.longitude,
      p.biography,
      p.fame_rating,
      pp.image_url as profile_pic,
      JSON_AGG(i.name) as interests
    FROM users u
    left JOIN profiles p ON p.user_id = u.id
    LEFT JOIN profile_pictures pp ON pp.user_id = u.id
    LEFT JOIN user_interests ui ON ui.user_id = u.id
    LEFT JOIN interests i ON i.id = ui.interest_id
    WHERE u.id = $1
    AND u.id <> $2
    AND NOT EXISTS (
      SELECT 1
      FROM relationships r
      WHERE r.user_id = $1
        AND r.target_user_id = $2
        AND r.status = 'block'
    )
    GROUP BY u.id, p.id, pp.id;
  `;
  const result = await query(sql, [targetId, userId]);
  return result.rows.length > 0 ? result.rows[0] : null;
};
