import { GetHTTP, PostHTTP } from './httpClient';

export async function GetBasicProfile(token: string) {
  return await GetHTTP(
    '/api/profile/me',
    new Headers({
      'Content-Type': 'application/json',
      Authorization: token,
    }),
  );
}

export async function GetFullProfile(token: string) {
  return await GetHTTP(
    '/api/profile/details',
    new Headers({
      'Content-Type': 'application/json',
      Authorization: token,
    }),
  );
}

export async function UpdateProfile(token: string, params: any) {
  return await PostHTTP(
    '/api/profile/update',
    new Headers({
      'Content-Type': 'application/json',
      Authorization: token,
    }),
    JSON.stringify(params),
  );
}
