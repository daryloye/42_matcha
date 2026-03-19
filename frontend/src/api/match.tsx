import { PostHTTP } from "./httpClient";

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
