export interface MatchRequest {
    action: string;
    targetId: string;
}

export enum matchStatus {
    LIKE = 'like',
    UNLIKE = 'unlike',
    CONNECTED = 'connected',
    BLOCK = 'block',
    UNBLOCK = 'unblock',
    VIEW = 'view',
    REPORT = 'report',
}