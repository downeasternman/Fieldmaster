# FieldMaster

FieldMaster is a comprehensive field service management system designed to streamline appointment scheduling, customer management, and billing operations.

## Features

### Appointment Management
- Schedule and track appointments
- Assign technicians to appointments
- Track appointment status and priority
- Add notes and photos to appointments
- Separate date and time inputs for better user experience

### Customer Management
- Store customer information
- Track customer history
- Manage customer appointments
- View customer details and notes

### Technician Management
- Manage technician profiles
- Track technician availability
- Assign technicians to appointments
- View technician performance

### Billing System
- Create bills and estimates
- Add line items with quantities and prices
- Support for both regular items and labor items
- Automatic labor rate population from technician profiles
- Track employee numbers for labor items
- Automatic tax handling (labor items non-taxable by default)
- Part number tracking for regular items
- Automatic total calculation with tax
- Track bill status (draft, sent, paid, overdue, cancelled)
- Link bills to appointments
- Set due dates for bills
- Support for both bills and estimates
- Automatic bill creation for new appointments
- Support for walk-in/cash customers

## Production Readiness Checklist

### Critical Issues and Bugs

- Fix select component value handling
  - Address out-of-range value warnings for customer_id select
  - Ensure proper value validation for select fields
- Address React Router deprecation warnings
  - Update to use v7_startTransition and v7_relativeSplatPath future flags
- Fix Material-UI component warnings
  - Update Date and Time Pickers to use textField component slot
  - Remove deprecated renderInput prop usage
- Fix accessibility issues
  - Address aria-hidden focus issues
  - Implement proper focus management

### Security
- [x] Basic authentication system implemented
- [ ] Implement proper JWT authentication
- [ ] Add rate limiting for API endpoints
- [ ] Set up CORS properly for production
- [ ] Implement password hashing and security policies
- [ ] Add API key management for external integrations
- [ ] Set up SSL/TLS certificates
- [ ] Implement proper session management
- [ ] Add request validation and sanitization
- [ ] Set up security headers

### Database
- [x] Basic models and relationships defined
- [ ] Add database indexes for performance
- [ ] Implement database migrations strategy
- [ ] Set up database backup system
- [ ] Add database monitoring
- [ ] Implement connection pooling
- [ ] Add database caching layer
- [ ] Set up database replication for high availability

### API & Backend
- [x] Basic CRUD operations implemented
- [x] RESTful API endpoints created
- [ ] Add API versioning
- [ ] Implement proper error handling
- [ ] Add request/response logging
- [ ] Set up API documentation (Swagger/OpenAPI)
- [ ] Add API monitoring and analytics
- [ ] Implement caching strategy
- [ ] Add background task processing
- [ ] Set up proper logging system

### Frontend
- [x] Basic UI components implemented
- [x] Material-UI integration
- [ ] Add proper error boundaries
- [ ] Implement loading states
- [ ] Add proper form validation
- [ ] Implement proper state management
- [ ] Add unit tests for components
- [ ] Set up E2E testing
- [ ] Implement proper error handling
- [ ] Add performance monitoring
- [ ] Implement proper code splitting
- [ ] Add PWA support

### DevOps & Infrastructure
- [x] Basic development environment setup
- [ ] Set up CI/CD pipeline
- [ ] Configure production environment
- [ ] Set up monitoring and alerting
- [ ] Implement logging aggregation
- [ ] Set up automated backups
- [ ] Configure load balancing
- [ ] Set up auto-scaling
- [ ] Implement blue-green deployment
- [ ] Add infrastructure as code

### Business Logic
- [x] Basic appointment management
- [x] Customer management system
- [x] Technician management
- [x] Billing system with line items
- [ ] Add reporting system
- [ ] Implement analytics dashboard
- [ ] Add customer notifications
- [ ] Implement payment processing
- [ ] Add inventory management
- [ ] Implement scheduling optimization
- [ ] Add customer portal
- [ ] Implement technician mobile app

### Documentation
- [x] Basic README
- [x] API documentation started
- [ ] Add detailed API documentation
- [ ] Create user documentation
- [ ] Add developer documentation
- [ ] Create deployment guide
- [ ] Add troubleshooting guide
- [ ] Create maintenance guide
- [ ] Add security documentation

### Testing
- [ ] Add unit tests for backend
- [ ] Add integration tests
- [ ] Add E2E tests
- [ ] Set up test automation
- [ ] Add performance tests
- [ ] Implement security testing
- [ ] Add load testing
- [ ] Set up test coverage reporting

### Compliance & Legal
- [ ] Add GDPR compliance
- [ ] Implement data retention policies
- [ ] Add terms of service
- [ ] Create privacy policy
- [ ] Add cookie policy
- [ ] Implement audit logging
- [ ] Add data export functionality
- [ ] Create compliance documentation

## Technology Stack

- **Backend**
  - Django
  - Django REST Framework
  - PostgreSQL

- **Frontend**
  - React
  - Material-UI
  - Axios for API communication

## Getting Started

### Prerequisites
- Python 3.8 or higher
- Node.js 14 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/fieldmaster.git
cd fieldmaster
```

2. Set up the backend:
```bash
# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Start the backend server
python manage.py runserver
```

3. Set up the frontend:
```bash
cd frontend
npm install
npm start
```

4. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api

## Usage

### Appointments
1. Navigate to the Appointments page
2. Click "New Appointment" to create an appointment
3. Fill in the appointment details
4. Select a customer and technician
5. Set the date and time
6. Add any notes or photos
7. Save the appointment

### Billing
1. Navigate to the Billing page
2. Click "New Bill/Estimate" to create a bill or estimate
3. Select a customer (and optionally link to an appointment)
4. Add line items with descriptions, quantities, and prices
5. Set the due date and status
6. Add any notes
7. Save the bill or estimate

## Development

### Project Structure
```
fieldmaster/
├── frontend/           # React frontend
├── appointments/       # Django app for appointments
├── manage.py          # Django management script
└── requirements.txt   # Python dependencies
```

### Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 