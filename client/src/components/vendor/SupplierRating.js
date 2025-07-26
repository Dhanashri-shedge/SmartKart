import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Rating,
  TextField
} from '@mui/material';
import { Star, RateReview } from '@mui/icons-material';

const SupplierRating = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Rate Suppliers
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Star sx={{ mr: 2, color: 'primary.main' }} />
            <Typography variant="h6">
              Rate a Supplier
            </Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Supplier Name"
                placeholder="Select supplier"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography>Rating:</Typography>
                <Rating />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Review"
                multiline
                rows={3}
                placeholder="Share your experience with this supplier..."
              />
            </Grid>
          </Grid>
          <Button variant="contained" sx={{ mt: 2 }}>
            Submit Rating
          </Button>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Your Ratings
              </Typography>
              <Typography variant="body2" color="text.secondary">
                View and manage your supplier ratings. Update reviews and track supplier performance.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Top Rated Suppliers
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Discover highly rated suppliers in your area based on community ratings and reviews.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SupplierRating; 