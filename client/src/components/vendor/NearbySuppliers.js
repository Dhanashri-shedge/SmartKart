import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  TextField,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { LocationOn, Search } from '@mui/icons-material';

// Simple distance calculator using Haversine formula
const getDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (val) => (val * Math.PI) / 180;
  const R = 6371; // Radius of Earth in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Mock supplier data
const mockSuppliers = [
  { name: 'Green Farms', lat: 19.1, lon: 72.9 },
  { name: 'AgroPro Suppliers', lat: 18.98, lon: 72.83 },
  { name: 'FreshVeg Hub', lat: 19.2, lon: 72.85 },
  { name: 'CropKart', lat: 18.95, lon: 72.88 },
  { name: 'Rural Connect', lat: 19.05, lon: 72.77 },
];

const NearbySuppliers = () => {
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  const [maxDistance, setMaxDistance] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = () => {
    const latNum = parseFloat(lat);
    const lonNum = parseFloat(lon);
    const maxDist = parseFloat(maxDistance);

    console.log('Searching suppliers...');
    console.log('User Input:', latNum, lonNum, maxDist);

    if (isNaN(latNum) || isNaN(lonNum) || isNaN(maxDist)) {
      alert('Please enter valid numbers for all fields.');
      return;
    }

    const filtered = mockSuppliers
      .map((supplier) => {
        const dist = getDistance(latNum, lonNum, supplier.lat, supplier.lon);
        return { ...supplier, distance: dist };
      })
      .filter((s) => s.distance <= maxDist);

    console.log('Filtered Suppliers:', filtered);
    setResults(filtered);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Find Nearby Suppliers
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <LocationOn sx={{ mr: 2, color: 'primary.main' }} />
            <Typography variant="h6">Search by Location</Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Latitude"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                placeholder="e.g., 19.0760"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Longitude"
                value={lon}
                onChange={(e) => setLon(e.target.value)}
                placeholder="e.g., 72.8777"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Max Distance (km)"
                value={maxDistance}
                onChange={(e) => setMaxDistance(e.target.value)}
                placeholder="150"
              />
            </Grid>
          </Grid>
          <Button
            variant="contained"
            startIcon={<Search />}
            sx={{ mt: 2 }}
            onClick={handleSearch}
          >
            Find Suppliers
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Supplier Results
          </Typography>
          {results.length > 0 ? (
            <List>
              {results.map((s, i) => (
                <ListItem key={i}>
                  <ListItemText
                    primary={s.name}
                    secondary={`Distance: ${s.distance.toFixed(2)} km`}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No suppliers found within this range.
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default NearbySuppliers;
