import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  ShoppingCart,
  TrendingUp,
  CheckCircle,
  Pending,
  Error,
  Notifications
} from '@mui/icons-material';
import axios from 'axios';

const SupplierHome = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
    recentOrders: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/suppliers/dashboard');
      const data = response.data;

      setStats({
        totalOrders: data.monthlyOrders || 0,
        pendingOrders: data.pendingOrders || 0,
        completedOrders: data.monthlyOrders - (data.pendingOrders || 0),
        totalRevenue: data.monthlyRevenue || 0,
        recentOrders: data.recentOrders || []
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ color, mr: 2 }}>
            {icon}
          </Box>
          <Typography variant="h6" component="div">
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" component="div" sx={{ mb: 1 }}>
          {value}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle color="success" />;
      case 'pending':
        return <Pending color="warning" />;
      case 'accepted':
        return <CheckCircle color="info" />;
      default:
        return <Error color="error" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'success';
      case 'pending':
        return 'warning';
      case 'accepted':
        return 'info';
      default:
        return 'error';
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Supplier Dashboard
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={<ShoppingCart />}
            color="primary.main"
            subtitle="This month"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Orders"
            value={stats.pendingOrders}
            icon={<Pending />}
            color="warning.main"
            subtitle="Awaiting action"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Completed"
            value={stats.completedOrders}
            icon={<CheckCircle />}
            color="success.main"
            subtitle="Successfully delivered"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Revenue"
            value={`₹${stats.totalRevenue.toLocaleString()}`}
            icon={<TrendingUp />}
            color="info.main"
            subtitle="This month"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Orders
              </Typography>
              <List>
                {stats.recentOrders.map((order, index) => (
                  <ListItem key={index} divider>
                    <ListItemIcon>
                      {getStatusIcon(order.status)}
                    </ListItemIcon>
                    <ListItemText
                      primary={`Order from ${order.vendorId?.businessName || 'Unknown'}`}
                      secondary={`₹${order.totalAmount} - ${order.status}`}
                    />
                    <Chip
                      label={order.status}
                      color={getStatusColor(order.status)}
                      size="small"
                    />
                  </ListItem>
                ))}
                {stats.recentOrders.length === 0 && (
                  <ListItem>
                    <ListItemText
                      primary="No recent orders"
                      secondary="New orders will appear here"
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<ShoppingCart />}
                  fullWidth
                >
                  View Pending Orders
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<CheckCircle />}
                  fullWidth
                >
                  Update Order Status
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<TrendingUp />}
                  fullWidth
                >
                  View Order History
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Notifications />}
                  fullWidth
                >
                  Manage Notifications
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SupplierHome; 