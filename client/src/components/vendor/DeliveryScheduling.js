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
  Divider,
  Chip
} from '@mui/material';
import { Schedule } from '@mui/icons-material';

const DeliveryScheduling = () => {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    address: ''
  });

  const [deliveries, setDeliveries] = useState([
    {
      date: '2025-07-28',
      time: '10:00',
      address: 'Market Yard, Pune',
      status: 'Scheduled'
    },
    {
      date: '2025-07-30',
      time: '15:30',
      address: 'Shivajinagar, Pune',
      status: 'In Transit'
    },
    {
      date: '2025-07-25',
      time: '13:00',
      address: 'Camp, Pune',
      status: 'Delivered'
    }
  ]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSchedule = () => {
    const { date, time, address } = formData;
    if (!date || !time || !address) return;

    const newDelivery = {
      date,
      time,
      address,
      status: 'Scheduled'
    };

    setDeliveries((prev) => [...prev, newDelivery]);
    setFormData({ date: '', time: '', address: '' });
  };

  const handleTrack = (index) => {
    setDeliveries((prev) =>
      prev.map((item, i) => {
        if (i === index) {
          const nextStatus =
            item.status === 'Scheduled'
              ? 'In Transit'
              : item.status === 'In Transit'
              ? 'Delivered'
              : 'Delivered';
          return { ...item, status: nextStatus };
        }
        return item;
      })
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled':
        return 'default';
      case 'In Transit':
        return 'warning';
      case 'Delivered':
        return 'success';
      default:
        return 'default';
    }
  };

  const upcomingDeliveries = deliveries.filter(
    (d) => d.status === 'Scheduled' || d.status === 'In Transit'
  );

  const deliveryHistory = deliveries.filter((d) => d.status === 'Delivered');

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Schedule Delivery
      </Typography>

      {/* Schedule Form */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Schedule sx={{ mr: 2, color: 'primary.main' }} />
            <Typography variant="h6">Schedule New Delivery</Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Delivery Date"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Delivery Time"
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Delivery Address"
                name="address"
                multiline
                rows={3}
                value={formData.address}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          <Button variant="contained" sx={{ mt: 2 }} onClick={handleSchedule}>
            Schedule Delivery
          </Button>
        </CardContent>
      </Card>

      {/* Delivery Sections */}
      <Grid container spacing={3}>
        {/* Upcoming Deliveries */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Upcoming Deliveries
              </Typography>
              {upcomingDeliveries.length > 0 ? (
                <List dense>
                  {upcomingDeliveries.map((delivery, index) => (
                    <React.Fragment key={index}>
                      <ListItem
                        sx={{
                          alignItems: 'flex-start',
                          justifyContent: 'space-between'
                        }}
                      >
                        <ListItemText
                          primary={`${delivery.date} | ${delivery.time}`}
                          secondary={
                            <>
                              <Typography variant="body2">
                                {delivery.address}
                              </Typography>
                              <Chip
                                label={delivery.status}
                                color={getStatusColor(delivery.status)}
                                size="small"
                                sx={{ mt: 1 }}
                              />
                            </>
                          }
                        />
                        <Button
                          onClick={() => handleTrack(deliveries.indexOf(delivery))}
                          variant="outlined"
                          size="small"
                        >
                          Update Status
                        </Button>
                      </ListItem>
                      {index < upcomingDeliveries.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No upcoming deliveries.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Delivery History */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Delivery History
              </Typography>
              {deliveryHistory.length > 0 ? (
                <List dense>
                  {deliveryHistory.map((delivery, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemText
                          primary={`${delivery.date} | ${delivery.time}`}
                          secondary={
                            <>
                              <Typography variant="body2">
                                {delivery.address}
                              </Typography>
                              <Chip
                                label={delivery.status}
                                color={getStatusColor(delivery.status)}
                                size="small"
                                sx={{ mt: 1 }}
                              />
                            </>
                          }
                        />
                      </ListItem>
                      {index < deliveryHistory.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No past deliveries.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DeliveryScheduling;
