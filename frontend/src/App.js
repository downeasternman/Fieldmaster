import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Technicians from './pages/Technicians';
import Customers from './pages/Customers';
import Appointments from './pages/Appointments';
import Billing from './pages/Billing';
import Settings from './pages/Settings';
import CustomerDetail from './pages/CustomerDetail';
import AppointmentDetail from './pages/AppointmentDetail';
import BillDetail from './pages/BillDetail';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { UserSettingsProvider } from './contexts/UserSettingsContext';

const DEFAULT_FONT = 'Roboto';
const DEFAULT_THEME = 'light';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" />;
};

function App() {
  const [userSettings, setUserSettings] = useState({ theme: DEFAULT_THEME, font: DEFAULT_FONT });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserSettings = async () => {
      try {
        const response = await fetch('/api/user-settings/', { credentials: 'include' });
        if (response.ok) {
          const data = await response.json();
          setUserSettings({
            theme: data.theme || DEFAULT_THEME,
            font: data.font || DEFAULT_FONT,
          });
        }
      } catch (error) {
        // fallback to defaults
      } finally {
        setLoading(false);
      }
    };
    fetchUserSettings();
  }, []);

  const theme = createTheme({
    palette: {
      mode: userSettings.theme,
      primary: { main: '#1976d2' },
      secondary: { main: '#dc004e' },
    },
    typography: {
      fontFamily: userSettings.font,
    },
  });

  if (loading) return null;

  return (
    <AuthProvider>
      <UserSettingsProvider value={{ userSettings, setUserSettings }}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <style>{`body { font-family: ${userSettings.font}, sans-serif !important; }`}</style>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Layout />
                  </PrivateRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="technicians" element={<Technicians />} />
                <Route path="customers" element={<Customers />} />
                <Route path="customers/:id" element={<CustomerDetail />} />
                <Route path="appointments" element={<Appointments />} />
                <Route path="appointments/:id" element={<AppointmentDetail />} />
                <Route path="billing" element={<Billing />} />
                <Route path="billing/:id" element={<BillDetail />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Routes>
          </Router>
        </ThemeProvider>
      </UserSettingsProvider>
    </AuthProvider>
  );
}

export default App; 