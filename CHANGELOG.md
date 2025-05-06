# Changelog

All notable changes to the FieldMaster project will be documented in this file.

## [Unreleased]

### Added
- Initial project setup with Django backend and React frontend
- Basic CRUD operations for appointments, customers, and technicians
- Documentation with diagrams and code examples
- GitHub repository setup
- React frontend structure with necessary configuration files
- Cursorrules guidelines for node_modules management
- API service layer with axios configuration
- Enhanced CORS settings for frontend-backend integration
- SVG logo for better compatibility and performance
- Automated server startup with cursorrules trigger
- Billing system with automatic bill creation for appointments
- Support for both bills and estimates
- Bill status tracking (draft, sent, paid, overdue, cancelled)
- New Billing page with customer management integration
- Support for walk-in/cash customers
- Separate date and time inputs for appointments
- Line items for bills and estimates
- Automatic bill creation when appointments are made
- Total amount calculation based on line items
- Due date tracking for bills
- Optional appointment linking for bills

### Fixed
- Added missing React frontend files (index.html, manifest.json, index.js, reportWebVitals.js)
- Created cursorrules file for documentation updates
- Initialized changelog tracking
- Fixed package version mismatch between @mui/x-date-pickers and date-fns
- Updated cursorrules to prevent unnecessary node_modules removal
- Fixed logo loading issues by replacing PNG with SVG format
- Configured CORS headers for secure API communication
- Fixed appointments API naming conflict in Dashboard component
- Fixed API authentication issues by temporarily allowing unauthenticated access
- Fixed Django server configuration to allow all hosts in development
- Resolved frontend-backend connection issues
- Fixed date/time input format issues in appointment form
- Fixed date/time format issues in appointment creation
- Resolved POST issues with bills and appointments
- Fixed authentication issues in API endpoints
- Fixed date/time handling in appointment creation
  - Resolved `formData.start_time.toTimeString is not a function` error
  - Implemented proper date/time formatting using date-fns
  - Fixed invalid date format warnings in time inputs
  - Improved time input handling with proper Date object conversion
  - Added graceful error handling for time input issues
  - Set default times (9 AM - 10 AM) when time parsing fails

### Changed
- Updated documentation with Mermaid diagrams and code examples
- Improved project structure documentation
- Updated package.json with correct dependency versions
- Enhanced cursorrules with development guidelines
- Added axios for API communication
- Configured CORS settings for secure frontend-backend communication
- Updated manifest.json to use SVG logo format
- Modified REST Framework permissions for development environment
- Updated cursorrules to support automated server startup
- Improved appointment form with separate date and time inputs
- Updated appointment form to handle date and time inputs correctly
- Improved error handling in API endpoints
- Enhanced UI/UX for better user experience

## [0.1.0] - 2025-05-01

### Added
- Initial project structure
- Django backend setup
- React frontend setup
- Basic documentation 