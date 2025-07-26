import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge,
  Avatar,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  Group,
  LocationOn,
  Payment,
  Star,
  Analytics,
  Schedule,
  Notifications,
  AccountCircle,
  Logout
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useSocket } from '../../contexts/SocketContext';
import VendorHome from './VendorHome';
import BulkOrderGroups from './BulkOrderGroups';
import NearbySuppliers from './NearbySuppliers';
import MaterialPrediction from './MaterialPrediction';
import DeliveryScheduling from './DeliveryScheduling';
import SupplierRating from './SupplierRating';
import UPIPayments from './UPIPayments';

const VendorDashboard = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, logout } = useAuth();
  const { notifications } = useSocket();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
  };

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/vendor' },
    { text: 'Bulk Order Groups', icon: <Group />, path: '/vendor/groups' },
    { text: 'Nearby Suppliers', icon: <LocationOn />, path: '/vendor/suppliers' },
    { text: 'Material Prediction', icon: <Analytics />, path: '/vendor/prediction' },
    { text: 'Delivery Scheduling', icon: <Schedule />, path: '/vendor/delivery' },
    { text: 'Rate Suppliers', icon: <Star />, path: '/vendor/rating' },
    { text: 'UPI Payments', icon: <Payment />, path: '/vendor/payments' }
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setDrawerOpen(!drawerOpen)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            SmartKart - Vendor Dashboard
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton color="inherit">
              <Badge badgeContent={notifications.length} color="error">
                <Notifications />
              </Badge>
            </IconButton>
            
            <Button
              color="inherit"
              onClick={handleMenuOpen}
              startIcon={<AccountCircle />}
            >
              {user?.name}
            </Button>
            
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleMenuClose}>
                <AccountCircle sx={{ mr: 1 }} />
                Profile
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <Logout sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            marginTop: '64px'
          }
        }}
      >
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => setDrawerOpen(false)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginTop: '64px',
          minHeight: '100vh',
          backgroundColor: 'background.default'
        }}
      >
        <Routes>
          <Route path="/" element={<VendorHome />} />
          <Route path="/groups" element={<BulkOrderGroups />} />
          <Route path="/suppliers" element={<NearbySuppliers />} />
          <Route path="/prediction" element={<MaterialPrediction />} />
          <Route path="/delivery" element={<DeliveryScheduling />} />
          <Route path="/rating" element={<SupplierRating />} />
          <Route path="/payments" element={<UPIPayments />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default VendorDashboard; 