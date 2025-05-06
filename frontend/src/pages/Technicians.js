import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Box,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

const Technicians = () => {
  const [technicians, setTechnicians] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedTechnician, setSelectedTechnician] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    labor_rate: 85.00
  });

  useEffect(() => {
    fetchTechnicians();
  }, []);

  const fetchTechnicians = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/technicians/');
      const data = await response.json();
      setTechnicians(data);
    } catch (error) {
      console.error('Error fetching technicians:', error);
    }
  };

  const handleOpen = (technician = null) => {
    if (technician) {
      setSelectedTechnician(technician);
      setFormData(technician);
    } else {
      setSelectedTechnician(null);
      setFormData({
        username: '',
        password: '',
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        labor_rate: 85.00
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTechnician(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = selectedTechnician
        ? `http://localhost:8000/api/technicians/${selectedTechnician.id}/`
        : 'http://localhost:8000/api/technicians/';
      const method = selectedTechnician ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchTechnicians();
        handleClose();
      }
    } catch (error) {
      console.error('Error saving technician:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this technician?')) {
      try {
        const response = await fetch(`http://localhost:8000/api/technicians/${id}/`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchTechnicians();
        }
      } catch (error) {
        console.error('Error deleting technician:', error);
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Technicians</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add Technician
        </Button>
      </Box>

      <Typography variant="h4" gutterBottom>
        Technicians
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => handleOpen()}
        sx={{ mb: 2 }}
      >
        Add Technician
      </Button>

      <Grid container spacing={3}>
        {technicians.map((technician) => (
          <Grid item xs={12} sm={6} md={4} key={technician.id}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: 6,
                  backgroundColor: 'rgba(0, 0, 0, 0.02)'
                }
              }}
              onClick={() => handleOpen(technician)}
            >
              <CardContent>
                <Typography variant="h6">
                  {technician.user.first_name} {technician.user.last_name}
                </Typography>
                <Typography color="textSecondary">
                  Email: {technician.user.email}
                </Typography>
                <Typography color="textSecondary">
                  Phone: {technician.phone}
                </Typography>
                <Typography color="textSecondary">
                  Status: {technician.is_available ? 'Available' : 'Unavailable'}
                </Typography>
                <Box sx={{ textAlign: 'right', mt: 2 }}>
                  <IconButton
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(technician.id);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedTechnician ? 'Edit Technician' : 'New Technician'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </Grid>
              {!selectedTechnician && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </Grid>
              )}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Labor Rate"
                  type="number"
                  value={formData.labor_rate}
                  onChange={(e) => setFormData({ ...formData, labor_rate: parseFloat(e.target.value) })}
                  InputProps={{
                    startAdornment: '$',
                    inputProps: { min: 0, step: 0.01 }
                  }}
                  required
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              {selectedTechnician ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default Technicians; 