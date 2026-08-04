import { GetHTTP, PatchHTTP } from './httpClient';

export async function GetNotifications() {
  return await GetHTTP(
    '/api/notifications',
    new Headers({
      'Content-Type': 'application/json',
    }),
  );
}

export async function MarkNotificationsRead() {
  return await PatchHTTP(
    '/api/notifications/read',
    new Headers({
      'Content-Type': 'application/json',
    }),
  );
}
