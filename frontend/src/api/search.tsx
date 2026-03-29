import { GetHTTP } from './httpClient';

export async function GetSearchProfiles(token: string) {
  return await GetHTTP(
    '/api/search',
    new Headers({
      'Content-Type': 'application/json',
      Authorization: token,
    }),
  );
}

export async function GetUserProfile(token: string, targetId: string) {
  return await GetHTTP(
    `/api/search/${targetId}`,
    new Headers({
      'Content-Type': 'application/json',
      Authorization: token,
    }),
  );
}
