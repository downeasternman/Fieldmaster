import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Grid,
  MenuItem,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';
import api from '../services/api';

const Billing = () => {
  const [bills, setBills] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingBill, setEditingBill] = useState(null);
  const [formData, setFormData] = useState({
    type: 'bill',
    customer_id: '',
    amount: '',
    description: '',
    notes: '',
    due_date: null,
    // New customer fields
    new_customer: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      address: '',
    },
    is_new_customer: false,
  });

  useEffect(() => {
    fetchBills();
    fetchCustomers();
  }, []);

  const fetchBills = async () => {
    try {
      const response = await api.get('/bills/');
      setBills(response.data);
    } catch (error) {
      console.error('Error fetching bills:', error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await api.get('/customers/');
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const handleOpenDialog = (bill = null) => {
    if (bill) {
      setEditingBill(bill);
      setFormData({
        type: bill.type,
        customer_id: bill.customer_id,
        amount: bill.amount,
        description: bill.description,
        notes: bill.notes,
        due_date: bill.due_date ? new Date(bill.due_date) : null,
        is_new_customer: false,
        new_customer: {
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
          address: '',
        },
      });
    } else {
      setEditingBill(null);
      setFormData({
        type: 'bill',
        customer_id: '',
        amount: '',
        description: '',
        notes: '',
        due_date: null,
        is_new_customer: false,
        new_customer: {
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
          address: '',
        },
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingBill(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('new_customer.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        new_customer: {
          ...prev.new_customer,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let customerId = formData.customer_id;
      
      // If creating a new customer
      if (formData.is_new_customer && formData.new_customer.first_name) {
        const customerResponse = await api.post('/customers/', formData.new_customer);
        customerId = customerResponse.data.id;
      }

      const billData = {
        type: formData.type,
        customer_id: customerId || null, // null for cash/walk-in
        amount: formData.amount,
        description: formData.description,
        notes: formData.notes,
        due_date: formData.due_date ? format(formData.due_date, 'yyyy-MM-dd') : null,
      };

      if (editingBill) {
        await api.put(`/bills/${editingBill.id}/`, billData);
      } else {
        await api.post('/bills/', billData);
      }

      fetchBills();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving bill:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this bill?')) {
      try {
        await api.delete(`/bills/${id}/`);
        fetchBills();
      } catch (error) {
        console.error('Error deleting bill:', error);
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Billing</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          New Bill/Estimate
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bills.map((bill) => (
              <TableRow key={bill.id}>
                <TableCell>{bill.type}</TableCell>
                <TableCell>{bill.customer ? `${bill.customer.first_name} ${bill.customer.last_name}` : 'Cash/Walk-in'}</TableCell>
                <TableCell>${bill.amount}</TableCell>
                <TableCell>{bill.due_date}</TableCell>
                <TableCell>{bill.status}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(bill)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(bill.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingBill ? 'Edit Bill/Estimate' : 'New Bill/Estimate'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                >
                  <MenuItem value="bill">Bill</MenuItem>
                  <MenuItem value="estimate">Estimate</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Customer"
                  name="customer_id"
                  value={formData.customer_id}
                  onChange={handleInputChange}
                >
                  <MenuItem value="">Cash/Walk-in</MenuItem>
                  {customers.map((customer) => (
                    <MenuItem key={customer.id} value={customer.id}>
                      {customer.first_name} {customer.last_name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  onClick={() => setFormData(prev => ({ ...prev, is_new_customer: !prev.is_new_customer }))}
                >
                  {formData.is_new_customer ? 'Select Existing Customer' : 'Add New Customer'}
                </Button>
              </Grid>

              {formData.is_new_customer && (
                <>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="First Name"
                      name="new_customer.first_name"
                      value={formData.new_customer.first_name}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      name="new_customer.last_name"
                      value={formData.new_customer.last_name}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="new_customer.email"
                      value={formData.new_customer.email}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone"
                      name="new_customer.phone"
                      value={formData.new_customer.phone}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Address"
                      name="new_customer.address"
                      value={formData.new_customer.address}
                      onChange={handleInputChange}
                      multiline
                      rows={2}
                    />
                  </Grid>
                </>
              )}

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Amount"
                  name="amount"
                  type="number"
                  value={formData.amount}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Due Date"
                    value={formData.due_date}
                    onChange={(newValue) => {
                      setFormData(prev => ({ ...prev, due_date: newValue }));
                    }}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  multiline
                  rows={3}
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
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingBill ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Billing; 