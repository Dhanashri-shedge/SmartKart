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

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders?status=pending', { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      setOrders([]);
    }
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
                12
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
                45
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
                38
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
                3
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
                  {order.status === 'pending' ? <Pending color="warning" /> : order.status === 'accepted' ? <CheckCircle color="success" /> : order.status === 'delivered' ? <CheckCircle color="info" /> : <Cancel color="error" />}
                </ListItemIcon>
                <ListItemText
                  primary={`Order #${order._id.slice(-6)} from ${order.vendorId?.businessName || order.vendorId?.name || 'Unknown'}`}
                  secondary={`₹${order.totalAmount?.toLocaleString()} - ${order.items?.map(i => i.name).join(', ')} - ${order.status}`}
                />
                {order.status === 'pending' ? (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button variant="contained" size="small" color="success" onClick={async () => {
                      await fetch(`/api/orders/${order._id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                        body: JSON.stringify({ status: 'accepted' })
                      });
                      fetchOrders();
                    }}>
                      Accept
                    </Button>
                    <Button variant="outlined" size="small" color="error" onClick={async () => {
                      await fetch(`/api/orders/${order._id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                        body: JSON.stringify({ status: 'rejected' })
                      });
                      fetchOrders();
                    }}>
                      Reject
                    </Button>
                  </Box>
                ) : (
                  <Chip label={order.status} color={order.status === 'accepted' ? 'success' : order.status === 'delivered' ? 'info' : 'error'} size="small" />
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