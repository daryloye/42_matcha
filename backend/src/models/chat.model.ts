import { query } from "../config/database";

export const getOrCreateChat = async (
  user1: number,
  user2: number,
): Promise<string | null> => {
  const u1 = Math.min(user1, user2);
  const u2 = Math.max(user1, user2);

  const sql = `
    INSERT INTO chat (user1_id, user2_id)
    VALUES ($1, $2)
    ON CONFLICT (user1_id, user2_id)
    DO UPDATE SET user1_id = EXCLUDED.user1_id
    RETURNING id;
  `;

  const result = await query(sql, [u1, u2]);
  return result.rows[0].id;
};
