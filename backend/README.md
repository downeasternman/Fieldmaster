# FieldMaster Backend

This is the backend service for the FieldMaster field service management system.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```
PORT=8000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/fieldmaster
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

3. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Bills
- GET /api/bills - List all bills
- POST /api/bills - Create a new bill
- GET /api/bills/:id - Get a specific bill
- PUT /api/bills/:id - Update a bill
- DELETE /api/bills/:id - Delete a bill

### Customers
- GET /api/customers - List all customers
- POST /api/customers - Create a new customer
- GET /api/customers/:id - Get a specific customer
- PUT /api/customers/:id - Update a customer
- DELETE /api/customers/:id - Delete a customer

### Appointments
- GET /api/appointments - List all appointments
- POST /api/appointments - Create a new appointment
- GET /api/appointments/:id - Get a specific appointment
- PUT /api/appointments/:id - Update an appointment
- DELETE /api/appointments/:id - Delete an appointment

### Technicians
- GET /api/technicians - List all technicians
- POST /api/technicians - Create a new technician
- GET /api/technicians/:id - Get a specific technician
- PUT /api/technicians/:id - Update a technician
- DELETE /api/technicians/:id - Delete a technician

### Settings
- GET /api/settings - Get current settings
- PUT /api/settings - Update settings

## Development

The backend is built with:
- Node.js
- Express
- PostgreSQL
- JWT for authentication

## Project Structure

```
backend/
├── src/
│   ├── models/        # Database models
│   ├── controllers/   # Route controllers
│   ├── routes/        # API routes
│   ├── middleware/    # Custom middleware
│   ├── config/        # Configuration files
│   ├── utils/         # Utility functions
│   └── index.js       # Application entry point
├── package.json
└── README.md
``` 