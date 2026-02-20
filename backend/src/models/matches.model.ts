import { query } from "../config/database";

export const getMatches = async (user: number): Promise<any | null> => {
  const sql = `
    SELECT user1_id, user2_id
    FROM matches
    WHERE user1_id = $1
    OR user2_id = $1
  `;

  const result = await query(sql, [user]);
  return result.rows;
};

export const addMatch = async (
  user1: number,
  user2: number,
): Promise<any | null> => {
  const u1 = Math.min(user1, user2);
  const u2 = Math.max(user1, user2);

  const sql = `
    INSERT INTO matches
    (user1_id, user2_id)
    VALUES ($1, $2)
    ON CONFLICT DO NOTHING
  `;

  const result = await query(sql, [u1, u2]);
  return result.rows;
};

export const deleteMatch = async (
  user1: number,
  user2: number,
): Promise<any | null> => {
  const u1 = Math.min(user1, user2);
  const u2 = Math.max(user1, user2);

  const sql = `
    DELETE FROM matches
    WHERE user1_id = $1
    AND user2_id = $2
  `;

  const result = await query(sql, [u1, u2]);
  return result.rows;
};
