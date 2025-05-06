import React, { useEffect, useState, createContext } from 'react';
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
import Settings from './pages/Settings';

export const UserSettingsContext = createContext();

const DEFAULT_FONT = 'Roboto';
const DEFAULT_THEME = 'light';

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
    <UserSettingsContext.Provider value={{ userSettings, setUserSettings }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <style>{`body { font-family: ${userSettings.font}, sans-serif !important; }`}</style>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="technicians" element={<Technicians />} />
              <Route path="customers" element={<Customers />} />
              <Route path="appointments" element={<Appointments />} />
              <Route path="billing" element={<Billing />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </UserSettingsContext.Provider>
  );
}

export default App; 