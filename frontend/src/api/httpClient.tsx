const API_URL = import.meta.env.VITE_API_URL;

export async function PostHTTP(
  endpoint: string,
  headers: HeadersInit,
  body: string,
) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers: headers,
    body: body,
    credentials: 'include',
  });

  const data = await res.json();
  
  if (res.status === 401) {
    window.location.href = '/';
    throw new Error('Session expired');
  }
  
  if (!res.ok) {
    throw new Error(data?.error || 'Unknown error');
  }

  return data;
}

export async function GetHTTP(endpoint: string, headers: HeadersInit) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: 'GET',
    headers: headers,
    credentials: 'include',
  });

  const data = await res.json();

  if (res.status === 401) {
    window.location.href = '/';
    throw new Error('Session expired');
  }

  if (!res.ok) {
    throw new Error(data?.error || 'Unknown error');
  }

  return data;
}
