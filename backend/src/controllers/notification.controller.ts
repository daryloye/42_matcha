import { AuthRequest } from "../middleware/auth.middleware";
import { Response } from "express";
import { getNotifications, markNotificationsAsRead } from "../models/notification.model";

export const getNotificationHandler = async (
    req: AuthRequest,
    res: Response,
): Promise<void>=> {
    try{
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ error: "user not authenticated" });
            return;
        }
        const notifications = await getNotifications(userId);
        res.status(200).json({ notifications });
    } catch(error) {
        console.error("error getting notifications", error);
        res.status(500).json({ error: "internal server error"});
    }
};


export const markNotificationsReadHandler = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: "user not authenticated" });
      return;
    }

    await markNotificationsAsRead(userId);
    res.status(200).json({ message: "notifications marked as read" });
  } catch (error) {
    console.error("error marking notifications as read", error);
    res.status(500).json({ error: "internal server error" });
  }
};