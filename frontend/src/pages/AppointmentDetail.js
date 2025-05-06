import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, Alert } from 'react-bootstrap';
import axios from 'axios';
import PhotoUpload from '../components/PhotoUpload';

const AppointmentDetail = () => {
  // ... existing state and functions ...

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
                {/* ... existing form fields ... */}
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