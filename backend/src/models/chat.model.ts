import { query } from "../config/database";

export const createChat = async (
    fromId: string,
    toId: string,
    message: string
): Promise<any | null> => {
  const sql = `
        INSERT INTO chat (from_user_id, to_user_id, message)
        VALUES ($1, $2, $3)
    `;
  const result = await query(sql, [fromId, toId, message]);
  return result.rows.length > 0 ? result.rows[0] : null;
};

export const getChat = async (
    user1: string,
    user2: string,
): Promise<any | null> => {
  const sql = `
        SELECT * FROM chat
        WHERE 
        (
            (from_user_id = $1 AND to_user_id = $2)
        OR  (from_user_id = $2 AND to_user_id = $1)
        )
        ORDER BY created_at
    `;
  const result = await query(sql, [user1, user2]);
  return result.rows.length > 0 ? result.rows : null;
};
