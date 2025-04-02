// src/routes.tsx
import { RouteObject } from 'react-router-dom';
import App from './App';
import AllListings from './pages/AllListingsPage';
import AuthProvider from './app/AuthProvider';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import MyListings from './pages/MyListings';
import AuthLayout from './layouts/AuthLayout'; 
import ListingDetails from "./pages/ListingsDetails";


// src/routes.tsx
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <App />, // Public layout
    children: [
     
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
      {
        path: "listing/:id",
        element:  (
          <ProtectedRoute>
            <ListingDetails />
          </ProtectedRoute>
        )
      }, 
      { path: 'all-listings', element: <AllListings /> },
    ],
  },
];