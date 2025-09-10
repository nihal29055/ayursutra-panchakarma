import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
} from '@mui/material';
import {
  CalendarToday,
  Spa,
  People,
  TrendingUp,
} from '@mui/icons-material';

const DashboardPage = () => {
  const stats = [
    {
      title: 'Upcoming Appointments',
      value: '3',
      icon: <CalendarToday sx={{ fontSize: 40 }} />,
      color: 'primary',
      action: 'View All',
    },
    {
      title: 'Available Therapies',
      value: '12',
      icon: <Spa sx={{ fontSize: 40 }} />,
      color: 'secondary',
      action: 'Explore',
    },
    {
      title: 'Active Practitioners',
      value: '8',
      icon: <People sx={{ fontSize: 40 }} />,
      color: 'success',
      action: 'View All',
    },
    {
      title: 'Treatment Progress',
      value: '75%',
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      color: 'info',
      action: 'View Details',
    },
  ];

  const recentActivities = [
    { action: 'Appointment scheduled', time: '2 hours ago', type: 'appointment' },
    { action: 'Therapy completed', time: '1 day ago', type: 'therapy' },
    { action: 'Profile updated', time: '2 days ago', type: 'profile' },
    { action: 'New practitioner added', time: '3 days ago', type: 'practitioner' },
  ];

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Welcome back! Here's an overview of your Panchakarma journey.
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ color: `${stat.color}.main`, mr: 2 }}>
                    {stat.icon}
                  </Box>
                  <Box>
                    <Typography variant="h4" component="div" fontWeight="bold">
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
              <CardActions>
                <Button size="small" color={stat.color}>
                  {stat.action}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Recent Activities */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom fontWeight="bold">
                Recent Activities
              </Typography>
              <Box sx={{ mt: 2 }}>
                {recentActivities.map((activity, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      py: 1,
                      borderBottom: index < recentActivities.length - 1 ? '1px solid #f0f0f0' : 'none',
                    }}
                  >
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body1">{activity.action}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {activity.time}
                      </Typography>
                    </Box>
                    <Chip
                      label={activity.type}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom fontWeight="bold">
                Quick Actions
              </Typography>
              <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button variant="contained" fullWidth>
                  Book Appointment
                </Button>
                <Button variant="outlined" fullWidth>
                  View Therapies
                </Button>
                <Button variant="outlined" fullWidth>
                  Update Profile
                </Button>
                <Button variant="outlined" fullWidth>
                  View Progress
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
