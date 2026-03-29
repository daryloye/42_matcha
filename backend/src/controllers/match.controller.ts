import { AuthRequest } from "../middleware/auth.middleware";
import { Response } from "express";
import { createMatchStatus, deleteMatchStatus, getLikeData, getMatchStatus, getTargetIdsWithStatus, getViewData } from "../models/match.model";
import { getUsernameFromId } from "../models/user.model";
import { MatchRequest, matchStatus } from "../types/match.types";
import { increaseUserFame } from "../models/profile.model";

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
      res.status(400).json({ error: "Invalid ID" });
      return; 
    }

    const statusFromTarget = await getMatchStatus(targetId, userId);
    if (statusFromTarget?.includes(matchStatus.BLOCK)) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }
    
    const statusFromUser = await getMatchStatus(userId, targetId);
    if (action !== matchStatus.UNBLOCK && statusFromUser?.includes(matchStatus.BLOCK)) {
      res.status(400).json({ error: "need to unblock user first" });
      return;
    }

    switch (action) {
      case matchStatus.LIKE:
        await createMatchStatus(userId, targetId, matchStatus.LIKE);
        if (statusFromTarget?.includes(matchStatus.LIKE)) {
          await createMatchStatus(userId, targetId, matchStatus.CONNECTED);
          await createMatchStatus(targetId, userId, matchStatus.CONNECTED);
        }
        await increaseUserFame(targetId, 1);
        res.status(200).json({ message: `${userId} ${action} ${targetId}`});
        return;

      case matchStatus.BLOCK:
        await createMatchStatus(userId, targetId, matchStatus.BLOCK);
        if (await deleteMatchStatus(userId, targetId, matchStatus.LIKE)) {
         await increaseUserFame(targetId, -1); 
        }
        await deleteMatchStatus(userId, targetId, matchStatus.CONNECTED);
        await deleteMatchStatus(targetId, userId, matchStatus.CONNECTED);
        await increaseUserFame(targetId, -5);
        res.status(200).json({ message: `${userId} ${action} ${targetId}`});
        return;

      case matchStatus.VIEW:
      case matchStatus.REPORT:
        await createMatchStatus(userId, targetId, action);
        res.status(200).json({ message: `${userId} ${action} ${targetId}`});
        return;

      case matchStatus.UNLIKE:
        await deleteMatchStatus(userId, targetId, matchStatus.LIKE);
        await deleteMatchStatus(userId, targetId, matchStatus.CONNECTED);
        await deleteMatchStatus(targetId, userId, matchStatus.CONNECTED);
        await increaseUserFame(targetId, -1);
        res.status(200).json({ message: `${userId} ${action} ${targetId}`});
        return;

      case matchStatus.UNBLOCK:
        await deleteMatchStatus(userId, targetId, matchStatus.BLOCK);
        await increaseUserFame(targetId, 5);
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
      res.status(400).json({ error: "Invalid ID" });
      return; 
    }

    const statusFromTarget = await getMatchStatus(targetId, userId);
    if (statusFromTarget?.includes(matchStatus.BLOCK)) {
      res.status(200).json({ isBlockedByTarget: true });
      return;
    }

    const statusFromUser = await getMatchStatus(userId, targetId);
    res.status(200).json({ 
      isConnected: statusFromUser?.includes(matchStatus.CONNECTED) || false,
      hasLikedTarget: statusFromUser?.includes(matchStatus.LIKE) || false,
      isBlockingTarget: statusFromUser?.includes(matchStatus.BLOCK) || false,
      isBlockedByTarget: false,
    });
  } catch (error) {
    console.error("error updating match status", error);
    res.status(500).json({ error: "internal server error" });
  }
};

export const getConnectedUsersHandler = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: "user not authenticated" });
      return;
    }

    const connectedUsers = await getTargetIdsWithStatus(userId, matchStatus.CONNECTED);
    res.status(200).json({ connectedUsers });

  } catch (error) {
    console.error("error getting connected users", error);
    res.status(500).json({ error: "internal server error" });
  }
};

export const getAccountDataHandler = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: "user not authenticated" });
      return;
    }

    const views = await getViewData(userId);
    const likes = await getLikeData(userId);
    res.status(200).json({ views, likes });
  } catch (error) {
    console.error("error getting account data", error);
    res.status(500).json({ error: "Internal server error" });
  }
}