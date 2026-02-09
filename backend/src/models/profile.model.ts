import { query } from '../config/database';


interface CreateUserProfile {
    gender?: string;
    sexual_preference?: string;
    biography?: string;
    latitude?: number;
    longitude?: number;
    location_city?: string;
}
/*
✅ createBlankProfile() - You started this (fix the SQL)
✅ getProfileByUserId() - Get user's profile
✅ updateProfile() - Update profile fields
✅ addProfilePicture() - Add a photo
✅ setProfilePicture() - Mark which photo is the profile pic
✅ getProfilePictures() - Get all user's photos
✅ getPrimaryProfilePicture() - Get the users primary profile picture(the avartar)
✅ deleteProfilePicture() - Remove a photo
*/ 


export const createBlankProfile = async (userId: number): Promise<any> => {
    const sql = `
        INSERT INTO profiles (user_id)
        VALUES ($1)
        returning id
    `;
    const result = await query(sql, [userId]);
    return result.rows.length > 0 ? result.rows[0] : null; 
}

export const getProfileByUserId = async (userId: number): Promise<any | null> => {
    const sql = `
        SELECT * FROM profiles where user_id = $1
    `;
    const result = await query(sql, [userId]);
    return result.rows.length > 0 ? result.rows[0] : null;
}
/*
export const updateProfile = async (userId: number, data: CreateUserProfile): Promise<any | null> => {
    const sql = `
        UPDATE profiles
        SET gender = $2,
            sexual_preference= $3,
            biography = $4,
            latitude = $5,
            longitude = $6, 
            location_city = $7, 
            updated_at = NOW()
        WHERE user_id = $1
        RETURNING *
    `
    const values = [
        userId,
        data.gender,
        data.sexual_preference,
        data.biography,
        data.latitude, 
        data.longitude, 
        data.location_city, 
    ];
    const result = await query(sql, values);

    return result.rows.length > 0 ? result.rows[0] : null;
}
*/

export const updateProfile = async (userId: number, data: CreateUserProfile): Promise<any | null> => {
    const updates: string[] = [];
    const values: any[] = [userId];
    let paramCount = 1;

    for(const [key, value] of Object.entries(data)){
        if(value !== undefined) {
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
        SET ${updates.join(', ')}
        WHERE user_id = $1
        RETURNING *    
    `;
    const result = await query(sql, values);
    return result.rows.length > 0 ? result.rows[0] : null;
}

export const addProfilePicture = async (userId: number, imageUrl: string): Promise<any | null> => {
    const countSql = `SELECT COUNT (*) FROM profile_pictures WHERE user_id = $1`;
    const countResult = await query(countSql, [userId]);
    const currentCount = parseInt(countResult.rows[0].count, 10);

    if (currentCount >= 5){
        throw new Error("Max 5 photos reached");
    }
    const isFirstPhoto = currentCount === 0;
    const sql = `
        INSERT INTO profile_pictures (user_id, image_url,is_profile_picture)
        VALUES ($1, $2, $3)
        RETURNING *
    `;
    const result = await query(sql, [userId, imageUrl, isFirstPhoto]);
    return result.rows.length > 0 ? result.rows[0] : null;
}

/*
export const addProfilePicture = async (userId: number, imageUrl: string, isPrimary: boolean = false): Promise<any | null> => {
    const sql = `
        INSERT INTO profile_pictures (user_id, image_url, is_profile_picture)
        VALUES ($1, $2, $3)
        RETURNING *   
    `;
    const params = [userId, imageUrl, isPrimary]
    const result = await query(sql, params);

    return result.rows.length > 0 ? result.rows[0] : null;
}

setProfilePicture:

Set all user's photos to is_profile_picture = false
Then set the specific photo to is_profile_picture = true
Use two UPDATE queries or one smart query

        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        image_url VARCHAR(255),
        is_profile_picture BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW()

*/ 
export const setProfilePicture = async (userId: number, pictureId: number): Promise<any | null> => {
    const sql = `
        UPDATE profile_pictures
        SET is_profile_picture = (id = $2)
        WHERE user_id = $1
        RETURNING *
    `;
    const result = await query(sql, [userId, pictureId]);
    return result.rows.find(row => row.id === pictureId) || null;
}
/*
getProfilePictures:

SELECT all photos for a user
Order by is_profile_picture DESC (profile pic first)


*/
export const getProfilePictures = async (userId: number): Promise <any | null> => {
    const sql = `
        SELECT * FROM profile_pictures
        WHERE user_id = $1
        ORDER BY is_profile_picture DESC, created_at DESC
    `;

    const result = await query(sql, [userId])
    return result.rows;
}

export const getPrimaryProfilePicture = async (userId: number): Promise <any | null> => {
    const sql = `
        SELECT * FROM profile_pictures
        WHERE user_id = $1 AND is_profile_picture = true
        LIMIT 1
    `;

    const result = await query(sql, [userId]);
    return result.rows.length > 0 ? result.rows[0] : null;
}

/*
deleteProfilePicture:

DELETE photo by id
Make sure it belongs to the user (security!)
*/

export const deleteProfilePicture = async(userId: number, pictureId: number): Promise <any | null> => {
    const sql = `
        DELETE FROM profile_pictures
        WHERE user_id = $1 AND id = $2
        RETURNING is_profile_picture
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