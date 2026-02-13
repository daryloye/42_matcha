const BACKEND_URL = 'http://localhost:5001';

export async function Login(params: any) {
  const endpoint = '/api/auth/login';

  const headers = new Headers();
  headers.append('Content-Type', 'application/json');

  const body = JSON.stringify({
    email: params.username,
    password: params.password,
  });

  const res = await fetch(`${BACKEND_URL}${endpoint}`, {
    method: 'POST',
    headers: headers,
    body: body,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.error || 'Unknown error');
  }

  return data;
}

export async function Register(params: any) {
  const endpoint = '/api/auth/register';

  const headers = new Headers();
  headers.append('Content-Type', 'application/json');

  const body = JSON.stringify({
    email: params.email,
    username: params.username,
    first_name: params.firstname,
    last_name: params.lastname,
    password: params.password,
  });

  const res = await fetch(`${BACKEND_URL}${endpoint}`, {
    method: 'POST',
    headers: headers,
    body: body,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.error || 'Unknown error');
  }

  return data;
}
