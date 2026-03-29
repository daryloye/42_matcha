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
