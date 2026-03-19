import { query } from "../config/database";

export const createMatchStatus = async (
    userId: string,
    targetId: string,
    status: string
): Promise<any | null> => {
  const sql = `
        INSERT INTO relationships (user_id, target_user_id, status)
        VALUES ($1, $2, $3)
    `;
  const result = await query(sql, [userId, targetId, status]);
  return result.rows.length > 0 ? result.rows[0] : null;
};

export const deleteMatchStatus = async (
    userId: string,
    targetId: string,
    status: string
): Promise<any | null> => {
  const sql = `
        DELETE FROM relationships
        WHERE user_id = $1
        AND target_user_id = $2
        AND status = $3
    `;
  const result = await query(sql, [userId, targetId, status]);
  return result.rows.length > 0 ? result.rows[0] : null;
};

export const getMatchStatus = async (
    userId: string,
    targetId: string,
): Promise<any | null> => {
  const sql = `
        SELECT status FROM relationships
        WHERE user_id = $1
        AND target_user_id = $2
    `;
  const result = await query(sql, [userId, targetId]);
  return result.rows.length > 0 ? result.rows[0] : null;
};

export const getTargetIdsWithStatus = async (
  userId: string,
  status: string,
): Promise<any | null> => {
  const sql = `
        SELECT target_user_id FROM relationships
        WHERE user_id = $1
        AND status = $2
    `;
  const result = await query(sql, [userId, status]);
  return result.rows.length > 0 ? result.rows[0] : null;
};
