import { query } from '../config/database';

interface CreateUserProfile {
    gender?: string;
    sexual_preference?: string;
    biography?: string;
    date_of_birth?: string;
    latitude?: number;
    longitude?: number;
    location_city?: string;
}
/*
✅ getProfileByUserId() - Get user's profile
✅ updateProfile() - Update profile fields
✅ addProfilePicture() - Add a photo
✅ setProfilePicture() - Mark which photo is the profile pic
✅ getProfilePictures() - Get all user's photos
✅ getPrimaryProfilePicture() - Get the users primary profile picture(the avartar)
✅ deleteProfilePicture() - Remove a photo
*/ 


export const getProfileByUserId = async (
  userId: string,
): Promise<any | null> => {
  const sql = `
        SELECT * FROM profiles where user_id = $1
    `;
  const result = await query(sql, [userId]);
  return result.rows.length > 0 ? result.rows[0] : null;
};

export const createProfile = async (
    userId: string,
): Promise<any | null> => {
    const sql = `
        INSERT INTO profiles (user_id, gender, sexual_preference)
        VALUES ($1, $2, $3)
        ON CONFLICT (user_id) DO NOTHING
    `;
    await query(sql, [userId, "other", "both"]);
}

export const deleteProfile = async (
    userId: string,
): Promise<any | null> => {
    const sql = `
        DELETE FROM profiles
        WHERE user_id = $1
    `
    await query(sql, [userId]);
}

export const updateProfile = async (
  userId: string,
  data: CreateUserProfile,
): Promise<any | null> => {
  const updates: string[] = [];
  const values: any[] = [userId];
  let paramCount = 1;

  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      paramCount += 1;
      updates.push(`${key} = $${paramCount}`);
      values.push(value);
    }
  }
  if (updates.length === 0) {
    return await getProfileByUserId(userId);
  }
  updates.push(`updated_at = NOW()`);
  const sql = `
        UPDATE profiles
        SET ${updates.join(", ")}
        WHERE user_id = $1
        RETURNING *    
    `;
    const result = await query(sql, values);
    return result.rows.length > 0 ? result.rows[0] : null;
}

export const getPictureCount = async (userId: string): Promise<number> => {
    const sql = `SELECT COUNT (*) FROM profile_pictures WHERE user_id = $1`;
    const result = await query(sql, [userId]);
    const count = parseInt(result.rows[0].count, 10);
    return count;
}

export const addProfilePicture = async (userId: string, imageUrl: string, isFirstPhoto: boolean): Promise<any | null> => {
    const sql = `
        INSERT INTO profile_pictures (user_id, image_url, is_profile_picture)
        VALUES ($1, $2, $3)
        RETURNING *
    `;
    
    const result = await query(sql, [userId, imageUrl, isFirstPhoto]);
    return result.rows.length > 0 ? result.rows[0] : null;
}

export const setProfilePicture = async (userId: string, pictureId: string): Promise<any | null> => {
    const sql = `
        UPDATE profile_pictures
        SET is_profile_picture = (id = $2)
        WHERE user_id = $1
        RETURNING *
    `;

    const result = await query(sql, [userId, pictureId]);
    return result.rows.find(row => row.id === pictureId) || null;
}

export const getProfilePictures = async (userId: string): Promise <any | null> => {
    const sql = `
        SELECT * FROM profile_pictures
        WHERE user_id = $1
        ORDER BY is_profile_picture DESC, created_at DESC
    `;

    const result = await query(sql, [userId])
    return result.rows;
}

export const getPrimaryProfilePicture = async (userId: string): Promise <any | null> => {
    const sql = `
        SELECT * FROM profile_pictures
        WHERE user_id = $1 AND is_profile_picture = true
        LIMIT 1
    `;

    const result = await query(sql, [userId]);
    return result.rows.length > 0 ? result.rows[0] : null;
}

export const deleteProfilePicture = async (userId: string, pictureId: string): Promise <any | null> => {
    const sql = `
        DELETE FROM profile_pictures
        WHERE user_id = $1 AND id = $2
        RETURNING image_url, is_profile_picture
    `;
    const result = await query(sql, [userId, pictureId]);
    const deletedWasPrimary = result.rows.length > 0 && result.rows[0].is_profile_picture === true;
    if (deletedWasPrimary) {
        const promoteSql = `
            UPDATE profile_pictures
            SET is_profile_picture = true
            WHERE id = (
                SELECT id FROM profile_pictures
                WHERE user_id = $1
                ORDER BY created_at ASC
                LIMIT 1
            )
        `;
        await query(promoteSql, [userId]);
    }
    return result.rows.length > 0 ? result.rows[0]: null;
}

export const getProfileMe = async (userId: string): Promise<any | null> => {
    const sql = `
        SELECT 
            u.username,
            u.first_name,
            u.last_name,
            pp.image_url AS picture,
            p.fame_rating,
            CASE WHEN
                p.gender IS NOT NULL AND
                p.sexual_preference IS NOT NULL AND
                p.biography IS NOT NULL AND
                (SELECT COUNT(*) FROM user_interests WHERE user_id = $1) > 0 AND
                (SELECT COUNT(*) FROM profile_pictures WHERE user_id = $1) > 0
            THEN true ELSE false END AS is_profile_completed
        FROM users u
        LEFT JOIN profiles p ON p.user_id = u.id
        LEFT JOIN profile_pictures pp ON pp.user_id = u.id AND pp.is_profile_picture = true
        WHERE u.id = $1
    `;
    const result = await query(sql, [userId]);
    return result.rows.length > 0 ? result.rows[0] : null;
}

export const getProfileDetails = async (userId: string): Promise<any | null> => {
    const sql = `
        SELECT
            u.first_name,
            u.last_name,
            u.email,
            p.gender,
            p.sexual_preference,
            p.biography,
            p.date_of_birth,
            p.latitude,
            p.longitude,
            p.fame_rating,
            COALESCE(
                JSON_AGG(DISTINCT i.name) FILTER (WHERE i.name IS NOT NULL),
                '[]'
            ) AS interests,
            COALESCE(
                JSON_AGG(DISTINCT pp.image_url) FILTER (WHERE pp.image_url IS NOT NULL),
                '[]'
            ) AS pictures
        FROM users u
        LEFT JOIN profiles p ON p.user_id = u.id
        LEFT JOIN user_interests ui ON ui.user_id = u.id
        LEFT JOIN interests i ON i.id = ui.interest_id
        LEFT JOIN profile_pictures pp ON pp.user_id = u.id
        WHERE u.id = $1
        GROUP BY u.id, p.id
    `;
    const result = await query(sql, [userId]);
    return result.rows.length > 0 ? result.rows[0] : null;
};

export const updateUserInterests = async (userId: string, interestNames: string[]): Promise<void> => {
    await query(`DELETE FROM user_interests WHERE user_id = $1`, [userId]);

    if(interestNames.length === 0)
        return;

    for (const name of interestNames){
        const interestResult = await query(
            `INSERT INTO interests (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id`,
            [name.toLowerCase().trim()]
        );
        const interestId = interestResult.rows[0].id;

        await query(
            `INSERT INTO user_interests (user_id, interest_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
            [userId, interestId]
        );
    }
}

export const increaseUserFame = async (userId: string, increaseValue: number): Promise<void> => {
    await query(
        `UPDATE profiles
        SET fame_rating = fame_rating + $2
        WHERE user_id = $1`,
        [userId, increaseValue]
    );
}
