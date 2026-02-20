import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import {
  getMessages,
  postMessage,
  updateReadMessages,
} from "../models/chat.model";
import { GetMessagesRequest, PostMessageRequest } from "../types/chat.types";

export const handleGetMessages = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: "user not authenticated" });
      return;
    }

    // check if targetUserId is valid
    const { targetUserId }: GetMessagesRequest = req.body;
    if (!targetUserId || targetUserId <= 0 || targetUserId === userId) {
      res.status(400).json({ error: "invalid target user id" });
      return;
    }

    // check if both users are matched

    const messages = await getMessages(userId!, targetUserId);
    await updateReadMessages(userId!, targetUserId);
    res.status(200).json({ messages });
  } catch (error) {
    console.error("failed to get messages", error);
    res.status(500).json({ error: "Failed to get messages" });
  }
};

export const handlePostMessage = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: "user not authenticated" });
      return;
    }

    const { targetUserId, message }: PostMessageRequest = req.body;

    // check if targetUserId is valid
    if (!targetUserId || targetUserId <= 0 || targetUserId === userId) {
      res.status(400).json({ error: "invalid target user id" });
      return;
    }

    // check if both users are matched

    // check if message length is valid
    if (message.length > 255) {
      res.status(413).json({ error: "Message length exceeds 255 chars" });
      return;
    }

    await postMessage(userId!, targetUserId, userId!, message);
    res.status(201).json({ message: "message sent" });
  } catch (error) {
    console.error("failed to send message", error);
    res.status(500).json({ error: "Failed to send message" });
  }
};
