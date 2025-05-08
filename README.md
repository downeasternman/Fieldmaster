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

## Project Structure
```
fieldmaster/
├── frontend/           # React frontend
├── appointments/       # Django app for appointments
├── manage.py          # Django management script
└── requirements.txt   # Python dependencies
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