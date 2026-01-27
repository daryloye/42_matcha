 import { query } from '../config/database';
 import { User } from '../types/user.types';

 interface CreateUserData {
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    password_hash: string;
    verification_token: string;
 }

 export const findUserByEmail = async(email: string): Promise<User | null> => {
     // SQL query SELECT * FROM users WHERE email = $1
    const params = [email];
    // Execute query using query() function from database.ts
    const sql = "SELECT * FROM users WHERE email = $1";
    // Return result or null
    const result = await query(sql, params);
    return result.rows.length > 0 ? result.rows[0] : null; 
 }

 export const findUserByUsername = async(username: string): Promise<User | null> => {
    const params= [username];
    const sql = "SELECT * FROM users WHERE username = $1";

    const result = await query(sql, params);
    return result.rows.length > 0 ? result.rows[0] : null;
 }

 export const createUser = async (data: CreateUserData) => {
    const sql = `
                INSERT INTO users (email, username, first_name, last_name, password_hash, verification_token) 
                VALUES ($1, $2, $3, $4, $5, $6) 
                RETURNING id;
    `;
    
    const values = [
        data.email,
        data.username,
        data.first_name,
        data.last_name,
        data.password_hash,
        data.verification_token
    ]
    return await query(sql, values);
 }

 export const findUserByVerificationToken = async(token: string) : Promise<User | null> => {
    const sql = "SELECT * FROM users WHERE verification_token = $1";
    const params = [token];

    const result = await query(sql, params);

    return result.rows.length > 0 ? result.rows[0] : null;


 }

 /*For the registration flow, we need:

findUserByEmail(email) - Check if email already exists
findUserByUsername(username) - Check if username already exists
createUser(userData) - Insert new user into database
findUserByVerificationToken(token) - Find user by verification token
verifyUser(userId) - Mark user as verified*/