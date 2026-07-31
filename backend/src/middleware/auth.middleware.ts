import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { getProfileMe } from "../models/profile.model";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    username: string;
  };
}

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  // 1. Get token from cookie
  // 2. Verify token with JWT_SECRET
  // 3. Attach user info to req.user
  // 4. Call next() if valid
  // 5. Return error if invalid
  try {
    const token = req.cookies?.access_token;
    if (!token) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      username: decoded.username,
    };

    if (decoded.exp) {
      const now = Math.floor(Date.now() / 1000);
      const remainingSeconds = decoded.exp - now;

      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        throw new Error("JWT_SECRET is not defined");
      }

      if (remainingSeconds <= 120) {
        const newToken = jwt.sign(
          {
            userId: decoded.userId,
            email: decoded.email,
            username: decoded.username,
          },
          jwtSecret,
          {
            expiresIn: process.env.JWT_EXPIRES_IN || "15m",
          } as jwt.SignOptions,
        );

        res.cookie('access_token', newToken, {
            maxAge: 900000,     // Expires in 15 minutes (in milliseconds)
            httpOnly: true,     // Protects against XSS attacks
            secure: true,       // Requires HTTPS connections
            sameSite: 'lax'     // Protects against CSRF attacks
        });
      }
    }

    next();
  } catch (error) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
};

export const requireProfileCompleted = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const profile = await getProfileMe(req.user.userId);
    if (!profile) {
      res.status(404).json({ error: "user profile does not exist" });
      return;
    }

    if (!profile.is_profile_completed) {
      res.status(403).json({ 
        code: 'PROFILE_INCOMPLETE',
        error: "Profile not completed yet" 
      });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    return;
  }
}