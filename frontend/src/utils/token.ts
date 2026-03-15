export function setToken(token: string) {
  localStorage.setItem('token', token);
}

export function getToken() {
  const token = localStorage.getItem('token');
  return token;
}

export function deleteToken() {
  localStorage.setItem('token', '');
}
