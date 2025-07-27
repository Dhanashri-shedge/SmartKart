import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import VendorDashboard from './components/vendor/VendorDashboard';
import SupplierDashboard from './components/supplier/SupplierDashboard';
import ProtectedRoute from './components/common/ProtectedRoute';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import CustomNavbar from './components/CustomNavbar';
import GroupForm from './components/GroupForm';
import HomePage from './components/HomePage';
import OrderForm from './components/OrderForm'; 
import axios from 'axios';

// Set default axios base URL
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

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

  return (
    <AuthProvider>
      <SocketProvider>
        <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element = {<AboutPage/>} />
            <Route path="/contact" element = {<ContactPage/>} />
            <Route path="/navbar" element = {<CustomNavbar/>} />
            <Route path="/Group" element = {<GroupForm/>} />
            <Route path="/home" element = {<HomePage/>} />
            <Route path="/order" element = {<OrderForm/>} />
            <Route
              path="/vendor/*"
              element={
                <ProtectedRoute userType="vendor">
                  <VendorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/supplier/*"
              element={
                <ProtectedRoute userType="supplier">
                  <SupplierDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </Box>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App; 