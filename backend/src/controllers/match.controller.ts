import { AuthRequest } from "../middleware/auth.middleware";
import { Response } from "express";
import { createMatchStatus, deleteMatchStatus, getMatchStatus } from "../models/match.model";
import { getUsernameFromId } from "../models/user.model";
import { MatchRequest, MatchStatusRequest, MatchStatusResponse } from "../types/match.types";

const LIKE = 'like';
const UNLIKE = 'unlike';
const BLOCK = 'block';
const UNBLOCK = 'unblock';
const VIEW = 'view';

export const updateMatchHandler = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: "user not authenticated" });
      return;
    }

    const {action, targetId}: MatchRequest = req.body;
    if (!action) {
      res.status(400).json({ error: "action cannot be nil" });
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

    switch (action) {
      case LIKE || BLOCK || VIEW:
        await createMatchStatus(userId, targetId, action);
        res.status(200).json({ message: `${userId} ${action} ${targetId}`});
        return;
      case UNLIKE || UNBLOCK:
        await deleteMatchStatus(userId, targetId, action);
        res.status(200).json({ message: `${userId} ${action} ${targetId}`});
        return;
      default:
        res.status(400).json({ error: "invalid action" });
        return;
    }
  } catch (error) {
    console.error("error updating match status", error);
    res.status(500).json({ error: "internal server error" });
  }
};

export const getMatchStatusHandler = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: "user not authenticated" });
      return;
    }

    const {targetId}: MatchStatusRequest = req.body;
    if (!targetId) {
      res.status(400).json({ error: "targetId cannot be nil" });
      return;
    }

    const targetUser = await getUsernameFromId(targetId);
    if (!targetUser || targetId === userId) {
      res.status(400).json({ error: "invalid targetId" });
      return; 
    }

    const statusFromUser = await getMatchStatus(userId, targetId);
    const statusFromTarget = await getMatchStatus(targetId, userId);
    
    // how to map the status to the resBody?

    const resBody: MatchStatusResponse = {
      isConnected: false,
      hasLikedTarget: false,
      isBlockingTarget: false,
      isBlockedByTarget: false,
    };

    res.status(200).json({ resBody });
  } catch (error) {
    console.error("error updating match status", error);
    res.status(500).json({ error: "internal server error" });
  }
};