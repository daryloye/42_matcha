import { GetHTTP, PostHTTP } from "./httpClient";

export async function SendMessage(token: string, params: any) {
  return await PostHTTP(
    '/api/chat/send',
    new Headers({
      'Content-Type': 'application/json',
      Authorization: token,
    }),
    JSON.stringify(params),
  );
}

export async function GetMessages(token: string, targetId: string) {
  return await GetHTTP(
    `/api/chat/?targetId=${targetId}`,
    new Headers({
      'Content-Type': 'application/json',
      Authorization: token,
    }),
  );
}
