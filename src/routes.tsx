// src/routes.tsx
import { RouteObject } from 'react-router-dom';
import App from './App';
import AllListings from './pages/AllListings';
import AuthProvider from './app/AuthProvider';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Dashboard from './pages/Dashboard';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: (
      <AuthProvider>
        <App />
      </AuthProvider>
    ),
    children: [
      { path: 'about', element: <AllListings /> },
      { 
        path: 'dashboard', 
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ) 
      },
      // Add other protected routes here
    ],
  },
];