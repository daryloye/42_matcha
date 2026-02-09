import {Request, Response, NextFunction} from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

export interface AuthRequest extends Request {
    user?: {
        userId: number;
        email: string;
        username: string;
    };
}

export const requireAuth = async(req: AuthRequest, res: Response, next: NextFunction) => {
    // 1. Get token from Authorization header
    // 2. Verify token with JWT_SECRET
    // 3. Attach user info to req.user
    // 4. Call next() if valid
    // 5. Return error if invalid
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        
        if(!token){
            res.status(401).json({ error: 'Authorization token required'});
            return;
        }
    
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    
        req.user = {
            userId: decoded.userId,
            email: decoded.email,
            username: decoded.username
        };
        next()
    }catch(error){
        res.status(401).json({ error: 'Request is not authorized' });
        return;
    }
};
