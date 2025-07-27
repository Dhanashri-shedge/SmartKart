import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import { ShoppingCart, CheckCircle, Cancel, Pending } from '@mui/icons-material';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    // Demo orders for frontend preview
    const demo = [
      {
        _id: '64ab12cdef001',
        vendorId: { businessName: 'Fresh Farms' },
        totalAmount: 1450,
        items: [{ name: 'Tomatoes' }, { name: 'Onions' }],
        status: 'pending'
      },
      {
        _id: '64ab12cdef002',
        vendorId: { name: 'Spice Mart' },
        totalAmount: 3200,
        items: [{ name: 'Turmeric' }, { name: 'Chili Powder' }],
        status: 'accepted'
      },
      {
        _id: '64ab12cdef003',
        vendorId: { businessName: 'Organic World' },
        totalAmount: 5000,
        items: [{ name: 'Rice' }, { name: 'Wheat' }],
        status: 'delivered'
      },
      {
        _id: '64ab12cdef004',
        vendorId: { name: 'Green Basket' },
        totalAmount: 900,
        items: [{ name: 'Carrots' }],
        status: 'rejected'
      }
    ];
    setOrders(demo);
  };

  const updateOrderStatus = (id, newStatus) => {
    setOrders(prev =>
      prev.map(order =>
        order._id === id ? { ...order, status: newStatus } : order
      )
    );
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Order Management
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {orders.filter(o => o.status === 'pending').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pending Orders
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">
                {orders.filter(o => o.status === 'accepted').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Accepted Orders
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="info.main">
                {orders.filter(o => o.status === 'delivered').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Delivered Orders
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="error">
                {orders.filter(o => o.status === 'rejected').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Rejected Orders
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recent Orders
          </Typography>
          <List>
            {orders.map((order) => (
              <ListItem key={order._id} divider>
                <ListItemIcon>
                  {order.status === 'pending' ? (
                    <Pending color="warning" />
                  ) : order.status === 'accepted' ? (
                    <CheckCircle color="success" />
                  ) : order.status === 'delivered' ? (
                    <CheckCircle color="info" />
                  ) : (
                    <Cancel color="error" />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={`Order #${order._id.slice(-6)} from ${order.vendorId?.businessName || order.vendorId?.name || 'Unknown'}`}
                  secondary={`₹${order.totalAmount?.toLocaleString()} - ${order.items?.map(i => i.name).join(', ')} - ${order.status}`}
                />
                {order.status === 'pending' ? (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      size="small"
                      color="success"
                      onClick={() => updateOrderStatus(order._id, 'accepted')}
                    >
                      Accept
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      color="error"
                      onClick={() => updateOrderStatus(order._id, 'rejected')}
                    >
                      Reject
                    </Button>
                  </Box>
                ) : (
                  <Chip
                    label={order.status}
                    color={
                      order.status === 'accepted'
                        ? 'success'
                        : order.status === 'delivered'
                        ? 'info'
                        : 'error'
                    }
                    size="small"
                  />
                )}
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

export default OrderManagement;
