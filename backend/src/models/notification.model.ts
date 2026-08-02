import { query } from "../config/database";

export const createNotification = async (
    userId: string,
    fromUserId: string,
    type: string,
): Promise<void> => {
    const sql = `
        INSERT INTO notifications (user_id, from_user_id, type)
        VALUES ($1, $2, $3)
    `;
    await query(sql, [userId, fromUserId, type]);
};

export const getNotifications = async (
    userId: string
): Promise<any[]> => {
    const sql = `
        SELECT *
        FROM notifications
        WHERE user_id = $1
        ORDER BY created_at DESC
    `;
    const result = await query(sql, [userId]);
    return result.rows;
};

export const markNotificationsAsRead = async (
    userId: string
): Promise<void> => {
    const sql = `
        UPDATE notifications
        SET is_read = TRUE
        WHERE user_id = $1
        AND is_read = FALSE
    `;
    await query(sql, [userId])
};