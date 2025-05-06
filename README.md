# FieldMaster

FieldMaster is a comprehensive field service management system designed to streamline appointment scheduling, customer management, and billing processes.

## Features

- **Appointment Management**
  - Schedule and track appointments
  - Assign technicians to appointments
  - Track appointment status and priority
  - Upload and manage appointment photos

- **Customer Management**
  - Store customer information
  - Track customer history
  - Manage customer communications

- **Technician Management**
  - Manage technician profiles
  - Track technician availability
  - Assign technicians to appointments

- **Billing System**
  - Automatic bill creation for appointments
  - Support for both bills and estimates
  - Track bill status (draft, sent, paid, cancelled)
  - Generate bills for any customer at any time
  - Set due dates and payment tracking

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

1. Clone the repository
2. Install dependencies:
   ```bash
   # Backend
   pip install -r requirements.txt
   
   # Frontend
   cd frontend
   npm install
   ```

3. Set up the database:
   ```bash
   python manage.py migrate
   ```

4. Start the development servers:
   ```bash
   # Backend
   python manage.py runserver
   
   # Frontend
   cd frontend
   npm start
   ```

## Development

- Backend API runs on http://localhost:8000
- Frontend development server runs on http://localhost:3000
- API documentation available at http://localhost:8000/api/

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 