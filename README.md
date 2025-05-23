# FieldMaster

FieldMaster is a comprehensive field service management system designed to streamline appointment scheduling, customer management, and billing operations.

## Monorepo Overview

This repository contains:
- **Frontend:** React + Material-UI app (`frontend/`)
- **Django Backend:** Handles core business logic, appointments, and billing (`fieldmaster/`, `appointments/`)
- **Node/Express Backend:** REST API for bills, customers, appointments, technicians, and settings (`backend/`)

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
- **Sidebar navigation now uses an Engineering icon for Technicians for better clarity**

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

## Technology Stack

- **Backend (Django):**
  - Django
  - Django REST Framework
  - PostgreSQL
- **Backend (Node/Express):**
  - Node.js
  - Express
  - PostgreSQL
- **Frontend:**
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

2. Set up the Django backend:
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

3. Set up the Node/Express backend:
```bash
cd backend
npm install
# Create .env file as described in backend/README.md
npm run dev
```

4. Set up the frontend:
```bash
cd frontend
npm install
npm start
```

5. Access the application:
- Frontend: http://localhost:3000
- Django Backend API: http://localhost:8000/api
- Node/Express API: http://localhost:8000 (or as configured)

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

## Project Structure
```
Fieldmaster2/
├── backend/                # Node/Express backend API
│   ├── src/
│   │   ├── models/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── config/
│   │   └── index.js
│   ├── package.json
│   └── README.md
├── fieldmaster/            # Django project (settings, URLs, WSGI)
├── appointments/           # Django app for appointments
├── frontend/               # React frontend
│   ├── public/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── contexts/
│   │   └── services/
│   └── package.json
├── requirements.txt        # Python dependencies
├── manage.py               # Django management script
├── README.md               # Main documentation
├── documentation.md        # Technical docs
├── ROADMAP.md              # Development roadmap
└── CHANGELOG.md            # Release notes
```

## Documentation

For detailed documentation, please refer to:
- [Technical Documentation](documentation.md)
- [Development Roadmap](ROADMAP.md)
- [Changelog](CHANGELOG.md)

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Version

![Version](https://img.shields.io/badge/version-0.1.0-blue)

## PWA Support
- Fieldmaster is now a Progressive Web App (PWA).
- Installable on mobile and desktop ("Add to Home Screen").
- Works offline with service worker caching.
- Ready for mobile-friendly UI improvements in the next release. 