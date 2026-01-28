import { Request, Response } from 'express';
import  bcrypt from 'bcrypt';
import  crypto from 'crypto';
import { 
    findUserByEmail, 
    findUserByUsername, 
    createUser, 
    findUserByVerificationToken, 
    verifyUser 
} from '../models/user.model';
import { isValidEmail, isValidUserName, isValidPassword } from '../utils/validation';
import { sendVerificationEmail } from '../utils/email';
import { RegisterRequest } from '../types/user.types';

/*what register needs to do:

1. Get data from request body
2. Validate all input (email, username, password, names)
3. Check if user already exists (email or username taken)
4. Hash password with bcrypt
5. Generate verification token
6. Save user to database
7. Send verification email
8. Return success response
*/

export const register = async (req: Request, res: Response): Promise<void> => {
    try{
        const { email, username, first_name, last_name, password }: RegisterRequest = req.body;
        // 2. Validate input
        // TODO: Check if fields are empty
        if (!email || !username || !first_name || !last_name || !password) {
            res.status(400).json({error: 'All fields are required'});
            return;
        }
        // TODO: Validate email format
        if(!isValidEmail(email)){
            res.status(400).json({error: 'Invalid email format'});
            return
        }
        // TODO: Validate username format
        if(!isValidUserName(username)){
            res.status(400).json({error: 'Invalid username'});
            return;
        }
        // TODO: Validate password strength
        if(!isValidPassword(password)){
            res.status(400).json({error: 'Invalid password'});
            return;
        }
        // 3. Check if user already exists
        const existingUsername = await findUserByUsername(username);
        if(existingUsername != null){
            res.status(400).json({error: 'Username already exist'});
            return;
        }
        // TODO: Check email
        const existingEmail = await findUserByEmail(email);
        if(existingEmail != null) {
            res.status(400).json({error: 'email is already registered'});
            return;
        }
        
        // 4. Hash password
        // TODO: Use bcrypt
        const saltRounds = 10;
        const password_hash = await bcrypt.hash(password, saltRounds);
        
        // 5. Generate verification token
        // TODO: Use crypto
        const verification_token = crypto.randomBytes(32).toString('hex');
        
        // 6. Save user to database
        // TODO: Call createUser
        const userData = {
            email,
            username,
            first_name,
            last_name,
            password_hash,
            verification_token
        }
        const result = await createUser(userData);
        const userId = result.rows[0].id;
        console.log(`✅ User created with id: ${userId}`);
        
        // 7. Send verification email
        // TODO: Call sendVerificationEmail
        await sendVerificationEmail(email, username, verification_token);
        // 8. Return success response
        res.status(201).json({
            message: 'Registration successful! Please check your email to verify your account.' 
        });
    } catch (error){
        console.error('Registration error: ', error);
        res.status(500).json({error: 'Registration failed. Please try again.'})
    }
}