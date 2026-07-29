import { GetHTTP, PostHTTP } from './httpClient';

export async function GetBasicProfile() {
  return await GetHTTP(
    '/api/profile/me',
    new Headers({
      'Content-Type': 'application/json',
    }),
  );
}

export async function GetFullProfile() {
  return await GetHTTP(
    '/api/profile/details',
    new Headers({
      'Content-Type': 'application/json',
    }),
  );
}

export async function UpdateProfile(params: any) {
  return await PostHTTP(
    '/api/profile/details',
    new Headers({
      'Content-Type': 'application/json',
    }),
    JSON.stringify(params),
  );
}
