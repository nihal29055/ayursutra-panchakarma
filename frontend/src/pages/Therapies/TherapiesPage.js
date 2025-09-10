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
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Search, Spa, AccessTime, AttachMoney } from '@mui/icons-material';
import api from '../../services/api';

const TherapiesPage = () => {
  const [therapies, setTherapies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    fetchTherapies();
  }, []);

  const fetchTherapies = async () => {
    try {
      setLoading(true);
      const response = await api.get('/therapies');
      if (response.data.success) {
        setTherapies(response.data.data);
      } else {
        setError('Failed to fetch therapies');
      }
    } catch (err) {
      setError('Error loading therapies');
      console.error('Error fetching therapies:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTherapies = therapies.filter(therapy => {
    const matchesSearch = therapy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         therapy.sanskritName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         therapy.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || therapy.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'purvakarma', label: 'Purvakarma (Preparatory)' },
    { value: 'pradhanakarma', label: 'Pradhanakarma (Main)' },
    { value: 'paschatkarma', label: 'Paschatkarma (Post-therapy)' },
    { value: 'kayachikitsa', label: 'Kayachikitsa (Internal Medicine)' },
    { value: 'bahyachikitsa', label: 'Bahyachikitsa (External)' },
  ];

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
        Panchakarma Therapies
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Explore our comprehensive range of traditional Ayurvedic treatments
      </Typography>

      {/* Search and Filter */}
      <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search therapies..."
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
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={categoryFilter}
            label="Category"
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {categories.map((category) => (
              <MenuItem key={category.value} value={category.value}>
                {category.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Therapies Grid */}
      <Grid container spacing={3}>
        {filteredTherapies.map((therapy) => (
          <Grid item xs={12} sm={6} md={4} key={therapy._id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Spa sx={{ color: 'primary.main', mr: 1 }} />
                  <Typography variant="h6" component="h3" fontWeight="bold">
                    {therapy.name}
                  </Typography>
                </Box>
                
                {therapy.sanskritName && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontStyle: 'italic' }}>
                    {therapy.sanskritName}
                  </Typography>
                )}

                <Typography variant="body2" sx={{ mb: 2 }}>
                  {therapy.description.substring(0, 100)}...
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AccessTime sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {therapy.formattedDuration}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AttachMoney sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    ₹{therapy.effectivePrice}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip
                    label={therapy.category}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                  <Chip
                    label={therapy.type}
                    size="small"
                    color="secondary"
                    variant="outlined"
                  />
                </Box>
              </CardContent>
              
              <CardActions>
                <Button size="small" variant="contained">
                  Learn More
                </Button>
                <Button size="small" variant="outlined">
                  Book Now
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredTherapies.length === 0 && !loading && (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary">
            No therapies found matching your criteria
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default TherapiesPage;
