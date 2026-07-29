import { Request, Response } from 'express';
import  bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import  crypto from 'crypto';
import { 
    findUserByEmail, 
    findUserByUsername, 
    createUser, 
    findUserByVerificationToken, 
    verifyUser,
    updatePassword,
    setResetToken,
    findUserByResetToken,
    clearResetToken,
    deleteUserById,
    updateLastSeen
} from '../models/user.model';
import { isValidEmail, isValidUserName, isValidPassword } from '../utils/validation';
import { sendPasswordResetEmail, sendVerificationEmail } from '../utils/email';
import { RegisterRequest, LoginRequest, ForgotPasswordRequest, ResetPasswordRequest } from '../types/user.types';
import { createProfile, deleteProfile } from '../models/profile.model';

/*
    // 1. Get token and new password from request
    // 2. Validate new password
    // 3. Find user by reset token
    // 4. Check if user exists and token not expired
    // 5. Hash new password
    // 6. Update password
    // 7. Clear reset token
    // 8. Return success
*/
export const resetPassword = async (req: Request, res: Response) : Promise <void> => {
    try {
        const { newPassword, resetToken } : ResetPasswordRequest = req.body;
        if(!isValidPassword(newPassword) || !newPassword){
            res.status(400).json({ error: 'Password is too weak'});
            return;
        }
        if(!resetToken){
            res.status(400).json({ error: 'Reset token is required'})
            return;
        }
        const existingUser = await findUserByResetToken(resetToken);
        if(!existingUser){
            res.status(400).json({ error: 'invalid or expired reset token'})
            return;
        }
        const saltRounds = 10;
        const password_hash = await bcrypt.hash(newPassword, saltRounds);
        await updatePassword(existingUser.id, password_hash);
        await clearResetToken(existingUser.id);

        res.status(200).json({message: 'Password updated.'})
    } catch (error) {
        console.error('Reset password error: ', error);
        res.status(500).json({ error: 'Internal server error' })
    }
}

/*
## Password Reset Flow (What We'll Build Next)
```
1. User clicks "Forgot Password"
2. User enters their email
3. Backend generates reset token
4. Backend calls setResetToken() to save token + expiry
5. Backend sends email with reset link
6. User clicks link → Frontend page
7. User enters new password
8. Backend verifies token, updates password
*/
export const forgotPassword = async (req: Request, res: Response) : Promise <void> => {
    try{
        const { email }: ForgotPasswordRequest = req.body;

        if(!email || !isValidEmail(email)) {
            res.status(400).json({ error: 'Invalid email format'});
            return;
        }

        const exisitingUser = await findUserByEmail(email);
        if (exisitingUser){
            const reset_token = crypto.randomBytes(32).toString('hex');
            const expires = new Date();
            expires.setHours(expires.getHours() + 1);
    
            await setResetToken(email, reset_token, expires);
            await sendPasswordResetEmail(email, exisitingUser.username, reset_token);
        }
        res.status(200).json({ message: 'A password reset link has been sent' });

    } catch (error){
        console.error('Forgot password error: ', error);
        res.status(500).json({ error: 'Internal server error. Please try again.' });
    }
}

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
        const { username, password }: LoginRequest = req.body;

        if(!username || !password) {
            res.status(400).json({ error: 'Invalid username or password.'})
            return;
        }

        const existingUser = await findUserByUsername(username);
        if (!existingUser) {
            res.status(400).json({ error: 'Invalid username or password.'});
            return;
        }

        const isMatch = await bcrypt.compare(password, existingUser.password_hash);
        if(!isMatch){
            res.status(400).json({ error: 'Invalid username or password.'})
            return;
        }

        if (!existingUser.is_verified){
            try {
                await sendVerificationEmail(existingUser.email, existingUser.username, existingUser.verification_token!)
                res.status(400).json({ error: 'Your account is not verified. A new verification email has been sent.'})
            } catch (emailError) {
                console.error('Failed to resend verification email: ', emailError);
                res.status(500).json({ error: 'Failed to send verification email. Please try again.' });    
            }
            return;
        }

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error('JWT_SECRET is not defined');
        }

        const token = jwt.sign(
            {
                userId: existingUser.id,
                email: existingUser.email,
                username: existingUser.username
            },
            jwtSecret,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || '15m'
            } as jwt.SignOptions 
        );
        await updateLastSeen(existingUser.id);
        res.status(200).json({
            message: 'Login successful!',
            token: token,
        });
    } catch (error) {
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
export const register = async (req: Request, res: Response): Promise <void> => {
    try{
        const { email, username, first_name, last_name, password }: RegisterRequest = req.body;

        if(!email || !username || !first_name || !last_name || !password){
            res.status(400).json({error: 'All fields are required'});
            return;
        }
        
        if(!isValidEmail(email)){
            res.status(400).json({error: 'Invalid email format'});
            return;
        }
        if(!isValidUserName(username)){
            res.status(400).json({error: 'Invalid username'});
            return;
        }
        if(!isValidPassword(password)){
            res.status(400).json({error: 'Password is too weak!'});
            return;
        }

        // check for existing email
        if (await findUserByEmail(email)) {
            res.status(400).json({ error: 'This email is already registered.' });
            return;
        }

        // check for existing username
        if (await findUserByUsername(username)) {
            res.status(400).json({error: 'Username already exist'});
            return;
        }

        const saltRounds = 10;
        const password_hash = await bcrypt.hash(password, saltRounds);
        const verification_token = crypto.randomBytes(32).toString('hex');

        const userData = { email, username, first_name, last_name, password_hash, verification_token };
        const result = await createUser(userData);
        const userId = result.rows[0].id;

        await createProfile(userId);
        
        console.log(`✅ User created with id: ${userId}`);
        
        try {
            await sendVerificationEmail(email, username, verification_token);
        } catch (emailError) {
            // Roll back user creation if email fails
            await deleteUserById(userId);
            await deleteProfile(userId);
            res.status(500).json({ error: 'Failed to send verification email. Please try again.'})
            return;
        }
        res.status(201).json({ message: 'Registration successful! Please check your email to verify your account.'});
    } catch (error) {
        console.log('Registration error: ', error);
        res.status(500).json({error: 'Registration failed. Please try again.'});
    }
}

export const verify = async(req: Request, res: Response): Promise<void> => {
    try {
        const { token } = req.query;
        if(!token || typeof token !== 'string'){
            res.status(400).json({ error: 'Missing or invalid token'})
            return
        }

        const user = await findUserByVerificationToken(token);
        if(!user){
            res.status(400).json({ error: 'User does not exist'});
            return;
        }

        if(user.is_verified){
            res.status(400).json({ error: 'Email is already registered'})
            return;
        }

        const userId = user.id; 
        await verifyUser(userId)
        res.status(200).json({message: 'Email verified successfully! You can now log in.'})

    } catch (error) {
        console.error("Verification error: ", error);
        res.status(500).json({ error: 'Internal server error. Verificatition failed. Please try again.'});
    };
}