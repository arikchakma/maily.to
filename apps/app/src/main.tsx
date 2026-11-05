import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';

import { App } from './app';
import { MigrationPage } from './migration-page';

import './global.css';

const router = createBrowserRouter([
  { element: <App />, path: '/' },
  { element: <MigrationPage />, path: '/migration' },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
