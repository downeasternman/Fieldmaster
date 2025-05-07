import React, { useState, useEffect, useCallback } from 'react';
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem
} from '@mui/material';
import axios from 'axios';
import PhotoUpload from '../components/PhotoUpload';

const BillDetail = () => {
  const { id } = useParams();
  const [bill, setBill] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    customer: '',
    appointment: '',
    type: 'bill',
    status: 'draft',
    description: '',
    notes: '',
    due_date: '',
    employee_name: '',
    line_items: []
  });

  const fetchBill = useCallback(async () => {
    try {
      const response = await axios.get(`/api/bills/${id}/`);
      setBill(response.data);
      setFormData({
        customer: response.data.customer?.id || '',
        appointment: response.data.appointment?.id || '',
        type: response.data.type,
        status: response.data.status,
        description: response.data.description,
        notes: response.data.notes,
        due_date: response.data.due_date,
        employee_name: response.data.employee_name,
        line_items: response.data.line_items
      });
    } catch (err) {
      setError('Failed to fetch bill details');
      console.error('Error fetching bill:', err);
    }
  }, [id]);

  const fetchCustomers = useCallback(async () => {
    try {
      const response = await axios.get('/api/customers/');
      setCustomers(response.data);
    } catch (err) {
      console.error('Error fetching customers:', err);
    }
  }, []);

  const fetchAppointments = useCallback(async () => {
    try {
      const response = await axios.get('/api/appointments/');
      setAppointments(response.data);
    } catch (err) {
      console.error('Error fetching appointments:', err);
    }
  }, []);

  useEffect(() => {
    fetchBill();
    fetchCustomers();
    fetchAppointments();
  }, [id, fetchBill, fetchCustomers, fetchAppointments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/bills/${id}/`, {
        customer_id: formData.customer,
        appointment_id: formData.appointment,
        type: formData.type,
        status: formData.status,
        description: formData.description,
        notes: formData.notes,
        due_date: formData.due_date,
        employee_name: formData.employee_name,
        line_items: formData.line_items
      });
      setSuccess('Bill updated successfully');
      setTimeout(() => setSuccess(''), 3000);
      fetchBill();
    } catch (err) {
      setError('Failed to update bill');
      console.error('Error updating bill:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!bill) {
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
          <Typography variant="h4" gutterBottom>Bill Details</Typography>
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
                      label="Appointment"
                      name="appointment"
                      value={formData.appointment}
                      onChange={handleInputChange}
                    >
                      <MenuItem value="">Select Appointment</MenuItem>
                      {appointments.map(appointment => (
                        <MenuItem key={appointment.id} value={appointment.id}>
                          #{appointment.id} - {appointment.description}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      fullWidth
                      label="Type"
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      required
                    >
                      <MenuItem value="bill">Bill</MenuItem>
                      <MenuItem value="estimate">Estimate</MenuItem>
                    </TextField>
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
                      <MenuItem value="draft">Draft</MenuItem>
                      <MenuItem value="sent">Sent</MenuItem>
                      <MenuItem value="paid">Paid</MenuItem>
                      <MenuItem value="overdue">Overdue</MenuItem>
                      <MenuItem value="cancelled">Cancelled</MenuItem>
                    </TextField>
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
                    />
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
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Due Date"
                      name="due_date"
                      type="date"
                      value={formData.due_date || ''}
                      onChange={handleInputChange}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Employee Name"
                      name="employee_name"
                      value={formData.employee_name}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>Line Items</Typography>
                    <TableContainer component={Paper} sx={{ mb: 2 }}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Description</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Unit Price</TableCell>
                            <TableCell>Amount</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {formData.line_items.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell>{item.description}</TableCell>
                              <TableCell>{item.quantity}</TableCell>
                              <TableCell>${item.unit_price}</TableCell>
                              <TableCell>${(item.quantity * item.unit_price).toFixed(2)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                        <TableHead>
                          <TableRow>
                            <TableCell colSpan={3} align="right"><strong>Total:</strong></TableCell>
                            <TableCell>
                              <strong>
                                ${formData.line_items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0).toFixed(2)}
                              </strong>
                            </TableCell>
                          </TableRow>
                        </TableHead>
                      </Table>
                    </TableContainer>
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
              <PhotoUpload objectType="bill" objectId={bill.id} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default BillDetail; 