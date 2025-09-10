import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Avatar,
  Rating,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Search, Person, Star, Work } from '@mui/icons-material';
import api from '../../services/api';

const PractitionersPage = () => {
  const [practitioners, setPractitioners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPractitioners();
  }, []);

  const fetchPractitioners = async () => {
    try {
      setLoading(true);
      const response = await api.get('/practitioners');
      if (response.data.success) {
        setPractitioners(response.data.data);
      } else {
        setError('Failed to fetch practitioners');
      }
    } catch (err) {
      setError('Error loading practitioners');
      console.error('Error fetching practitioners:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPractitioners = practitioners.filter(practitioner =>
    practitioner.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    practitioner.specializations.some(spec => 
      spec.toLowerCase().includes(searchTerm.toLowerCase())
    ) ||
    practitioner.bio?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        Our Practitioners
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Meet our qualified Ayurvedic practitioners specializing in Panchakarma therapies
      </Typography>

      {/* Search */}
      <Box sx={{ mb: 4 }}>
        <TextField
          placeholder="Search practitioners..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 300 }}
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Practitioners Grid */}
      <Grid container spacing={3}>
        {filteredPractitioners.map((practitioner) => (
          <Grid item xs={12} sm={6} md={4} key={practitioner._id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                    <Person />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" component="h3" fontWeight="bold">
                      {practitioner.fullName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {practitioner.title}
                    </Typography>
                  </Box>
                </Box>

                {practitioner.bio && (
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {practitioner.bio.substring(0, 120)}...
                  </Typography>
                )}

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Work sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {practitioner.experienceYears} years experience
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Rating
                    value={practitioner.ratings.averageRating}
                    readOnly
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    ({practitioner.ratings.totalReviews} reviews)
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>
                    Specializations:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {practitioner.specializations.slice(0, 3).map((spec, index) => (
                      <Chip
                        key={index}
                        label={spec}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                    {practitioner.specializations.length > 3 && (
                      <Chip
                        label={`+${practitioner.specializations.length - 3} more`}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                  {practitioner.languages.slice(0, 2).map((lang, index) => (
                    <Chip
                      key={index}
                      label={lang}
                      size="small"
                      color="secondary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </CardContent>
              
              <CardActions>
                <Button size="small" variant="contained">
                  View Profile
                </Button>
                <Button size="small" variant="outlined">
                  Book Appointment
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredPractitioners.length === 0 && !loading && (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary">
            No practitioners found matching your criteria
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default PractitionersPage;
