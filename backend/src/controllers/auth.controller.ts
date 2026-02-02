import { Request, Response } from 'express';
import  bcrypt from 'bcrypt';
import jwt, { Secret } from 'jsonwebtoken';
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
import { RegisterRequest, LoginRequest } from '../types/user.types';
/*
resetPassword



*/
/*
Login function
1. Get email and password from request body
2. Validate input (not empty)
3. Find user by email in database
4. Check if user exists
5. Check if user is verified
6. Compare password with hashed password (bcrypt)
7. Generate JWT token
8. Return token + user info to frontend
*/

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password }: LoginRequest = req.body;

        if(!isValidEmail(email)) {
            res.status(400).json({ error: 'Invalid email or password.'});
            return;
        }
        if(!isValidPassword(password)) {
            res.status(400).json({ error: 'Invalid email or password.'})
            return;
        }
        const existingUser = await findUserByEmail(email);

        if(existingUser === null){
            res.status(400).json({ error: 'Invalid email or password.'});
            return;
        }
        if (!existingUser.is_verified){
            res.status(400).json({ error: 'Please verify your email before loggin in.'})
            return;
        }
        const isMatch = await bcrypt.compare(password, existingUser.password_hash);

        if(!isMatch){
            res.status(400).json({ error: 'Invalid email or password.'})
            return;
        }
        const jwtSecret = process.env.JWT_SECRET;
        if(!jwtSecret)
            throw new Error('JWT_SECRET is not defined');
        const token = jwt.sign(
            {
                userId: existingUser.id,
                email: existingUser.email,
                username: existingUser.username
            },
            jwtSecret,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || '7d'
            } as jwt.SignOptions

        );

        res.status(200).json({
            message: 'Login successful!',
            token: token,
            user: {
                id: existingUser.id,
                username: existingUser.username,
                first_name: existingUser.first_name,
                last_name: existingUser.last_name,
                email: existingUser.email
            }
        });
    }catch(error){
        console.error('login error: ', error);
        res.status(500).json({ error: 'Internal Server Error' })
    }
};

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

export const verify = async(req: Request, res: Response): Promise<void>=>{
    try{
        const { token } = req.query;
        if(!token || typeof token !== 'string'){
            res.status(400).json({ error: 'Missing or invalid token'})
            return
        }
        const user = await findUserByVerificationToken(token);
        if(!user){
            res.status(400).json({ error: 'User do not exist'});
            return;
        }
        if(user.is_verified){
            res.status(400).json({ error: 'User\'s email is already registered'})
            return;
        }
        const userId =  user.id; 
        await verifyUser(userId)
        res.status(200).json({message: 'Email verified successfully! You can now log in.'})
    }catch(error){
        console.error("Verification error", error);
        res.status(500).json({ error: 'Internal server error. Verificatition failed. Please try again.'});
    };
}