import { createCookie } from 'react-router';

export const apiConfigCookie = createCookie('__maily_config__', {
  maxAge: 60 * 60 * 24 * 30, // 30 days
  httpOnly: !import.meta.env.DEV,
  secure: !import.meta.env.DEV,
});
