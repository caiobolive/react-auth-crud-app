import { createBrowserRouter, Navigate, useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { Home } from '../pages/home';
import { Auth } from '../pages/auth';
import React from 'react';

function ProtectedRoute({ children }) {
  const userData = useSelector((state) => state.userData.userData);
  const navigate = useNavigate();

  if (!userData?.token) {
    navigate('/auth');
    return null;
  }
  return children;
}

function PublicRoute({ children }) {
  const userData = useSelector((state) => state.userData.userData);
  const navigate = useNavigate();

  if (userData?.token) {
    navigate('/home');
    return null;
  }
  return children;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/auth" replace />,
  },
  {
    path: '/auth',
    element: (
      <PublicRoute>
        <Auth />
      </PublicRoute>
    ),
    errorElement: <h1>404</h1>,
    children: [
      {
        path: '/auth',
        element: (
          <PublicRoute>
            <Auth />
          </PublicRoute>
        ),
      },
    ],
  },
  {
    path: '/home',
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
    errorElement: <h1>404</h1>,
    children: [
      {
        path: '/home',
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
