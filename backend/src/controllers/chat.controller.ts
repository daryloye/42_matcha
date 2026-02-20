import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { getOrCreateChat } from "../models/chat.model";
import { NewChatRequest } from "../types/chat.types";

export const handleGetOrCreateChat = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: "user not authenticated" });
    }

    const { targetUserId }: NewChatRequest = req.body;
    if (!targetUserId || targetUserId <= 0 || targetUserId === userId) {
      res.status(400).json({ error: "invalid target user id" });
    }

    // TODO: check if target user exists -> return 404

    // TODO: check if user is blocked by the target user -> return 403

    var chatId = await getOrCreateChat(userId!, targetUserId);
    res.status(201).json({ message: "created", chatId });
  } catch (error) {
    console.error("failed to create new chat", error);
    res.status(500).json({ error: "Failed to create new chat" });
  }
};
