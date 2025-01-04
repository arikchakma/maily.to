import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('playground', 'routes/playground.tsx'),
  route('login', 'routes/login.tsx'),
  ...prefix('auth', [
    route('callback', 'routes/auth-callback.ts'),
    route('confirm', 'routes/auth-confirm.ts'),
  ]),
  route('templates', 'routes/templates.tsx'),
  route('templates/:templateId', 'routes/template.tsx'),
] satisfies RouteConfig;
