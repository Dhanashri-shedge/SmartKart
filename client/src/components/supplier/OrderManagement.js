import React from 'react';
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
            <ListItem divider>
              <ListItemIcon>
                <Pending color="warning" />
              </ListItemIcon>
              <ListItemText
                primary="Order #123456 from ABC Grocery"
                secondary="₹15,000 - Vegetables & Fruits - Pending"
              />
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button variant="contained" size="small" color="success">
                  Accept
                </Button>
                <Button variant="outlined" size="small" color="error">
                  Reject
                </Button>
              </Box>
            </ListItem>
            <ListItem divider>
              <ListItemIcon>
                <CheckCircle color="success" />
              </ListItemIcon>
              <ListItemText
                primary="Order #123455 from XYZ Restaurant"
                secondary="₹8,500 - Grains & Spices - Accepted"
              />
              <Chip label="Accepted" color="success" size="small" />
            </ListItem>
            <ListItem divider>
              <ListItemIcon>
                <CheckCircle color="info" />
              </ListItemIcon>
              <ListItemText
                primary="Order #123454 from Fresh Market"
                secondary="₹12,000 - Dairy Products - Delivered"
              />
              <Chip label="Delivered" color="info" size="small" />
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

export default OrderManagement; 