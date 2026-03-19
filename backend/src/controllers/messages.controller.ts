import { AuthRequest } from "../middleware/auth.middleware";
import { Response } from "express";
import { getMessages } from "../models/messages.model";

export const getMessagesHandler = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: "user not authenticated" });
      return;
    }

    const { id: targetId } = req.params as { id: string};
    if (!targetId) {
        res.status(400).json({ error: "invalid recipient id" });
        return;
    }

    const since = Number(req.query.since ?? 0);
    await getMessages(userId, targetId, since);

    res.status(200).json({ message: since });    
  } catch (error) {
    console.error("get messages error: ", error);
    res.status(500).json({ error: "failed to get messages" });
  }
};

export const postMessageHandler = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: "user not authenticated" });
      return;
    }

    const { id: targetId } = req.params as { id: string};
    if (!targetId) {
        res.status(400).json({ error: "invalid recipient id" });
        return;
    }

    res.status(200).json({ message: 'hello' });    
  } catch (error) {
    console.error("post messages error: ", error);
    res.status(500).json({ error: "failed to post message" });
  }
};
