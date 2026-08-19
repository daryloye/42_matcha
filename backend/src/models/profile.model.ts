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

export const addProfilePictureByUserId = async (userId: string, imageUrl: string): Promise<any | null> => {
    const sql = `
        INSERT INTO profile_pictures (user_id, image_url, is_profile_picture)
        VALUES ($1, $2, TRUE)
        RETURNING id, image_url
    `;
    const result = await query(sql, [userId, imageUrl]);
    return result.rows.length > 0 ? result.rows[0]: null;
}

export const getProfilePictureByUserId = async (userId: string): Promise <any | null> => {
    const sql = `
        SELECT id, image_url FROM profile_pictures
        WHERE user_id = $1 AND is_profile_picture = TRUE
    `;
    const result = await query(sql, [userId])
    return result.rows.length > 0 ? result.rows[0]: null;
}

export const deleteProfilePictureByUserId = async (userId: string): Promise <any | null> => {
    const sql = `
        DELETE FROM profile_pictures
        WHERE user_id = $1 AND is_profile_picture = TRUE
        RETURNING id, image_url
    `;
    const result = await query(sql, [userId]);
    return result.rows.length > 0 ? result.rows[0]: null;
}

export const getPictureCount = async (userId: string): Promise<number> => {
    const sql = `SELECT COUNT (*) FROM profile_pictures WHERE user_id = $1 AND is_profile_picture IS FALSE`;
    const result = await query(sql, [userId]);
    const count = parseInt(result.rows[0].count, 10);
    return count;
}

export const addPictureByUserId = async (userId: string, imageUrl: string): Promise<any | null> => {
    const sql = `
        INSERT INTO profile_pictures (user_id, image_url, is_profile_picture)
        VALUES ($1, $2, FALSE)
        RETURNING id, image_url
    `;
    const result = await query(sql, [userId, imageUrl]);
    return result.rows.length > 0 ? result.rows[0]: null;
}

export const getPicturesByUserId = async (userId: string): Promise <any | null> => {
    const sql = `
        SELECT id, image_url FROM profile_pictures
        WHERE user_id = $1 AND is_profile_picture = FALSE
        ORDER BY created_at DESC
    `;

    const result = await query(sql, [userId])
    return result.rows;
}

export const deletePictureByUserId = async (userId: string, pictureId: string): Promise <any | null> => {
    const sql = `
        DELETE FROM profile_pictures
        WHERE user_id = $1 AND id = $2
        RETURNING id, image_url
    `;
    const result = await query(sql, [userId, pictureId]);
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
                u.first_name IS NOT NULL AND
                u.last_name IS NOT NULL AND
                u.email IS NOT NULL AND
                p.date_of_birth IS NOT NULL AND
                p.gender IS NOT NULL AND
                p.sexual_preference IS NOT NULL AND
                p.biography IS NOT NULL AND
                (SELECT COUNT(*) FROM user_interests WHERE user_id = $1) > 0 AND
                (SELECT COUNT(*) FROM profile_pictures WHERE user_id = $1 AND is_profile_picture IS TRUE) > 0 AND
                p.latitude IS NOT NULL AND
                p.longitude IS NOT NULL
            THEN true ELSE false END AS is_profile_completed
        FROM users u
        LEFT JOIN profiles p ON p.user_id = u.id
        LEFT JOIN profile_pictures pp ON pp.user_id = u.id AND pp.is_profile_picture IS TRUE
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
                JSONB_AGG(
                    DISTINCT JSONB_BUILD_OBJECT(
                        'id', pp.id,
                        'image_url', pp.image_url
                    ) 
                ) FILTER (WHERE pp.id IS NOT NULL AND pp.is_profile_picture IS TRUE),
                '[]'::jsonb
            ) AS profile_picture,
            
            COALESCE(
                JSONB_AGG(
                    DISTINCT JSONB_BUILD_OBJECT(
                        'id', pp.id,
                        'image_url', pp.image_url
                    ) 
                ) FILTER (WHERE pp.id IS NOT NULL AND pp.is_profile_picture IS FALSE),
                '[]'::jsonb
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
