import { GetHTTP, PostHTTP } from './httpClient';

export async function Login(params: any) {
  return await PostHTTP(
    '/api/auth/login',
    new Headers({
      'Content-Type': 'application/json',
    }),
    JSON.stringify({
      username: params.username,
      password: params.password,
    }),
  );
}

export async function Register(params: any) {
  return await PostHTTP(
    '/api/auth/register',
    new Headers({
      'Content-Type': 'application/json',
    }),
    JSON.stringify({
      last_name: params.lastname,
      first_name: params.firstname,
      email: params.email,
      username: params.username,
      password: params.password,
    }),
  );
}

export async function Verify(token: string) {
  return await GetHTTP(
    `/api/auth/verify?token=${encodeURIComponent(token)}`,
    new Headers({
      'Content-Type': 'application/json',
    }),
  );
}

export async function ForgotPassword(params: any) {
  return await PostHTTP(
    '/api/auth/forgot-password',
    new Headers({
      'Content-Type': 'application/json',
    }),
    JSON.stringify({
      email: params.email,
    }),
  );
}

export async function ResetPassword(params: any) {
  return await PostHTTP(
    `/api/auth/reset-password`,
    new Headers({
      'Content-Type': 'application/json',
    }),
    JSON.stringify({
      newPassword: params.password,
      resetToken: params.token,
    }),
  );
}
