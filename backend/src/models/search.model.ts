import { query } from "../config/database";

export const getReommendedProfiles = async (
    userId: string,
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
      p.fame_rating,
      pp.image_url as profile_pic,
      JSON_AGG(i.name) as interests
    FROM users u
    left JOIN profiles p ON p.user_id = u.id
    LEFT JOIN profile_pictures pp ON pp.user_id = u.id
    LEFT JOIN user_interests ui ON ui.user_id = u.id
    LEFT JOIN interests i ON i.id = ui.interest_id
    WHERE 
    u.id <> $1
      and NOT EXISTS (
        SELECT 1
        FROM relationships r
        WHERE r.user_id = $1
          AND r.target_user_id = u.id
          AND r.status = 'block'
      )
    GROUP BY u.id, p.id, pp.id;
  `;
  const result = await query(sql, [userId]);
  return result.rows.length > 0 ? result.rows : null;
};
