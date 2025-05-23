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
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import axios from 'axios';
import PhotoUpload from '../components/PhotoUpload';

const BillDetail = () => {
  const { id } = useParams();
  const [bill, setBill] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingLineItemId, setEditingLineItemId] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [lineItemToDelete, setLineItemToDelete] = useState(null);
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

  const fetchTechnicians = useCallback(async () => {
    try {
      const response = await axios.get('/api/technicians/');
      setTechnicians(response.data);
    } catch (err) {
      console.error('Error fetching technicians:', err);
    }
  }, []);

  useEffect(() => {
    fetchBill();
    fetchCustomers();
    fetchAppointments();
    fetchTechnicians();
  }, [id, fetchBill, fetchCustomers, fetchAppointments, fetchTechnicians]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Sanitize line_items: remove temp_ IDs for new items, ensure required fields, and remove 'bill' field
      const sanitizedLineItems = formData.line_items.map(item => {
        const newItem = { ...item };
        if (typeof newItem.id === 'string' && newItem.id.startsWith('temp_')) {
          delete newItem.id;
        }
        if ('bill' in newItem) {
          delete newItem.bill;
        }
        // Optionally, ensure required fields are present
        if (!newItem.description) newItem.description = '';
        if (!newItem.quantity) newItem.quantity = 0;
        if (!newItem.unit_price) newItem.unit_price = 0;
        return newItem;
      });
      await axios.put(`/api/bills/${id}/`, {
        customer_id: formData.customer,
        appointment_id: formData.appointment,
        type: formData.type,
        status: formData.status,
        description: formData.description,
        notes: formData.notes,
        due_date: formData.due_date,
        employee_name: formData.employee_name,
        line_items: sanitizedLineItems
      });
      setSuccess('Bill updated successfully');
      setTimeout(() => setSuccess(''), 3000);
      fetchBill();
    } catch (err) {
      let errorMsg = 'Failed to update bill';
      if (err.response && err.response.data) {
        errorMsg += ': ' + JSON.stringify(err.response.data);
        console.error('Backend error:', err.response.data);
      } else {
        console.error('Error updating bill:', err);
      }
      setError(errorMsg);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLineItemEdit = (lineItemId) => {
    setEditingLineItemId(lineItemId);
  };

  const handleLineItemSave = (lineItemId) => {
    setEditingLineItemId(null);
    // The line item changes are already in formData, just need to clear edit mode
  };

  const handleLineItemCancel = () => {
    setEditingLineItemId(null);
    // Revert changes by re-fetching the bill
    fetchBill();
  };

  const handleLineItemChange = (lineItemId, field, value) => {
    setFormData(prev => ({
      ...prev,
      line_items: prev.line_items.map(item =>
        item.id === lineItemId
          ? { ...item, [field]: value }
          : item
      )
    }));
  };

  const handleDeleteLineItem = (lineItem) => {
    setLineItemToDelete(lineItem);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteLineItem = () => {
    setFormData(prev => ({
      ...prev,
      line_items: prev.line_items.filter(item => item.id !== lineItemToDelete.id)
    }));
    setDeleteConfirmOpen(false);
    setLineItemToDelete(null);
  };

  const addLineItem = (isLabor = false) => {
    const newItem = {
      id: `temp_${Date.now()}`, // Temporary ID for new items
      description: '',
      quantity: 1,
      unit_price: 0,
      notes: '',
      is_labor: isLabor,
      is_taxable: true,
      technician_id: null,
      employee_number: '',
      part_number: ''
    };

    setFormData(prev => ({
      ...prev,
      line_items: [...prev.line_items, newItem]
    }));
    setEditingLineItemId(newItem.id);
  };

  if (!bill) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth={false} sx={{ mt: 4, mb: 4 }}>
      <style>{`
        @media print {
          .MuiAppBar-root, .MuiDrawer-root, .MuiButton-root.print-btn { display: none !important; }
          body { background: white !important; }
          .print-area { width: 100vw !important; margin: 0 !important; }
        }
      `}</style>
      <Button className="print-btn" variant="outlined" sx={{ mb: 2 }} onClick={() => window.print()}>
        Print
      </Button>
      <div className="print-area">
        <Grid container spacing={3}>
          <Grid item xs={12} md={9} sx={{ display: 'flex', flexDirection: 'column' }}>
            <Card sx={{ width: '100%', flexGrow: 1 }}>
              <CardContent>
                <Typography variant="h4" gutterBottom>Bill Details</Typography>
                {error && <Alert severity="error">{error}</Alert>}
                {success && <Alert severity="success">{success}</Alert>}
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
                      <TableContainer component={Paper} sx={{ width: '100%', overflowX: 'visible', flexGrow: 1 }}>
                        <Table sx={{ minWidth: '100%' }}>
                          <TableHead>
                            <TableRow>
                              <TableCell sx={{ minWidth: 300 }}>Description</TableCell>
                              <TableCell sx={{ minWidth: 120 }}>Part/Employee #</TableCell>
                              <TableCell sx={{ minWidth: 100 }}>Quantity</TableCell>
                              <TableCell sx={{ minWidth: 120 }}>Unit Price</TableCell>
                              <TableCell sx={{ minWidth: 100 }}>Total</TableCell>
                              <TableCell sx={{ minWidth: 120 }}>Actions</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {formData.line_items.map((item) => (
                              <TableRow key={item.id}>
                                {editingLineItemId === item.id ? (
                                  // Edit mode
                                  <>
                                    <TableCell>
                                      <TextField
                                        fullWidth
                                        value={item.description}
                                        onChange={(e) => handleLineItemChange(item.id, 'description', e.target.value)}
                                        size="small"
                                        sx={{ minWidth: 120 }}
                                      />
                                    </TableCell>
                                    <TableCell>
                                      {item.is_labor ? (
                                        <TextField
                                          value={item.employee_number || ''}
                                          onChange={(e) => handleLineItemChange(item.id, 'employee_number', e.target.value)}
                                          size="small"
                                          sx={{ minWidth: 100 }}
                                        />
                                      ) : (
                                        <TextField
                                          value={item.part_number || ''}
                                          onChange={(e) => handleLineItemChange(item.id, 'part_number', e.target.value)}
                                          size="small"
                                          sx={{ minWidth: 100 }}
                                        />
                                      )}
                                    </TableCell>
                                    <TableCell>
                                      <TextField
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) => handleLineItemChange(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                                        size="small"
                                        sx={{ minWidth: 80 }}
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <TextField
                                        type="number"
                                        value={item.unit_price}
                                        onChange={(e) => handleLineItemChange(item.id, 'unit_price', parseFloat(e.target.value) || 0)}
                                        size="small"
                                        sx={{ minWidth: 100 }}
                                      />
                                    </TableCell>
                                    <TableCell align="right">
                                      ${(item.quantity * item.unit_price).toFixed(2)}
                                    </TableCell>
                                    <TableCell>
                                      <IconButton onClick={() => handleLineItemSave(item.id)} color="primary">
                                        <SaveIcon />
                                      </IconButton>
                                      <IconButton onClick={handleLineItemCancel} color="error">
                                        <CancelIcon />
                                      </IconButton>
                                    </TableCell>
                                  </>
                                ) : (
                                  // Display mode
                                  <>
                                    <TableCell>{item.description}</TableCell>
                                    <TableCell>{item.is_labor ? item.employee_number : item.part_number}</TableCell>
                                    <TableCell align="right">{item.quantity}</TableCell>
                                    <TableCell align="right">${item.unit_price}</TableCell>
                                    <TableCell align="right">${(item.quantity * item.unit_price).toFixed(2)}</TableCell>
                                    <TableCell>
                                      <IconButton onClick={() => handleLineItemEdit(item.id)} color="primary">
                                        <EditIcon />
                                      </IconButton>
                                      <IconButton onClick={() => handleDeleteLineItem(item)} color="error">
                                        <DeleteIcon />
                                      </IconButton>
                                    </TableCell>
                                  </>
                                )}
                              </TableRow>
                            ))}
                            <TableRow>
                              <TableCell colSpan={4} align="right">
                                <strong>Total:</strong>
                              </TableCell>
                              <TableCell align="right">
                                <strong>
                                  ${formData.line_items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0).toFixed(2)}
                                </strong>
                              </TableCell>
                              <TableCell />
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>
                    <Grid item xs={12}>
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
                    <Grid item xs={12}>
                      <Button type="submit" variant="contained">Save Changes</Button>
                    </Grid>
                  </Grid>
                </form>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ width: '100%' }}>
              <CardContent>
                <Typography variant="h6">Photos</Typography>
                <PhotoUpload objectType="bill" objectId={bill.id} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this line item?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
            <Button onClick={confirmDeleteLineItem} color="error">Delete</Button>
          </DialogActions>
        </Dialog>
      </div>
    </Container>
  );
};

export default BillDetail; 