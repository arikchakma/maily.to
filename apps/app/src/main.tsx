import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';

import { App } from './app';
import { ComponentsPage } from './components-page';
import { MigrationPage } from './migration-page';

import './global.css';

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/migration', element: <MigrationPage /> },
  { path: '/components', element: <ComponentsPage /> },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
