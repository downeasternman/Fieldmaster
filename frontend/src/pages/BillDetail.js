import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, Alert, Table } from 'react-bootstrap';
import axios from 'axios';
import PhotoUpload from '../components/PhotoUpload';

const BillDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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

  useEffect(() => {
    fetchBill();
    fetchCustomers();
    fetchAppointments();
  }, [id]);

  const fetchBill = async () => {
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
  };

  const fetchCustomers = async () => {
    try {
      const response = await axios.get('/api/customers/');
      setCustomers(response.data);
    } catch (err) {
      console.error('Error fetching customers:', err);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await axios.get('/api/appointments/');
      setAppointments(response.data);
    } catch (err) {
      console.error('Error fetching appointments:', err);
    }
  };

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
      <Container className="mt-4">
        <div>Loading...</div>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <h2>Bill Details</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
        </Col>
        <Col xs="auto">
          <Button variant="outline-secondary" onClick={() => navigate('/bills')}>
            Back to Bills
          </Button>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={8}>
          <Card>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Customer</Form.Label>
                  <Form.Select
                    name="customer"
                    value={formData.customer}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Customer</option>
                    {customers.map(customer => (
                      <option key={customer.id} value={customer.id}>
                        {customer.first_name} {customer.last_name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Appointment</Form.Label>
                  <Form.Select
                    name="appointment"
                    value={formData.appointment}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Appointment</option>
                    {appointments.map(appointment => (
                      <option key={appointment.id} value={appointment.id}>
                        #{appointment.id} - {appointment.description}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Type</Form.Label>
                  <Form.Select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="bill">Bill</option>
                    <option value="estimate">Estimate</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="draft">Draft</option>
                    <option value="sent">Sent</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                    <option value="cancelled">Cancelled</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Notes</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Due Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="due_date"
                    value={formData.due_date || ''}
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Employee Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="employee_name"
                    value={formData.employee_name}
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <h4>Line Items</h4>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th>Quantity</th>
                      <th>Unit Price</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.line_items.map((item, index) => (
                      <tr key={index}>
                        <td>{item.description}</td>
                        <td>{item.quantity}</td>
                        <td>${item.unit_price}</td>
                        <td>${(item.quantity * item.unit_price).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="3" className="text-end"><strong>Total:</strong></td>
                      <td>
                        <strong>
                          ${formData.line_items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0).toFixed(2)}
                        </strong>
                      </td>
                    </tr>
                  </tfoot>
                </Table>

                <Button type="submit" variant="primary">
                  Save Changes
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Photos</Card.Title>
              <PhotoUpload
                objectType="bill"
                objectId={bill.id}
                onPhotoAdded={() => {
                  setSuccess('Photo added successfully');
                  setTimeout(() => setSuccess(''), 3000);
                }}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default BillDetail; 