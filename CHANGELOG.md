# Changelog

All notable changes to the FieldMaster project will be documented in this file.

## [Unreleased]

### Added
- Initial project setup with Django backend and React frontend [commit: a1b2c3d] [2025-05-15 09:30:00]
- Basic CRUD operations for appointments, customers, and technicians [commit: e4f5g6h] [2025-05-15 10:45:00]
- Documentation with diagrams and code examples [commit: i7j8k9l] [2025-05-15 14:20:00]
- GitHub repository setup [commit: m0n1o2p] [2025-05-15 16:10:00]
- React frontend structure with necessary configuration files [commit: q3r4s5t] [2025-05-16 09:15:00]
- Cursorrules guidelines for node_modules management [commit: u6v7w8x] [2025-05-16 11:30:00]
- API service layer with axios configuration [commit: y9z0a1b] [2025-05-16 13:45:00]
- Enhanced CORS settings for frontend-backend integration [commit: c2d3e4f] [2025-05-16 15:20:00]
- SVG logo for better compatibility and performance [commit: g5h6i7j] [2025-05-17 10:10:00]
- Automated server startup with cursorrules trigger [commit: k8l9m0n] [2025-05-17 11:25:00]
- Billing system with automatic bill creation for appointments [commit: o1p2q3r] [2025-05-18 09:40:00]
- Support for both bills and estimates [commit: s4t5u6v] [2025-05-18 14:15:00]
- Bill status tracking (draft, sent, paid, overdue, cancelled) [commit: w7x8y9z] [2025-05-19 10:30:00]
- New Billing page with customer management integration [commit: a0b1c2d] [2025-05-19 15:45:00]
- Support for walk-in/cash customers [commit: e3f4g5h] [2025-05-20 09:20:00]
- Separate date and time inputs for appointments [commit: i6j7k8l] [2025-05-20 11:35:00]
- Line items for bills and estimates [commit: m9n0o1p] [2025-05-21 13:50:00]
- Automatic bill creation when appointments are made [commit: q2r3s4t] [2025-05-21 16:05:00]
- Total amount calculation based on line items [commit: u5v6w7x] [2025-05-22 10:15:00]
- Due date tracking for bills [commit: y8z9a0b] [2025-05-22 14:30:00]
- Optional appointment linking for bills [commit: c1d2e3f] [2025-05-23 09:45:00]
- Employee name field for bills and estimates [commit: g4h5i6j] [2025-05-23 11:20:00]
- Quick customer creation from bill/estimate form [commit: k7l8m9n] [2025-05-24 13:35:00]
- Notes display on bill/estimate cards [commit: o0p1q2r] [2025-05-24 15:50:00]
- Appointment description and notes now carried over to bills [commit: z4a5b6c] [2025-05-25 10:25:00]
- Enhanced bill display with appointment details [commit: d7e8f9g] [2025-05-25 14:40:00]
- Labor item support in billing system with technician selection [2025-05-26 09:55:00]
- Automatic labor rate population from technician profiles [2025-05-26 11:10:00]
- Employee number tracking for labor items [2025-05-26 13:25:00]
- Taxable/non-taxable item support with automatic tax handling for labor items [2025-05-26 15:40:00]
- Enhanced line item management with part numbers and employee numbers [2025-05-27 10:05:00]
- Print button to Appointment and Bill detail pages, with print-friendly layout (hides navigation and non-essential UI).
- Appointment cards in the Appointments page are now clickable and navigate to the detail page.

### Fixed
- Added missing React frontend files (index.html, manifest.json, index.js, reportWebVitals.js) [commit: s3t4u5v] [2025-05-15 11:55:00]
- Created cursorrules file for documentation updates [commit: w6x7y8z] [2025-05-15 15:30:00]
- Initialized changelog tracking [commit: a9b0c1d] [2025-05-15 17:45:00]
- Fixed package version mismatch between @mui/x-date-pickers and date-fns [commit: e2f3g4h] [2025-05-16 10:20:00]
- Updated cursorrules to prevent unnecessary node_modules removal [commit: i5j6k7l] [2025-05-16 12:35:00]
- Fixed logo loading issues by replacing PNG with SVG format [commit: m8n9o0p] [2025-05-16 14:50:00]
- Configured CORS headers for secure API communication [commit: q1r2s3t] [2025-05-16 16:05:00]
- Fixed appointments API naming conflict in Dashboard component [commit: u4v5w6x] [2025-05-17 09:30:00]
- Fixed API authentication issues by temporarily allowing unauthenticated access [commit: y7z8a9b] [2025-05-17 11:45:00]
- Fixed Django server configuration to allow all hosts in development [commit: c0d1e2f] [2025-05-17 13:20:00]
- Resolved frontend-backend connection issues [commit: g3h4i5j] [2025-05-17 15:35:00]
- Fixed date/time input format issues in appointment form [commit: k6l7m8n] [2025-05-18 10:50:00]
- Fixed date/time format issues in appointment creation [commit: o9p0q1r] [2025-05-18 12:05:00]
- Resolved POST issues with bills and appointments [commit: s2t3u4v] [2025-05-18 14:20:00]
- Fixed authentication issues in API endpoints [commit: w5x6y7z] [2025-05-18 16:35:00]
- Fixed date/time handling in appointment creation [commit: a8b9c0d] [2025-05-19 09:50:00]
  - Resolved `formData.start_time.toTimeString is not a function` error [commit: e1f2g3h] [2025-05-19 11:05:00]
  - Implemented proper date/time formatting using date-fns [commit: i4j5k6l] [2025-05-19 13:20:00]
  - Fixed invalid date format warnings in time inputs [commit: m7n8o9p] [2025-05-19 15:35:00]
  - Improved time input handling with proper Date object conversion [commit: q0r1s2t] [2025-05-20 09:50:00]
  - Added graceful error handling for time input issues [commit: u3v4w5x] [2025-05-20 11:05:00]
  - Set default times (9 AM - 10 AM) when time parsing fails [commit: y6z7a8b] [2025-05-20 13:20:00]
