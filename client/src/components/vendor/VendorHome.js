import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  Group,
  Payment,
  TrendingUp,
  Schedule,
  Notifications,
  CheckCircle,
  Pending,
  Error
} from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const VendorHome = () => {
  const [stats, setStats] = useState({
    totalGroups: 0,
    activeGroups: 0,
    totalPaid: 0,
    pendingPayments: 0,
    recentOrders: []
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [groupsResponse, paymentsResponse] = await Promise.all([
        axios.get('/api/vendors/groups'),
        axios.get('/api/payments/history')
      ]);

      const groups = groupsResponse.data.orderGroups || [];
      const payments = paymentsResponse.data.orders || [];

      setStats({
        totalGroups: groups.length,
        activeGroups: groups.filter(g => g.status === 'active').length,
        totalPaid: payments.filter(p => p.paymentStatus === 'paid')
          .reduce((sum, p) => sum + p.totalAmount, 0),
        pendingPayments: payments.filter(p => p.paymentStatus === 'pending')
          .reduce((sum, p) => sum + p.totalAmount, 0),
        recentOrders: payments.slice(0, 5)
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

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome back!
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Groups"
            value={stats.totalGroups}
            icon={<Group />}
            color="primary.main"
            subtitle="Bulk order groups created"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Groups"
            value={stats.activeGroups}
            icon={<TrendingUp />}
            color="success.main"
            subtitle="Currently active orders"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Paid"
            value={`₹${stats.totalPaid.toLocaleString()}`}
            icon={<Payment />}
            color="info.main"
            subtitle="Total payments made"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending"
            value={`₹${stats.pendingPayments.toLocaleString()}`}
            icon={<Schedule />}
            color="warning.main"
            subtitle="Payments pending"
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
                      {order.paymentStatus === 'paid' ? (
                        <CheckCircle color="success" />
                      ) : order.paymentStatus === 'pending' ? (
                        <Pending color="warning" />
                      ) : (
                        <Error color="error" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={`Order #${order._id.slice(-6)}`}
                      secondary={`₹${order.totalAmount} - ${order.paymentStatus}`}
                    />
                    <Chip
                      label={order.paymentStatus}
                      color={order.paymentStatus === 'paid' ? 'success' : 'warning'}
                      size="small"
                    />
                  </ListItem>
                ))}
                {stats.recentOrders.length === 0 && (
                  <ListItem>
                    <ListItemText
                      primary="No recent orders"
                      secondary="Your recent orders will appear here"
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
                  startIcon={<Group />}
                  fullWidth
                  onClick={() => navigate('/vendor/groups')}
                >
                  Create Bulk Order Group
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Payment />}
                  fullWidth
                >
                  Make UPI Payment
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Schedule />}
                  fullWidth
                >
                  Schedule Delivery
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<TrendingUp />}
                  fullWidth
                >
                  View Material Prediction
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default VendorHome; 