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
import Messages from '@/pages/Messages';
import MessageDetail from '@/pages/MessageDetail';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <App />,
    children: [
      
    ],
  },
  {
    path: '/login-page',
    element: <LoginPage />,

  },
  { path: 'all-listings', element: <AllListings /> },


  {path: "/messages", element: <Messages /> },
  {path: "/messages/:id", element: <MessageDetail />},
   {path: "/messages/new", element: <MessageDetail />},
  {
    path: '/',
    element: (
      <AuthProvider>
        <AuthLayout />
      </AuthProvider>
    ),
    children: [
      { path: 'dashboard', element: <ProtectedRoute><Dashboard /></ProtectedRoute> },
      { path: 'my-listings', element: <ProtectedRoute><MyListings /></ProtectedRoute> },
      { path: 'listing/:id', element: <ProtectedRoute><ListingDetails /></ProtectedRoute> },
    ],
  },
  {
    path: '/admin',
    element: (
      <AuthProvider>
        <Layout />
      </AuthProvider>
    ),
    children: [
      { 
        index: true, 
        element: <AdminRoute><AdminDashboard /></AdminRoute> 
      },
      { 
        path: 'pending-listings', 
        element: <AdminRoute><PendingListings /></AdminRoute> 
      },
      { 
        path: 'users', 
        element: <AdminRoute><Users /></AdminRoute> 
      },
    ],
  },
]