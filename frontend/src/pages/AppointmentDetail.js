import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, Alert } from 'react-bootstrap';
import axios from 'axios';
import PhotoUpload from '../components/PhotoUpload';

const AppointmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
      <Container className="mt-4">
        <div>Loading...</div>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <h2>Appointment Details</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
        </Col>
        <Col xs="auto">
          <Button variant="outline-secondary" onClick={() => navigate('/appointments')}>
            Back to Appointments
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
                    required
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
                  <Form.Label>Technician</Form.Label>
                  <Form.Select
                    name="technician"
                    value={formData.technician}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Technician</option>
                    {technicians.map(technician => (
                      <option key={technician.id} value={technician.id}>
                        {technician.user.first_name} {technician.user.last_name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="appointment_date"
                    value={formData.appointment_date}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Row>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Start Time</Form.Label>
                      <Form.Control
                        type="time"
                        name="start_time"
                        value={formData.start_time}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>End Time</Form.Label>
                      <Form.Control
                        type="time"
                        name="end_time"
                        value={formData.end_time}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Priority</Form.Label>
                  <Form.Select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="emergency">Emergency</option>
                  </Form.Select>
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
                objectType="appointment"
                objectId={appointment.id}
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

export default AppointmentDetail; 