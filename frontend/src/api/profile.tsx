import { GetHTTP } from './httpClient';

export async function GetBasicProfile(token: string) {
  return await GetHTTP(
    `/api/profile/me`,
    new Headers({
      'Content-Type': 'application/json',
      Authorization: token,
    }),
  );
}
