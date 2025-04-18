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
import LoginPage from './pages/LoginPage';
import { AdminRoute } from './components/common/AdminRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import PendingListings from './pages/admin/PendingListings';
import Users from './pages/admin/Users';
import Layout from './pages/admin/Layout';

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
      { path: 'login-page', element: <LoginPage /> },
      {
        path: "admin",
        element: (
          <AdminRoute>
            <Layout />
          </AdminRoute>
        ),
        children: [
          { path: "admindashboard", element: <AdminDashboard /> },
          { path: "pending-listings", element: <PendingListings /> },
          { path: "users", element: <Users /> },
        ],
      }
    ],
  },
];