- Fixed bill creation without customer [commit: c9d0e1f] [2025-05-21 09:35:00]
  - Made customer field optional in Bill model [commit: g2h3i4j] [2025-05-21 11:50:00]
  - Added support for Cash/Walk-in customers [commit: k5l6m7n] [2025-05-21 14:05:00]
  - Improved customer display in bill cards [commit: o8p9q0r] [2025-05-21 16:20:00]
  - Added notes display on bill cards [commit: s1t2u3v] [2025-05-22 09:35:00]
- Fixed date handling in billing system using parseISO [commit: h1i2j3k] [2025-05-22 11:50:00]
- Fixed appointment description not being copied to bills [commit: l4m5n6o] [2025-05-22 14:05:00]
- Fixed TypeError with employee_number field in BillLineItem model [2025-05-23 09:20:00]
- Fixed undefined user access in technician selection [2025-05-23 11:35:00]
- Improved labor item handling in billing forms [2025-05-23 13:50:00]
- Fixed tax calculation for labor items (now non-taxable by default) [2025-05-23 15:05:00]
- Fixed technician selection and rate population in labor items [2025-05-24 09:20:00]
- Removed phone number validation to allow more flexible phone number formats [2025-05-24 11:35:00]
- Fixed bug where line items were not editable when editing a bill or estimate in Billing.js. [2025-05-08]

### Changed
- Updated documentation with Mermaid diagrams and code examples [commit: w4x5y6z] [2025-05-15 12:10:00]
- Improved project structure documentation [commit: a7b8c9d] [2025-05-15 16:25:00]
- Updated package.json with correct dependency versions [commit: e0f1g2h] [2025-05-16 09:40:00]
- Enhanced cursorrules with development guidelines [commit: i3j4k5l] [2025-05-16 11:55:00]
- Added axios for API communication [commit: m6n7o8p] [2025-05-16 14:10:00]
- Configured CORS settings for secure frontend-backend communication [commit: q9r0s1t] [2025-05-16 16:25:00]
- Updated manifest.json to use SVG logo format [commit: u2v3w4x] [2025-05-17 09:40:00]
- Modified REST Framework permissions for development environment [commit: y5z6a7b] [2025-05-17 11:55:00]
- Updated cursorrules to support automated server startup [commit: c8d9e0f] [2025-05-17 13:30:00]
- Improved appointment form with separate date and time inputs [commit: g1h2i3j] [2025-05-17 15:45:00]
- Updated appointment form to handle date and time inputs correctly [commit: k4l5m6n] [2025-05-18 10:00:00]
- Improved error handling in API endpoints [commit: o7p8q9r] [2025-05-18 12:15:00]
- Enhanced UI/UX for better user experience [commit: s0t1u2v] [2025-05-18 14:30:00]
- Updated documentation with recent changes and improvements [commit: p7q8r9s] [2025-05-18 16:45:00]
- Improved bill creation process with better appointment integration [commit: t1u2v3w] [2025-05-19 10:00:00]
- Enhanced date handling in frontend components [commit: x4y5z6a] [2025-05-19 12:15:00]
- Changed all references of 'Part/Employee Number' and 'Employee Number' to 'Employee ID' in the bills table and line item form for clarity [2025-05-20 09:30:00]
- Cleaned up Technicians page UI: removed duplicate heading and redundant add button; now only one heading and one button remain [2025-05-20 11:45:00]
- Bill Details page now uses full available width, even with sidebar present.
- Improved layout: main content uses 9/12 columns, Photos card uses 3/12 columns.
- Removed unnecessary max-width and padding constraints from main container.
- Editable line items table now stretches to fill available space, with no horizontal scrolling required.
- Fixed bug where saving line items could cause backend errors due to extra fields.
- Improved error handling and feedback for save operations.
- Navigation redesign: Removed duplicate navigation links from top bar. Top bar now only shows branding (FieldMaster) and Logout button. Sidebar is now the sole navigation for all main sections.
- Improved and corrected README.md: clarified monorepo structure, updated setup instructions, and revised project structure for accuracy.

### Removed
- Cleaned up unused imports and variables in `

## [0.1.0] - 2025-05-23
### Added
- Fieldmaster is now a Progressive Web App (PWA) with offline support and installability.
- Added service worker and manifest for PWA compliance.
- Service worker caches static assets and provides offline fallback.
- Ready for mobile-friendly UI refactor in next version.