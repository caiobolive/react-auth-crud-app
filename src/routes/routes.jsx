import { createBrowserRouter, Navigate, useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { Home } from '../pages/home';
import { Auth } from '../pages/auth';
import { ErrorBoundary } from '../components/ErrorBoundary';
import React from 'react';

function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.userData?.userData);

  if (!userData?.token) {
    navigate('/auth');
    return null;
  }
  return children;
}

function PublicRoute({ children }) {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.userData?.userData);

  if (userData?.token) {
    navigate('/home');
    return null;
  }
  return children;
}

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Navigate to="/auth" replace />,
      errorElement: <ErrorBoundary />,
    },
    {
      path: '/auth',
      element: (
        <PublicRoute>
          <Auth />
        </PublicRoute>
      ),
      errorElement: <ErrorBoundary />,
    },
    {
      path: '/home',
      element: (
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      ),
      errorElement: <ErrorBoundary />,
    },
    {
      path: '*',
      element: <ErrorBoundary />,
    },
  ],
  {
    basename: '/react-auth-crud-app',
  },
);
