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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, PersonAdd as PersonAddIcon } from '@mui/icons-material';
import { format, parseISO } from 'date-fns';

const Billing = () => {
  const [bills, setBills] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openCustomerDialog, setOpenCustomerDialog] = useState(false);
  const [editingBill, setEditingBill] = useState(null);
  const [formData, setFormData] = useState({
    customer_id: '',
    appointment_id: '',
    type: 'bill',
    status: 'draft',
    description: '',
    notes: '',
    due_date: '',
    employee_name: '',
    line_items: [{ description: '', quantity: 1, unit_price: 0, notes: '' }],
  });
  const [settings, setSettings] = useState({
    sales_tax_rate: 0.0825
  });

  const billTypes = [
    { value: 'bill', label: 'Bill' },
    { value: 'estimate', label: 'Estimate' },
  ];

  const billStatuses = [
    { value: 'draft', label: 'Draft' },
    { value: 'sent', label: 'Sent' },
    { value: 'paid', label: 'Paid' },
    { value: 'overdue', label: 'Overdue' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  useEffect(() => {
    fetchBills();
    fetchCustomers();
    fetchAppointments();
    fetchSettings();
    fetchTechnicians();
  }, []);

  const fetchBills = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/bills/');
      const data = await response.json();
      setBills(data);
    } catch (error) {
      console.error('Error fetching bills:', error);
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

  const fetchAppointments = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/appointments/');
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/settings/');
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      console.error('Error fetching settings:', error);
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

  const handleOpenDialog = (bill = null) => {
    if (bill) {
      setEditingBill(bill);
      setFormData({
        customer_id: bill.customer?.id || '',
        appointment_id: bill.appointment?.id || '',
        type: bill.type,
        status: bill.status,
        description: bill.description,
        notes: bill.notes,
        due_date: bill.due_date,
        employee_name: bill.employee_name,
        line_items: bill.line_items.map(item => ({
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
          notes: item.notes,
          part_number: item.part_number || '',
          employee_number: item.employee_number || '',
          is_labor: item.is_labor || false,
          is_taxable: item.is_taxable ?? true,
          technician_id: item.technician?.id || null
        })),
      });
    } else {
      setEditingBill(null);
      setFormData({
        customer_id: '',
        appointment_id: '',
        type: 'bill',
        status: 'draft',
        description: '',
        notes: '',
        due_date: '',
        employee_name: '',
        line_items: [{
          description: '',
          quantity: 1,
          unit_price: 0,
          notes: '',
          part_number: '',
          employee_number: '',
          is_labor: false,
          is_taxable: true,
          technician_id: null
        }],
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
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLineItemChange = (index, field, value) => {
    const newLineItems = [...formData.line_items];
    newLineItems[index] = {
      ...newLineItems[index],
      [field]: value,
    };
    
    // If it's a labor item, ensure it's not taxable
    if (field === 'is_labor' && value) {
      newLineItems[index].is_taxable = false;
    }
    
    // If changing technician, update the employee number and rate
    if (field === 'technician_id' && value) {
      const technician = technicians.find(t => t.id === parseInt(value));
      if (technician) {
        newLineItems[index].employee_number = technician.user?.username || '';
        newLineItems[index].unit_price = technician.labor_rate || 0;
      }
    }
    
    setFormData(prev => ({
      ...prev,
      line_items: newLineItems,
    }));
  };

  const addLineItem = (isLabor = false) => {
    setFormData(prev => ({
      ...prev,
      line_items: [...prev.line_items, {
        description: isLabor ? 'Labor' : '',
        quantity: 1,
        unit_price: 0,
        notes: '',
        part_number: '',
        employee_number: '',
        is_labor: isLabor,
        is_taxable: !isLabor, // Labor is not taxable, everything else is
        technician_id: null
      }],
    }));
  };

  const removeLineItem = (index) => {
    setFormData(prev => ({
      ...prev,
      line_items: prev.line_items.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingBill
        ? `http://localhost:8000/api/bills/${editingBill.id}/`
        : 'http://localhost:8000/api/bills/';
      
      const method = editingBill ? 'PUT' : 'POST';
      
      // Format the data before sending
      const formattedData = {
        ...formData,
        due_date: formData.due_date ? format(parseISO(formData.due_date), 'yyyy-MM-dd') : null,
        line_items: formData.line_items.map(item => ({
          ...item,
          quantity: parseFloat(item.quantity) || 0,
          unit_price: parseFloat(item.unit_price) || 0,
          technician_id: item.technician_id ? parseInt(item.technician_id) : null,
          employee_number: item.is_labor ? item.employee_number : null,
          part_number: !item.is_labor ? item.part_number : null
        }))
      };
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });

      if (response.ok) {
        fetchBills();
        handleCloseDialog();
      } else {
        const errorData = await response.json();
        console.error('Error saving bill:', errorData);
      }
    } catch (error) {
      console.error('Error saving bill:', error);
    }
  };

  const handleDelete = async (billId) => {
    if (window.confirm('Are you sure you want to delete this bill?')) {
      try {
        const response = await fetch(`http://localhost:8000/api/bills/${billId}/`, {
          method: 'DELETE',
        });

        if (response.ok) {
          fetchBills();
        } else {
          console.error('Error deleting bill');
        }
      } catch (error) {
        console.error('Error deleting bill:', error);
      }
    }
  };

  const handleOpenCustomerDialog = () => {
    setOpenCustomerDialog(true);
  };

  const handleCloseCustomerDialog = () => {
    setOpenCustomerDialog(false);
  };

  const handleCreateCustomer = async (customerData) => {
    try {
      const response = await fetch('http://localhost:8000/api/customers/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData),
      });

      if (response.ok) {
        const newCustomer = await response.json();
        setCustomers([...customers, newCustomer]);
        setFormData(prev => ({
          ...prev,
          customer_id: newCustomer.id
        }));
        handleCloseCustomerDialog();
      }
    } catch (error) {
      console.error('Error creating customer:', error);
    }
  };

  const handleAppointmentChange = (e) => {
    const appointmentId = e.target.value;
    if (appointmentId) {
      const selectedAppointment = appointments.find(a => a.id === parseInt(appointmentId));
      if (selectedAppointment) {
        setFormData(prev => ({
          ...prev,
          appointment_id: appointmentId,
          customer_id: selectedAppointment.customer.id,
          description: selectedAppointment.description,
          notes: selectedAppointment.notes
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        appointment_id: '',
        description: '',
        notes: ''
      }));
    }
  };

  const calculateTotals = (lineItems) => {
    const subtotal = lineItems.reduce((sum, item) => {
      const amount = item.quantity * item.unit_price;
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);
    
    const taxableAmount = lineItems
      .filter(item => item.is_taxable)
      .reduce((sum, item) => {
        const amount = item.quantity * item.unit_price;
        return sum + (isNaN(amount) ? 0 : amount);
      }, 0);
    
    const taxAmount = taxableAmount * (settings?.sales_tax_rate || 0);
    const total = subtotal + taxAmount;

    return {
      subtotal: isNaN(subtotal) ? 0 : subtotal,
      taxAmount: isNaN(taxAmount) ? 0 : taxAmount,
      total: isNaN(total) ? 0 : total
    };
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            Billing
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{ mb: 2 }}
          >
            New Bill/Estimate
          </Button>
        </Grid>

        {bills.map((bill) => {
          const totals = calculateTotals(bill.line_items);
          return (
            <Grid item xs={12} key={bill.id}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': {
                    boxShadow: 6,
                    backgroundColor: 'rgba(0, 0, 0, 0.02)'
                  }
                }}
                onClick={() => handleOpenDialog(bill)}
              >
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="h6">
                        {bill.type === 'bill' ? 'Bill' : 'Estimate'} #{bill.id}
                      </Typography>
                      <Typography color="textSecondary">
                        Customer: {bill.customer ? `${bill.customer.first_name} ${bill.customer.last_name}` : 'Cash/Walk-in'}
                      </Typography>
                      {bill.employee_name && (
                        <Typography color="textSecondary">
                          Employee: {bill.employee_name}
                        </Typography>
                      )}
                      {bill.appointment && (
                        <Typography color="textSecondary">
                          Appointment: #{bill.appointment.id} [{bill.appointment.description}]
                        </Typography>
                      )}
                      {bill.description && (
                        <Typography color="textSecondary" sx={{ mt: 1 }}>
                          Description: {bill.description}
                        </Typography>
                      )}
                      {bill.notes && (
                        <Typography color="textSecondary" sx={{ mt: 1 }}>
                          Notes: {bill.notes}
                        </Typography>
                      )}
                    </Grid>
                    <Grid item xs={12} sm={6} sx={{ textAlign: 'right' }}>
                      <Typography variant="h6">
                        Total: ${totals.total.toFixed(2)}
                      </Typography>
                      <Typography color="textSecondary">
                        Status: {bill.status}
                      </Typography>
                      <Typography color="textSecondary">
                        Due Date: {bill.due_date ? new Date(bill.due_date).toLocaleDateString() : 'Not set'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <TableContainer component={Paper}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Description</TableCell>
                              <TableCell>Employee ID</TableCell>
                              <TableCell align="right">Quantity/Hours</TableCell>
                              <TableCell align="right">Unit Price</TableCell>
                              <TableCell align="right">Amount</TableCell>
                              <TableCell align="center">Taxable</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {bill.line_items.map((item) => (
                              <TableRow key={item.id}>
                                <TableCell>
                                  {item.description}
                                  {item.is_labor && item.technician?.user && (
                                    <Typography variant="caption" display="block" color="textSecondary">
                                      Tech: {item.technician.user.first_name} {item.technician.user.last_name}
                                    </Typography>
                                  )}
                                </TableCell>
                                <TableCell>{item.is_labor ? item.employee_number : item.part_number}</TableCell>
                                <TableCell align="right">{item.quantity}</TableCell>
                                <TableCell align="right">${item.unit_price}</TableCell>
                                <TableCell align="right">${(item.quantity * item.unit_price).toFixed(2)}</TableCell>
                                <TableCell align="center">{item.is_taxable ? 'Yes' : 'No'}</TableCell>
                              </TableRow>
                            ))}
                            <TableRow>
                              <TableCell colSpan={4} align="right">
                                <strong>Subtotal:</strong>
                              </TableCell>
                              <TableCell align="right">
                                <strong>${totals.subtotal.toFixed(2)}</strong>
                              </TableCell>
                              <TableCell />
                            </TableRow>
                            <TableRow>
                              <TableCell colSpan={4} align="right">
                                <strong>Tax ({settings.sales_tax_rate * 100}%):</strong>
                              </TableCell>
                              <TableCell align="right">
                                <strong>${totals.taxAmount.toFixed(2)}</strong>
                              </TableCell>
                              <TableCell />
                            </TableRow>
                            <TableRow>
                              <TableCell colSpan={4} align="right">
                                <strong>Total:</strong>
                              </TableCell>
                              <TableCell align="right">
                                <strong>${totals.total.toFixed(2)}</strong>
                              </TableCell>
                              <TableCell />
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>
                    <Grid item xs={12} sx={{ textAlign: 'right' }}>
                      <IconButton
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(bill.id);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingBill ? 'Edit Bill/Estimate' : 'New Bill/Estimate'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
              >
                {billTypes.map((option) => (
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
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                {billStatuses.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', gap: 1 }}>
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
                <IconButton 
                  color="primary" 
                  onClick={handleOpenCustomerDialog}
                  sx={{ mt: 1 }}
                >
                  <PersonAddIcon />
                </IconButton>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Appointment (Optional)"
                name="appointment_id"
                value={formData.appointment_id}
                onChange={handleAppointmentChange}
              >
                <MenuItem value="">None</MenuItem>
                {appointments.map((appointment) => (
                  <MenuItem key={appointment.id} value={appointment.id}>
                    #{appointment.id} - {appointment.description}
                  </MenuItem>
                ))}
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
                value={formData.due_date ? format(parseISO(formData.due_date), 'yyyy-MM-dd') : ''}
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
              <Typography variant="h6" gutterBottom>
                Line Items
              </Typography>
              {formData.line_items.map((item, index) => (
                <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Description"
                      value={item.description}
                      onChange={(e) => handleLineItemChange(index, 'description', e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    {item.is_labor ? (
                      <TextField
                        fullWidth
                        label="Employee ID"
                        value={item.employee_number || ''}
                        disabled
                      />
                    ) : (
                      <TextField
                        fullWidth
                        label="Part Number"
                        value={item.part_number}
                        onChange={(e) => handleLineItemChange(index, 'part_number', e.target.value)}
                      />
                    )}
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      fullWidth
                      label={item.is_labor ? "Hours" : "Quantity"}
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleLineItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      fullWidth
                      label="Unit Price"
                      type="number"
                      value={item.unit_price}
                      onChange={(e) => handleLineItemChange(index, 'unit_price', parseFloat(e.target.value) || 0)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      fullWidth
                      label="Amount"
                      type="number"
                      value={(item.quantity * item.unit_price).toFixed(2)}
                      disabled
                    />
                  </Grid>
                  {item.is_labor && (
                    <Grid item xs={12} sm={6}>
                      <TextField
                        select
                        fullWidth
                        label="Technician"
                        value={item.technician_id || ''}
                        onChange={(e) => handleLineItemChange(index, 'technician_id', e.target.value)}
                      >
                        <MenuItem value="">None</MenuItem>
                        {technicians.map((tech) => (
                          <MenuItem key={tech.id} value={tech.id}>
                            {tech.user?.first_name} {tech.user?.last_name} ({tech.user?.username || 'N/A'})
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  )}
                  <Grid item xs={12} sm={1}>
                    <IconButton
                      color="error"
                      onClick={() => removeLineItem(index)}
                      disabled={formData.line_items.length === 1}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
              <Button
                startIcon={<AddIcon />}
                onClick={() => addLineItem(false)}
                sx={{ mr: 1 }}
              >
                Add Item
              </Button>
              <Button
                startIcon={<AddIcon />}
                onClick={() => addLineItem(true)}
              >
                Add Labor
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editingBill ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openCustomerDialog} onClose={handleCloseCustomerDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Customer</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="first_name"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="last_name"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                multiline
                rows={2}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCustomerDialog}>Cancel</Button>
          <Button onClick={handleCreateCustomer} variant="contained" color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Billing; 