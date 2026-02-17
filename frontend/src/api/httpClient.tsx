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
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error || 'Unknown error');
  }

  return data;
}

export async function GetHTTP(endpoint: string, headers: HeadersInit) {
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
