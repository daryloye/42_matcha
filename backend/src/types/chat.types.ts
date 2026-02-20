export interface GetMessagesRequest {
  targetUserId: number;
}

export interface PostMessageRequest {
  targetUserId: number;
  message: string;
}
