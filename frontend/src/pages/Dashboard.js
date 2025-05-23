import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  Container,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { appointments as appointmentsApi } from '../services/api';
import { useNavigate } from 'react-router-dom';

const localizer = momentLocalizer(moment);

function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    scheduled: 0,
    inProgress: 0,
    completed: 0,
    cancelled: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await appointmentsApi.getAll();
        console.log('API Response:', response.data);
        setAppointments(response.data);
        setLoading(false);
        
        // Calculate statistics
        const stats = {
          total: response.data.length,
          scheduled: response.data.filter(a => a.status === 'scheduled').length,
          inProgress: response.data.filter(a => a.status === 'in_progress').length,
          completed: response.data.filter(a => a.status === 'completed').length,
          cancelled: response.data.filter(a => a.status === 'cancelled').length,
        };
        setStats(stats);
      } catch (err) {
        console.error('API Error:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  if (loading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error">Error: {error}</Alert>
      </Container>
    );
  }

  const events = appointments.map(appointment => ({
    id: appointment.id,
    title: `${appointment.customer.first_name} ${appointment.customer.last_name}`,
    start: new Date(`${appointment.appointment_date}T${appointment.start_time}`),
    end: new Date(`${appointment.appointment_date}T${appointment.end_time}`),
    status: appointment.status,
    priority: appointment.priority,
  }));

  const eventStyleGetter = (event) => {
    let backgroundColor = '#3174ad';
    if (event.status === 'completed') {
      backgroundColor = '#28a745';
    } else if (event.status === 'cancelled') {
      backgroundColor = '#dc3545';
    } else if (event.status === 'in_progress') {
      backgroundColor = '#ffc107';
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '0px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block',
      },
    };
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Appointments
              </Typography>
              <Typography variant="h4">
                {stats.total}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Scheduled
              </Typography>
              <Typography variant="h4">
                {stats.scheduled}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                In Progress
              </Typography>
              <Typography variant="h4">
                {stats.inProgress}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Completed
              </Typography>
              <Typography variant="h4">
                {stats.completed}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 2 }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          eventPropGetter={eventStyleGetter}
          onSelectEvent={(event) => navigate(`/appointments/${event.id}`)}
        />
      </Paper>
    </Container>
  );
}

export default Dashboard; 