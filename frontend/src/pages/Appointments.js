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
  Alert,
  Snackbar,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';

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
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    customer: '',
    technician: '',
    appointment_date: new Date(),
    start_time: new Date(new Date().setHours(9, 0, 0, 0)),
    end_time: new Date(new Date().setHours(10, 0, 0, 0)),
    description: '',
    status: 'scheduled',
    priority: 'medium',
    notes: '',
  });
  const navigate = useNavigate();

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
      try {
        const startTime = new Date();
        const [startHours, startMinutes] = appointment.start_time.split(':');
        startTime.setHours(parseInt(startHours), parseInt(startMinutes), 0, 0);

        const endTime = new Date();
        const [endHours, endMinutes] = appointment.end_time.split(':');
        endTime.setHours(parseInt(endHours), parseInt(endMinutes), 0, 0);

        setFormData({
          ...appointment,
          customer: appointment.customer.id,
          technician: appointment.technician?.id || '',
          appointment_date: new Date(appointment.appointment_date),
          start_time: startTime,
          end_time: endTime,
        });
      } catch (error) {
        console.warn('Error parsing appointment times:', error);
        // Set default times if parsing fails
        setFormData({
          ...appointment,
          customer: appointment.customer.id,
          technician: appointment.technician?.id || '',
          appointment_date: new Date(appointment.appointment_date),
          start_time: new Date(new Date().setHours(9, 0, 0, 0)),
          end_time: new Date(new Date().setHours(10, 0, 0, 0)),
        });
      }
    } else {
      setSelectedAppointment(null);
      setFormData({
        customer: '',
        technician: '',
        appointment_date: new Date(),
        start_time: new Date(new Date().setHours(9, 0, 0, 0)),
        end_time: new Date(new Date().setHours(10, 0, 0, 0)),
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
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = selectedAppointment
        ? `http://localhost:8000/api/appointments/${selectedAppointment.id}/`
        : 'http://localhost:8000/api/appointments/';
      const method = selectedAppointment ? 'PUT' : 'POST';

      let formattedData;
      try {
        // Try to format dates and times correctly
        formattedData = {
          ...formData,
          appointment_date: format(formData.appointment_date, 'yyyy-MM-dd'),
          start_time: format(formData.start_time, 'HH:mm:ss'),
          end_time: format(formData.end_time, 'HH:mm:ss'),
          customer_id: formData.customer,
          technician_id: formData.technician || null
        };
      } catch (formatError) {
        console.warn('Error formatting dates:', formatError);
        // Use default values if formatting fails
        const defaultDate = new Date();
        formattedData = {
          ...formData,
          appointment_date: format(defaultDate, 'yyyy-MM-dd'),
          start_time: '09:00:00',
          end_time: '10:00:00',
          customer_id: formData.customer,
          technician_id: formData.technician || null
        };
        setError('There was an issue with the date/time format. Default times (9 AM - 10 AM) were used.');
      }

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
        setError(`Error saving appointment: ${errorData.detail || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error saving appointment:', error);
      setError('Failed to save appointment. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'start_time' || name === 'end_time') {
      // Create a new date object for today
      const date = new Date();
      // Parse the time value (HH:mm format)
      const [hours, minutes] = value.split(':');
      // Set the hours and minutes
      date.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
      setFormData(prev => ({
        ...prev,
        [name]: date
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 3 }}>Appointments</Typography>

      <Grid container spacing={3}>
        {appointments.map((appointment) => (
          <Grid item xs={12} sm={6} md={4} key={appointment.id}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: 6
                }
              }}
              onClick={() => navigate(`/appointments/${appointment.id}`)}
            >
              <CardContent>
                <Typography variant="h6">
                  {new Date(appointment.appointment_date).toLocaleDateString()}
                </Typography>
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

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => handleOpen()}
        sx={{ mt: 3, mb: 3 }}
      >
        New Appointment
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedAppointment ? 'Edit Appointment' : 'New Appointment'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            {error && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
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
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Start Time"
                  type="time"
                  name="start_time"
                  value={formData.start_time instanceof Date ? 
                    format(formData.start_time, 'HH:mm') : 
                    formData.start_time}
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
                  value={formData.end_time instanceof Date ? 
                    format(formData.end_time, 'HH:mm') : 
                    formData.end_time}
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

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        message={error}
      />
    </Container>
  );
}

export default Appointments; 