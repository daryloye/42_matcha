import { GetHTTP, PostHTTP } from "./httpClient";

export async function SendMessage(params: any) {
  return await PostHTTP(
    '/api/chat/send',
    new Headers({
      'Content-Type': 'application/json',
    }),
    JSON.stringify(params),
  );
}

export async function GetMessages(targetId: string) {
  return await GetHTTP(
    `/api/chat/?targetId=${targetId}`,
    new Headers({
      'Content-Type': 'application/json',
    }),
  );
}
