import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { routes } from './routes';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Providers } from './providers';

const router = createBrowserRouter(routes);
const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <StrictMode>
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  </StrictMode>
);