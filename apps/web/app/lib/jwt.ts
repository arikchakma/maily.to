export const TOKEN_COOKIE_NAME = '__maily_jt__';

export function isLoggedIn(req: Request) {
  const cookies = req.headers.get('cookie');
  if (!cookies) {
    return false;
  }

  const jwt = cookies.includes(TOKEN_COOKIE_NAME);
  if (!jwt) {
    return false;
  }

  return true;
}
