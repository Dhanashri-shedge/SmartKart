import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
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
    recentOrders: [],
    deliveries: [
      {
        address: '123 Street, Pune',
        date: '2025-07-30',
        time: '10:00 AM',
        status: 'scheduled'
      },
      {
        address: 'JM Road, Pune',
        date: '2025-07-25',
        time: '03:00 PM',
        status: 'in transit'
      },
      {
        address: 'Kothrud, Pune',
        date: '2025-07-20',
        time: '12:00 PM',
        status: 'delivered'
      },
      {
        address: 'Nashik Road, Nashik',
        date: '2025-07-18',
        time: '02:00 PM',
        status: 'cancelled'
      }
    ]
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

      setStats(prev => ({
        ...prev,
        totalGroups: groups.length,
        activeGroups: groups.filter(g => g.status === 'active').length,
        totalPaid: payments.filter(p => p.paymentStatus === 'paid').reduce((sum, p) => sum + p.totalAmount, 0),
        pendingPayments: payments.filter(p => p.paymentStatus === 'pending').reduce((sum, p) => sum + p.totalAmount, 0),
        recentOrders: payments.slice(0, 5)
      }));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ color, mr: 2 }}>{icon}</Box>
          <Typography variant="h6">{title}</Typography>
        </Box>
        <Typography variant="h4" sx={{ mb: 1 }}>{value}</Typography>
        {subtitle && <Typography variant="body2" color="text.secondary">{subtitle}</Typography>}
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Vendor Dashboard</Typography>

      {/* Stats Cards */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Groups" value={stats.totalGroups ?? 0} icon={<Group />} color="primary.main" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Active Groups" value={stats.activeGroups ?? 0} icon={<TrendingUp />} color="success.main" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Paid" value={`₹${stats.totalPaid ?? 0}`} icon={<Payment />} color="info.main" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Pending Payments" value={`₹${stats.pendingPayments ?? 0}`} icon={<Pending />} color="warning.main" />
        </Grid>
      </Grid>

      {/* Deliveries */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Upcoming Deliveries</Typography>
              <List>
                {stats.deliveries.filter(d => d.status === 'scheduled' || d.status === 'in transit').map((delivery, index) => (
                  <ListItem key={index} divider>
                    <ListItemIcon>
                      {delivery.status === 'scheduled' ? <Schedule color="primary" /> : <Pending color="warning" />}
                    </ListItemIcon>
                    <ListItemText
                      primary={`Delivery to ${delivery.address}`}
                      secondary={`Date: ${delivery.date} | Time: ${delivery.time}`}
                    />
                    <Chip
                      label={delivery.status}
                      color={delivery.status === 'scheduled' ? 'info' : 'warning'}
                      size="small"
                    />
                  </ListItem>
                ))}
                {stats.deliveries.filter(d => d.status === 'scheduled' || d.status === 'in transit').length === 0 && (
                  <ListItem>
                    <ListItemText primary="No upcoming deliveries" />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Delivery History</Typography>
              <List>
                {stats.deliveries.filter(d => d.status === 'delivered' || d.status === 'cancelled').map((delivery, index) => (
                  <ListItem key={index} divider>
                    <ListItemIcon>
                      {delivery.status === 'delivered' ? <CheckCircle color="success" /> : <Error color="error" />}
                    </ListItemIcon>
                    <ListItemText
                      primary={`Delivery to ${delivery.address}`}
                      secondary={`Date: ${delivery.date} | Time: ${delivery.time}`}
                    />
                    <Chip
                      label={delivery.status}
                      color={delivery.status === 'delivered' ? 'success' : 'error'}
                      size="small"
                    />
                  </ListItem>
                ))}
                {stats.deliveries.filter(d => d.status === 'delivered' || d.status === 'cancelled').length === 0 && (
                  <ListItem>
                    <ListItemText primary="No past deliveries yet" />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default VendorHome;
