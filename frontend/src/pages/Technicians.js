import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
  IconButton,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

function Technicians() {
  const [technicians, setTechnicians] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedTechnician, setSelectedTechnician] = useState(null);
  const [formData, setFormData] = useState({
    user: {
      first_name: '',
      last_name: '',
      email: '',
      username: '',
      password: '',
    },
    phone: '',
    is_available: true,
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
        user: {
          first_name: '',
          last_name: '',
          email: '',
          username: '',
          password: '',
        },
        phone: '',
        is_available: true,
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
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Technicians</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          New Technician
        </Button>
      </Box>

      <Grid container spacing={3}>
        {technicians.map((technician) => (
          <Grid item xs={12} sm={6} md={4} key={technician.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6">
                    {technician.user.first_name} {technician.user.last_name}
                  </Typography>
                  <Box>
                    <IconButton onClick={() => handleOpen(technician)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(technician.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                <Typography color="textSecondary">{technician.user.email}</Typography>
                <Typography color="textSecondary">{technician.phone}</Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={technician.is_available}
                      disabled
                    />
                  }
                  label="Available"
                />
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
                  value={formData.user.first_name}
                  onChange={(e) => setFormData({
                    ...formData,
                    user: { ...formData.user, first_name: e.target.value }
                  })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={formData.user.last_name}
                  onChange={(e) => setFormData({
                    ...formData,
                    user: { ...formData.user, last_name: e.target.value }
                  })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.user.email}
                  onChange={(e) => setFormData({
                    ...formData,
                    user: { ...formData.user, email: e.target.value }
                  })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Username"
                  value={formData.user.username}
                  onChange={(e) => setFormData({
                    ...formData,
                    user: { ...formData.user, username: e.target.value }
                  })}
                  required
                />
              </Grid>
              {!selectedTechnician && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    value={formData.user.password}
                    onChange={(e) => setFormData({
                      ...formData,
                      user: { ...formData.user, password: e.target.value }
                    })}
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
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.is_available}
                      onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                    />
                  }
                  label="Available"
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
    </Box>
  );
}

export default Technicians; 