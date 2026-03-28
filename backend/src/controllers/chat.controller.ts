import { AuthRequest } from "../middleware/auth.middleware";
import { Response } from "express";
import { getMatchStatus } from "../models/match.model";
import { getUsernameFromId } from "../models/user.model";
import { ChatRequest } from "../types/chat.types";
import { createChat, getChat } from "../models/chat.model";
import { matchStatus } from "../types/match.types";

export const createChatHandler = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: "user not authenticated" });
      return;
    }

    const {message, targetId}: ChatRequest = req.body;
    if (!message) {
      res.status(400).json({ error: "message cannot be nil" });
      return;
    }
    if (!targetId) {
      res.status(400).json({ error: "targetId cannot be nil" });
      return;
    }
    const targetUser = await getUsernameFromId(targetId);
    if (!targetUser || targetId === userId) {
      res.status(400).json({ error: "invalid targetId" });
      return; 
    }

    // cannot send if users are not connected
    const statusFromUser = await getMatchStatus(userId, targetId);
    if (!statusFromUser?.includes(matchStatus.CONNECTED)) {
        res.status(400).json({ error: "users are not connected" });
        return;
    }

    await createChat(userId, targetId, message);
    res.status(201).json({ message: "message sent"} );

  } catch (error) {
    console.error("error sending chat", error);
    res.status(500).json({ error: "internal server error" });
  }
};

export const getChatHandler = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: "user not authenticated" });
      return;
    }

    const {targetId} = req.query;
    if (!targetId || typeof targetId !== 'string') {
      res.status(400).json({ error: "targetId cannot be nil" });
      return;
    }

    const targetUser = await getUsernameFromId(targetId);
    if (!targetUser || targetId === userId) {
      res.status(400).json({ error: "invalid targetId" });
      return; 
    }

    // cannot get messages if users are not connected
    const statusFromUser = await getMatchStatus(userId, targetId);
    if (!statusFromUser?.includes(matchStatus.CONNECTED)) {
        res.status(400).json({ error: "users are not connected" });
        return;
    }

    const messages = await getChat(userId, targetId);
    res.status(200).json({ messages } );

  } catch (error) {
    console.error("error updating match status", error);
    res.status(500).json({ error: "internal server error" });
  }
};