import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { userStore } from './userContext';

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = userStore();

  if (loading) {
    // You can show a loading spinner here
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
