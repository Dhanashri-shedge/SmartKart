import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  TextField,
  Chip
} from '@mui/material';
import { Payment, QrCode } from '@mui/icons-material';

const UPIPayments = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        UPI Payments
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Payment sx={{ mr: 2, color: 'primary.main' }} />
            <Typography variant="h6">
              Make UPI Payment
            </Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Order ID"
                placeholder="Enter order ID"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Amount"
                type="number"
                placeholder="Enter amount"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                placeholder="Payment description"
              />
            </Grid>
          </Grid>
          <Button variant="contained" sx={{ mt: 2 }}>
            Generate UPI Link
          </Button>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Payment History
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                View your payment history and transaction status.
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip label="Paid" color="success" />
                <Chip label="Pending" color="warning" />
                <Chip label="Failed" color="error" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                QR Code Payment
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Scan QR codes for quick UPI payments. Generate QR codes for your payments.
              </Typography>
              <Button
                variant="outlined"
                startIcon={<QrCode />}
                sx={{ mt: 2 }}
              >
                Generate QR Code
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UPIPayments; 