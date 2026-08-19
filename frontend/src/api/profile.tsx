import { DeleteHTTP, GetHTTP, PostHTTP } from './httpClient';

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

export async function GetProfilePic() {
  return await GetHTTP(
    '/api/profile/profilepic',
    new Headers({
      'Content-Type': 'application/json',
    }),
  );
}

export async function DeleteProfilePic() {
  return await DeleteHTTP(
    '/api/profile/profilepic',
    new Headers({
      'Content-Type': 'application/json',
    }),
  );
}

export async function GetPictures() {
  return await GetHTTP(
    '/api/profile/pictures',
    new Headers({
      'Content-Type': 'application/json',
    }),
  );
}

export async function DeletePicture(pictureId: string) {
  return await DeleteHTTP(
    `/api/profile/pictures/${pictureId}`,
    new Headers({
      'Content-Type': 'application/json',
    }),
  );
}

export async function GetOpenMeteoGeocoding(location: string) {
  const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error || 'Unknown error');
  }
  return data;
}
