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
⏳ getProfileByUserId() - Get user's profile
⏳ updateProfile() - Update profile fields
⏳ addProfilePicture() - Add a photo
⏳ setProfilePicture() - Mark which photo is the profile pic
⏳ getProfilePictures() - Get all user's photos
⏳ deleteProfilePicture() - Remove a photo

*/ 


export const createBlankProfile = async (userId: number): Promise<any> => {
    const sql = `
        INSERT INTO profiles (user_id)
        VALUES ($1)
        returning id
    `
    const result = await query(sql, [userId]);
    return result.rows.length > 0 ? result.rows[0] : null; 
}

export const getProfileByUserId = async (userId: number): Promise<any | null> => {
    const sql = `
        SELECT * FROM profiles where user_id = $1
    `
    const result = await query(sql, [userId]);
    return result.rows.length > 0 ? result.rows[0] : null;
}

export const updateProfile = async (userId: number, data: CreateUserProfile): Promise<any | null> => {
    const sql = `
        UPDATE profiles
        SET gender = $2
            sexual_preference= $3
            biography = $4
            latitude = $5 
            longitude = $6 
            location_city = $7 
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
    const result = await query(sql, values)

    return result.rows.length > 0 ? result.rows[0] : null;
}

