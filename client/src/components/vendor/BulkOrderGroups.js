import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid
} from '@mui/material';
import { Group, Add } from '@mui/icons-material';

const BulkOrderGroups = () => {
  const [recentGroups, setRecentGroups] = useState([]);
  const navigate = typeof window !== 'undefined' ? require('react-router-dom').useNavigate() : () => {};

  useEffect(() => {
    // Example fetch, replace with your actual API endpoint
    fetch('/api/vendors/groups')
      .then(res => res.json())
      .then(data => setRecentGroups(data.orderGroups ? data.orderGroups.slice(0, 5) : []))
      .catch(() => setRecentGroups([]));
  }, []);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Bulk Order Groups
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/Group')}
        >
          Create New Group
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Group sx={{ mr: 2, color: 'primary.main' }} />
                <Typography variant="h6">
                  Create Bulk Order Group
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Create groups for bulk orders with multiple vendors. Split bills automatically among group members.
              </Typography>
              <Button variant="outlined" fullWidth
              startIcon={<Add />}
              onClick={() => navigate('/Group')}>
                Start Creating Group
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Group Management
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Manage existing groups, track payments, and monitor delivery schedules.
              </Typography>
              <Button variant="outlined" fullWidth
              sx={{ mt: 2 }}
              onClick={() => navigate('/vendor/groups')}>
                View All Groups
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recent Groups
          </Typography>
          {recentGroups.length > 0 ? (
            recentGroups.map(group => (
              <Box key={group._id} sx={{ mb: 2 }}>
                <Typography variant="subtitle1">{group.name || `Group #${group._id.slice(-6)}`}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Members: {group.members ? group.members.length : 0} | Status: {group.status}
                </Typography>
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              Your recent bulk order groups will appear here. This feature allows vendors to create groups for bulk orders and split bills among multiple vendors.
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default BulkOrderGroups; 