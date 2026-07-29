import { GetHTTP } from './httpClient';

export async function GetSearchProfiles() {
  return await GetHTTP(
    '/api/search',
    new Headers({
      'Content-Type': 'application/json',
    }),
  );
}

export async function GetUserProfile(targetId: string) {
  return await GetHTTP(
    `/api/search/${targetId}`,
    new Headers({
      'Content-Type': 'application/json',
    }),
  );
}
