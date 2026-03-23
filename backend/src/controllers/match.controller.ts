import { AuthRequest } from "../middleware/auth.middleware";
import { Response } from "express";
import { createMatchStatus, deleteMatchStatus, getMatchStatus } from "../models/match.model";
import { getUsernameFromId } from "../models/user.model";
import { MatchRequest } from "../types/match.types";

const LIKE = 'like';
const UNLIKE = 'unlike';
const BLOCK = 'block';
const UNBLOCK = 'unblock';
const VIEW = 'view';
const REPORT = 'report';

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

    // TODO: handle fame updating
    
    switch (action) {
      case LIKE:
      case BLOCK:
      case VIEW:
      case REPORT:
        await createMatchStatus(userId, targetId, action);
        res.status(200).json({ message: `${userId} ${action} ${targetId}`});
        return;

      case UNLIKE:
        await deleteMatchStatus(userId, targetId, LIKE);
        res.status(200).json({ message: `${userId} ${action} ${targetId}`});
        return;

      case UNBLOCK:
        await deleteMatchStatus(userId, targetId, BLOCK);
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

    const statusFromUser = await getMatchStatus(userId, targetId);
    const statusFromTarget = await getMatchStatus(targetId, userId);
    
    res.status(200).json({ 
      isConnected: statusFromUser?.includes('like') && statusFromTarget?.includes('like') || false,
      hasLikedTarget: statusFromUser?.includes('like') || false,
      isBlockingTarget: statusFromUser?.includes('block') || false,
      isBlockedByTarget: statusFromTarget?.includes('block') || false,
    });
  } catch (error) {
    console.error("error updating match status", error);
    res.status(500).json({ error: "internal server error" });
  }
};