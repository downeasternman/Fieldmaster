# FieldMaster Appointment System

A comprehensive appointment management system for plumbing and heating service companies.

## Features

- Customer management
- Technician scheduling
- Appointment booking and tracking
- Photo uploads for service documentation
- Priority-based scheduling
- Status tracking
- Admin interface

## Setup Instructions

### Prerequisites

- Python 3.8+
- PostgreSQL
- Node.js (for frontend)

### Backend Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up PostgreSQL database:
```bash
createdb fieldmaster
```

4. Run migrations:
```bash
python manage.py migrate
```

5. Create a superuser:
```bash
python manage.py createsuperuser
```

6. Run the development server:
```bash
python manage.py runserver
```

### Frontend Setup (React)

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Start the development server:
```bash
npm start
```

## API Endpoints

- `/api/customers/` - Customer management
- `/api/technicians/` - Technician management
- `/api/appointments/` - Appointment management
- `/api/photos/` - Photo uploads

## Admin Interface

Access the admin interface at `/admin/` with your superuser credentials.

## Development

- Backend: Django REST Framework
- Frontend: React
- Database: PostgreSQL
- Authentication: Django REST Framework Session Authentication

## License

MIT 