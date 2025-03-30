// src/routes.tsx
import { RouteObject } from 'react-router-dom';
import App from './App';
import AllListings from './pages/AllListings';
import AuthProvider from './app/AuthProvider';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import MyListings from './pages/MyListings';
import Home from './pages/Home'; 
import AuthLayout from './layouts/AuthLayout'; 

// src/routes.tsx
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <App />, // Public layout
    children: [
      { index: true, element: <Home /> },
      { path: 'all-listings', element: <AllListings /> },
    ],
  },
  {
    path: '/',
    element: (
      <AuthProvider>
        <AuthLayout /> {/* Private auth layout */}
      </AuthProvider>
    ),
    children: [
        // Add protected routes here
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'my-listings',
        element: (
          <ProtectedRoute>
            <MyListings />
          </ProtectedRoute>
        ),
      },

    ],
  },
];