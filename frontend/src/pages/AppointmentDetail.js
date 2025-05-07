import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Typography,
  Alert,
  MenuItem
} from '@mui/material';
import axios from 'axios';
import PhotoUpload from '../components/PhotoUpload';

const AppointmentDetail = () => {
  const { id } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    customer: '',
    technician: '',
    appointment_date: '',
    start_time: '',
    end_time: '',
    description: '',
    status: 'scheduled',
    priority: 'medium',
    notes: ''
  });

  useEffect(() => {
    fetchAppointment();
    fetchCustomers();
    fetchTechnicians();
  }, [id]);

  const fetchAppointment = async () => {
    try {
      const response = await axios.get(`/api/appointments/${id}/`);
      setAppointment(response.data);
      setFormData({
        customer: response.data.customer?.id || '',
        technician: response.data.technician?.id || '',
        appointment_date: response.data.appointment_date,
        start_time: response.data.start_time,
        end_time: response.data.end_time,
        description: response.data.description,
        status: response.data.status,
        priority: response.data.priority,
        notes: response.data.notes
      });
    } catch (err) {
      setError('Failed to fetch appointment details');
      console.error('Error fetching appointment:', err);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await axios.get('/api/customers/');
      setCustomers(response.data);
    } catch (err) {
      console.error('Error fetching customers:', err);
    }
  };

  const fetchTechnicians = async () => {
    try {
      const response = await axios.get('/api/technicians/');
      setTechnicians(response.data);
    } catch (err) {
      console.error('Error fetching technicians:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/appointments/${id}/`, {
        customer_id: formData.customer,
        technician_id: formData.technician,
        appointment_date: formData.appointment_date,
        start_time: formData.start_time,
        end_time: formData.end_time,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        notes: formData.notes
      });
      setSuccess('Appointment updated successfully');
      setTimeout(() => setSuccess(''), 3000);
      fetchAppointment();
    } catch (err) {
      setError('Failed to update appointment');
      console.error('Error updating appointment:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!appointment) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>Appointment Details</Typography>
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}
        </Grid>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      fullWidth
                      label="Customer"
                      name="customer"
                      value={formData.customer}
                      onChange={handleInputChange}
                      required
                    >
                      <MenuItem value="">Select Customer</MenuItem>
                      {customers.map(customer => (
                        <MenuItem key={customer.id} value={customer.id}>
                          {customer.first_name} {customer.last_name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      fullWidth
                      label="Technician"
                      name="technician"
                      value={formData.technician}
                      onChange={handleInputChange}
                    >
                      <MenuItem value="">Select Technician</MenuItem>
                      {technicians.map(technician => (
                        <MenuItem key={technician.id} value={technician.id}>
                          {technician.user.first_name} {technician.user.last_name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Date"
                      name="appointment_date"
                      type="date"
                      value={formData.appointment_date}
                      onChange={handleInputChange}
                      InputLabelProps={{ shrink: true }}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      label="Start Time"
                      name="start_time"
                      type="time"
                      value={formData.start_time}
                      onChange={handleInputChange}
                      InputLabelProps={{ shrink: true }}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      label="End Time"
                      name="end_time"
                      type="time"
                      value={formData.end_time}
                      onChange={handleInputChange}
                      InputLabelProps={{ shrink: true }}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      multiline
                      rows={2}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      fullWidth
                      label="Status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      required
                    >
                      <MenuItem value="scheduled">Scheduled</MenuItem>
                      <MenuItem value="in_progress">In Progress</MenuItem>
                      <MenuItem value="completed">Completed</MenuItem>
                      <MenuItem value="cancelled">Cancelled</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      fullWidth
                      label="Priority"
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      required
                    >
                      <MenuItem value="low">Low</MenuItem>
                      <MenuItem value="medium">Medium</MenuItem>
                      <MenuItem value="high">High</MenuItem>
                      <MenuItem value="emergency">Emergency</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      multiline
                      rows={2}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button type="submit" variant="contained">Save Changes</Button>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Photos</Typography>
              <PhotoUpload objectType="appointment" objectId={appointment.id} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AppointmentDetail; 