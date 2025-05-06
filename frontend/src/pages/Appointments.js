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
  MenuItem,
  IconButton,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format } from 'date-fns';

const statusOptions = [
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'emergency', label: 'Emergency' },
];

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [formData, setFormData] = useState({
    customer: '',
    technician: '',
    appointment_date: new Date(),
    start_time: new Date(),
    end_time: new Date(),
    description: '',
    status: 'scheduled',
    priority: 'medium',
    notes: '',
  });

  useEffect(() => {
    // Fetch appointments, customers, and technicians from API
    // This is a placeholder - implement actual API calls
    fetchAppointments();
    fetchCustomers();
    fetchTechnicians();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/appointments/');
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/customers/');
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const fetchTechnicians = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/technicians/');
      const data = await response.json();
      setTechnicians(data);
    } catch (error) {
      console.error('Error fetching technicians:', error);
    }
  };

  const handleOpen = (appointment = null) => {
    if (appointment) {
      setSelectedAppointment(appointment);
      setFormData({
        ...appointment,
        appointment_date: new Date(appointment.appointment_date),
        start_time: new Date(appointment.start_time),
        end_time: new Date(appointment.end_time),
      });
    } else {
      setSelectedAppointment(null);
      setFormData({
        customer: '',
        technician: '',
        appointment_date: new Date(),
        start_time: new Date(),
        end_time: new Date(),
        description: '',
        status: 'scheduled',
        priority: 'medium',
        notes: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedAppointment(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = selectedAppointment
        ? `http://localhost:8000/api/appointments/${selectedAppointment.id}/`
        : 'http://localhost:8000/api/appointments/';
      const method = selectedAppointment ? 'PUT' : 'POST';

      // Format dates and times correctly
      const formattedData = {
        ...formData,
        appointment_date: format(formData.appointment_date, 'yyyy-MM-dd'),
        start_time: format(formData.start_time, 'HH:mm:ss'),
        end_time: format(formData.end_time, 'HH:mm:ss'),
        customer_id: formData.customer,
        technician_id: formData.technician || null
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });

      if (response.ok) {
        fetchAppointments();
        handleClose();
      } else {
        const errorData = await response.json();
        console.error('Error saving appointment:', errorData);
      }
    } catch (error) {
      console.error('Error saving appointment:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        const response = await fetch(`http://localhost:8000/api/appointments/${id}/`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchAppointments();
        }
      } catch (error) {
        console.error('Error deleting appointment:', error);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Appointments</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          New Appointment
        </Button>
      </Box>

      <Grid container spacing={3}>
        {appointments.map((appointment) => (
          <Grid item xs={12} sm={6} md={4} key={appointment.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6">
                    {new Date(appointment.appointment_date).toLocaleDateString()}
                  </Typography>
                  <Box>
                    <IconButton onClick={() => handleOpen(appointment)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(appointment.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                <Typography color="textSecondary">
                  {appointment.customer.first_name} {appointment.customer.last_name}
                </Typography>
                <Typography color="textSecondary">
                  {appointment.technician?.user?.first_name} {appointment.technician?.user?.last_name}
                </Typography>
                <Typography color="textSecondary">
                  Status: {appointment.status}
                </Typography>
                <Typography color="textSecondary">
                  Priority: {appointment.priority}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedAppointment ? 'Edit Appointment' : 'New Appointment'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Customer"
                  value={formData.customer}
                  onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                  required
                >
                  {customers.map((customer) => (
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
                  value={formData.technician}
                  onChange={(e) => setFormData({ ...formData, technician: e.target.value })}
                >
                  {technicians.map((technician) => (
                    <MenuItem key={technician.id} value={technician.id}>
                      {technician.user.first_name} {technician.user.last_name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Appointment Date"
                    value={formData.appointment_date ? new Date(formData.appointment_date) : null}
                    onChange={(newValue) => {
                      setFormData(prev => ({
                        ...prev,
                        appointment_date: newValue ? format(newValue, 'yyyy-MM-dd') : ''
                      }));
                    }}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Start Time"
                  type="time"
                  name="start_time"
                  value={formData.start_time}
                  onChange={handleInputChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    step: 300 // 5 min
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="End Time"
                  type="time"
                  name="end_time"
                  value={formData.end_time}
                  onChange={handleInputChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    step: 300 // 5 min
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Priority"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  {priorityOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes"
                  multiline
                  rows={4}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              {selectedAppointment ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}

export default Appointments; 