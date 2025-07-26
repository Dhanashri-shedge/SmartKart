import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  TextField
} from '@mui/material';
import { LocationOn, Search } from '@mui/icons-material';

const NearbySuppliers = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Find Nearby Suppliers
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <LocationOn sx={{ mr: 2, color: 'primary.main' }} />
            <Typography variant="h6">
              Search by Location
            </Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Latitude"
                placeholder="e.g., 19.0760"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Longitude"
                placeholder="e.g., 72.8777"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Max Distance (km)"
                placeholder="50"
              />
            </Grid>
          </Grid>
          <Button
            variant="contained"
            startIcon={<Search />}
            sx={{ mt: 2 }}
          >
            Find Suppliers
          </Button>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Supplier Results
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Find farms and suppliers in your vicinity. View ratings, business types, and contact information.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Map View
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Interactive map showing nearby suppliers with distance and rating information.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default NearbySuppliers; 