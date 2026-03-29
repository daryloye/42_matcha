import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

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
  // 1. Get token from Authorization header
  // 2. Verify token with JWT_SECRET
  // 3. Attach user info to req.user
  // 4. Call next() if valid
  // 5. Return error if invalid
  try {
    const token = req.headers.authorization;
    if (!token) {
      res.status(401).json({ error: "Authorization token required" });
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

        res.setHeader('x-renewed-token', newToken);
      }
    }

    next();
  } catch (error) {
    res.status(401).json({ error: "Request is not authorized" });
    return;
  }
};
