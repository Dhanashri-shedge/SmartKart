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
import { Schedule, LocationOn } from '@mui/icons-material';

const DeliveryScheduling = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Schedule Delivery
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Schedule sx={{ mr: 2, color: 'primary.main' }} />
            <Typography variant="h6">
              Schedule New Delivery
            </Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Delivery Date"
                type="date"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Delivery Time"
                type="time"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Delivery Address"
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
          <Button variant="contained" sx={{ mt: 2 }}>
            Schedule Delivery
          </Button>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Upcoming Deliveries
              </Typography>
              <Typography variant="body2" color="text.secondary">
                View and manage your scheduled deliveries. Track delivery status and update schedules.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Delivery Tracking
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Real-time tracking of deliveries with location updates and status notifications.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DeliveryScheduling; 