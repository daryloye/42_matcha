import { query } from "../config/database";

export const createMatchStatus = async (
    userId: string,
    targetId: string,
    status: string
): Promise<any | null> => {
  const sql = `
        INSERT INTO relationships (user_id, target_user_id, status)
        VALUES ($1, $2, $3)
        ON CONFLICT DO NOTHING
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
  const res = await query(sql, [userId, targetId, status]);
  return(res.rowCount);
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
  return result.rows.length > 0 ? result.rows.map(row => row.status) : null;
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
  return result.rows.length > 0 ? result.rows.map(row => row.target_user_id) : null;
};

export const getViewData = async (userId: string): Promise<any | void> => {
  const sql = `
    SELECT 
      r.user_id,
      r.status,
      u.first_name,
      u.last_name
    FROM relationships r
    LEFT JOIN users u on u.id = r.user_id
    WHERE r.target_user_id = $1
    and r.status = 'view'
    `;
    const result = await query(sql, [userId]);
    return result.rows.length > 0 ? result.rows : null;
}

export const getLikeData = async (userId: string): Promise<any | void> => {
  const sql = `
    SELECT 
      r.user_id,
      r.status,
      u.first_name,
      u.last_name
    FROM relationships r
    LEFT JOIN users u on u.id = r.user_id
    WHERE r.target_user_id = $1
    and r.status = 'like'
    `;
    const result = await query(sql, [userId]);
    return result.rows.length > 0 ? result.rows : null;
}