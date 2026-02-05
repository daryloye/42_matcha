import { query } from '../config/database';

/*
        id SERIAL PRIMARY KEY,
        user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        gender VARCHAR(20),
        sexual_preference VARCHAR(20) DEFAULT 'both',
        biography TEXT,

        latitude DECIMAL(9, 6),
        longitude DECIMAL(9, 6),
        location_city VARCHAR(100),

        fame_rating INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
*/

/*
interface CreateUserProfile {
    user_id: number;
    gender: string;
    sexual_preference: string;
    biography: string;

    latitude: number;
    longitude: number;
    location_city: string;
    fame_rating: number;
    created_at: number;
    updated_at: number;

}
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

/*
export const createBlankProfile = async (userId: number, data: CreateUserProfile): Promise<void> => {
    const sql = `
        INSERT into profiles (user_id, gender, sexual_preference, biography, latitude, longitude, location_city, fame_rating, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING id;
        `;
    
    const values = [
        data.user_id = userId,
        data.gender,
        data.sexual_preference,
        data.biography,
        data.latitude,
        data.longitude,
        data.location_city,
        data.fame_rating,
        data.created_at,
        data.updated_at
    ]
    
    const result = await query(sql, values);
    return result.rows.length > 0 ?result.rows[0] : null;
}*/