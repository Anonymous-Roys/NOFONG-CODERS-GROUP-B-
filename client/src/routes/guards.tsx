import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const RequireAuth: React.FC = () => {
  const { status } = useAuth();
  const location = useLocation();

  if (status === 'authenticated') return <Outlet />;
  if (status === 'otp_sent') return <Navigate to="/signup" replace state={{ from: location }} />;
  if (status === 'profile_pending') return <Navigate to="/profile/create" replace state={{ from: location }} />;
  return <Navigate to="/login" replace state={{ from: location }} />;
};

export const PublicOnly: React.FC = () => {
  const { status } = useAuth();
  if (status === 'authenticated') return <Navigate to="/" replace />;
  return <Outlet />;
};


