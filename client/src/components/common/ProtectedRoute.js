import React from 'react';
import { Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children, userType }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (userType && user.userType !== userType) {
    // Redirect to appropriate dashboard based on user type
    if (user.userType === 'vendor') {
      return <Navigate to="/vendor" replace />;
    } else {
      return <Navigate to="/supplier" replace />;
    }
  }

  return children;
};

export default ProtectedRoute; 