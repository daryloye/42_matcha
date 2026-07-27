export function setToken(token: string) {
  localStorage.setItem('token', token);
}

export function getToken() {
  return localStorage.getItem('token');
}

export function deleteToken() {
  localStorage.removeItem('token');
}
