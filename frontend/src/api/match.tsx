import { GetHTTP, PostHTTP } from "./httpClient";

export async function UpdateMatchStatus(token: string, params: any) {
  return await PostHTTP(
    '/api/match/update',
    new Headers({
      'Content-Type': 'application/json',
      Authorization: token,
    }),
    JSON.stringify(params),
  );
}

export async function GetMatchStatus(token: string, targetId: string) {
  return await GetHTTP(
    `/api/match/status?targetId=${targetId}`,
    new Headers({
      'Content-Type': 'application/json',
      Authorization: token,
    }),
  );
}

export async function GetConnectedUsers(token: string) {
  return await GetHTTP(
    `/api/match/connected`,
    new Headers({
      'Content-Type': 'application/json',
      Authorization: token,
    }),
  );
}

export async function GetAccountData(token: string) {
  return await GetHTTP(
    `/api/match/account`,
    new Headers({
      'Content-Type': 'application/json',
      Authorization: token,
    }),
  );
}
