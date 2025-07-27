import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Rating,
  TextField,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import { Star } from '@mui/icons-material';

const SupplierRating = () => {
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [ratingsList, setRatingsList] = useState([]);

  const handleSubmit = () => {
    if (!selectedSupplier || rating === 0) {
      alert('Please fill all fields');
      return;
    }

    const newRating = {
      supplier: selectedSupplier,
      rating,
      review,
    };

    setRatingsList(prev => [newRating, ...prev]);
    setSelectedSupplier('');
    setRating(0);
    setReview('');
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Rate Suppliers
      </Typography>

      {/* Rating Form */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Star sx={{ mr: 2, color: 'primary.main' }} />
            <Typography variant="h6">Rate a Supplier</Typography>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Supplier Name"
                value={selectedSupplier}
                onChange={(e) => setSelectedSupplier(e.target.value)}
                placeholder="Enter supplier name"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography>Rating:</Typography>
                <Rating
                  value={rating}
                  onChange={(e, newVal) => setRating(newVal)}
                />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Review"
                multiline
                rows={3}
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Share your experience with this supplier..."
              />
            </Grid>
          </Grid>

          <Button variant="contained" sx={{ mt: 2 }} onClick={handleSubmit}>
            Submit Rating
          </Button>
        </CardContent>
      </Card>

      {/* Ratings Display */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Your Ratings
              </Typography>

              {ratingsList.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No ratings submitted yet.
                </Typography>
              ) : (
                <List dense>
                  {ratingsList.map((entry, idx) => (
                    <React.Fragment key={idx}>
                      <ListItem alignItems="flex-start">
                        <ListItemText
                          primary={<strong>{entry.supplier}</strong>}
                          secondary={entry.review}
                        />
                        <Rating value={entry.rating} readOnly />
                      </ListItem>
                      {idx < ratingsList.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Demo Top Rated Suppliers */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Top Rated Suppliers
              </Typography>

              {/* Example Top Rated Suppliers */}
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1"><strong>FreshMart Supplies</strong></Typography>
                <Rating value={5} readOnly size="small" />
                <Typography variant="body2" color="text.secondary">Reliable delivery & great quality.</Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle1"><strong>AgroHarvest Co.</strong></Typography>
                <Rating value={4.5} readOnly size="small" />
                <Typography variant="body2" color="text.secondary">Always on time and responsive.</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SupplierRating;
