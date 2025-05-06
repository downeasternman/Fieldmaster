import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Technicians from './pages/Technicians';
import Customers from './pages/Customers';
import Appointments from './pages/Appointments';
import Billing from './pages/Billing';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="technicians" element={<Technicians />} />
            <Route path="customers" element={<Customers />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="billing" element={<Billing />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App; 