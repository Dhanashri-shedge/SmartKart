import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  TextField,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import { Payment, QrCode } from '@mui/icons-material';
import { QRCodeCanvas } from 'qrcode.react';

const UPIPayments = () => {
  const [upiLink, setUpiLink] = useState('');
  const [formData, setFormData] = useState({
    orderId: '',
    amount: '',
    description: ''
  });

  const [showLink, setShowLink] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const [paymentHistory] = useState([
    { orderId: 'ORD001', amount: 250, status: 'Paid', description: 'Vegetables Bulk Order' },
    { orderId: 'ORD002', amount: 500, status: 'Pending', description: 'Grains Supplier' },
    { orderId: 'ORD003', amount: 180, status: 'Paid', description: 'Spices Purchase' }
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateUpiLink = () => {
    const { orderId, amount, description } = formData;
    if (!orderId || !amount) return '';
    return `upi://pay?pa=vendor@upi&pn=SmartKart&am=${amount}&cu=INR&tn=${description || 'Payment'}`;
  };

  const handleGenerateLink = () => {
    const link = generateUpiLink();
    setUpiLink(link);
    setShowLink(true);
    setShowQR(false);
  };

  const handleGenerateQR = () => {
    const link = generateUpiLink();
    setUpiLink(link);
    setShowQR(true);
    setShowLink(false);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>UPI Payments</Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Payment sx={{ mr: 2, color: 'primary.main' }} />
            <Typography variant="h6">Make UPI Payment</Typography>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Order ID"
                name="orderId"
                value={formData.orderId}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Amount"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
            <Button variant="contained" onClick={handleGenerateLink}>
              Generate Link
            </Button>
            <Button variant="outlined" startIcon={<QrCode />} onClick={handleGenerateQR}>
              Generate QR Code
            </Button>
          </Box>

          {showLink && upiLink && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2">UPI Link:</Typography>
              <a href={upiLink} target="_blank" rel="noopener noreferrer">{upiLink}</a>
            </Box>
          )}

          {showQR && upiLink && (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <QRCodeCanvas value={upiLink} size={180} />
              <Typography variant="caption" display="block" mt={1}>
                Scan to Pay
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Payment History</Typography>
              <List dense>
                {paymentHistory.map((record, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemText
                        primary={`${record.orderId} - ₹${record.amount}`}
                        secondary={record.description}
                      />
                      <Chip
                        label={record.status}
                        color={
                          record.status === 'Paid'
                            ? 'success'
                            : record.status === 'Pending'
                              ? 'warning'
                              : 'default'
                        }
                        size="small"
                      />
                    </ListItem>
                    {index < paymentHistory.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box >
  );
};

export default UPIPayments;
