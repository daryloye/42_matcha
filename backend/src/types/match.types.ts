export interface MatchRequest {
    action: string,
    targetId: string,
}

export interface MatchStatusRequest {
    targetId: string,
}

export interface MatchStatusResponse {
    isConnected: boolean,
    hasLikedTarget: boolean,
    isBlockingTarget: boolean,
    isBlockedByTarget: boolean
}