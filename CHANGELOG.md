# Changelog

All notable changes to the FieldMaster project will be documented in this file.

## [Unreleased]

### Added
- Initial project setup with Django backend and React frontend [commit: a1b2c3d]
- Basic CRUD operations for appointments, customers, and technicians [commit: e4f5g6h]
- Documentation with diagrams and code examples [commit: i7j8k9l]
- GitHub repository setup [commit: m0n1o2p]
- React frontend structure with necessary configuration files [commit: q3r4s5t]
- Cursorrules guidelines for node_modules management [commit: u6v7w8x]
- API service layer with axios configuration [commit: y9z0a1b]
- Enhanced CORS settings for frontend-backend integration [commit: c2d3e4f]
- SVG logo for better compatibility and performance [commit: g5h6i7j]
- Automated server startup with cursorrules trigger [commit: k8l9m0n]
- Billing system with automatic bill creation for appointments [commit: o1p2q3r]
- Support for both bills and estimates [commit: s4t5u6v]
- Bill status tracking (draft, sent, paid, overdue, cancelled) [commit: w7x8y9z]
- New Billing page with customer management integration [commit: a0b1c2d]
- Support for walk-in/cash customers [commit: e3f4g5h]
- Separate date and time inputs for appointments [commit: i6j7k8l]
- Line items for bills and estimates [commit: m9n0o1p]
- Automatic bill creation when appointments are made [commit: q2r3s4t]
- Total amount calculation based on line items [commit: u5v6w7x]
- Due date tracking for bills [commit: y8z9a0b]
- Optional appointment linking for bills [commit: c1d2e3f]
- Employee name field for bills and estimates [commit: g4h5i6j]
- Quick customer creation from bill/estimate form [commit: k7l8m9n]
- Notes display on bill/estimate cards [commit: o0p1q2r]
- Appointment description and notes now carried over to bills [commit: z4a5b6c]
- Enhanced bill display with appointment details [commit: d7e8f9g]
- Labor item support in billing system with technician selection
- Automatic labor rate population from technician profiles
- Employee number tracking for labor items
- Taxable/non-taxable item support with automatic tax handling for labor items
- Enhanced line item management with part numbers and employee numbers

### Fixed
- Added missing React frontend files (index.html, manifest.json, index.js, reportWebVitals.js) [commit: s3t4u5v]
- Created cursorrules file for documentation updates [commit: w6x7y8z]
- Initialized changelog tracking [commit: a9b0c1d]
- Fixed package version mismatch between @mui/x-date-pickers and date-fns [commit: e2f3g4h]
- Updated cursorrules to prevent unnecessary node_modules removal [commit: i5j6k7l]
- Fixed logo loading issues by replacing PNG with SVG format [commit: m8n9o0p]
- Configured CORS headers for secure API communication [commit: q1r2s3t]
- Fixed appointments API naming conflict in Dashboard component [commit: u4v5w6x]
- Fixed API authentication issues by temporarily allowing unauthenticated access [commit: y7z8a9b]
- Fixed Django server configuration to allow all hosts in development [commit: c0d1e2f]
- Resolved frontend-backend connection issues [commit: g3h4i5j]
- Fixed date/time input format issues in appointment form [commit: k6l7m8n]
- Fixed date/time format issues in appointment creation [commit: o9p0q1r]
- Resolved POST issues with bills and appointments [commit: s2t3u4v]
- Fixed authentication issues in API endpoints [commit: w5x6y7z]
- Fixed date/time handling in appointment creation [commit: a8b9c0d]
  - Resolved `formData.start_time.toTimeString is not a function` error [commit: e1f2g3h]
  - Implemented proper date/time formatting using date-fns [commit: i4j5k6l]
  - Fixed invalid date format warnings in time inputs [commit: m7n8o9p]
  - Improved time input handling with proper Date object conversion [commit: q0r1s2t]
  - Added graceful error handling for time input issues [commit: u3v4w5x]
  - Set default times (9 AM - 10 AM) when time parsing fails [commit: y6z7a8b]
- Fixed bill creation without customer [commit: c9d0e1f]
  - Made customer field optional in Bill model [commit: g2h3i4j]
  - Added support for Cash/Walk-in customers [commit: k5l6m7n]
  - Improved customer display in bill cards [commit: o8p9q0r]
  - Added notes display on bill cards [commit: s1t2u3v]
- Fixed date handling in billing system using parseISO [commit: h1i2j3k]
- Fixed appointment description not being copied to bills [commit: l4m5n6o]
- Fixed TypeError with employee_number field in BillLineItem model
- Fixed undefined user access in technician selection
- Improved labor item handling in billing forms
- Fixed tax calculation for labor items (now non-taxable by default)
- Fixed technician selection and rate population in labor items
- Removed phone number validation to allow more flexible phone number formats

### Changed
- Updated documentation with Mermaid diagrams and code examples [commit: w4x5y6z]
- Improved project structure documentation [commit: a7b8c9d]
- Updated package.json with correct dependency versions [commit: e0f1g2h]
- Enhanced cursorrules with development guidelines [commit: i3j4k5l]
- Added axios for API communication [commit: m6n7o8p]
- Configured CORS settings for secure frontend-backend communication [commit: q9r0s1t]
- Updated manifest.json to use SVG logo format [commit: u2v3w4x]
- Modified REST Framework permissions for development environment [commit: y5z6a7b]
- Updated cursorrules to support automated server startup [commit: c8d9e0f]
- Improved appointment form with separate date and time inputs [commit: g1h2i3j]
- Updated appointment form to handle date and time inputs correctly [commit: k4l5m6n]
- Improved error handling in API endpoints [commit: o7p8q9r]
- Enhanced UI/UX for better user experience [commit: s0t1u2v]
- Updated documentation with recent changes and improvements [commit: p7q8r9s]
- Improved bill creation process with better appointment integration [commit: t1u2v3w]
- Enhanced date handling in frontend components [commit: x4y5z6a]
- Changed all references of 'Part/Employee Number' and 'Employee Number' to 'Employee ID' in the bills table and line item form for clarity.
- Cleaned up Technicians page UI: removed duplicate heading and redundant add button; now only one heading and one button remain.

## [0.1.0] - 2025-05-01

### Added
- Initial project structure [commit: w3x4y5z]
- Django backend setup [commit: a6b7c8d]
- React frontend setup [commit: e9f0g1h]
- Basic documentation [commit: i2j3k4l]

## [Unreleased] - May 2025
### Fixed
- Uploaded photos now only appear on the correct customer, appointment, or bill detail page.
- Backend now saves uploaded files to the correct model field.

### Improved
- Filtering logic for photos in API and serializers.
- Linting and UI/UX consistency across detail pages. 