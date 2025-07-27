import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Chip
} from '@mui/material';
import { Analytics } from '@mui/icons-material';

const MaterialPrediction = () => {
  const [predictions, setPredictions] = useState(null);

  const handleGenerate = () => {
    // Frontend-only mock prediction
    const demoData = {
      Vegetables: { quantity: '120 kg', confidence: 85 },
      Fruits: { quantity: '90 kg', confidence: 78 },
      Grains: { quantity: '150 kg', confidence: 92 }
    };
    setPredictions(demoData);
  };

  const marketTrends = [
    {
      title: 'Tomato Prices Rising',
      description: 'Due to recent rainfall, the supply of tomatoes has decreased, leading to a price surge.'
    },
    {
      title: 'High Fruit Demand',
      description: 'Seasonal demand for mangoes and watermelons is expected to peak in the coming week.'
    },
    {
      title: 'Grain Stock Surplus',
      description: 'Warehouses report increased stock of wheat and rice, keeping prices stable.'
    }
  ];

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
          <Button variant="contained" onClick={handleGenerate}>
            Generate Prediction
          </Button>
        </CardContent>
      </Card>

      {predictions && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Predicted Requirements
                </Typography>
                <Box sx={{ mt: 2 }}>
                  {Object.entries(predictions).map(([key, value]) => (
                    <Box
                      key={key}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mb: 1
                      }}
                    >
                      <Typography>{key}: {value.quantity}</Typography>
                      <Chip
                        label={`${value.confidence}% confidence`}
                        color={value.confidence > 80 ? 'success' : 'warning'}
                        size="small"
                      />
                    </Box>
                  ))}
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
                {marketTrends.map((trend, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      • {trend.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {trend.description}
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default MaterialPrediction;
