const API_URL = import.meta.env.VITE_API_URL;

async function PostHTTP(endpoint: string, headers: HeadersInit, body: string) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers: headers,
    body: body,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error || 'Unknown error');
  }

  return data;
}

async function GetHTTP(endpoint: string, headers: HeadersInit) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: 'GET',
    headers: headers,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error || 'Unknown error');
  }

  return data;
}

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
      username: params.username,
      first_name: params.firstname,
      last_name: params.lastname,
      password: params.password,
    }),
  );
}

export async function Verify(token: string) {
  console.log(token);
  return await GetHTTP(
    `/api/auth/verify?token=${encodeURIComponent(token)}`,
    new Headers({
      'Content-Type': 'application/json',
    }),
  );
}
