import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { routes } from './routes'; // Import the routes
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const router = createBrowserRouter(routes);
const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);