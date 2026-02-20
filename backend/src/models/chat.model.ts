import { query } from "../config/database";

export const getMessages = async (
  user1: number,
  user2: number,
): Promise<any | null> => {
  const u1 = Math.min(user1, user2);
  const u2 = Math.max(user1, user2);

  const sql = `
    SELECT user1_id, user2_id, sender_id, message, created_at FROM chat
    WHERE user1_id = $1
    AND user2_id = $2
    ORDER BY created_at DESC;
  `;

  const result = await query(sql, [u1, u2]);
  return result.rows;
};

export const postMessage = async (
  user1: number,
  user2: number,
  sender: number,
  message: string,
): Promise<any | null> => {
  const u1 = Math.min(user1, user2);
  const u2 = Math.max(user1, user2);

  const sql = `
  INSERT INTO chat
  (user1_id, user2_id, sender_id, message)
  VALUES ($1, $2, $3, $4);
  `;

  const result = await query(sql, [u1, u2, sender, message]);
  return result.rows[0];
};

export const updateReadMessages = async (
  user1: number,
  user2: number,
): Promise<any | null> => {
  const u1 = Math.min(user1, user2);
  const u2 = Math.max(user1, user2);

  const sql = `
    UPDATE chat
    SET is_read = true
    WHERE user1_id = $1
    AND user2_id = $2
  `;

  const result = await query(sql, [u1, u2]);
  return result.rows;
};

export const getUnreadMessages = async (
  user1: number,
  user2: number,
): Promise<any | null> => {
  const u1 = Math.min(user1, user2);
  const u2 = Math.max(user1, user2);

  const sql = `
    SELECT * FROM chat
    WHERE is_read = false
    AND user1_id = $1
    AND user2_id = $2
  `;

  const result = await query(sql, [u1, u2]);
  return result.rows;
};
