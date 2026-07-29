import { GetHTTP, PostHTTP } from "./httpClient";

export async function UpdateMatchStatus(params: any) {
  return await PostHTTP(
    '/api/match/update',
    new Headers({
      'Content-Type': 'application/json',
    }),
    JSON.stringify(params),
  );
}

export async function GetMatchStatus(targetId: string) {
  return await GetHTTP(
    `/api/match/status?targetId=${targetId}`,
    new Headers({
      'Content-Type': 'application/json',
    }),
  );
}

export async function GetConnectedUsers() {
  return await GetHTTP(
    `/api/match/connected`,
    new Headers({
      'Content-Type': 'application/json',
    }),
  );
}

export async function GetAccountData() {
  return await GetHTTP(
    `/api/match/account`,
    new Headers({
      'Content-Type': 'application/json',
    }),
  );
}
