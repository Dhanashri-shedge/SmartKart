import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Chip
} from '@mui/material';
import { Analytics, TrendingUp } from '@mui/icons-material';

const MaterialPrediction = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Next Day Raw Material Prediction
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Analytics sx={{ mr: 2, color: 'primary.main' }} />
            <Typography variant="h6">
              AI-Powered Prediction
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Get AI-powered predictions for next day raw material requirements based on historical data and market trends.
          </Typography>
          <Button variant="contained">
            Generate Prediction
          </Button>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Predicted Requirements
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Vegetables</Typography>
                  <Chip label="85% confidence" color="success" size="small" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Fruits</Typography>
                  <Chip label="78% confidence" color="warning" size="small" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Grains</Typography>
                  <Chip label="92% confidence" color="success" size="small" />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Market Trends
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Analysis of market trends, seasonal factors, and demand patterns that influence predictions.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MaterialPrediction; 